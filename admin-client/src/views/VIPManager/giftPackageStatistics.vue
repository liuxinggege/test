<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="VIP礼包统计"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">VIP礼包统计</span>
      </el-col>
      <!--工具条-->
      <div>

        <span>平台</span>
        <el-select @change="searchData" v-model="queryItem.pid" placeholder="请选择" style="margin:0px 20px 0px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <!-- <span>VIP</span>
        <el-input-number v-model="queryItem.start" :min="1" :max="queryItem.end" controls-position="right" style="width:120px;"></el-input-number>
        <span>到VIP</span>
        <el-input-number v-model="queryItem.end" :min="queryItem.start" :max="15" controls-position="right" style="width:120px;margin-right:15px;"></el-input-number> -->

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
        <span style="margin-left:30px;">总领取次数： {{giftPackageStatisticsData.totalReceiveCount}}</span>
      </div>
      <!-- 列表  -->
      <el-table :data="giftPackageStatisticsData.pageData" border highlight-current-row style="width: 100%;margin-top:20px;" max-height="500">
        <el-table-column prop="vipLevel" label="VIP等级"         align="center"></el-table-column>
        <el-table-column prop="name" label="礼包名称"         align="center"></el-table-column>
        <el-table-column prop="available" label="可领取人数"  align="center"></el-table-column>
        <el-table-column prop="receive" label="领取人数"      align="center"></el-table-column>
        <el-table-column prop="receivingRate" label="领取率"  align="center"></el-table-column>
      </el-table>
      <!--工具条-->
      <!-- <el-col class="toolbar2">
        <el-pagination 
        layout="total,sizes,prev, pager, next,jumper" 
        class="pag" 
        @current-change="handleCurrentChange" 
        @size-change="handleSizeChange" 
        :current-page="queryItem.page" 
        :page-sizes="[10,20,30,50]" :page-size="queryItem.count" 
        :total="giftPackageStatisticsData.totalCount"></el-pagination>
      </el-col> -->
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";
interface QueryItem {
  pid:string;
  // start:number;
  // end:number;
  // page:number;
  // count:number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GiftPackageStatistics extends Vue {
  /*inital data*/
  pidList:any[] = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
  giftPackageStatisticsData:any = this.$store.state.giftPackageStatistics;
  queryItem:QueryItem = {
      pid:"A",//平台
      // start:1,
      // end:15,
      // page: 1, //当前页
      // count:10,
  }
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
   /*method*/
  searchData() {
    // this.queryItem.page = 1;
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetVipPrivilegeListCount", this.queryItem)
  }
  //页码变更
  // handleCurrentChange(val) {
  //   this.queryItem.page = val;
  //   this.loadData();
  // }
  //每页显示数据量变更
  // handleSizeChange(val) {
  //   this.queryItem.count = val;
  //   this.loadData();
  // }
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
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
