<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人充值"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">商人联系方式查询</span>
      </el-col>
      <div class="searchBox">
        <label>商人ID:</label>
        <el-input v-model="traderID" style="width:200px" placeholder="请输入内容"></el-input>
        <el-button @click="searchId" type="primary" size="small" style="margin:0 100px 0 20px">查询ID</el-button>
        <label style="margin-left:30px">平台:</label>
        <el-select v-model="platform" placeholder="请选择" @change="searchId">
          <el-option v-for="(item,index) in pidArr" :key="index" :label="item.name" :value="item.pid"></el-option>
        </el-select>
      </div>
      <el-table :data="pageData" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="pid" fixed label="平台" :formatter="pidFormat" width="300px" align="center"></el-table-column>
        <el-table-column prop="uid" label="商人ID" width="300px" align="center"></el-table-column>
        <el-table-column prop="contacNum" label="联系方式总数" width="300px" align="center"></el-table-column>
        <el-table-column prop="contacFalseNum" label="废弃联系方式数" width="300px" align="center"></el-table-column>
        <el-table-column label="操作" width="320px" align="center">
          <template slot-scope="scope">
            <el-button @click="read(scope.row)" type="primary" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
      <el-dialog title :visible.sync="dialogRecharge" width="60%">
        <div style="margin-bottom:40px">
          <label>商人ID:</label>
          <span>{{uid}}</span>
          <label style="margin-left:30px">使用情况：</label>
          <el-select v-model="select" placeholder="请选择" @change="selectType">
            <el-option v-for=" (item,index) in studios" :key="index" :label="item.label" :value="item.type"></el-option>
          </el-select>
        </div>
        <el-table :data="infos" border height="300px">
          <el-table-column prop="createDate" label="录入时间" width="150" align="center" :formatter="timeFormat2"></el-table-column>
          <el-table-column prop="accountType" label="联系方式" width="200" align="center"></el-table-column>
          <el-table-column prop="accountId" label="联系账号" align="center"></el-table-column>
          <el-table-column prop="agentName" label="账号昵称" align="center"></el-table-column>
          <el-table-column prop="qrCode" label="二维码" align="center">
            <template slot-scope="scope">
              <img v-if="scope.row.qrCode" :src="scope.row.qrCode" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="using" label="当前使用状况" align="center" :formatter="Format1"></el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { myAsyncFn, myDispatch } from "../../utils/index.js";
import {
  onlineMonitor,
  getAgenStats,
  getContacInfos,
  getContacDetails
} from "@/api/admin/agentRecharge/agentRecharge";
import { log } from "util";
export default {
  data() {
    return {
      studios: [
        { type: null, label: "全部" },
        { type: false, label: "停用" },
        { type: true, label: "使用中" }
      ],
      select: "",
      infos: [],
      gridData: null,
      value: null,
      trader: "",
      platform: "",
      pid: null,
      uid: null,
      pageData: [],
      dialogRecharge: false,
      agentData: [],
      page: 1,
      count: 10,
      totalCount: 0,
      channelArr: [],
      online: "",
      totalNum: "",
      dialogData: {},
      tempValue: "",
      pidArr: [],
      ///////
      traderID: ""
    };
  },
  created() {
    this.loadData();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid"));
    this.pidArr.push({ pid: undefined, name: "全部" });
  },
  methods: {
    //查询使用状态
    async selectType() {
      let query = {
        uid: this.uid,
        using: this.select
      };
      let res = await myAsyncFn(getContacDetails, query);
      if (res.code === 200) {
        console.log(res.msg);
        this.infos = res.msg;
        this.using = "";
      }
    },
    //查询用户
    async searchId() {
      let query = {
        pid: this.platform ? this.platform : null,
        uid: this.traderID ? this.traderID : null,
        count: this.count,
        page: this.page
      };
      let res = await myAsyncFn(getContacInfos, query);
      if (res.code === 200) {
        this.pageData = res.msg.pageData;
        this.totalCount = res.msg.totalCount;
      }
    },
    //Format1
    Format1(row) {
      if (row.using) {
        return "使用中";
      } else {
        return "停用";
      }
    },
    //时间整形
    timeFormat2(row, column) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    },
    //查看详情
    read(row) {
      this.dialogRecharge = true;
      this.infos = row.infos;
      this.pid = row.pid;
      this.uid = row.uid;
      console.log(row.infos);
    },
    searchData() {
      this.page = 1;
      this.loadAgent();
    },
    //加载数据
    async loadData() {
      let query = {
        pid: this.pid,
        uid: this.uid,
        count: this.count,
        page: this.page
      };
      let res = await myAsyncFn(getContacInfos, query);
      if (res.code === 200) {
        this.pageData = res.msg.pageData;
        this.totalCount = res.msg.totalCount;
      }
    },
    //pid整形
    pidFormat(row) {
      let key = row.pid;
      let prod = "";
      this.pidArr.some(item => {
        if (item.pid == key) {
          prod = item.name;
        }
        return item.pid == key;
      });
      return prod;
    },
    goodReviewRateFormat(row) {
      return row.goodReviewRate + "%";
    },
    badReviewRateFormat(row) {
      return row.badReviewRate + "%";
    },
    setValue(value) {
      this.nowValue = value;
    },
    editLine(index) {
      let dataList = [...this.agentData];
      dataList[index].tempValue = dataList[index].weightPoint.$numberDecimal;
      dataList[index]["isEdit"] = true;
      this.agentData = dataList;
    },
    handleSizeChange(e) {
      this.count = e;
      this.loadAgent();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.loadAgent();
    }
  }
};
</script>
<style lang="scss" scoped>
.searchBox {
  margin: 30px 20px 10px 20px;
}
.total {
  margin: 10px 0;
  display: flex;
  height: 50px;
  align-items: center;
  & > * {
    margin-right: 20px;
  }
}
.detail {
  li {
    list-style: none;
    line-height: 30px;
    color: #999;
    em {
      font-weight: 700;
      font-style: normal;
      color: #333;
    }
    span {
      margin-right: 10px;
      display: inline-block;
    }
  }
  .searchBox {
    padding: 40px 0;
  }
}
</style>
