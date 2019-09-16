<template>
     <div class="dashboard-outer">
	    <el-card class="dashboard-second">
			<el-col  class="toolbar1">
			<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="推广配置">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">推广配置</span>
			</el-col>
			<div class="box">
         <span>项目</span>
          <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
            </el-option>
          </el-select>
				<span>代理账号</span>
				<el-input v-model="agentAct" style="width:120px; margin:0 10px" ></el-input>
        <span>代理类别</span>
        <el-select v-model="agentType" placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
          <el-option v-for="item in agentTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span>状态</span>
        <el-select v-model="status" placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span>代理ID</span>
				<el-input v-model="agentID" style="width:120px; margin:0 10px" ></el-input>
        <br>
				
        <span>创建时间</span>
        <el-date-picker v-model="createTime" type="datetimerange"
          value-format='yyyy-MM-dd HH:mm:ss' 
          style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
        </el-date-picker>

        <!-- <span>平台</span>
        <el-select v-model="platform" placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->

        <el-button type="primary" @click="searchData" style="margin:10px 0px 10px 10px">搜索</el-button>
				<!-- <el-button type="primary" @click="addClick" style="margin:10px 0px 10px 10px">添加</el-button> -->
			</div>

		<!--列表-->
			<el-table :data="spreadSetting.spreadSettingDatas" border highlight-current-row style="width: 100%;" min-height="600">
         <el-table-column prop="pid" label="项目" width="80" align="center"  :formatter="pidFormat"></el-table-column>
				<el-table-column prop="gameUid" label="代理游戏ID" min-width="175" align="center" />
        <el-table-column prop="name" label="代理名称" min-width="175" align="center" />
        <el-table-column prop="level" label="推广等级" min-width="175" align="center" />
        <!-- <el-table-column prop="withdrawOrderID" label="宣传页下载" min-width="175" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="updateAgent(scope.row)">下载</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="推广二维码" min-width="300" align="center">
          <template slot-scope="scope">
             
             <img class="default-image"  style="width:200px" :src="scope.row.image">
             <!-- <a :href="scope.row.image" :download="scope.row.gameUid">点击下载</a> -->
             
          </template>
        </el-table-column>
        <el-table-column prop="downloadUrl[0]" label="推广宣传地址" min-width="175" align="center" />
        <el-table-column prop="channel" label="渠道号" min-width="175" align="center" />
        <el-table-column prop="pwd" label="后台密码" min-width="175" align="center" />
        <el-table-column prop="createDate" label="创建时间" min-width="175" align="center" :formatter="craeteDateFormate"/>
				<!-- <el-table-column prop="applyMoney" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="updateAgent(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteAgent(scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
			</el-table>

			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
					@current-change="handleCurrentChange" 
					@size-change="handleSizeChange" 
					:current-page="page" 
					:page-sizes="[10,20,30,50]" 
					:page-size="count" 
					:total="spreadSetting.totalCount">
				</el-pagination>
			</el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { SpreadSettingState } from "../../store/stateInterface";
import QRCode from 'qrcode'

interface QueryItem {
    pid:string,
    agencyAct ?: string,
    type ?: string,
    status ?: boolean|string,
    agencyId ?: string,
    createDateStart ?: Date,
    createDateEnd ?: Date,
    page ?: number,
    count ?: number,
}

var opts = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  rendererOpts: {
    quality: 0.95,
  },
  width: 400,
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SpreadSetting extends Vue {
  page: number = 1; //当前页
  count: number = 10;
  pidList: any[] = [];
  pid: string = "A";
  spreadSetting: SpreadSettingState = this.$store.state.spreadSetting;
  agentId:string = "";

  addAgentVisible:boolean = false;
  updateAgentVisible:boolean = false;

  minTax:string = "";
  maxTax:string = "";
  rate:string = "";

  testUrl:string ="";
  agentAct:string = "";
  agentType:string = "";
  status:string = "";
  agentID:string = "";
  createTime:Date[] = [];
  platform:string = "";

  agentTypes:any = [
      { value: "", label: "全部" },
      { value: "business", label: "商人代理" },
      { value: "general", label: "全民代理" }];

  statusOptions:any = [
      { value: "", label: "全部" },
      { value: true, label: "正常" },
      { value: false, label: "冻结" },
  ];

  platforms:any = [
      { value: "", label: "全部" },
      { value: "web", label: "web" },
      { value: "android", label: "android" },
      { value: "ios", label: "ios" }
  ];
  //生命周期钩子函数
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }

 

  //初始化数据
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetSpreadSetting", queryItem, true).then(() => {
      this.spreadSetting.spreadSettingDatas.forEach(e => {
        if (e.downloadUrl.length){
          QRCode.toDataURL(e.downloadUrl[0], opts, (err, url) => {
            if (err) throw err;
              e.image= "";
              e.image = url;
              e.level++;
              e.level--;
          })
        }
      
      });
    });
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let tmp: QueryItem = {pid:this.pid};

    if (this.agentAct.trim()){
      tmp.agencyAct = this.agentAct;
    }

    if (this.agentType.trim()){
      tmp.type = this.agentType;
    }

    if (this.status!==""){
      tmp.status = this.status;
    }
    if (this.agentID.trim()){
      tmp.agencyId = this.agentID;
    }

    if (this.createTime && this.createTime.length === 2){
      tmp.createDateStart = this.createTime[0];
      tmp.createDateEnd = this.createTime[1];
    }
    return tmp;
  }


  handleShowSonAgent(){
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

  cancelEditAlipay() {
    // 点击取消按钮
  }

  addClick(){
    this.addAgentVisible = true;
  }

  deleteAgent(row){

  }
  updateAgent(row){
    console.log("=======>",row)
  }
  updateAgentCancel(){  

  }
  updateAgentConfirm(){

  }

  addAgentCancel(){

  }

  craeteDateFormate(row, column) {
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }

  addAgentConfirm(){
    let tempData:any = {};
    this.$confirm("是否确认提交", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "AddAgentNew",
          tempData,
          true
        ).then(() => {
          if (this.spreadSetting.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
          });
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  pidFormat(row, column){
    let name = "";
    this.pidList.forEach(element => {
        if(element.pid === row.pid){
          name =  element.name ;
        }
    });
    return name ;
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
    // margin-top: 80px;
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
