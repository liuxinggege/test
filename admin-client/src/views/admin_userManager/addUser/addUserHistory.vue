<template>
    <el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="账号创建记录">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>账号创建记录</b>
		</span>		
    <br>
      <span>id</span>
      <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
      <span>注册渠道</span>
      <el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
          </el-option>
        </el-select>
      <span>注册时间</span>
      <el-date-picker v-model="createDate" type="datetimerange"
          value-format='yyyy-MM-dd HH:mm:ss' 
          style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
      </el-date-picker>    
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
      <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button> 
		<!--列表-->
     <el-table :data="userCreateRecordData.data"  border highlight-current-row style="width: 100%;">
        <el-table-column prop="pid" label="项目" min-width="100" :formatter="pidFormatter" align="center"></el-table-column>        
        <el-table-column prop="act" label="账号" min-width="200" align="center"></el-table-column>
        <el-table-column prop="pwd" label="密码" min-width="120" align="center"></el-table-column>
        <el-table-column prop="channel" label="渠道" min-width="100" align="center" :formatter="channelFuc"></el-table-column>
        <el-table-column prop="uid" label="id" min-width="200"  align="center"></el-table-column>
        <el-table-column prop="opt" label="操作人" min-width="120" align="center"></el-table-column>
        <el-table-column prop="time" label="时间" min-width="200" :formatter="timeFormatter" align="center"></el-table-column>
      </el-table>
      <!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="userCreateRecordData.count">
				</el-pagination>
			</el-col>
	</el-card>
    
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../../utils/downloadEXCEL";
import { BrnnMatchStagesState } from "../../../store/stateInterface"; //state Interface
import { myDispatch } from "../../../utils/index.js"
// @Component 修饰符注明了此类为一个 Vue 组件
interface QueryItem {
  pid?:string;
  uid?: number;
  act?: string;
  channel?: string;
  opt?:string;
  page: number;
  count: number;
  startTime?: Date;
  endTime?: Date;
}
@Component
export default class AddUserHistory extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }
  /*inital data*/
  userCreateRecordData = this.$store.state.userCreate.userCreateRecordData;
  page:number = 1;
  count:number = 10;
  uid:any = "";
  channel:string = "";
  pid:string = "";
  createDate: Date[] = [];
  pidList: any[] = [];
  /*method*/
  loadData() {
      let queryItem: QueryItem = this.getQueryItem();
      queryItem.page = this.page;
      queryItem.count = this.count;
      myDispatch(this.$store,"GetUserCreateRecord",queryItem).then(()=>{    });
  }
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
    };
    if (this.uid) {
      temp.uid = this.uid;
    }
    if (this.channel.trim()) {
      temp.channel = this.channel;
    }
    if (this.pid.trim()) {
      temp.pid = this.pid;
    }
    if (this.createDate && this.createDate.length) {
      temp.startTime = this.createDate[0];
      temp.endTime = this.createDate[1];
    }
    return temp;
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
  timeFormatter(row, column) {
    let date = new Date(row.time);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  pidFormatter(row) {
    let data;
    this.pidList.forEach(element => {
      if (element.pid === row.pid) data = element;
    });
    return data.name;
  }
  channelFuc(row, column) {
    if (row.channel === "") {
      return "官方";
    } else {
      return row.channel;
    }
  }
  //导出
  downloadExcel() {
    const downloadExcelCfg = [
      {
        title: "项目",
        field: "pid",
        type: "pidType"
      },
      {
        title: "账号",
        field: "act",
        type: "string"
      },
      {
        title: "密码",
        field: "pwd",
        type: "string"
      },      
      {
        title: "渠道",
        field: "channel",
        type: "channelType"
      },
      {
        title: "id",
        field: "uid",
        type: "string"
      },
      {
        title: "操作人",
        field: "opt",
        type: "string"
      },
      {
        title: "时间",
        field: "time",
        type: "Date"
      },
    ];
    let queryItem: any = this.getQueryItem();
    myDispatch(this.$store, "DownloadUserCreateExcel", queryItem).then(ret => {
		if(this.$store.state.userCreate.code!==200){
			this.$message({
				type: "error",
				message: `${this.$store.state.userCreate.msg}`
			});
			return;
		}
     downloadExcel(ret,this);
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 15px;
  border: 1px solid #dfe6ec;
  position: relative;
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
.edit-input {
  padding-right: 0px;
}
.close-btn {
  margin:0 3px
}
</style>
