<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <div class="total">
        <div>当前总商人数量：{{totalNum}}</div>
        <div>总当值人数：{{online}}</div>
        <el-button @click="loadData" type="primary" size="small">刷新</el-button>
      </div>
      <el-table :data="tableData" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="pid" fixed label="项目" :formatter="pidFormat" width="150" align="center"></el-table-column>
        <el-table-column prop="total" label="总人数" width="120" align="center"></el-table-column>
        <el-table-column prop="online" label="在线人数" width="160" align="center"></el-table-column>
        <el-table-column prop="busy" label="繁忙" width="160" align="center"></el-table-column>
        <el-table-column prop="free" label="空闲" width="300" align="center"></el-table-column>
        <el-table-column prop="rest" label="休息" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button @click="read(scope.row)" type="primary" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="商人ID">
            <el-input v-model="search.uid"></el-input>
          </el-form-item>
          <el-form-item label="渠道">
            <el-input v-model="search.channel"></el-input>
          </el-form-item>
          <el-form-item label="项目">
            <el-select v-model="search.pid" placeholder="请选择">
              <el-option v-for="item in pidArr" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="agentData" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="uid" fixed label="商人ID" width="150" align="center"></el-table-column>
        <el-table-column prop="name" label="商人昵称" width="100" align="center"></el-table-column>
        <el-table-column prop="channel" label="渠道" width="100" align="center"></el-table-column>
        <el-table-column prop="pid" label="项目" width="100" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column label="总结单数" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="`已完成：${scope.row.finishedChatNum}，未完成：${scope.row.unfinishedChatNum}，关闭：${scope.row.closedChatNum}`" placement="bottom">
              <el-button type="text">{{scope.row.allchatNum}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="reviewAllCnt" label="总评数" width="100" align="center"></el-table-column>
        <el-table-column prop="goodReviewCnt" label="好评数" width="100" align="center"></el-table-column>
        <el-table-column prop="goodReviewRate" label="好评率" width="100" :formatter="goodReviewRateFormat" align="center"></el-table-column>
        <el-table-column prop="badReviewCnt" label="差评数" width="100" align="center"></el-table-column>
        <el-table-column prop="badReviewRate" label="差评率" width="100" :formatter="badReviewRateFormat" align="center"></el-table-column>
        <el-table-column prop="reportAllCnt" label="举报总数" width="100" align="center"></el-table-column>
        <el-table-column prop="reportSucCnt" label="举报成功" width="100" align="center"></el-table-column>
        <el-table-column prop="reportFailCnt" label="举报失败" width="100" align="center"></el-table-column>
        <el-table-column label="权重" width="220" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEdit" style="width:50px;margin-right:20px;">{{scope.row.weightPoint.$numberDecimal}}</span>
            <el-input v-model="scope.row.weightPoint.$numberDecimal" style="width:50px;margin-right:20px;" v-if="scope.row.isEdit"></el-input>
            
            <el-button v-if="scope.row.isEdit" @click="canselEdit(scope.$index)" icon="el-icon-close" size="mini" type="warning"></el-button>
            <el-button v-if="!scope.row.isEdit" @click="editLine(scope.$index)" type="primary" size="mini"  icon="el-icon-edit"></el-button>
            <el-button v-if="scope.row.isEdit" @click="submitLine(scope.row)" type="success" size="mini" icon="el-icon-circle-check-outline"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
      <el-dialog title="详情" :visible.sync="dialogRecharge" width="500px">
        <ul class="detail">
          <li>
            <em>在线商人：</em>
            <span v-if="!dialogData.online||dialogData.online.length==0">暂无</span>
            <span v-for="item in dialogData.online" :key="item.uid">{{item.name}}(uid：{{item.uid}})</span>
          </li>
          <li>
            <em>繁忙商人：</em>
            <span v-if="!dialogData.busy||dialogData.busy.length==0">暂无</span>
            <span v-for="item in dialogData.busy" :key="item.uid">{{item.name}}(uid：{{item.uid}})</span>
          </li>
          <li>
            <em>空闲商人：</em>
            <span v-if="!dialogData.free||dialogData.free.length==0">暂无</span>
            <span v-for="item in dialogData.free" :key="item.uid">{{item.name}}(uid：{{item.uid}})</span>
          </li>
          <li>
            <em>休息商人：</em>
            <span v-if="!dialogData.rest||dialogData.rest.length==0">暂无</span>
            <span v-for="item in dialogData.rest" :key="item.uid">{{item.name}}(uid：{{item.uid}})</span>
          </li>
        </ul>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { myAsyncFn,myDispatch} from "../../utils/index.js";
import {
  onlineMonitor,
  getAgenStats
} from "@/api/admin/agentRecharge/agentRecharge";
export default {
  data() {
    return {
      dialogRecharge: false,
      tableData: [],
      agentData: [],
      search: {},
      page: 1,
      count: 10,
      totalCount:0,
      channelArr: [],
      online: "",
      totalNum: "",
      dialogData: {},
      tempValue: "",
      pidArr: [],
    };
  },
  created() {
    this.loadData();
    this.loadAgent();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid"));
    this.pidArr.push({ pid: undefined, name: "全部" });
  },
  methods: {
    read(row) {
      //查看详情
      this.dialogRecharge = true;
      this.dialogData = row.detail;
    },
    searchData() {
      this.page = 1;
      this.loadAgent();
    },
    loadData() {
      //加载数据
      onlineMonitor().then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.msg.tableData;
          this.online = res.data.msg.totalOnlineAgentNum;
          this.totalNum = res.data.msg.totalAgentNum;
        }
      });
    },
    async loadAgent() {
      let query = { ...this.search, page: this.page, count: this.count };
      let res = await myAsyncFn(getAgenStats, query);
      if (res.code === 200) {
        this.agentData = res.msg.pageData;
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
      dataList[index].tempValue=dataList[index].weightPoint.$numberDecimal;
      dataList[index]["isEdit"] = true;
      this.agentData = dataList;
    },
    canselEdit(index){
      let dataList = [...this.agentData];
      dataList[index]["isEdit"] = false;
      dataList[index].weightPoint.$numberDecimal=dataList[index].tempValue
      this.agentData = dataList;
    },
    submitLine(row){
      let queryItem = {
        uid: row.uid,
        weightPoint: row.weightPoint.$numberDecimal
      };
      if (queryItem.weightPoint < 0) {
        this.$message({
          type: "error",
          message: "权重值必须为正数",
          duration: 8 * 1000
        });
        return
      }
      myDispatch(this.$store, "SetWeightByUid", queryItem).then(res => {
        if(res===200){
          this.$message({
            type: "success",
            message: "权重修改成功",
            duration: 8 * 1000
          });
          this.loadAgent();
        }
        
      })
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
}
</style>
