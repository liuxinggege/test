<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <div>
        <el-col class="toolbar1" style="margin-bottom: 20px">
          <el-popover ref="popover1" placement="top" title="标题" trigger="hover" content="活动配置"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title">活动配置</span>
          <span style="position:absolute; right:0; top:1">
            <el-button type="primary" style="margin:0 10px" icon="el-icon-search" @click="getFaq">读取</el-button>
            <el-button type="primary" style="margin:0 100px 10px 0" icon="el-icon-edit" @click="addActivity">添加</el-button>
          </span>
        </el-col>
        <el-table :data="data" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" min-width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
              <el-button type="text" icon="el-icon-edit" @click="edit(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="pid" label="项目" min-width="90" align="center" :formatter="pidFormat"></el-table-column>
          <el-table-column prop="type" label="活动类型" min-width="100" align="center" :formatter="eventTypeFormat"></el-table-column>
          <el-table-column prop="actId" label="活动Id" min-width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="活动名称" min-width="170" align="center"></el-table-column>
          <el-table-column prop="allChannel" label="全渠道活动平台" min-width="120" align="center" :formatter="allChannelFormat"></el-table-column>
          <el-table-column prop="condition.interest" label="充值返利比率" min-width="100" align="center"></el-table-column>
          <el-table-column prop="rechargeChannels" label="充值通道" min-width="170" align="center" :formatter="typesFormat"></el-table-column>
          <el-table-column prop="condition.recharge" label="充值" min-width="100" align="center"></el-table-column>
          <el-table-column prop="condition.chgMoney" label="流水" min-width="100" align="center"></el-table-column>
          <el-table-column prop="startDate" label="开始时间" min-width="170" :formatter="startDateFormat" align="center"></el-table-column>
          <el-table-column prop="endDate" label="结束时间" min-width="170" :formatter="endDateFormat" align="center"></el-table-column>
          <el-table-column prop="active" label="状态" min-width="100" :formatter="activeFormat" align="center"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col class="toolbar2">
          <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
        </el-col>
        <!-- 添加小画面 -->
        <el-dialog :visible.sync="addflg" width="700px" @close="close">
          <div style="margin-left:100px">
            <span>项目</span>
            <el-select style="width:120px; margin:20px 10px" v-model="pid" placeholder="请选择">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </div>
          <div style="margin-left:100px">
            <span>活动名称</span>
            <el-input v-model="addName" style="width:120px; margin:20px 10px"></el-input>
          </div>
          <div v-if="type==2" style="margin-left:100px">
            <span>充值通道</span>
            <el-checkbox-group style="margin-left:70px" v-model="addRechargeChannels">
              <el-checkbox label="chat">官方代充</el-checkbox>
              <el-checkbox label="yun_pay">云闪付</el-checkbox>
            </el-checkbox-group>
          </div>
          <div style="margin-left:100px">
            <span>活动日期</span>
            <el-date-picker v-model="addDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </div>
          <div style="margin-left:100px">
            <span>是否启用</span>
            <el-switch v-model="addActive" active-color="#13ce66" inactive-color="#ff4949" style="margin:20px 10px"></el-switch>
          </div>
          <div style="margin-left:100px" v-if="type==2">
            <span>充值返利比率</span>
            <el-input disabled type="text" v-model="interest" style="width:120px; margin:20px 10px"></el-input>
          </div>
          <div style="margin-left:100px;">
            <span>全渠道活动平台</span>
            <el-switch v-model="allChannel" style="margin:20px 10px" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
          <div v-if="type==1">
            <div style="margin-left:100px">
              <span>充值</span>
              <el-input-number :controls="false" v-model="addRecharge" style="width:120px; margin:20px 10px"></el-input-number>
            </div>
            <div style="margin-left:100px">
              <span>输赢</span>
              <el-input-number :controls="false" v-model="addChangeMoney" style="width:120px; margin:20px 10px"></el-input-number>
            </div>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveAddActivity">确定</el-button>
        </el-dialog>
        <!-- 编辑小画面 -->
        <el-dialog :visible.sync="editflag" width="700px" @close="close">
          <div style="margin-left:100px">
            <span>项目</span>
            <el-select style="width:120px; margin:20px 10px" disabled v-model="pid" placeholder="请选择">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </div>
          <div style="margin-left:100px">
            <span>活动名称</span>
            <el-input disabled v-model="editName" style="width:120px; margin:20px 10px"></el-input>
          </div>
          <div v-if="editShowMsg.type==2" style="margin-left:100px">
            <span>充值通道</span>
            <el-checkbox-group style="margin-left:70px" v-model="editRechargeChannels">
              <el-checkbox label="chat">官方代充</el-checkbox>
              <el-checkbox label="yun_pay">云闪付</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="editShowMsg.startDate" style="margin-left:100px">
            <span>活动日期</span>
            <el-date-picker v-model="editDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </div>
          <div style="margin-left:100px">
            <span>是否启用</span>
            <el-switch v-model="editActive" active-color="#13ce66" inactive-color="#ff4949" style="margin:20px 10px"></el-switch>
          </div>
          <div style="margin-left:100px" v-if="editShowMsg.type==2">
            <span>充值返利比率</span>
            <el-input disabled type="text" v-model="interest" style="width:120px; margin:20px 10px"></el-input>
          </div>
          <div style="margin-left:100px;">
            <span>全渠道活动平台</span>
            <el-switch v-model="allChannel" style="margin:20px 10px" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
          <div v-if="editShowMsg.type==1">
            <div style="margin-left:100px">
              <span>充值</span>
              <el-input-number :controls="false" v-model="editRecharge" style="width:120px; margin:20px 10px"></el-input-number>
            </div>
            <div style="margin-left:100px">
              <span>输赢</span>
              <el-input-number :controls="false" v-model="editChangeMoney" style="width:120px; margin:20px 10px"></el-input-number>
            </div>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveEditFaq">确定</el-button>
        </el-dialog>
        <!-- 活动类型选择画面 -->
        <el-dialog :visible.sync="typeDialog" width="700px" @close="close">
          <div style="margin:0 auto;width:300px;">
            <span>活动类型</span>
            <el-select v-model="type" placeholder="请选择">
              <el-option v-for="item in eventTypeArray" :key="item.type" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveType">确定</el-button>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import {
  getEventType,
  getOneByType
} from "../../api/admin/activity/activityCfg";
import { myDispatch, myAsyncFn } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ActivityCfg extends Vue {
  // lifecycle hook
  //    getManyActivity
  //   updateActivity
  //   deleteCfgActivity
  //   addActivity
  created() {
    this.pidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }
  /*inital data*/
  data: any[] = []; //表单数据
  showMsg: any = {}; //显示数据
  pidList: any[] = [];
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;
  //活动
  typeDialog: boolean = false;
  type: number = 2;
  pid: string = "A";
  eventTypeArray: any[] = [
    {
      name: "充值返利",
      type: 2
    },
    {
      name: "兑换码活动",
      type: 1
    }
  ];
  _id: string = "";
  // 添加
  addflg: boolean = false;
  addName: string = "";
  addDate: Date[] = [];
  addRechargeChannels: any = [];
  addActive: boolean = true;
  addRecharge: string = "";
  addChangeMoney: string = "";
  interest: string = "0.01";
  allChannel: boolean = false;

  // 修改
  id: string = "";
  editflag: boolean = false;
  editActive: boolean = false;
  editName: string = "";
  editDate: Date[] = [];
  editRecharge: string = "";
  editChangeMoney: string = "";
  editShowMsg: any = [];
  editRechargeChannels: any = [];
  /*method*/
  loadData() {
    myDispatch(this.$store, "getManyActivity", {}, true).then(ret => {
      this.data = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    });
  }
  getFaq() {
    this.loadData();
  }
  //添加
  addActivity() {
    this.typeDialog = true;
  }
  //添加保存
  saveAddActivity() {
    if (!this.addName) {
      this.$message({
        type: "error",
        message: "请填写的活动名称!"
      });
      return;
    }
    let data: any = {
      name: this.addName,
      active: this.addActive,
      type: this.type,
      pid: this.pid,
      allChannel: this.allChannel
    };
    if (this.type == 2) {
      if (this.addRechargeChannels.length == 0) {
        this.$message({
          type: "warning",
          message: "充值通道最少选择一个"
        });
        return;
      }
      data.interest = this.interest;
      data.rechargeChannels = this.addRechargeChannels;
    } else {
      data.recharge = this.addRecharge.toString();
      data.chgMoney = this.addChangeMoney.toString();
    }
    if (this.addDate[0]) {
      data.startDate = this.addDate[0];
    }
    if (this.addDate[1]) {
      data.endDate = this.addDate[1];
    }
    myDispatch(this.$store, "addActivity", data)
      .then(ret => {
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.loadData();
          this.addflg = false;
          this.typeDialog = false;
          return;
        } else {
          this.$message({
            type: "error",
            message: "添加失败!" + ret.err
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err.err
        });
        return;
      });
  }
  //编辑
  edit(row, index) {
    this.editShowMsg = row;
    let localDate1: any = new Date(row.startDate);
    let localDate2: any = new Date(row.endDate);
    localDate1 = localDate1.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    localDate2 = localDate2.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    this.id = row._id;
    this.editActive = row.active;
    this.editName = row.name;
    this.editDate = [localDate1 || "", localDate2 || ""];
    this.editRecharge = row.recharge;
    this.editChangeMoney = row.chgMoney;
    this.editRechargeChannels = row.condition.types;
    this.interest = row.condition.interest;
    this.allChannel = row.allChannel;
    this.pid = row.pid;
    this.editflag = true;
  }
  //编辑保存
  saveEditFaq() {
    let data: any = {
      id: this.id,
      name: this.editName,
      active: this.editActive,
      allChannel: this.allChannel
    };
    if (this.editShowMsg.type == 2) {
      if (this.editRechargeChannels.length == 0) {
        this.$message({
          type: "warning",
          message: "充值通道最少选择一个"
        });
        return;
      }
      data.interest = this.interest;
      data.rechargeChannels = this.editRechargeChannels;
    } else {
      data.recharge = this.editRecharge.toString();
      data.chgMoney = this.editChangeMoney.toString();
    }
    if (this.editDate && this.editDate[0]) {
      data.startDate = this.editDate[0];
    }
    if (this.editDate && this.editDate[1]) {
      data.endDate = this.editDate[1];
    }
    myDispatch(this.$store, "updateActivity", data)
      .then(ret => {
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.loadData();
          this.editflag = false;
          return;
        } else {
          this.$message({
            type: "error",
            message: "修改失败!" + ret.err
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err.err
        });
        return;
      });
  }

  //删除
  del(index) {
    myDispatch(this.$store, "deleteCfgActivity", { id: index })
      .then(ret => {
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.loadData();
          this.addflg = false;
          return;
        } else {
          this.$message({
            type: "error",
            message: "删除失败!" + ret.err
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err.err
        });
        return;
      });
  }
  close() {
    this.addName = "";
    this.addDate = [];
    this.addActive = true;
    this.addRecharge = "";
    this.addChangeMoney = "";
    this.addRechargeChannels = [];
    this.interest = "0.01";
    this.allChannel = true;
    this._id = "";
    this.pid = "A";

    this.editActive = true;
    this.editName = "";
    this.editDate = [];
    this.editRecharge = "";
    this.editChangeMoney = "";
    this.editRechargeChannels = [];
    this.editShowMsg = {};
  }
  saveType() {
    this.addflg = true;
    this.typeDialog = false;
    this.addChangeMoney = "";
    this.addRecharge = "";
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
  eventTypeFormat(row) {
    let str = "";
    str = row.type ? (row.type === 2 ? "充值返利" : "兑换码活动") : "";
    return str;
  }
  typesFormat(row) {
    let str = "";
    if (row.type == 2) {
      row.condition.types.map(i => {
        if (i == "chat") {
          str += "官方代充  ";
        } else {
          str += "云闪付  ";
        }
      });
    }
    return str;
  }
  allChannelFormat(row) {
    let str = "";
    str = row.allChannel ? "是" : "否";
    return str;
  }
  pidFormat(row) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  startDateFormat(row, column) {
    if (row.startDate) {
      let date = new Date(row.startDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  endDateFormat(row, column) {
    if (row.endDate) {
      let date = new Date(row.endDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  activeFormat(row, column) {
    return row.active ? "开启" : "关闭";
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
