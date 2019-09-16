<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人信息修改日志">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">商人信息修改日志</span>
      </el-col>
      <!--工具条-->
      <div>			 
        <span>商人ID</span>
        <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
        <span>旧QQ</span>
        <el-input v-model="oldQQ" style="width:120px; margin:20px 10px"></el-input>
        <span>新QQ</span>
        <el-input v-model="newQQ" style="width:120px; margin:20px 10px"></el-input>
        <span>旧微信</span>
        <el-input v-model="oldWx" style="width:120px; margin:20px 10px"></el-input>
        <span>新微信</span>
        <el-input v-model="newWx" style="width:120px; margin:20px 10px"></el-input>
        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="contactInfoLog" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="logDate" label="日志创建时间" min-width="120" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="uid" label="商人ID" min-width="80" align="center"></el-table-column>
        <el-table-column prop="newQQ" label="新QQ" min-width="100" align="center"></el-table-column>
        <el-table-column prop="oldQQ" label="旧QQ" min-width="100" align="center"></el-table-column>
        <el-table-column prop="newWx" label="新微信" min-width="100" align="center"></el-table-column>
        <el-table-column prop="oldWx" label="旧微信" min-width="100" align="center"></el-table-column>
        <el-table-column prop="opt" label="操作人" min-width="80" align="center"></el-table-column>
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
import { getAgentContactInfoLog } from "../../api/admin/logManage/log";
import { myAsyncFn } from "../../utils/index.js";
//LoginLog
interface QueryItem {
  uid?: string;
  oldQQ?:string;
  newQQ?:string;
  oldWx?:string;
  newWx?:string;
  page: number;
  count: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class contactInfoLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  contactInfoLog: any[]=[]; //表单数据
  uid: string = "";
  oldQQ:string= "";
  newQQ:string= "";
  oldWx:string= "";
  newWx:string= "";
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  /*method*/
  search(){
    this.page = 1;
    this.loadData();
  }
  async loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.uid) {
      queryItem.uid = this.uid;
    }
    if (this.oldQQ) {
      queryItem.oldQQ = this.oldQQ;
    }
    if (this.newQQ) {
      queryItem.newQQ = this.newQQ;
    }
    if (this.oldWx) {
      queryItem.oldWx = this.oldWx;
    }
    if (this.newWx) {
      queryItem.newWx = this.newWx;
    }
    let ret = await myAsyncFn(getAgentContactInfoLog,queryItem)
    if(ret.code===200){
        this.contactInfoLog = ret.msg.pageData
        this.totalCount = ret.msg.totalCount
    }else{
        this.$message({
            type:"error",
            message:ret.err
        })
    }
  }
  //日期整形
  timeFormat(row, column) {
    let date = new Date(row.logDate);
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
