<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人充值"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">联系方式开关</span>
      </el-col>
      <div class="searchBox">
        <label>商人ID:</label>
        <el-input v-model="uid" style="width:200px" placeholder="请输入内容"></el-input>
        <el-button type="primary" size="small" @click="loadData" style="margin-left:20px">搜索</el-button>
        <label style="margin-left:30px">代充切换:</label>
        <el-select v-model="displayContact" placeholder="请选择" @change="selectDisplayContact">
          <el-option v-for="(item,index) in displayContacts" :key="index" :label="item.type" :value="item.value"></el-option>
        </el-select>
        <!-- <el-button type="primary" size="small" style="margin-left:20px">保存刷新</el-button> -->
        <el-button type="primary" @click="openAddWindow" size="small" :disabled="!displayContact" style="margin-left:50px">新增白名单</el-button>
      </div>
      <el-table :data="pageData" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="sequenceNumber" fixed label="序列" width="450px" align="center"></el-table-column>
        <el-table-column prop="uids" label="商人ID" width="450px" align="center"></el-table-column>
        <el-table-column label="操作" width="450px" align="center">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="primary" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
      <el-dialog title :visible.sync="dialogRecharge" width="20%">
        <el-col class="toolbar1">
          <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="新增白名单"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title" align="center">新增白名单</span>
        </el-col>
        <div style="margin-bottom:40px">
          <label>商人ID:</label>
          <el-input v-model="traderID" style="width:200px" placeholder="请输入内容"></el-input>
        </div>
        <el-button type="primary" size="small" @click="addWhiteList" style="margin-left:20px">新增白名单</el-button>
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
  ///////
  getAgentWhiteList,
  delAgentWhiteList,
  addAgentWhiteList,
  getDisplayContact,
  updateDisplayContact
} from "@/api/admin/agentRecharge/agentRecharge";
import { log } from "util";
export default {
  data() {
    return {
      studios: [
        { type: "all", label: "全部" },
        { type: false, label: "停用" },
        { type: true, label: "使用中" }
      ],
      displayContacts: [
        { type: "展示充值扫码", value: false },
        { type: "展示联系方式", value: true }
      ],
      select: "",
      infos: [],
      gridData: null,
      value: null,
      trader: "",
      platform: [],
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
      displayContact: false,
      pidArr: [],
      ///////
      traderID: ""
    };
  },
  created() {
    this.loadData();
    this.loadDisplayContact();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid"));
    this.pidArr.push({ pid: undefined, name: "全部" });
  },
  methods: {
    openAddWindow() {
      this.dialogRecharge = true;
      this.traderID = "";
    },
    //切换代充方式
    async selectDisplayContact() {
      let query = { displayContact: this.displayContact };
      let res = await myAsyncFn(updateDisplayContact, query);
    },
    //获取代充方式
    async loadDisplayContact() {
      let res = await myAsyncFn(getDisplayContact, null, true);
      if (res.code === 200) {
        this.displayContact = res.msg.displayContact;
      }
    },
    //添加白名单
    async addWhiteList() {
      let query = { uid: this.traderID };
      let res = await myAsyncFn(addAgentWhiteList, query, true);
      if (res.code === 200) {
        this.loadData();
        this.$message({
          type: "success",
          message: "添加成功!"
        });
        this.dialogRecharge = false;
      }
    },
    //Format1
    Format1(row) {
      if (row.active) {
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
    del(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let query = { uid: row.uids };
          let res = await myAsyncFn(delAgentWhiteList, query, true);
          if (res.code === 200) {
            this.uid = "";
            this.loadData();
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    searchData() {
      this.page = 1;
      this.loadData();
    },

    //加载数据
    async loadData() {
      let query = {
        uid: this.uid ? this.uid : null,
        count: this.count,
        page: this.page
      };
      let res = await myAsyncFn(getAgentWhiteList, query, true);
      if (res.code === 200) {
        this.pageData = res.msg.pageData;
        this.totalCount = res.msg.totalCount;
      }
    },
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
      this.loadData();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.loadData();
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
