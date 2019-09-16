<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理公告">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">代理福利领取记录</span>
			</el-col>
			<div class="box">
        <br>
				<span>项目</span>
				<el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
					<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
					</el-option>
				</el-select>
        <span>代理id</span>
				<el-input v-model="agencyId" style="width:120px; margin:10px"></el-input>
        <span>活动id</span>
				<el-input v-model="activityId" style="width:120px; margin:10px"></el-input>
        <span>时间</span>
        <el-date-picker v-model="receiveTime" type="datetimerange"
            value-format='yyyy-MM-dd HH:mm:ss' 
            style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
        </el-date-picker>
				<el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
				<el-button type="primary" @click="downloadExcel" style="margin:0px 0px 10px 10px">导出</el-button>
			</div>
			<!--列表-->
			<el-table :data="agencyWelfareRecord" border highlight-current-row style="width: 99%;" max-height="600">
				<el-table-column prop="pid" label="项目" width="100" align="center" :formatter="pidFormat" />
				<el-table-column prop="agencyId" label="代理id" min-width="150" align="center"  />
				<el-table-column prop="activityId"  label="活动id" min-width="100" align="center" />
				<el-table-column prop="description"  label="活动描述" min-width="100" align="center" />
				<el-table-column prop="money"  label="领取金额" min-width="100" align="center" />
				<el-table-column prop="receiveTime" label="领奖时间" min-width="200" align="center" :formatter="sumDatedFormatter"/>
			</el-table>
      	<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
declare var require: any
declare var process: any
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { SpreadDayTableState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";

interface QueryItem {
  pid?: string;
  page?: number;
  count?: number;
  agencyId?: string;
  activityId?: string;
  receiveTimeStart?:Date;
  receiveTimeEnd?:Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgencyWelfareRecord extends Vue {
  agencyWelfareRecord: any = this.$store.state.agencyWelfareRecord.agencyWelfareRecord;
  totalCount:number = this.$store.state.agencyWelfareRecord.totalCount;
  page: number = 1; //当前页
  count: number = 10;
  pidList: any[] = [];
  pid: string = "";
  id:string = "";
  agencyId:string = "";
  activityId:string = "";
  finishState:string = "";
  receiveState:string = "";
  receiveTime:Date[]=[];
  //生命周期钩子函数
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.pidList.push({name:"全部",pid:""})
    this.loadData();
  }

  //初始化数据
  loadData() {
    let queryItem: QueryItem|undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetWelfareRecord", queryItem).then(() => {
      this.agencyWelfareRecord = this.$store.state.agencyWelfareRecord.agencyWelfareRecord;
      this.totalCount= this.$store.state.agencyWelfareRecord.totalCount;
    });
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let tmp: QueryItem = { };
    if(this.pid){
      tmp.pid = this.pid;
    }
    if(this.agencyId){
      tmp.agencyId = this.agencyId;
    }
    if(this.activityId){
      tmp.activityId = this.activityId;
    }
    if (this.receiveTime && this.receiveTime.length === 2){
      tmp.receiveTimeStart = this.receiveTime[0];
      tmp.receiveTimeEnd = this.receiveTime[1];
    }
    return tmp;
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
  sumDatedFormatter(row, index) {
    if (row.receiveTime) {
      let date = new Date(row.receiveTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
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
  stateFormat(row, column) {
    if(row.state!==undefined){
      if(row.state){
        return "已完成"
      }else{
        return "未完成"
      }
    }
    return row.state;
  }
  receiveFormat(row, column) {
    if(row.receive!==undefined){
      if(row.receive){
        return "已领奖"
      }else{
        return "未领奖"
      }
    }
    return row.receive;
  }
downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "代理id", field: "agencyId", type: "string" },
      { title: "活动id", field: "activityId", type: "string" },
      { title: "活动描述", field: "description", type: "string" },
      { title: "领取金额", field: "money", type: "string" },
      { title: "领奖时间", field: "receiveTime", type: "Date" },
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "ExportWelfareRecord", queryItem).then(ret => {
      downloadExcel(ret,this);
    });
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
