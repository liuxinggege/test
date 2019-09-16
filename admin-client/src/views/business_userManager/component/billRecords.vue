<template>   
     <div style="border:2px solid #AFEEEE; z-index:999">
        <el-col class="toolbar1">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="账单记录"></el-popover>
            <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
            <span class="title">账单记录({{uid}})</span>  
            <el-button type="primary" @click="refrsh" style="margin: 20px;">刷新</el-button>
        </el-col>
        <!--工具条-->
        <el-col class="toolbar1">
            <el-pagination layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange" 
            @size-change="handleSizeChange" 
            :current-page="page" 
            :page-sizes="[10,20,30,50]" 
            :page-size="count" 
            >
            </el-pagination>
            <!-- :total="0" -->
        </el-col>
        <!--列表-->
         <el-table :data="billRecord" border highlight-current-row style="width: 100%;">
            <el-table-column prop="logDate" label="时间" width="180" :formatter="timeFormat" align="center">
            </el-table-column>
            <el-table-column prop="price" label="金额" width="180" align="center">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="180" align="center">
            </el-table-column>
            <el-table-column prop="channel" label="通道" min-width="100" align="center">
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { GeneralUser } from "../../../store/stateInterface";
import { BillRecord } from "../../../store/modules/userManager/generalUser";
import { myDispatch, secToString } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GenUserAttribution extends Vue {
  //初始化数据
  uid = this.$attrs.curUid;
  generalUser: GeneralUser = this.$store.state.generalUser;
  billRecord: BillRecord[] = this.generalUser.billRecord;
  page: number = 1; //当前页
  count: number = 10;

  created() {
    this.uid = this.$attrs.curUid;
    this.loadData();
  }
  refrsh() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetBillRecords", {
      uid: this.uid,
      page: this.page,
      count: this.count
    }, true).then(() => {
      this.billRecord = this.generalUser.billRecord;
    });
  }
  secToString(value) {
    return secToString(value);
  }
  //整形
  timeFormat(row, column) {
    let date = new Date(row.bindTime);
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
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
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
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: sans-serif;
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
