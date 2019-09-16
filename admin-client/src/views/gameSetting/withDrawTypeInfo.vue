<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <!--工具条-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="支付方式">
          <el-select v-model="widthdrawType" placeholder="请选择" @change="loadChannels">
            <el-option v-for="item in widthdrawTypeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="channel" placeholder="请选择">
            <el-option v-for="item in channels" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="showAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table :data="dataList" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column prop="channel" label="兑换渠道" min-width="150" align="center"></el-table-column>
        <el-table-column prop="maxMoney" label="最大兑换金额" min-width="150" align="center"></el-table-column>
        <el-table-column prop="minMoney" label="最小兑换金额" min-width="100" align="center"></el-table-column>
        <el-table-column prop="timeInterval" label="兑换间隔时间" min-width="120" align="center"></el-table-column>
        <el-table-column prop="withdrawRate" label="兑换费率" min-width="100" align="center"></el-table-column>
        <el-table-column prop="withdrawTimes" label="兑换次数" min-width="100" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="primary" size="small">删除</el-button>
            <el-button @click="edit(scope.row)" type="primary" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增兑换配置" :visible.sync="isAdd" width="1000px">
        <el-form :inline="true">
          <el-form-item label="兑换方式">
            <el-select v-model="addWidthdrawType" placeholder="请选择" @change="loadAddChannels">
              <el-option v-for="item in widthdrawTypeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <el-select v-model="addChannel" placeholder="请选择">
              <el-option v-for="item in addChannels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小兑换金额">
            <el-input v-model="addMinMoney"></el-input>
          </el-form-item>
          <el-form-item label="最大兑换金额">
            <el-input v-model="addMaxMoney"></el-input>
          </el-form-item>
          <el-form-item label="兑换间隔时间">
            <el-input v-model="addTimeInterval"></el-input>
          </el-form-item>
          <el-form-item label="兑换费率">
            <el-input v-model="addWithdrawRate"></el-input>
          </el-form-item>
          <el-form-item label="兑换次数">
            <el-input v-model="addWithdrawTimes"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改兑换配置" :visible.sync="isEdit" width="1000px">
        <el-form :inline="true">
          <el-form-item label="渠道">
            <el-input v-model="addChannel" disabled></el-input>
          </el-form-item>
          <el-form-item label="最小兑换金额">
            <el-input v-model="addMinMoney"></el-input>
          </el-form-item>
          <el-form-item label="最大兑换金额">
            <el-input v-model="addMaxMoney"></el-input>
          </el-form-item>
          <el-form-item label="兑换间隔时间">
            <el-input v-model="addTimeInterval"></el-input>
          </el-form-item>
          <el-form-item label="兑换费率">
            <el-input v-model="addWithdrawRate"></el-input>
          </el-form-item>
          <el-form-item label="兑换次数">
            <el-input v-model="addWithdrawTimes"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </div>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn, myDispatch } from "../../utils/index.js";
