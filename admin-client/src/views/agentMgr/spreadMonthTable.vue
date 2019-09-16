<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="推广月表">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">推广月表</span>
      </el-col>
      <div class="box">
        <span>代理ID</span>
        <el-input v-model="channel" style="width:120px; margin:0 10px"></el-input>
        <span>代理名称</span>
        <el-input v-model="alipay" style="width:120px; margin:0 10px"></el-input>
        <span>统计时间</span>
        <el-date-picker v-model="staticTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
        <span>平台</span>
        <el-select v-model="agentChannel" placeholder="全部" style="margin:0 10px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span>代理渠道</span>
        <el-select v-model="agentChannel" placeholder="全部" style="margin:0 10px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>

      </div>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">【推广】总营收</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总充值</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总兑换</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总注册用户</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总税收</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总付费率</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总ARPPU</span>
      <span style="font-size:12pt;">{{0}}</span>
      <br>
      <br>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">【实际】总营收</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总充值</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总兑换</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总注册用户</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总税收</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总付费率</span>
      <span style="font-size:12pt;">{{0}}</span>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">总ARPPU</span>
      <span style="font-size:12pt;">{{0}}</span>
      <br><br>
      <!--列表-->
      <el-table :data="spreadMonthTable.spreadMonthTableDatas" border highlight-current-row style="width: 99%;" max-height="600">
        <el-table-column prop="_id" label="统计时间" min-width="220" align="center" />
        <el-table-column prop="withdrawOrderID" label="代理ID" min-width="175" align="center" />
        <el-table-column prop="status" label="代理名称" width="100" align="center" />
        <el-table-column prop="act" label="营收" width="150" align="center" />
        <el-table-column prop="applyMoney" label="充值" width="200" align="center" />
        <el-table-column prop="totalSetMoney" label="兑换" width="170" align="center" />
        <el-table-column prop="alipayAccount" label="注册用户数" width="200" align="center" />
        <el-table-column prop="alipayAccount" label="登陆用户数" width="200" align="center" />
        <el-table-column prop="alipayAccount" label="绑定用户数" width="200" align="center" />
        <el-table-column prop="alipayAccount" label="新增充值人数" width="200" align="center" />
        <el-table-column prop="alipayAccount" label="平均充值" width="200" align="center" />
        <el-table-column prop="alipayAccount" label="最高在线" width="200" align="center" />
        <el-table-column prop="alipayAccount" label="总税收" width="200" align="center" />

      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="spreadMonthTable.totalCount">
        </el-pagination>
      </el-col>

      <el-dialog :visible.sync="addAgentVisible" width=800px>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">代理类型</span>
        <template>
          <el-radio style=' margin:10px 30px 10px 35px' v-model="isBusinessman" :label="true">商人代理</el-radio>
          <el-radio v-model="isBusinessman" :label="false">全民代理</el-radio>
        </template>

        <!-- <el-checkbox type='text'  style="font-size:12pt; margin:0px 0px 0px 198px" class="checkbox" label="商人代理" border
							v-model="isBusinessman">
				</el-checkbox>
        <el-checkbox type='text'  style="font-size:12pt; margin:0px 0px 0px 198px" class="checkbox" label="全名代理" border
						v-model="isNormal">
				</el-checkbox> -->
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">代理名字</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 35px' placeholder="必填项" v-model="addAgentName"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 50px">代理游戏ID</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 35px' placeholder="必填项" v-model="addAgentGameID"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 34px">代理后台账号</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 35px' placeholder="必填项" v-model="addAgentAct"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">后台密码</span>
        <el-input type='text' style='width:200px; margin:10px 0px 10px 35px' placeholder="必填项" v-model="addAgentPwd"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 103px">QQ</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 35px' placeholder="选填项" v-model="addQQ"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 80px">手机号</span>
        <el-input type='text' style='width:200px; margin:10px 0px 10px 35px' placeholder="选填项" v-model="addPhoneNumber"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 80px">微信号</span>
        <el-input type='text' style='width:200px; margin:10px 0px 10px 35px' placeholder="选填项" v-model="addWetch"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 95px">备注</span>
        <el-input type='text' style='width:400px; margin:10px 0px 10px 35px' placeholder="选填项" v-model="addInfo"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">税收分成</span>
        <el-input type='text' style='width:200px; margin:10px 0px 10px 35px' placeholder="选填项" v-model="addShuishou"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">扣量比例</span>
        <el-input type='text' style='width:200px; margin:10px 0px 10px 35px' placeholder="选填,不填默认为1" v-model="addRate"></el-input>
        <br>
        <el-checkbox type='text' style="font-size:12pt; margin:0px 0px 0px 164px" class="checkbox" label="开设下级代理" border v-model="haveSonAgent" v-if="isBusinessman">
        </el-checkbox>
        <el-button type="primary" @click="addAgentCancel" style="margin:20px 0px 10px 500px">取消</el-button>
        <el-button type="primary" @click="addAgentConfirm" style="margin:20px 0px 10px 30px">确认</el-button>
      </el-dialog>

    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { SpreadMonthTableState } from "../../store/stateInterface";

