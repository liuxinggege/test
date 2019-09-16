<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <div>
        <el-col class="toolbar1" style="margin-bottom: 20px">
          <el-popover ref="popover1" placement="top" title="标题" trigger="hover" content="兑换用户"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title">兑换领取记录</span>
        </el-col>
        <div>
           <span>活动id</span>
          <el-input v-model="actId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
          <span>兑换码</span>
          <el-input v-model="code" style="width:120px; margin:5px 20px 0px 32px "></el-input>
          <span>用户ID</span>
          <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getdata">读取</el-button>
        </div>
        <el-table :data="data" border highlight-current-row style="margin: 20px 0">
          <el-table-column prop="actId" label="活动Id" min-width="170" align="center"></el-table-column>
          <el-table-column prop="uid" label="玩家id" min-width="170" align="center"></el-table-column>
          <el-table-column
            prop="getCodeDate"
            label="获取兑换码时间"
            min-width="170"
            :formatter="getCodeDateFormat"
            align="center"
          ></el-table-column>
          <el-table-column prop="code" label="兑换码" min-width="170" align="center"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col class="toolbar2">
          <el-pagination
            layout="total,sizes,prev, pager, next,jumper"
            class="pag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="page"
            :page-sizes="[10,20,30,50]"
            :page-size="count"
            :total="totalCount"
          ></el-pagination>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ActivityCfg extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.loadData();
  }
  /*inital data*/
  data: any[] = []; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;
  pidList: any[] = [];
  pid: string = "";
  uid: string = "";
  actId: string = "";
  code: string = "";
  /*method*/
  getCond() {
    let tmp: any = {
      //   pid: this.pid,
      page: this.page,
      count: this.count
    };
    if (this.uid) {
      tmp.uid = this.uid;
    }
    if (this.code) {
      tmp.code = this.code;
    }
    if (this.actId) {
      tmp.actId = this.actId;
    }
    return tmp;
  }
  loadData() {
    let cond = this.getCond();
    myDispatch(this.$store, "eventResultUser", cond, true).then(ret => {
      this.data = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    });
  }
  getdata() {
    this.loadData();
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
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  getCodeDateFormat(row, column) {
    let date = new Date(row.getCodeDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
