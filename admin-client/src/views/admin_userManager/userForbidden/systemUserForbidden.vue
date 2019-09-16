<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
             <!--系统账号封停-->
            <el-col  class="toolbar1" style="margin-bottom: 20px">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="系统账号封停">
                </el-popover>
                <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
                <span class="title">系统账号封停</span>                
            </el-col> 
            <span>用户ID</span>
            <el-input v-model="searchUid" style="width:120px; margin:20px 10px"></el-input>
            <span>等级</span>
            <el-input v-model="searchLevel" style="width:120px; margin:20px 10px"></el-input>
            <span>手机号</span>
            <el-input v-model="searchPhone" style="width:120px; margin:20px 10px"></el-input>
            <span>ip</span>
            <el-input v-model="searchIp" style="width:120px; margin:20px 10px"></el-input>
            <span>风险类型</span>
            <el-select v-model="searchRiskType" placeholder="请选择"  style="width:120px; margin:20px 10px">
                <el-option v-for="item in riskType" :key="item.value"  :label="item.label" :value="item.value"></el-option>
            </el-select>
            <br>
            <span>封停时间</span>
            <el-date-picker v-model="searchForbiddenTime" type="datetimerange"
                value-format='yyyy-MM-dd HH:mm:ss' 
                style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
            </el-date-picker>        
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
            <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 10px">导出excel</el-button> 
            <!-- 列表 -->
            <el-table :data="systemUserForbiddenLogDatas.data" border  max-height="700"  highlight-current-row style="width: 100%;font-size:10pt">
                <!-- <el-table-column prop="pid" label="项目" min-width=70" align="center"  :formatter="pidFormat" fixed></el-table-column> -->
                <el-table-column prop="uid" label="玩家ID" min-width="120" fixed align="center" ></el-table-column>  
                <el-table-column prop="level" label="等级" min-width="120"	 align="center" ></el-table-column>   
                <el-table-column prop="logDate"  label="封号时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
                <el-table-column prop="phoneNumber" label="手机号" min-width="120"	 align="center" ></el-table-column>
                <el-table-column prop="ip" label="ip" min-width="130" align="center"></el-table-column>
                <el-table-column prop="riskType" label="风险类型" min-width="130" :formatter="riskTypeFormat" align="center"></el-table-column>
            </el-table>
             <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange" 
                :current-page="page" 
                :page-sizes="[10,20,30,50]" 
                :page-size="count" 
                :total="systemUserForbiddenLogDatas.count">
                </el-pagination>
            </el-col>
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
  searchLevel: string ="";
  searchUid: string = "";
  searchPhone: string = "";
  searchIp: string = "";
  searchRiskType: string = "";
  searchForbiddenTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  total:number = 0;
  riskType:any[]=[
      {value: '',label: '所有'},
      {value: 1,label: '帐号信用低'},
      {value: 2,label: '垃圾帐号'},
      {value: 3, label: '无效帐号' }, 
      {value: 4, label: '黑名单' }, 
      {value: 101, label: '批量操作'}, 
      {value: 102, label: '自动机' },
      {value: 201, label: '环境异常'}, 
      {value: 202,label: 'js上报异常'}, 
      {value: 203, label: '撞库'}];
  systemUserForbiddenLogDatas: UserForbidden = this.$store.state.userForbidden.systemUserForbiddenLogDatas;
  created() {
    this.loadData();
  }
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetSystemUserForbiddenLog", queryItem).then(() => {
      this.systemUserForbiddenLogDatas = this.$store.state.userForbidden.systemUserForbiddenLogDatas;
      this.close();
    });
  }
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
getQueryItem() {
    let temp: any = {
    };
    if (this.searchUid.trim()) {
      temp.uid = this.searchUid;
    }
    if (this.searchLevel.trim()) {
      temp.level = this.searchLevel;
    }
    if (this.searchPhone.trim()) {
      temp.phoneNumber = this.searchPhone;
    }
    if (this.searchIp.trim()) {
      temp.ip = this.searchIp;
    }
    if (this.searchRiskType) {
      temp.riskType = this.searchRiskType;
    }
    if (this.searchForbiddenTime && this.searchForbiddenTime.length) {
      temp.logDate ={gte: this.searchForbiddenTime[0],lt:this.searchForbiddenTime[1]};
    }
    return temp;
  }
  downloadExcel(){
       const downloadExcelCfg = [
      {
        title: "用户id",
        field: "uid",
        type: "string"
      },
      {
        title: "时间",
        field: "logDate",
        type: "Date"
      },
      {
        title: "等级",
        field: "level",
        type: "number"
	  },
      {
        title: "手机",
        field: "phoneNumber",
        type: "string"
      },
      {
        title: "ip",
        field: "ip",
        type: "string"
      },
      {
        title: "风险类型",
        field: "riskType",
        type: "riskType"
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
    myDispatch(this.$store, "DownloadSystemUserForbiddenExcel", queryItem).then(ret => {
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
  //整形
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

  //清空缓存数据
  close() {
    this.searchLevel = "";
    this.searchUid = "";
    this.searchPhone= "";
    this.searchIp= "";
    this.searchRiskType= "";
    this.searchForbiddenTime = [];
  }
  typeFormat(row, column){
      return row.type?"封号":"解封";
  }
  riskTypeFormat(row, column){
      let result:string[] = []; 
      if(row.riskType.length>0){
        row.riskType.forEach(element => {
          switch (element) {
            case 1:
                result.push("帐号信用低");
              break;
            case 2:
                result.push("垃圾帐号");
              break;
            case 3:
                result.push("无效帐号");
              break;
            case 4:
                result.push("黑名单");
              break;
            case 101:
                result.push("批量操作");
              break;
            case 102:
                result.push("自动机");
              break;
            case 201:
                result.push("环境异常");
              break;
            case 202:
                result.push("js上报异常");
              break;
            case 203:
                result.push("撞库");
              break;
            default:
              break;
          }
        });
      }
      return result.toString();
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
