<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
             <!--账号封停-->
            <el-col  class="toolbar1" style="margin-bottom: 20px">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="账号封停">
                </el-popover>
                <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
                <span class="title">账号封停</span>                
            </el-col> 
            <!-- 查询条件 -->
            <!-- <span>项目</span>
            <el-select v-model="searchPid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
              </el-option>
            </el-select> -->
            <span>用户ID</span>
            <el-input v-model="searchUid" style="width:120px; margin:20px 10px"></el-input>
            <span>封停时间</span>
            <el-date-picker v-model="searchForbiddenTime" type="datetimerange"
                value-format='yyyy-MM-dd HH:mm:ss' 
                style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
            </el-date-picker>        
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
            <el-button type="success" icon="search" @click="notForbidden" style="margin:8px 0px 10px 10px">解封</el-button> 
            <el-button type="success" icon="search" @click="userForbidden" style="margin:8px 0px 10px 10px">封号</el-button> 
            <el-button type="success" icon="search" @click="usersForbidden" style="margin:8px 0px 10px 10px">批量封号</el-button> 
            <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 10px">导出excel</el-button> 
            <!-- 列表 -->
            <el-table :data="userForbiddenData.data" border  max-height="700"  highlight-current-row style="width: 100%;font-size:10pt">
                <!-- <el-table-column prop="pid" label="项目" min-width=70" align="center"  :formatter="pidFormat" fixed></el-table-column> -->
                <el-table-column prop="uids" label="玩家ID" min-width="120" fixed align="center" :formatter="uidFormat"></el-table-column>  
                <el-table-column prop="type" label="类型" min-width="120"	 align="center" :formatter="typeFormat"></el-table-column>   
                <el-table-column prop="time"  label="时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
                <el-table-column prop="reason" label="理由" min-width="120"	 align="center" ></el-table-column>
                <el-table-column prop="opt" label="操作人" min-width="130" align="center"></el-table-column>
                <el-table-column label="详情" min-width="65" align="center">
                    <template slot-scope="scope">
                    <el-button type="text" @click="detail(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange" 
                :current-page="page" 
                :page-sizes="[10,20,30,50]" 
                :page-size="count" 
                :total="userForbiddenData.count">
                </el-pagination>
            </el-col>
			<el-dialog :visible.sync="dialogUserForbiddenVisible" width=500px @close="close">
				<div style="margin:0px 0px 40px 220px;font-size:20px;">{{this.loginForbidden?"封号":"解封"}}</div>
				<div style="margin:0px 0px 40px 40px">
					<span style="font-size:20px;">玩家ID：</span>
					<el-input  v-model="srcUid" style="width:300px" ></el-input>
				</div>
				<div style="margin:0px 0px 40px 40px">
					<span style="font-size:20px;">理由：</span>
					<el-input type="textarea"   v-model="reason" placeholder="理由必填" style="width:320px" ></el-input>
					<br>				
				</div>
				<el-button type="primary" @click="userForbiddenConfim" style="margin:0px 0px 10px 230px" >确认提交</el-button>
			</el-dialog>
      	<el-dialog :visible.sync="dialogUsersForbiddenVisible" width=500px @close="close">
				<div style="margin:0px 0px 40px 200px;font-size:20px;">批量封号</div>
				<div style="margin:0px 0px 40px 40px">
					<span style="font-size:20px;">玩家ID：</span>
					<el-input type="textarea" v-model="srcUids" style="width:300px" ></el-input>
				</div>
				<div style="margin:0px 0px 40px 40px">
					<span style="font-size:20px;">理由：</span>
					<el-input type="textarea"   v-model="reason" placeholder="理由必填" style="width:320px" ></el-input>
					<br>				
				</div>
				<el-button type="primary" @click="usersForbiddenConfim" style="margin:0px 0px 10px 230px" >确认提交</el-button>
			</el-dialog>
      <el-dialog :visible.sync="dialogDetailVisible" width=500px @close="close">
				<div style="margin:0px 0px 40px 40px">
					<span style="font-size:20px;">玩家ID</span>
					<el-input type="textarea" v-model="detailUids" style="width:300px" ></el-input>
				</div>
			</el-dialog>
      </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";

import { downloadExcel } from "../../../utils/downloadEXCEL";
import { UserForbidden } from "../../../store/stateInterface";
import { myDispatch, secToString, getTransferRate } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

