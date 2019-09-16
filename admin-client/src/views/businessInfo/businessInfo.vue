<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
             <!--普通用户信息-->
            <el-col  class="toolbar1" style="margin-bottom: 20px">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="普通用户信息">
                </el-popover>
                <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
                <span class="title">商人信息</span>                
            </el-col> 
            <!-- 查询条件 -->
            <span>商人ID</span>
            <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
            <span>时间</span>
            <el-date-picker v-model="createDate" type="datetimerange"
                value-format='yyyy-MM-dd HH:mm:ss' 
                style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
            </el-date-picker>        
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
            <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button> 
            
            <!-- 列表 -->
            <el-table :data="generalUserData" border  max-height="700"  highlight-current-row style="width: 100%;font-size:10pt">
                <el-table-column label="序号" type="index" :index="indexMethod" min-width="80" fixed align="center"></el-table-column>
                <el-table-column prop="uid" label="商人ID" min-width="80" align="center" fixed></el-table-column>
                <el-table-column prop="name" label="商人展示名称" min-width="120" align="center" fixed></el-table-column>    
                <el-table-column prop="wx"  label="展示微信" min-width="120" align="center"></el-table-column>
                <el-table-column prop="qq"  label="展示QQ" min-width="120" align="center"></el-table-column>
                <!-- <el-table-column prop="totalGameTime"  label="商代代理号" min-width="120" align="center"></el-table-column> -->
                <el-table-column prop="channel"  label="渠道号" min-width="120" align="center" :formatter="channelFormat"></el-table-column>
                <el-table-column prop="transferOut" label="转出总额" min-width="150" align="center"></el-table-column>
                <el-table-column prop="transferIn" label="转入总额" min-width="150" align="center"></el-table-column>
            </el-table>
             <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange" 
                :current-page="page" 
                :page-sizes="[10,20,30,50]" 
                :page-size="count" 
                :total="totalCount">
                </el-pagination>
            </el-col>
    </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { downloadExcel } from "../../utils/downloadEXCEL";
import { myAsyncFn } from "../../utils/index";
import {getAgentStat,getAgentStatExcel} from "../../api/admin/userManager/userManager"

interface QueryItem {
  uid:string;
  page: number;
  count: number;
  startTime: Date;
  endTime: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GetGeneralUser extends Vue {
  //初始化数据
  generalUserData:any[] = [];
  uid: string = "";
  createDate: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;
	
  created() {}

  //method
  async loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getAgentStat,queryItem)
    if(ret.code===200){
        this.generalUserData = ret.msg.pageData
        this.totalCount = ret.msg.totalCount
    }else{
        this.$message({
            type:'error',
            message:ret.err
        })
    }
  }
  indexMethod(index){
      return index+1
  }
  searchLoadData(){
    if(!this.createDate||this.createDate.length===0){
        this.$message({
            type:'error',
            message:"请选择时间！"
        })
    }else{
        this.page = 1;
        this.loadData();
    }
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {};
    if (this.uid.trim()) {
      temp.uid = this.uid;
    }
    if (this.createDate && this.createDate.length) {
      temp.startTime = this.createDate[0];
      temp.endTime = this.createDate[1];
    }
    return temp;
  }
  
  //整形
  channelFormat(row){
      let channel = row.channel?row.channel:'官方'
      return channel
  }
//   timeFormat(row, column) {
//     let date = new Date(row.createDate);
//     let sdate = date.toLocaleString(undefined, {
//       hour12: false,
//       timeZone: "Asia/Shanghai"
//     });
//     return sdate;
//   }
  
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

  //导出
  async downloadExcel() {
    let queryItem: any = this.getQueryItem();
    if (Object.keys(queryItem).length<=1) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    let ret = await myAsyncFn(getAgentStatExcel,queryItem)
    if(ret.code===200){
        this.$message({
            type:'success',
            message:"创建任务成功！"
        })
    }else{
        this.$message({
            type:'error',
            message:ret.err
        })
    }
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
