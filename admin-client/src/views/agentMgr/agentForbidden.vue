<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
             <!--代理账号封停记录-->
            <el-col  class="toolbar1" style="margin-bottom: 20px">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理账号封停记录">
                </el-popover>
                <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
                <span class="title">代理账号封停记录</span>                
            </el-col> 
            <!-- 查询条件 -->
            <span>项目</span>
            <el-select v-model="searchPid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
              </el-option>
            </el-select>
            <span>代理ID</span>
            <el-input v-model="searchAgencyId" style="width:120px; margin:20px 10px"></el-input>
            <span>封停时间</span>
            <el-date-picker v-model="searchForbiddenTime" type="datetimerange"
                value-format='yyyy-MM-dd HH:mm:ss' 
                style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
            </el-date-picker>        
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
            <!-- 列表 -->
            <el-table :data="agentForbiddenData" border  max-height="700"  highlight-current-row style="width: 100%;font-size:10pt">
               <el-table-column prop="pid" label="项目" min-width="120" fixed align="center" :formatter="pidFormat"></el-table-column> 
                <el-table-column prop="agencyId" label="代理ID" min-width="120" fixed align="center"></el-table-column>  
                <el-table-column prop="type" label="类型" min-width="120"	 align="center" :formatter="typeFormat"></el-table-column>   
                <el-table-column prop="time"  label="时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
                <el-table-column prop="reason" label="理由" min-width="120"	 align="center" ></el-table-column>
                <el-table-column prop="opt" label="操作人" min-width="130" align="center"></el-table-column>
            </el-table>
             <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange" 
                :current-page="page" 
                :page-sizes="[10,20,30,50]" 
                :page-size="count" 
                :total="total">
                </el-pagination>
            </el-col>
      </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { UserForbidden,AgentMgrState } from "../../store/stateInterface";
import {getforbiddenLog} from "../../api/admin/agentMgr/agentMgr";
import { myDispatch, myAsyncFn } from "../../utils/index";

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
  pidList: any[] = []
  agentMgr: AgentMgrState = this.$store.state.agentMgr;
  searchPid: string = "";
  searchAgencyId: string = "";
  searchForbiddenTime: Date[] = [];
  loginForbidden:boolean = false;//
  page: number = 1; //当前页
  count: number = 10;
  total:number = 0;
  agentForbiddenData: any[]=[];
  created() {
    this.loadData();
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    // this.pid= this.pidList[0]? this.pidList[0].pid||"" : "";
  }
  async loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getforbiddenLog, queryItem)
    if(ret.code===200){
      this.agentForbiddenData = ret.msg.data;
      this.total = ret.msg.page.total;
    }
  }
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
getQueryItem() {
    let temp: any = {
      pid:this.searchPid,
    };
    if (this.searchAgencyId.trim()) {
      temp.agencyId = this.searchAgencyId;
    }
    if (this.searchForbiddenTime && this.searchForbiddenTime.length) {
      temp.fromTime =this.searchForbiddenTime[0]
      temp.toTime =this.searchForbiddenTime[1]
    }
    return temp;
  }
  pidFormat(row) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
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

  typeFormat(row, column){
      return row.type?"正常":"冻结";
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
