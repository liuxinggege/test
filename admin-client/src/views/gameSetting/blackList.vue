<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="黑名单 (每条数据都以换行分割)"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>黑名单</b>
      </span>
      <div style="margin:10px 10px 10px 40px">
        <div style="margin:10px 10px 10px 40px">
          <span style="font-size:12pt; margin:10px 31px 10px 20px">类型</span>
          <el-select v-model="type" placeholder="请选择" style="width:110px; margin:0px 0px 0px 0px">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <span style="font-size:12pt; margin:0px 0px 10px 70px">信息</span>
          <el-input type="text" style="width:300px; margin:15px 30px 10px 32px" v-model="info"></el-input>

          <el-button type="primary" style="margin:0 10px 10px 0" @click="getBlackList">读取</el-button>
          <el-button type="primary" style="margin:0 100px 10px 0" @click="addBlackList">添加</el-button>
        </div>
        <el-table :data="blackList.withdraw" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createDate" label="时间" min-width="100" align="center" :formatter="dateFormat"></el-table-column>
          <el-table-column prop="type" label="类型" min-width="70" align="center" :formatter="typeFormat"></el-table-column>
          <el-table-column prop="info" label="信息" min-width="170" align="center"></el-table-column>
          <el-table-column prop="reason" label="理由" min-width="170" align="center"></el-table-column>
          <el-table-column prop="operator" label="操作人" min-width="70" align="center"></el-table-column>
        </el-table>
      </div>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="blackList.totalCount"></el-pagination>
      </el-col>
      <el-dialog :visible.sync="addFlag" width="900px" @close="close">
        <div>
          <span style="font-size:12pt; margin:10px 31px 10px 123px">类型</span>
          <el-select v-model="type" placeholder="请选择" style="width:110px; margin:0px 0px 0px 0px">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 121px">信息</span>
          <el-input type="text" style="width:300px; margin:15px 30px 10px 32px" v-model="info"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 121px">理由</span>
          <el-input type="text" style="width:300px; margin:15px 30px 10px 32px" v-model="reason"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BlackList } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//blackList
enum WithDrawBlackType {
  act,
  bankCard,
  aliPayAct,
  realName
}
// @Component 修饰符注明了此类为一个 Vue 组件

@Component
export default class blackList extends Vue {
  // lifecycle hook
  blackList: BlackList = this.$store.state.blackList; //整个marqueState

  created() {
    this.loadData();
  }
  /*inital data*/
  id: string = "";
  type: WithDrawBlackType = 0;
  types: any[] = [
    { value: 0, label: "账号" },
    { value: 1, label: "银行卡" },
    { value: 2, label: "支付宝" },
    { value: 3, label: "名字" },
    { value: 4, label: "ip" }
  ];
  info: string = "";
  reason: string = "";
  addFlag: boolean = false;
  page: number = 1;
  count: number = 10;
  /*method*/
  getBlackList() {
    this.page = 1;
    this.loadData();
  }

  //添加
  addBlackList() {
    this.addFlag = true;
  }
  //添加确认
  async addConfirm() {
    let data = {
      type: this.type,
      info: this.info,
      reason: this.reason
    };
    console.log(data);
    this.$confirm("此操作将添加,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "AddBlackList", data);
        if (this.blackList.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.addFlag = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.blackList.msg}`
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

  del(id) {
    this.$confirm("此操作将添加,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "DelBlackList", { id: id });
        if (this.blackList.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.addFlag = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.blackList.msg}`
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

  loadData() {
    let req = this.getReq();
    req.page = this.page;
    req.count = this.count;
    myDispatch(this.$store, "GetBlackList", req);
  }

  getReq() {
    let tmp: any = {};
    if (this.type) {
      tmp.type = this.type;
    }
    if (this.info) {
      tmp.info = this.info;
    }
    return tmp;
  }

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
  typeFormat(row) {
    switch (row.type) {
      case 0:
        return "账号";
      case 1:
        return "银行卡";
      case 2:
        return "支付宝";
      case 3:
        return "名字";
      case 4:
        return "ip";
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
  close() {
    this.info = "";
    this.reason = "";
    this.type = 0;
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
