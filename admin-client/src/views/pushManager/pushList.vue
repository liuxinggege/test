<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="推送任务列表">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">
				<b>推送任务列表</b>
			</span>
			<div style="margin:10px 10px 10px 0px">
				<div style="margin:10px 10px 10px 0px">
					<span style="font-size:12pt; margin:10px 10px 10px 0px">状态</span>
					<el-select v-model="state" placeholder="请选择" style="width:110px;">
						<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
                    <span style="font-size:12pt; margin:0px 0px 10px 10px">bundleId</span>
					<el-input type='text' style='width:120px; margin:0 10px' v-model="bundleId"></el-input>
					<span style="font-size:12pt; margin:0px 0px 10px 10px">操作人</span>
					<el-input type='text' style='width:120px; margin:0 10px' v-model="opt"></el-input>
                    <span>时间</span>
                    <el-date-picker v-model="createDate" type="datetimerange"
                      value-format='yyyy-MM-dd HH:mm:ss' 
                      style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
                    </el-date-picker>
					<el-button type="primary" style="margin:0 10px 10px 0" @click="searchData"> 搜索
					</el-button>
					<el-button type="primary" style="margin:0 100px 10px 0" @click="addpushData"> 批量添加
					</el-button>
				</div>
				<el-table :data="pushListData" border highlight-current-row style="margin: 20px 0">
                    <el-table-column prop="bundleId" label="bundleId" min-width="100" align="center">
					</el-table-column>
					<el-table-column prop="createDate" label="创建时间" min-width="100" align="center" :formatter="dateFormat">
					</el-table-column>
					<el-table-column prop="state" label="状态" min-width="70" align="center" :formatter="stateFormat">
					</el-table-column>
					<el-table-column label="推送消息" align="center" min-width="150">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top" width="300">
                                <p>{{ scope.row.msg }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="big">{{ scope.row.msg.slice(0,30)+"......" }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
					<el-table-column prop="opt" label="操作人" min-width="70" align="center">
					</el-table-column>
				</el-table>
			</div>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount">
				</el-pagination>
			</el-col>
			<el-dialog :visible.sync="addFlag" width='450px' @close="close" title="添加">
				<div>
					<span style="font-size:12pt; margin:0px 0px 10px 0px">推送消息</span>
					<el-input type='textarea' placeholder="必填项" style='width:300px; margin:15px 0px 10px 10px;vertical-align: middle;' v-model="msg"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:0px 0px 10px 0px">bundleId</span>
					<el-input type='textarea' placeholder="必填项，若要批量添加，bundleId用英文逗号分隔" style='width:300px; margin:15px 0px 10px 10px;vertical-align: middle;' v-model="bundleIds"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="addConfirm">确定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {getApnsTask,createApnsTask} from "../../api/admin/pushManager/pushManager";

// @Component 修饰符注明了此类为一个 Vue 组件

@Component
export default class PushList extends Vue {
  created() {
    this.loadData();
  }
  /*inital data*/
  pushListData:any[]=[];
  totalCount: number = 0;
  opt: string = "";
  bundleId: string = "";
  createDate: Date[] = [];
  state: string = '';
  states: any[] = [
    { value: "", label: "全部" },
    { value: "init", label: "创建" },
    { value: "pushing", label: "推送中" },
    { value: "success", label: "成功" },
    { value: "fail", label: "失败" }
  ];
  msg: string = '';
  bundleIds: string = '';
  addFlag: boolean = false;
  page: number = 1;
  count: number = 10;
  /*method*/
  searchData() {
    this.page = 1;
    this.loadData();
  }

  //添加
  addpushData() {
    this.addFlag = true;
    this.msg = "";
    this.bundleIds = "";
  }
  //添加确认
  async addConfirm() {
       console.log(this.bundleIds.match('，'))
    if(!this.msg||!this.bundleIds){
        this.$message({
          type: "error",
          message: "不能为空！"
        });
    }else if(this.bundleIds.match('，')){
        this.$message({
          type: "error",
          message: "多个bundleId用英文逗号分隔！"
        });
    }else{
        let data = {
            msg: this.msg,
            bundleIds: this.bundleIds.split(',')
        };
    this.$confirm("此操作将添加,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(createApnsTask,data)
        if(ret.code===200){
            this.$message({
                type: "success",
                message: "添加成功！"
            });
            this.loadData();
            this.addFlag = false;
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

  async loadData() {
    let req = this.getReq();
    req.page = this.page;
    req.count = this.count;
    let ret = await myAsyncFn(getApnsTask,req)
    if(ret.code===200){
        this.pushListData = ret.msg.pageData;
        this.totalCount = ret.msg.totalCount;
    }
  }

  getReq() {
    let tmp: any = {};
    if (this.state) {
      tmp.state = this.state;
    }
    if (this.opt) {
      tmp.opt = this.opt;
    }
    if (this.bundleId) {
      tmp.bundleId = this.bundleId;
    }
    if (this.createDate && this.createDate[0]) {
      tmp.startDate = this.createDate[0];
      tmp.endDate = this.createDate[1];
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
  stateFormat(row) {
    switch (row.state) {
      case "init":
        return "创建";
      case "pushing":
        return "推送中";
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
  close() {
    this.msg = "";
    this.bundleIds = "";
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
