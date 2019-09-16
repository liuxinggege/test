<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="上分记录"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">上分记录</span>
        <span class="total">上分总金额：{{total}}</span>
      </el-col>
      <div align="center">
        <span>玩家ID</span>
        <el-input v-model="searchUid" style="width:120px; margin:20px 10px"></el-input>
        <span>时间</span>
        <el-date-picker v-model="searchTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchDate">搜索</el-button>
      </div>
      <el-table :data="list" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" align="center">
        <el-table-column prop="corTime" label="日期" width="180" align="center"></el-table-column>
        <el-table-column prop="toName" label="昵称" width="180" align="center"></el-table-column>
        <el-table-column prop="to" label="转入ID" width="180" align="center"></el-table-column>
        <el-table-column prop="from" label="转出ID" width="180" align="center"></el-table-column>
        <el-table-column prop="toBefore" label="上分前" width="180" align="center"></el-table-column>
        <el-table-column prop="transferMoney" label="上分数" width="180" align="center"></el-table-column>
      </el-table>
      <el-pagination align="right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="count" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </el-card>
  </div>
</template>

<script >
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
export default {
  //    emptyGif =  'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
  data: function() {
    return {
      list: [],
      page: 1,
      count: 10,
      hasMore: true,
      searchUid: "",
      searchTime: [],
      total: "",
      totalCount: 0
    };
  },
  computed: {
    startTime: function() {
      if (!this.searchTime) {
        return null;
      }
      return this.searchTime[0];
    },
    endTime: function() {
      if (!this.searchTime) {
        return null;
      }
      return this.searchTime[1];
    }
  },
  mounted() {
    myDispatch(this.$store, "UpPointLog", {
      count: this.count,
      type: 0,
      page: this.page
    })
      .then(result => {
        if (result.code == 200) {
          let logs = result.msg.logs;
          this.list = [];
          this.totalCount = result.msg.totalCount;
          if (!logs || logs.length === 0) {
            this.$message({ type: "error", message: "没有上分记录!" });
            this.list = [];
            return;
          }
          logs.forEach((e, i) => {
            let date = new Date(e.transferTime);
            let sdate = date.toLocaleString(undefined, { hour12: false });
            e.corTime = sdate;
            this.list.push(e);
          });
          this.list = logs;
        } else {
          // this.$message({type: "error",message: result.err});
          return;
        }
      })
      .then(() => {
        let match = { searchUid: this.searchUid, type: 0 };
        if (this.startTime) {
          match.startTime = this.startTime;
        }
        if (this.endTime) {
          match.endTime = this.endTime;
        }
        myDispatch(this.$store, "MoneyTotal", match)
          .then(result => {
            if (result.code == 200) {
              this.total = result.msg.sum;
            } else {
              // this.$message({type: "error",message: result.err});
              return;
            }
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: "连接服务器错误!" + error
            });
            return;
          });
      })
      .catch(error => {
        this.$message({ type: "error", message: "连接服务器错误!" + error });
        return;
      });
  },
  methods: {
    loadMore() {
      if (!this.hasMore) {
        this.$message({ type: "error", message: "没有更多的数据了!" });
        return;
      }
      let page = this.page;
      let match = {
        count: this.count,
        searchUid: this.searchUid,
        type: 0,
        page: page
      };
      if (this.startTime) {
        match.startTime = this.startTime;
      }
      if (this.endTime) {
        match.endTime = this.endTime;
      }
      myDispatch(this.$store, "UpPointLog", match)
        .then(result => {
          if (result.code == 200) {
            let logs = result.msg.logs;
            this.list = [];
            this.totalCount = result.msg.totalCount;
            if (logs.length == 0) {
              this.$message({ type: "error", message: "没有更多的数据了!" });
              this.hasMore = false;
              return;
            }
            logs.forEach((e, i) => {
              let date = new Date(e.transferTime);
              let sdate = date.toLocaleString(undefined, { hour12: false });
              e.corTime = sdate.split(" ");
              this.list.push(e);
            });
          } else {
            // this.$message({type: "error",message: result.err});
            return;
          }
        })
        .catch(error => {
          this.$message({ type: "error", message: "连接服务器错误!" + error });
          return;
        })
        .then(() => {
          let match = { searchUid: this.searchUid, type: 0 };
          if (this.startTime) {
            match.startTime = this.startTime;
          }
          if (this.endTime) {
            match.endTime = this.endTime;
          }
          myDispatch(this.$store, "MoneyTotal", match)
            .then(result => {
              if (result.code == 200) {
                this.total = result.msg.sum;
              } else {
                // this.$message({type: "error",message: result.err});
                return;
              }
            })
            .catch(error => {
              this.$message({
                type: "error",
                message: "连接服务器错误!" + error
              });
              return;
            });
        });
    },
    searchDate() {
      this.page = 1; //点击搜索的时候要把page重置为1，不然page的值改变后可能查不到数据
      let match = {
        count: this.count,
        searchUid: this.searchUid,
        type: 0,
        page: this.page
      };
      if (this.startTime) {
        match.startTime = this.startTime;
      }
      if (this.endTime) {
        match.endTime = this.endTime;
      }
      myDispatch(this.$store, "UpPointLog", match)
        .then(result => {
          if (result.code == 200) {
            let logs = result.msg.logs;
            this.list = [];
            this.totalCount = result.msg.totalCount;
            if (!logs || logs.length === 0) {
              this.$message({ type: "error", message: "没有上分记录!" });
              this.list = [];
              return;
            }
            logs.forEach((e, i) => {
              let date = new Date(e.transferTime);
              let sdate = date.toLocaleString(undefined, { hour12: false });
              e.corTime = sdate;
              this.list.push(e);
            });
            this.list = logs;
          } else {
            // this.$message({type: "error",message: result.err});
            return;
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: "连接服务器错误!" + error.err
          });
          return;
        })
        .then(() => {
          let match = { searchUid: this.searchUid, type: 0 };
          if (this.startTime) {
            match.startTime = this.startTime;
          }
          if (this.endTime) {
            match.endTime = this.endTime;
          }
          myDispatch(this.$store, "MoneyTotal", match)
            .then(result => {
              if (result.code == 200) {
                this.total = result.msg.sum;
              } else {
                // this.$message({type: "error",message: result.err});
              }
            })
            .catch(error => {
              this.$message({
                type: "error",
                message: "连接服务器错误!" + error.err
              });
              return;
            });
        });
    },
    handleSizeChange(val) {
      this.count = val;
      this.loadMore();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.loadMore();
      console.log("当前地" + val + "页");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.total {
  position: absolute;
  right: 15%;
  margin-top: 8px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #fff;
  min-height: 100vh;
  margin-top: -50px;
  padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