interface QueryItem {
  channel?: string;
  alipay?: string;
  status?: string[];
  page?: number;
  count?: number;
  startDate?: Date;
  endDate?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SpreadMonthTable extends Vue {
  page: number = 1; //当前页
  count: number = 10;
  staticTime: Date[] = [];

  spreadMonthTable: SpreadMonthTableState = this.$store.state.spreadMonthTable;

  channel: string = "";
  alipay: string = "";
  alipayType: string = "";
  changeAlipay: any = {
    //修改支付宝
    alipayAccount: "",
    alipayName: "",
    act: ""
  };

  dialogEditChannelVisible: boolean = false;
  value: string = "all";
  options: any = [
    { value: "all", label: "全部" },
    { value: "success", label: "成功" },
    { value: "fail", label: "失败" },
    { value: "transfer", label: "转账中" },
    { value: "await", label: "等待审核" }
  ];

  agentChannel: string = "all";

  addAgentVisible: boolean = false;
  isBusinessman: boolean = false;
  isNormal: boolean = false;
  haveSonAgent: boolean = false;
  showSonAgent: boolean = false;

  addAgentName: string = "";
  addAgentGameID: string = "";
  addAgentAct: string = "";
  addAgentPwd: string = "";
  addQQ: string = "";
  addPhoneNumber: string = "";
  addWetch: string = "";
  addInfo: string = "";
  addShuishou: string = "";
  addRate: string = "";

  //生命周期钩子函数
  created() {
    this.loadData();
  }

  //函数
  refresh() {
    this.loadData();
  }

  //初始化数据
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "getAgentListNew", queryItem, true).then(() => {});
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let tmp: QueryItem = {};
    if (this.value === "all") {
      tmp.status = ["success", "fail", "transfer", "await"];
    } else {
      tmp.status = [this.value];
    }
    if (this.channel) {
      tmp.channel = this.channel;
    }
    if (this.alipay) {
      tmp.alipay = this.alipay;
    }

    return tmp;
  }

  handleShowSonAgent() {
    this.showSonAgent = true;
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

  cancelEditAlipay() {
    // 点击取消按钮
    this.dialogEditChannelVisible = false;
  }

  addClick() {
    this.addAgentVisible = true;
  }

  addAgentCancel() {
    this.addAgentVisible = false;
  }

  addAgentConfirm() {
    let tempData: any = {};
    this.$confirm("是否确认提交", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddAgentNew", tempData, true).then(() => {
          if (this.spreadMonthTable.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.addAgentVisible = false;
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
          });
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  eidtAnget(index, row) {
    this.addAgentVisible = true;
  }

  deletAgent(index, row) {}

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
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