interface QueryItem {
  pid:string;
  uid: number;
  page: number;
  count: number;
  time: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class UserForbiddenLog extends Vue {
  //初始化数据
  // pidList: any[] = [];
  // pid: string = "A";
  searchPid: string = "A";
  searchUid: string = "";
  searchForbiddenTime: Date[] = [];
  loginForbidden:boolean = false;//
  page: number = 1; //当前页
  count: number = 10;
  total:number = 0;
  currentUid: string = ""; //选中用户id fromID
  dialogUserForbiddenVisible: boolean = false; //封号
  dialogUsersForbiddenVisible: boolean = false; //解封
  dialogDetailVisible:boolean = false;
  srcUid: string = ""; //封号解封id
  srcUids: string = ""; //批量封号id
  reason: string = "";//封号解封理由
  flag:boolean = false;//详情显示flag
  detailUids:string = "";
  userForbiddenData: UserForbidden = this.$store.state.userForbidden.userForbiddenLogDatas;
  created() {
    this.loadData();
    // this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    // this.pid= this.pidList[0]? this.pidList[0].pid||"" : "";
  }
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetUserForbiddenLog", queryItem).then(() => {
      this.userForbiddenData = this.$store.state.userForbidden.userForbiddenLogDatas;
    });
  }
  userForbidden(){
    this.loginForbidden=true;
    this.dialogUserForbiddenVisible = true;
  }
  notForbidden(){
    this.loginForbidden=false;
    this.dialogUserForbiddenVisible = true;
  }
  usersForbidden(){
    this.loginForbidden=true;
    this.dialogUsersForbiddenVisible = true;
  }
  userForbiddenConfim(){
    let uid = this.srcUid;
    let reason = this.reason;
    myDispatch(this.$store, "ForbiddenUser", {uid:uid,reason:reason,loginForbidden:this.loginForbidden}).then(() => {
      if(this.$store.state.userForbidden.code!==200&&this.$store.state.userForbidden.code!==400){
         this.$message({
          type: "error",
          message: this.$store.state.userForbidden.msg
        });
        return;
      }else if(this.$store.state.userForbidden.code===200){
          this.$message({
          type: "success",
          message: "操作成功"
        })
       }
      this.loadData();
    });
  }
  usersForbiddenConfim(){
    let uidstr = this.srcUids.split(",");
    let reason = this.reason;
    let uids = uidstr.map(e=>parseInt(e));
    myDispatch(this.$store, "ForbiddenUsers", {uids:uids,reason:reason}).then(() => {
      if(this.$store.state.userForbidden.code!==200&&this.$store.state.userForbidden.code!==400){
         this.$message({
          type: "error",
          message: this.$store.state.userForbidden.msg
        });
        return;
      }else if(this.$store.state.userForbidden.code===200){
          this.$message({
          type: "success",
          message: "操作成功"
        })
       }
      this.loadData();
    });
  }
  detail(index,row){
    this.detailUids = row.uids.join(',');
    this.dialogDetailVisible = true;
  }
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
getQueryItem() {
    let temp: any = {
      // pid:this.searchPid,
    };
    if (this.searchUid.trim()) {
      temp.uid = this.searchUid;
    }
    if (this.searchForbiddenTime && this.searchForbiddenTime.length) {
      temp.time ={gte: this.searchForbiddenTime[0],lt:this.searchForbiddenTime[1]};
    }
    return temp;
  }
  downloadExcel(){
       const downloadExcelCfg = [
      {
        title: "uids",
        field: "uids",
        type: "string"
      },
      {
        title: "时间",
        field: "time",
        type: "Date"
      },
      {
        title: "类型",
        field: "type",
        type: "userForbiddenType"
	  },
      {
        title: "理由",
        field: "reason",
        type: "string"
      },
      {
        title: "操作人",
        field: "opt",
        type: "string"
      },
    ];

    let queryItem: any = this.getQueryItem();
    if (Object.keys(queryItem).length<1) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    myDispatch(this.$store, "DownloadUserForbiddenExcel", queryItem).then(ret => {
		if(this.$store.state.userForbidden.code!==200){
			this.$message({
				type: "error",
				message: `${this.$store.state.userForbidden.msg}`
			});
			return;
    }else if(this.$store.state.userForbidden.code===200){
          this.$message({
          type: "success",
          message: "操作成功"
        })
    }
      downloadExcel(ret,this);
    });
  }
  uidFormat(row, column){
    if(row.uids.length===1){
      return row.uids;
    }else if(row.uids.length>1){
      return row.uids[0]+"..."
    }
  }
  //整形
  timeFormat(row, column) {
    let date = new Date(row.time);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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

  //清空缓存数据
  close() {
    // this.pid = "A";
    this.searchPid = "A";
    this.searchUid = "";
    this.searchForbiddenTime = [];
    this.page = 1; //当前页
    this.count = 10;
    this.currentUid = ""; //选中用户id fromID
    this.dialogUserForbiddenVisible = false; //封号
    this.srcUid = ""; //封号解封id
    this.reason = "";//封号解封理由
    this.loginForbidden = false;
  }
  typeFormat(row, column){
      return row.type?"封号":"解封";
  }
  // pidFormat(row, column){
  //   let name = "";
  //   this.pidList.forEach(element => {
  //       if(element.pid === row.pid){
  //         name =  element.name ;
  //       }
  //   });
  //   return name ;
  // }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
.toolbar1 {
  padding: 2px;
  background-color: #f9fafc;
  border: 1px;
  margin: 0px 0px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 0px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 10px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}

.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}

.content_font {
  font-size: 14px;
  font-weight: 700;
}
</style>
