<template>   
     <div style="border:2px solid #AFEEEE; padding:20px">
        <el-col class="toolbar1">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="转账记录"></el-popover>
            <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
            <span class="title">转账记录({{uid}})</span>  
            <el-date-picker v-model="time" type="datetimerange"
                value-format='yyyy-MM-dd HH:mm:ss' 
                style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
            </el-date-picker>
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="loadData">搜索</el-button>
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
        <el-table :data="transferInfo" border highlight-current-row style="width: 100%;">
            <el-table-column prop="from" label="转账人ID" width="120" align="center"></el-table-column>
            <el-table-column prop="to" label="接受人ID" width="120" align="center"></el-table-column>
            <el-table-column prop="fromGoldBefore" label="转账人原金币" width="150" align="center"></el-table-column>
            <el-table-column prop="fromBankGoldBefore" label="转账人原银行金币" width="150" align="center"></el-table-column>
            <el-table-column prop="toGoldBefore" label="接受人原金币" width="150" align="center"></el-table-column>
            <el-table-column prop="toBankGoldBefore" label="接受人原银行金币" width="150" align="center"></el-table-column>
            <el-table-column prop="fromGoldAfter" label="转账人现金币" width="150" align="center"></el-table-column>
            <el-table-column prop="fromBankGoldAfter" label="转账人现银行金币" width="150" align="center"></el-table-column>
            <el-table-column prop="toGoldAfter" label="接受人现金币" width="150" align="center"></el-table-column>
            <el-table-column prop="toBankGoldAfter" label="接受人现银行金币" width="150" align="center"></el-table-column>
            <el-table-column prop="transferMoney" label="交易金币" min-width="150" align="center"></el-table-column>
            <el-table-column prop="transferTime" label="交易时间" width="150" :formatter="timeFormat1" align="center"></el-table-column>
            <el-table-column prop="logTime" label="日志时间" width="150" :formatter="timeFormat2" align="center"></el-table-column>
        </el-table>
        
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { GeneralUser } from "@/store/stateInterface";
import { TransferInfo } from "@/store/modules/userManager/generalUser";
import { myDispatch, secToString } from "@/utils/index";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GenUserAttribution extends Vue {
  //初始化数据
  uid = this.$attrs.curUid;
  generalUser: GeneralUser = this.$store.state.generalUser;
  transferInfo: TransferInfo[] = this.generalUser.transferInfo;
  page: number = 1; //当前页
  count: number = 10;
  time: Date[] = [];
  created() {
    this.uid = this.$attrs.curUid;
    this.loadData();
  }
  refrsh() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "", {}, true).then(() => {
      this.transferInfo = this.generalUser.transferInfo;
    });
  }
  secToString(value) {
    return secToString(value);
  }
  //整形
  timeFormat1(row, column) {
    let date = new Date(row.transferTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  timeFormat2(row, column) {
    let date = new Date(row.logTime);
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
