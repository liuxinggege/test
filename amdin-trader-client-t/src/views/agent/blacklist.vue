<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="玩家ID">
            <el-input type="number" v-model.number="search.uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="primary" @click="showAdd">添加黑名单</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="blackList" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="uid" label="玩家ID" align="center"></el-table-column>
        <el-table-column prop="createDate" :formatter="dateFormat" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="380" align="center">
          <template slot-scope="scope">
            <el-button @click="deleteLine(scope.row)" type="primary" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getBlackList, setBlackUser } from "@/api/agent/webSocket";
export default {
  data() {
    return {
      count: 10,
      page: 0,
      totalCount: 0,
      search: {},
      blackList: [],
      addUid: undefined
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    searchData() {
      this.page = 0;
      this.loadData();
    },
    loadData() {
      let queryItem = {
        page: this.page,
        count: this.count,
        uid: this.search.uid
      };
      this.clean(queryItem);
      console.log(queryItem);
      getBlackList(queryItem)
        .then(res => {
          this.blackList = res.list;
          this.totalCount = res.total;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
    },
    showAdd() {
      this.$prompt("请输入玩家ID", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          if (value) {
            this.addUid = parseInt(value);
            this.addUser();
          } else {
            this.$message.error("添加无效");
          }
        })
        .catch(() => {});
    },
    addUser() {
      setBlackUser({ uid: this.addUid, setBlack: 1 }).then(res => {
        this.$message.success("添加成功");
        this.loadData();
      });
    },
    deleteLine(row) {
      setBlackUser({ uid: row.uid, setBlack: 0 }).then(res => {
        this.$message.success("删除黑名单成功");
        this.loadData();
      });
    },
    handleSizeChange(e) {
      this.count = e;
      this.loadData();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.loadData();
    },
    dateFormat(row) {
      let newDate = new Date(row.createDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
};
</script>