import {
  getWithdrawTypeInfo,
  addWithdrawTypeInfo,
  delWithdrawTypeInfo,
  updateWithdrawTypeInfo,
  getRechargeAndWithdrawItem
} from "../../api/admin/gameSetting/gameSetting";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TotalStatic extends Vue {
  // lifecycle hook
  created() {
    this.loadChannels();
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  dataList: any[] = [];
  channel: string = "";
  channels: any[] = [];
  widthdrawType: string = "ali";
  widthdrawTypeOpts: any[] = [
    { value: "ali", label: "支付宝" },
    { value: "bank", label: "银行" }
  ];
  isAdd: boolean = false;
  addChannels: any = [];
  addMinMoney: string = "";
  addMaxMoney: string = "";
  addTimeInterval: string = "";
  addWithdrawTimes: string = "";
  addWithdrawRate: string = "";
  addChannel: string = "";
  addWidthdrawType: string = "ali";
  addWidthdrawTypeOpts: any[] = [
    { value: "ali", label: "支付宝" },
    { value: "bank", label: "银行" }
  ];
  isEdit: boolean = false;
  curId: string = "";
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  async loadData() {
    let queryItem = {
      page: this.page,
      count: this.count,
      channel: this.channel
    };
    let ret = await myAsyncFn(getWithdrawTypeInfo, queryItem, true);
    if (ret.code === 200) {
      this.dataList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    }
  }
  del(row) {
    this.$confirm("此操作将删除该行数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delWithdrawTypeInfo, { id: row._id });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.page = 1;
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }

  search() {
    this.page = 1;
    this.loadData();
  }
  async loadChannels() {
    let queryItem = {
      name: this.widthdrawType,
      type: "withdraw"
    };
    let ret = await myAsyncFn(getRechargeAndWithdrawItem, queryItem, true);
    if (ret.code === 200) {
      if (!ret.msg[0]) {
        this.$message.error("此兑换方式暂无渠道");
        this.channels = [];
        return;
      }
      this.channels = ret.msg[0].channel;
    }
  }
  async loadAddChannels() {
    let queryItem = {
      name: this.addWidthdrawType,
      type: "withdraw"
    };
    let ret = await myAsyncFn(getRechargeAndWithdrawItem, queryItem);
    if (ret.code === 200) {
      if (!ret.msg[0]) {
        this.$message.error("此兑换方式暂无渠道");
        this.addChannels = [];
        return;
      }
      this.addChannels = ret.msg[0].channel;
      this.addChannel = this.addChannels[0].value;
    }
  }
  showAdd() {
    this.addWidthdrawType = "ali";
    this.loadAddChannels();
    this.addMaxMoney = "";
    this.addMinMoney = "";
    this.addTimeInterval = "";
    this.addWithdrawRate = "";
    this.addWithdrawTimes = "";
    this.isAdd = true;
  }
  async submitAdd() {
    if (
      !this.addMaxMoney ||
      !this.addMinMoney ||
      !this.addTimeInterval ||
      !this.addWithdrawRate ||
      !this.addWithdrawTimes
    ) {
      this.$message({
        type: "error",
        message: "全部都为必填项！"
      });
      return;
    }
    let req = {
      minMoney: this.addMinMoney,
      maxMoney: this.addMaxMoney,
      timeInterval: this.addTimeInterval,
      withdrawTimes: this.addWithdrawTimes,
      withdrawRate: this.addWithdrawRate,
      channel: this.addChannel
    };
    let ret = await myAsyncFn(addWithdrawTypeInfo, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "添加成功！"
      });
      this.loadData();
      this.isAdd = false;
    }
  }
  cancelAdd() {
    this.isAdd = false;
  }
  edit(row) {
    this.addMaxMoney = row.maxMoney;
    this.addMinMoney = row.minMoney;
    this.addTimeInterval = row.timeInterval;
    this.addWithdrawRate = row.withdrawRate;
    this.addWithdrawTimes = row.withdrawTimes;
    this.addChannel = row.channel;
    this.curId = row._id;
    this.isEdit = true;
  }
  async submitEdit() {
    if (
      !this.addMaxMoney ||
      !this.addMinMoney ||
      !this.addTimeInterval ||
      !this.addWithdrawRate ||
      !this.addWithdrawTimes
    ) {
      this.$message({
        type: "error",
        message: "全部都为必填项！"
      });
      return;
    }
    let req = {
      minMoney: this.addMinMoney,
      maxMoney: this.addMaxMoney,
      timeInterval: this.addTimeInterval,
      withdrawTimes: this.addWithdrawTimes,
      withdrawRate: this.addWithdrawRate,
      id: this.curId
    };
    let ret = await myAsyncFn(updateWithdrawTypeInfo, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "修改成功！"
      });
      this.loadData();
      this.isEdit = false;
    }
  }
  cancelEdit() {
    this.isEdit = false;
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
