<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="推送任务明细">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">
				<b>推送任务明细</b>
			</span>
			<div style="margin:10px 10px 10px 0px">
				<div style="margin:10px 10px 10px 0px">
					<span style="font-size:12pt; margin:10px 10px 10px 0px">状态</span>
					<el-select v-model="state" placeholder="请选择" style="width:110px;">
						<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
          <span style="font-size:12pt; margin:0px 0px 10px 10px">bundleId</span>
					<el-input type='text' style='width:150px; margin:0 10px' v-model="bundleId"></el-input>
          <span style="font-size:12pt; margin:0px 0px 10px 10px">消息ID</span>
					<el-input type='text' style='width:150px; margin:0 10px' v-model="msgId"></el-input>
          <span style="font-size:12pt; margin:0px 0px 10px 10px">keyId</span>
					<el-input type='text' style='width:150px; margin:0 10px' v-model="keyId"></el-input>
					<span style="font-size:12pt; margin:0px 0px 10px 10px">设备码</span>
					<el-input type='text' style='width:200px; margin:0 10px' v-model="deviceToken"></el-input>
					<el-button type="primary" style="margin:0 10px 10px 0" @click="searchData"> 搜索
					</el-button>
          <br>
          <span style="font-size:12pt;">根据消息ID批量重新推送</span>
          <el-input type='text' style='width:200px; margin:0 20px' v-model="repushMsgId"></el-input>
					<el-button type="primary" @click="repushDetails"> 推送
					</el-button>
				</div>
				<el-table :data="pushDetailList" border highlight-current-row style="margin: 20px 0">
          <el-table-column prop="bundleId" label="bundleId" min-width="100" align="center">
					</el-table-column>
          <el-table-column prop="msgId" label="消息ID" min-width="100" align="center">
					</el-table-column>
          <el-table-column prop="deviceToken" label="设备码" min-width="150" align="center">
					</el-table-column>
					<el-table-column prop="keyId" label="keyId" min-width="100" align="center">
					</el-table-column>
					<el-table-column prop="state" label="状态" min-width="50" align="center" :formatter="stateFormat">
					</el-table-column>
          <el-table-column prop="createDate" label="创建时间" min-width="120" align="center" :formatter="dateFormat">
					</el-table-column>          
					<el-table-column prop="finishDate" label="完成时间" min-width="120" align="center" :formatter="finishDateFormat">
					</el-table-column>
          <el-table-column label="操作" min-width="60" align="center" >
            <template slot-scope="scope">
              <el-button type="text" style="margin:0 10px 10px 0"
                :disabled="scope.row.state!=='fail'"
                @click="repush(scope.row._id)">
                重新推送
              </el-button>  
            </template>
          </el-table-column>
				</el-table>
			</div>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {getApnsTaskDetail,repushTaskDetail,repushTaskManyDetail} from "../../api/admin/pushManager/pushManager";

// @Component 修饰符注明了此类为一个 Vue 组件

@Component
export default class PushList extends Vue {
  created() {
    this.loadData();
  }
  /*inital data*/
  pushDetailList:any[]=[];
  totalCount: number = 0;
  repushMsgId: string = "";
  deviceToken: string = "";
  bundleId: string = "";
  keyId: string = "";
  msgId: string = "";
  state: string = '';
  states: any[] = [
    { value: "", label: "全部" },
    { value: "init", label: "需要处理" },
    { value: "success", label: "成功" },
    { value: "fail", label: "失败" }
  ];
  page: number = 1;
  count: number = 10;
  /*method*/
  searchData() {
    this.page = 1;
    this.loadData();
  }

  //批量推送
  async repushDetails() {
    if(!this.repushMsgId){
      this.$message({
          type: "error",
          message: "消息ID不能为空！"
        });
    }else{
       this.$confirm("此操作将批量重新推送,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(repushTaskManyDetail,{msgId:this.repushMsgId})
        if(ret.code===200){
            this.$message({
                type: "success",
                message: "操作成功！"
            });
            this.loadData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
      
    }
  }
 
  async repush(id){
    let ret = await myAsyncFn(repushTaskDetail,{id:id})
    if(ret.code===200){
      this.$message({
        type:'success',
        message:'操作成功！'
      })
    }
    this.loadData();
  }
  async loadData() {
    let req = this.getReq();
    req.page = this.page;
    req.count = this.count;
    let ret = await myAsyncFn(getApnsTaskDetail,req)
    if(ret.code===200){
        this.pushDetailList = ret.msg.pageData;
        this.totalCount = ret.msg.totalCount;
    }
  }

  getReq() {
    let tmp: any = {};
    if (this.state) {
      tmp.state = this.state;
    }
    if (this.deviceToken) {
      tmp.deviceToken = this.deviceToken;
    }
    if (this.bundleId) {
      tmp.bundleId = this.bundleId;
    }
    if (this.keyId) {
      tmp.keyId = this.keyId;
    }
    if (this.msgId) {
      tmp.msgId = this.msgId;
    }
    return tmp;
  }

  dateFormat(row, column) {
    if (row.createDate) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  finishDateFormat(row, column) {
    if (row.finishDate) {
      let date = new Date(row.finishDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  stateFormat(row) {
    switch (row.state) {
      case "init":
        return "需要处理";
      case "success":
        return "成功";
      case "fail":
        return "失败";
    }
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
</style>
