<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="登陆失败提示管理 (每条数据都以换行分割)"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>登陆失败提示管理</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <el-button type="primary" @click="addCustomerInfoList">添加</el-button>
          <el-button type="primary" @click="refresh">读取</el-button>
        </div>
        <el-table :data="customerInfoList" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row.pid)"></el-button>
              <el-button type="text" icon="el-icon-edit" @click="update(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat"></el-table-column>
          <el-table-column prop="qqs" label="QQ" min-width="150" :formatter="qqsToStr" align="center"></el-table-column>
          <el-table-column prop="wxs" label="微信" min-width="150" :formatter="wxsToStr" align="center"></el-table-column>
          <el-table-column prop="rechargeQuestionUrl" label="充值问题域名" min-width="200" align="center"></el-table-column>
        </el-table>
      </div>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
      <!-- 添加 -->
      <el-dialog :visible.sync="addFlag" width="550px" @close="close">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 15px">项目</span>
          <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 18px;vertical-align:top ">QQ</span>
          <el-input type="textarea" placeholder="多个QQ号以英文逗号分隔" style="width:400px; margin:15px 30px 10px 15px" v-model="qqs"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 10px;vertical-align:top">微信</span>
          <el-input type="textarea" placeholder="多个微信号以英文逗号分隔" style="width:400px; margin:15px 30px 10px 15px" v-model="wxs"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 10px;">域名</span>
          <el-input style="width:400px; margin:15px 30px 10px 15px" v-model="rechargeQuestionUrl"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog :visible.sync="editFlag" width="600px" @close="close">
        <!-- <div>
          <span style="font-size:12pt; margin:0px 0px 10px 20px">pid</span>
          <el-input
            type='text'
            style='width:300px; margin:15px 30px 10px 15px'
            v-model="pid"
          ></el-input>
        </div>-->
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 18px;vertical-align:top ">QQ</span>
          <el-input type="textarea" placeholder="多个QQ号以英文逗号分隔" style="width:300px; margin:15px 30px 10px 15px" v-model="qqs"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 10px;vertical-align:top">微信</span>
          <el-input type="textarea" placeholder="多个微信号以英文逗号分隔" style="width:300px; margin:15px 30px 10px 15px" v-model="wxs"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 10px;">域名</span>
          <el-input style="width:400px; margin:15px 30px 10px 15px" v-model="rechargeQuestionUrl"></el-input>
        </div>
        <div style="text-align:right">
          <el-button type="primary" @click="editConfirm">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script lang = 'ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getCustomerInfo,
  addCustomerInfo,
  delCustomerInfo,
  updateCustomerInfo
} from "../../api/admin/gameSetting/gameSetting";

@Component
export default class loginErrorMessage extends Vue {
  created() {
    this.loadData();
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  /*inital data*/
  customerInfoList: object[] = [];
  addFlag: boolean = false;
  editFlag: boolean = false;
  pidList: any[] = [];
  pid: string = "";
  qqs: string = "";
  wxs: string = "";
  rechargeQuestionUrl: string = "";
  totalCount: Number = 0;
  editUid: string = "";
  page: number = 1;
  count: number = 10;
  /*method*/
  async loadData() {
    let req: any = {};
    req.page = this.page;
    req.count = this.count;
    let ret = await myAsyncFn(getCustomerInfo, req);
    if (ret.code === 200) {
      this.customerInfoList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  //读取
  refresh() {
    this.page = 1;
    this.loadData();
  }
  //添加
  addCustomerInfoList() {
    this.addFlag = true;
    this.pid = this.pidList[0].pid;
    this.qqs = "";
    this.wxs = "";
    this.rechargeQuestionUrl = "";
  }
  // string to array
  strToArray(str) {
    return str.split(",");
  }
  // array to string
  qqsToStr(row) {
    return row.qqs.join(",");
  }
  wxsToStr(row) {
    return row.wxs.join(",");
  }
  //添加确认
  async addConfirm() {
    let data: any = { pid: this.pid };
    if (this.qqs.search("，") >= 0 || this.wxs.search("，") >= 0) {
      this.$message({
        type: "error",
        message: "输入格式错误!"
      });
    } else {
      if (this.qqs) {
        data.qqs = this.strToArray(this.qqs);
      }
      if (this.wxs) {
        data.wxs = this.strToArray(this.wxs);
      }
      if (!this.rechargeQuestionUrl) {
        this.$message({
          type: "error",
          message: "充值问题域名不能为空!"
        });
        return;
      }
      data.rechargeQuestionUrl = this.rechargeQuestionUrl;
      this.$confirm("此操作将添加,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(addCustomerInfo, data);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.addFlag = false;
            this.loadData();
          } else {
            this.$message({
              type: "error",
              message: `操作失败${ret.err}`
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  }
  // 删除
  async del(pid) {
    this.$confirm("此操作将删除数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delCustomerInfo, { pid });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${ret.err}`
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  // 修改
  async update(row) {
    this.editFlag = true;
    this.pid = row.pid;
    this.qqs = this.qqsToStr(row);
    this.wxs = this.wxsToStr(row);
    this.rechargeQuestionUrl = row.rechargeQuestionUrl;
  }

  // 修改确认
  async editConfirm() {
    let data: any = { pid: this.pid };
    if (this.qqs) {
      data.qqs = this.strToArray(this.qqs);
    }
    if (this.wxs) {
      data.wxs = this.strToArray(this.wxs);
    }
    if (!this.rechargeQuestionUrl) {
      this.$message({
        type: "error",
        message: "充值问题域名不能为空!"
      });
      return;
    }
    data.rechargeQuestionUrl = this.rechargeQuestionUrl;
    this.$confirm("此操作将修改数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(updateCustomerInfo, data);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editFlag = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${ret.err}`
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  // getReq() {
  //   let tmp = {};
  //   if (this.type) {
  //     tmp.type = this.type;
  //   }
  //   if (this.info) {
  //     tmp.info = this.info;
  //   }
  //   return tmp;
  // },

  dateFormat(row, column) {
    if (row.createDate) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
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
  close() {
    this.pid = "";
    this.qqs = "";
    this.wxs = "";
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
    margin-top: 80px;
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
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
</style>
