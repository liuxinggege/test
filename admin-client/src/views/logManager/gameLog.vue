<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="游戏日志">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">游戏日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>用户ID</span>
        <el-input v-model="userId" style="width:120px; margin:20px 10px"></el-input>
        <span>类型</span>
        <el-select v-model="type" placeholder="请选择" style="width:120px; margin:20px 10px">
          <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>日志记录时间</span>
        <el-date-picker v-model="logTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
        <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="gameLog.gameLogData" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="_id" label="日志id" min-width="175" align="center" />
        <el-table-column prop="uid" label="玩家ID" width="200" align="center" />
        <el-table-column prop="gid" label="游戏名字" width="150" :formatter="gid" align="center" />
        <el-table-column prop="yid" label="场次号" width="200" align="center" />
        <el-table-column prop="startDate" label="开始时间" width="170" :formatter="timeFormat1" align="center" />
        <el-table-column prop="endDate" label="结束时间" width="170" :formatter="timeFormat2" align="center" />
        <el-table-column prop="totalOrgMoney" label="原金币" width="200" align="center" />
        <el-table-column prop="money" label="金币" width="150" align="center" />
        <el-table-column prop="chgMoney" label="变化金币" min-width="150" align="center" />
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
          <el-pagination ref="pageRef" layout="sizes, prev, next" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-count="gameLog.totalCount" :page-sizes="[10,20,30,50]"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { GameLogState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
//GameLog
interface QueryItem {
  userId: number;
  type: string[];
  page: number;
  count: number;
  startTime?: Date;
  endTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GameLog extends Vue {
  // lifecycle hook
  created() {
    // this.loadData(); //初始化-->加载数据
  }
  searchData(){
    this.page=1;
    this.loadData();
  }
  /*inital data*/
  gameLog: GameLogState = this.$store.state.gameLog; //表单数据
  userId: string = "";
  logTime: Date[] = [];
  page: number = 1; //当前页
  weekTamp = 1000 * 60 * 60 * 24 * 7;
  count: number = 30;
  type: string | undefined = "";
  stateOptions = [
    { value: "", label: "全部" },
    { value: "JH", label: "金花" },
    { value: "BRNN", label: "百人牛牛" },
    {
      value: "SUOHA",
      label: "梭哈"
    },
    {
      value: "XUEZHAN",
      label: "麻将"
    },
    {
      value: "QZNN",
      label: "牛牛"
    },
    {
      value: "DDZ",
      label: "斗地主"
    },
    {
      value: "DZPK",
      label: "德州扑克"
    },
    {
      value: "QHB",
      label: "抢红包"
    },
    {
      value: "HH",
      label: "红黑"
    },
    {
      value: "ERMJ",
      label: "二人麻将"
    },
    {
      value: "LH",
      label: "龙虎斗"
    },
    {
      value: "EBG",
      label: "二八杠"
    },
    {
      value: "DFDC",
      label: "多福多财"
    },
    {
      value: "BY",
      label: "捕鱼"
    },
    { value: "JDNN", label: "经典牛牛" },
    { value: "PDK", label: "跑得快" }
  ];
  // totalCount: number = 0;

  /*method*/
  loadData() {
    if (isNaN(parseInt(this.userId))) {
      this.$message({
        type: "error",
        message: "用户ID必填且是数字类型!"
      });
      return;
    }
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    if (queryItem.startTime && queryItem.endTime) {
      let endTime = new Date(queryItem.endTime.toString());
      let startTime = new Date(queryItem.startTime.toString());
      if (endTime.getTime() - startTime.getTime() > this.weekTamp) {
        this.$message({ type: "error", message: "日期间隔大于一周!" });
        return;
      }
    } else {
      queryItem.endTime = new Date();
      queryItem.startTime = new Date(
        queryItem.endTime.getTime() - this.weekTamp
      );
    }
     myDispatch(this.$store, "GetGameLog2", queryItem).then(() => {
      this.setPagination();
    });
  }
  setPagination() {
    const pagination: any = this.$refs.pageRef;
    if (this.page === 1) {
      this.gameLog.totalCount = 1;
    }
    if (this.gameLog.next) {
      if (this.page >= pagination.lastEmittedPage || this.page === 1) {
        this.gameLog.totalCount += 1;
      } else {
        this.gameLog.totalCount -= 1;
      }
    }
   }
  //获取查询条件
  getQueryItem() {
    let temp: any = {};
    temp.userId = parseInt(this.userId);
    if (!this.type || this.type == "") {
      this.type = undefined;
    } else {
      temp.type = [this.type];
    }

    if (this.logTime && this.logTime.length) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }
  //日期整形
  timeFormat1(row, column) {
    let date = new Date(row.startDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  timeFormat2(row, column) {
    let date = new Date(row.endDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  //游戏名称
  gid(row, column) {
    if (row.gid == "JH") {
      return "金花";
    } else if (row.gid == "QZNN") {
      return "牛牛";
    } else if (row.gid == "BRNN") {
      return "百人牛牛";
    } else if (row.gid == "XUEZHAN") {
      return "麻将";
    } else if (row.gid == "SUOHA") {
      return "梭哈";
    } else if (row.gid == "DDZ") {
      return "斗地主";
    } else if (row.gid == "DZPK") {
      return "德州扑克";
    } else if (row.gid == "QHB") {
      return "抢红包";
    } else if (row.gid == "HH") {
      return "红黑";
    }else if (row.gid == "ERMJ") {
      return "二人麻将";
    }else if (row.gid == "LH") {
      return "龙虎斗";
    } else if (row.gid == "BY") {
      return "捕鱼";
    } else if (row.gid == "JDNN") {
      return "经典牛牛";
    } else if (row.gid == "PDK") {
      return "跑得快";
    }else if (row.gid == "EBG") {
      return "二八杠";
    }else if (row.gid == "DFDC") {
      return "多福多财";
    }
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
  //导出excle
  downloadExcel() {
    if (isNaN(parseInt(this.userId))) {
      this.$message({
        type: "error",
        message: "用户ID必填且是数字类型!"
      });
      return;
    }
    const downloadExcelCfg = [
      {
        title: "日志id",
        field: "_id",
        type: "string"
      },
      {
        title: "玩家ID",
        field: "uid",
        type: "string"
      },
      {
        title: "游戏名字",
        field: "gid",
        type: "string"
      },
      {
        title: "场次号",
        field: "yid",
        type: "string"
      },
      {
        title: "开始时间",
        field: "startDate",
        type: "Date"
      },
      {
        title: "结束时间",
        field: "endDate",
        type: "Date"
      },
      {
        title: "原金币",
        field: "totalOrgGold",
        type: "string"
      },
      {
        title: "金币",
        field: "money",
        type: "string"
      },
      {
        title: "变化金币",
        field: "chgMoney",
        type: "string"
      }
    ];
    let queryItem: QueryItem = this.getQueryItem();
    // if (!Object.keys(queryItem).length) {
    //   this.$message({
    //     type: "error",
    //     message: "必须输入任一搜索条件"
    //   });
    //   return;
    // }
    myDispatch(this.$store, "GetGameLogExcel", queryItem).then(ret => {
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
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
