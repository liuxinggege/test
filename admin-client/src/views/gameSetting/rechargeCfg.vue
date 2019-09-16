<template>
  <div>
    <rechargeLocationCfg></rechargeLocationCfg>
    <div class="dashboard-outer">
      <el-card class="dashboard-second">
        <el-form :inline="true" ref="form" :model="form">
          <el-form-item label="新代理充值开关">
            <el-switch v-model="form.newAgentSwitch"></el-switch>
          </el-form-item>
          <el-form-item label="vip充值开关">
            <el-switch v-model="form.vipSwitch"></el-switch>
          </el-form-item>
          <el-form-item label="支付策略开关">
            <el-switch v-model="form.payEnforce"></el-switch>
          </el-form-item>
          <el-form-item label="limitOCMM">
            <el-switch v-model="form.limitOtherChannelMaxMoney"></el-switch>
          </el-form-item>
          <el-form-item label="支持代充的vip开关">
            <el-switch v-model="form.agentVipSwitch"></el-switch>
          </el-form-item>
          <br />
          <el-form-item label="代理充值最小显示">
            <el-input v-model="form.agentMinMoney" type="text"></el-input>
          </el-form-item>
          <el-form-item label="支付充值间隔（单位：秒）：">
            <el-input v-model="form.createThridPayInterval" type="text"></el-input>
          </el-form-item>
          <el-form-item label="srTimesLL">
            <el-input v-model="form.srTimesLLmit" type="text"></el-input>
          </el-form-item>
          <el-form-item label="srTLL">
            <el-input v-model="form.srTotalLLimit" type="text"></el-input>
          </el-form-item>
          <el-form-item label="srOSAR">
            <el-input v-model="form.srOnlyShowAgentRate" type="text"></el-input>
          </el-form-item>
          <el-form-item label="srCNBT">
            <el-input v-model="form.srConNoBillTimes" type="text"></el-input>
          </el-form-item>
          <el-form-item label="srDR">
            <el-input v-model="form.srDecRate" type="text"></el-input>
          </el-form-item>
          <el-form-item label="saOSAR">
            <el-input v-model="form.saOnlyShowAgentRate" type="text"></el-input>
          </el-form-item>
          <el-form-item label="saCNBT">
            <el-input v-model="form.saConNoBillTimes" type="text"></el-input>
          </el-form-item>
          <el-form-item label="saDR">
            <el-input v-model="form.saDecRate" type="text"></el-input>
          </el-form-item>
          <el-form-item label="perACIR">
            <el-input v-model="form.perACIncRate" type="text"></el-input>
          </el-form-item>
          <el-form-item label="otherCMM">
            <el-input v-model="form.otherChannelMaxMoney" type="text"></el-input>
          </el-form-item>
          <div>
            <el-form-item>
              <el-button type="primary" @click="getForms">读取</el-button>
              <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
      <div class="bottomList">
        <div class="payInfo">
          <div class="searchBox">
            <span>权重自动配置</span>
            <el-input style="width:80px; margin:10px" v-model="rechargeWeightAutoTime"></el-input>
            <span>分钟</span>
            <el-button type="primary" @click="refreshRechargeWeightTime">刷新</el-button>
            <el-button type="primary" @click="updateRechargeWeightTime">保存</el-button>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="支付方式">
                <el-select v-model="paySearch.payType" placeholder="请选择" @change="loadChannels">
                  <el-option v-for="item in newPayTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="渠道">
                <el-select v-model="paySearch.channel" placeholder="请选择">
                  <el-option v-for="item in channels" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开关">
                <el-select v-model="paySearch.active" placeholder="请选择">
                  <el-option label="全部" :value="undefined"></el-option>
                  <el-option label="开" :value="true"></el-option>
                  <el-option label="关" :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchPayInfo">搜索</el-button>
                <el-button type="primary" @click="showAddPay">新增</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="payInfoData" border cell-class-name="tableTd" header-cell-class-name="tableTh" style="width:1150px">
            <el-table-column prop="channel" label="渠道" :formatter="channelFormat" width="120" align="center"></el-table-column>
            <el-table-column prop="payType" label="支付方式" :formatter="newPayTypeFormat" width="120" align="center"></el-table-column>
            <el-table-column prop="payTypeOri" label="原支付方式" :formatter="payTypeFormat" width="120" align="center"></el-table-column>
            <el-table-column prop="minMoney" label="最小金额" width="120" align="center"></el-table-column>
            <el-table-column prop="maxMoney" label="最大金额" width="120" align="center"></el-table-column>
            <el-table-column prop="auto" label="自动获取最小最大金额开关" :formatter="autoFormat" width="100" align="center"></el-table-column>
            <el-table-column prop="active" label="开关" width="100" :formatter="activeFormat" align="center"></el-table-column>
            <el-table-column prop="out" label="通道类型" width="100" :formatter="outFormat" align="center"></el-table-column>
            <el-table-column prop="isSmallAmt" label="小额标识" width="100" :formatter="isSmallAmountFormat" align="center"></el-table-column>
            <el-table-column prop="weightAutoActive" label="手/自动开关" width="100" :formatter="weightAutoActiveFormat" align="center"></el-table-column>
            <el-table-column prop="weightUpLimit" label="权重上限" width="100" align="center"></el-table-column>
            <el-table-column prop="weightDownLimit" label="权重下限" width="100" align="center"></el-table-column>
            <el-table-column prop="weight" label="权重" width="100" align="center"></el-table-column>
            <el-table-column prop="rate" label="费率" width="100" align="center"></el-table-column>
            <el-table-column prop="moneyRange" label="金额范围" width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.moneyRange.join(",")}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button @click="editLine(scope.row)" type="primary" size="small">编辑</el-button>
                <el-button @click="delPayInfoItem(scope.row)" type="primary" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageBox">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="payInfoParms.page" :page-sizes="[10, 20, 50, 100]" :page-size="payInfoParms.count" layout="total, sizes, prev, pager, next, jumper" :total="payInfoParms.totalCount"></el-pagination>
          </div>
        </div>
        <div class="payType">
          <el-button type="primary" @click="showAddPayType" style="margin-bottom:40px;">新增</el-button>
          <el-button type="primary" @click="loadPayType" style="margin-bottom:40px;">刷新</el-button>
          <el-table :data="payTypeData" border cell-class-name="tableTd" header-cell-class-name="tableTh" style="width:450px">
            <!-- <el-table-column prop="_id" fixed label="ID" width="220" align="center"></el-table-column> -->
            <el-table-column prop="payType" :formatter="newPayTypeFormat" label="支付方式" align="center"></el-table-column>
            <el-table-column prop="idx" label="排序" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="deletePayType(scope.row)" type="primary" size="small">删除</el-button>
                <el-button @click="editPayType(scope.row)" type="primary" size="small">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageBox">
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="payTypeParms.page" :page-sizes="[10, 20, 50, 100]" :page-size="payTypeParms.count" layout="total, sizes, prev, pager, next, jumper" :total="payTypeParms.totalCount"></el-pagination>
          </div>
        </div>
      </div>
      <el-dialog title="新增支付信息" :visible.sync="dialogAddPayInfo" width="1000px">
        <el-form :inline="true">
          <el-form-item label="支付方式">
            <el-select v-model="addPayInfo.payType" placeholder="请选择" @change="changePayType">
              <el-option v-for="item in newPayTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原支付方式">
            <el-select v-model="addPayInfo.payTypeOri" placeholder="请选择" @change="loadAddChannels">
              <el-option v-for="item in addPayTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <el-select v-model="addPayInfo.channel" placeholder="请选择">
              <el-option v-for="item in addChannels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开关">
            <el-select v-model="addPayInfo.active" placeholder="请选择">
              <el-option label="开" :value="true"></el-option>
              <el-option label="关" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额范围">
            <el-input v-model="addPayInfo.moneyRange" placeholder="多个金额以英文逗号隔开(,)" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="自动获取最小最大金额开关">
            <el-select v-model="addPayInfo.auto" placeholder="请选择">
              <el-option label="开" :value="true"></el-option>
              <el-option label="关" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小金额">
            <el-input v-model="addPayInfo.minMoney"></el-input>
          </el-form-item>
          <el-form-item label="最大金额">
            <el-input v-model="addPayInfo.maxMoney"></el-input>
          </el-form-item>
          <el-form-item label="权重">
            <el-input type="number" v-model="addPayInfo.weight"></el-input>
          </el-form-item>
          <el-form-item label="通道类型">
            <el-select v-model="addPayInfo.out" placeholder="请选择">
              <el-option label="外部" :value="true"></el-option>
              <el-option label="内部" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开关类型">
            <el-select v-model="addPayInfo.weightAutoActive" placeholder="请选择">
              <el-option label="自动" :value="true"></el-option>
              <el-option label="手动" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小额标识">
            <el-select v-model="addPayInfo.isSmallAmt" placeholder="请选择">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费率">
            <el-input type="number" v-model="addPayInfo.rate"></el-input>
          </el-form-item>
          <el-form-item label="权重上限">
            <el-input type="number" v-model="addPayInfo.weightUpLimit"></el-input>
          </el-form-item>
          <el-form-item label="权重下限">
            <el-input type="number" v-model="addPayInfo.weightDownLimit"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseAddPayInfo">取 消</el-button>
          <el-button type="primary" @click="submitAddPayInfo">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="`编辑支付信息：${dialogId}`" :visible.sync="dialogEditPayInfo" width="1000px">
        <el-form :inline="true">
          <el-form-item label="支付方式">
            <el-input v-model="editPayInfo.payType" disabled></el-input>
          </el-form-item>
          <el-form-item label="原支付方式">
            <el-input v-model="editPayInfo.payTypeOri" disabled></el-input>
          </el-form-item>
          <el-form-item label="渠道">
            <el-input v-model="editPayInfo.channel" disabled></el-input>
          </el-form-item>
          <el-form-item label="开关">
            <el-select v-model="editPayInfo.active" placeholder="请选择">
              <el-option label="开" :value="true"></el-option>
              <el-option label="关" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额范围">
            <el-input v-model="editPayInfo.moneyRange" placeholder="多个金额以英文逗号隔开(,)" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="自动获取最小最大金额开关">
            <el-select v-model="editPayInfo.auto" placeholder="请选择">
              <el-option label="开" :value="true"></el-option>
              <el-option label="关" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小金额">
            <el-input v-model="editPayInfo.minMoney"></el-input>
          </el-form-item>
          <el-form-item label="最大金额">
            <el-input v-model="editPayInfo.maxMoney"></el-input>
          </el-form-item>
          <el-form-item label="权重">
            <el-input type="number" v-model="editPayInfo.weight"></el-input>
          </el-form-item>
          <el-form-item label="通道类型">
            <el-select v-model="editPayInfo.out" placeholder="请选择">
              <el-option label="外部" :value="true"></el-option>
              <el-option label="内部" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开关类型">
            <el-select v-model="editPayInfo.weightAutoActive" placeholder="请选择">
              <el-option label="自动" :value="true"></el-option>
              <el-option label="手动" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小额标识">
            <el-select v-model="editPayInfo.isSmallAmt" placeholder="请选择">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费率">
            <el-input type="number" v-model="editPayInfo.rate"></el-input>
          </el-form-item>
          <el-form-item label="权重上限">
            <el-input type="number" v-model="editPayInfo.weightUpLimit"></el-input>
          </el-form-item>
          <el-form-item label="权重下限">
            <el-input type="number" v-model="editPayInfo.weightDownLimit"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseEditPayInfo">取 消</el-button>
          <el-button type="primary" @click="submitEditPayInfo">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增支付方式" :visible.sync="dialogPayType" width="400px">
        <el-form :inline="true">
          <el-form-item label="支付方式">
            <el-select v-model="addPayTypeArr.payType" placeholder="请选择" @change="loadAddChannels">
              <el-option v-for="item in payTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            排列
            <el-input v-model="addPayTypeArr.idx"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseAddPayType">取 消</el-button>
          <el-button type="primary" @click="submitAddPayType">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改支付方式" :visible.sync="editDialogPayType" width="400px">
        <el-form :inline="true">
          <el-form-item label="支付方式">
            <el-input disabled v-model="editPayTypeArr.payType"></el-input>
          </el-form-item>
          <el-form-item>
            排列
            <el-input v-model="editPayTypeArr.idx"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseEditPayType">取 消</el-button>
          <el-button type="primary" @click="submitEditPayType">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  getRechargeCfg,
  updateRechargeCfg,
  getPayTypeInfo,
  addPayTypeInfo,
  delPayTypeInfo,
  updatePayTypeInfo,
  getPayType,
  addPayType,
  editPayType,
  delPayType,
  getAllRechargeChannel,
  getRechargeAndWithdrawItem,
  rechargeWeightTimeCfg
} from "../../api/admin/gameSetting/gameSetting";
import { getAdminCfg } from "../../api/admin/adminCfg/adminCfg";
import { myAsyncFn, myDispatch } from "../../utils";
import rechargeLocationCfg from "./rechargeLocationCfg.vue";

@Component({
  components: { rechargeLocationCfg: rechargeLocationCfg }
})
export default class rechargeCfg extends Vue {
  labelWidth: string = "120px";
  form: any = {};
  rechargeWeightAutoTime: string = "";
  payTypeParms = {
    page: 1,
    count: 10,
    totalCount: 0
  };
  payInfoParms = {
    page: 1,
    count: 10,
    totalCount: 0
  };
  paySearch: any = {};
  payInfoData = [];
  payTypeData = [];
  dialogAddPayInfo = false;
  dialogEditPayInfo = false;
  payTypes = [
    { value: "", label: "全部" },
    { value: "wx_pay", label: "微信" },
    { value: "wx_fix", label: "固定微信" },
    { value: "ali_pay", label: "支付宝" },
    { value: "union_pay", label: "银联" },
    { value: "yun_pay", label: "云闪付" },
    { value: "qq_pay", label: "QQ钱包" },
    { value: "jd_pay", label: "京东" },
    { value: "card_pay", label: "点卡" },
    { value: "ali_person", label: "个人支付宝" },
    { value: "ali_fix", label: "固定支付宝" }
  ];
  addPayTypes = [];
  newPayTypes = [
    { value: "", label: "全部" },
    { value: "wx_pay", label: "微信" },
    { value: "ali_pay", label: "支付宝" },
    { value: "union_pay", label: "银联" },
    { value: "yun_pay", label: "云闪付" },
    { value: "qq_pay", label: "QQ钱包" },
    { value: "jd_pay", label: "京东" },
    { value: "card_pay", label: "点卡" }
  ];
  payTypesWeb = {
    wx_pay: "wxs",
    wx_fix: "wx_fix",
    ali_pay: "alis",
    union_pay: "unions",
    yun_pay: "yuns",
    qq_pay: "qqs",
    jd_pay: "jds",
    card_pay: "cards",
    ali_person: "oneAlis",
    ali_fix: "aliFixs"
    // ali_H5: "ali_H5",
    // wx_H5: "wx_H5"
  };
  channels: any = [];
  addPayInfo: any = {
    active: false,
    auto: false,
    minMoney: "0",
    maxMoney: "0",
    weight: 0,
    isSmallAmt: false,
    out: false,
    weightAutoActive: false,
    weightUpLimit: "0",
    weightDownLimit: "0",
    rate: "0",
    payTypeOri: ""
  };
  addChannels: any = [];
  dialogId = "";
  editPayInfo: any = {
    active: false,
    auto: false,
    minMoney: "0",
    maxMoney: "0",
    isSmallAmt: false,
    weight: 0,
    out: false,
    weightAutoActive: false,
    weightUpLimit: "0",
    weightDownLimit: "0",
    rate: "0"
  };
  dialogPayType = false;
  editDialogPayType = false;
  addPayTypeArr: any = {};
  editPayTypeArr: any = {};
  created() {
    this.loadPayInfo();
    this.loadPayType();
    this.getChannelTypes();
    this.getForms();
    this.refreshRechargeWeightTime();
  }
  colseAddPayInfo() {
    this.dialogAddPayInfo = false;
    this.addPayInfo = {
      active: false,
      auto: false,
      minMoney: "0",
      maxMoney: "0",
      isSmallAmt: false,
      weight: 0,
      out: false,
      weightAutoActive: false,
      weightUpLimit: "0",
      weightDownLimit: "0",
      rate: "0"
    };
  }
  colseEditPayInfo() {
    this.dialogEditPayInfo = false;
    this.editPayInfo = {
      active: false,
      auto: false,
      minMoney: "0",
      maxMoney: "0",
      isSmallAmt: false,
      weight: 0,
      out: false,
      weightAutoActive: false,
      weightUpLimit: "0",
      weightDownLimit: "0",
      rate: "0"
    };
  }
  colseAddPayType() {
    this.dialogPayType = false;
    this.addPayTypeArr = {};
  }
  colseEditPayType() {
    this.dialogPayType = false;
    this.editPayTypeArr = {};
  }
  getChannelTypes() {
    getAllRechargeChannel({}).then(res => {
      if (res.data.msg) {
        this.channels = res.data.msg.channels;
      }
    });
  }
  getForms() {
    getRechargeCfg().then(res => {
      this.form = res.data.msg;
    });
  }
  submitForm() {
    updateRechargeCfg(this.form)
      .then(res => {
        if (res.data.code != 200) {
          return;
        }
        this.$message.success("保存成功");
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  //获取权重自动配置
  async refreshRechargeWeightTime() {
    let ret = await myAsyncFn(getAdminCfg);
    if (ret.code === 200 && ret.msg) {
      this.rechargeWeightAutoTime = ret.msg.rechargeWeightAutoTime;
    }
  }
  //修改权重自动配置
  async updateRechargeWeightTime() {
    if (!this.rechargeWeightAutoTime) {
      this.$message({
        type: "error",
        message: "权重自动配置不能为空!"
      });
    } else {
      let ret = await myAsyncFn(rechargeWeightTimeCfg, {
        time: this.rechargeWeightAutoTime
      });
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }
    }
  }
  searchPayInfo() {
    this.payInfoParms.page = 1;
    this.loadPayInfo();
  }
  loadPayInfo() {
    let queryItem = { ...this.paySearch };
    queryItem.page = this.payInfoParms.page;
    queryItem.count = this.payInfoParms.count;
    getPayTypeInfo(queryItem)
      .then(res => {
        if (res.data.code != 200) {
          return;
        }
        this.payInfoData = res.data.msg.pageData;
        this.payInfoParms.totalCount = res.data.msg.totalCount;
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  loadPayType() {
    getPayType({ page: this.payTypeParms.page, count: this.payTypeParms.count })
      .then(res => {
        if (res.data.code != 200) {
          return;
        }
        this.payTypeData = res.data.msg.pageData;
        this.payTypeParms.totalCount = res.data.msg.totalCount;
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  showAddPay() {
    this.addPayInfo.payType = "";
    this.addPayInfo.payTypeOri = "";
    this.addPayTypes = [];
    this.dialogAddPayInfo = true;
  }
  showAddPayType() {
    this.dialogPayType = true;
  }
  editLine(row) {
    this.dialogEditPayInfo = true;
    this.dialogId = row._id;
    this.editPayInfo = { ...row };
    this.editPayInfo.moneyRange = this.editPayInfo.moneyRange.join(",");
    this.editPayInfo.channel = this.channelFormat(row);
    this.editPayInfo.payType = this.newPayTypeFormat(row);
    this.editPayInfo.payTypeOri = this.payTypeFormat(row);
  }
  delPayInfoItem(row) {
    this.$confirm("此操作将删除该行信息, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        delPayTypeInfo({ id: row._id })
          .then(res => {
            if (res.data.code != 200) {
              return;
            }
            this.$message.success("删除成功");
            this.loadPayInfo();
          })
          .catch(err => {
            if (err.code == 400) {
              return;
            }
            this.$message.error(err.err);
          });
      })
      .catch(() => {});
  }
  handleSizeChange(val) {
    this.payInfoParms.count = val;
    this.loadPayInfo();
  }
  handleCurrentChange(val) {
    this.payInfoParms.page = val;
    this.loadPayInfo();
  }
  handleSizeChange2(val) {
    this.payTypeParms.count = val;
    this.loadPayType();
  }
  handleCurrentChange2(val) {
    this.payTypeParms.page = val;
    this.loadPayType();
  }
  isSmallAmountFormat(row) {
    if (row.isSmallAmt) {
      return "是";
    } else {
      return "否";
    }
  }
  autoFormat(row) {
    if (row.auto) {
      return "开";
    } else {
      return "关";
    }
  }
  activeFormat(row) {
    if (row.active) {
      return "开";
    } else {
      return "关";
    }
  }
  outFormat(row) {
    if (row.out) {
      return "外部";
    } else {
      return "内部";
    }
  }
  weightAutoActiveFormat(row) {
    if (row.weightAutoActive) {
      return "自动";
    } else {
      return "手动";
    }
  }
  newPayTypeFormat(row) {
    let payType = this.payTypes.filter(i => i.value == row.payType);
    return payType[0].label || "-";
  }
  payTypeFormat(row) {
    let payTypeOri = this.payTypes.filter(i => i.value == row.payTypeOri);
    return payTypeOri[0].label || "-";
  }
  channelFormat(row) {
    let tmp = row.channel;
    if (row.channel) {
      let ret = this.channels.find(item => row.channel == item.value);
      if (ret) {
        tmp = ret.label;
      }
    }
    return tmp;
  }
  changePayType() {
    this.addPayInfo.payTypeOri = "";
    this.addPayTypes = [];
    switch (this.addPayInfo.payType) {
      case "wx_pay":
        this.addPayTypes = [
          { value: "wx_pay", label: "微信" },
          { value: "wx_fix", label: "固定微信" }
          // { value: "wx_H5", label: "微信H5" }
        ];
        break;
      case "ali_pay":
        this.addPayTypes = [
          { value: "ali_pay", label: "支付宝" },
          { value: "ali_person", label: "个人支付宝" },
          { value: "ali_fix", label: "固定支付宝" }
          // { value: "ali_H5", label: "支付宝H5" }
        ];
        break;
      case "union_pay":
        this.addPayTypes = [{ value: "union_pay", label: "银联" }];
        break;
      case "yun_pay":
        this.addPayTypes = [{ value: "yun_pay", label: "云闪付" }];
        break;
      case "qq_pay":
        this.addPayTypes = [{ value: "qq_pay", label: "QQ钱包" }];
        break;
      case "jd_pay":
        this.addPayTypes = [{ value: "jd_pay", label: "京东" }];
        break;
      case "card_pay":
        this.addPayTypes = [{ value: "card_pay", label: "点卡" }];
        break;
      case "card_pay":
        this.addPayTypes = [{ value: "card_pay", label: "点卡" }];
        break;
    }
  }
  loadAddChannels() {
    let queryItem = {
      name: this.addPayInfo.payTypeOri,
      type: "recharge"
    };
    queryItem.name = this.payTypesWeb[queryItem.name];
    getRechargeAndWithdrawItem(queryItem).then(res => {
      if (res.data.code != 200) {
        return;
      }
      if (res.data.msg.length === 0) {
        this.$message.error("此支付方式暂无渠道");
        this.addChannels = [];
        return;
      }
      if (res.data.msg[0].channel.length === 0) {
        this.$message.error("此支付方式暂无渠道");
        this.addChannels = [];
        return;
      }
      this.addChannels = res.data.msg[0].channel;
    });
  }
  loadChannels() {
    if (this.paySearch.channel) {
      this.paySearch.channel = "";
    }
    let queryItem = {
      name: this.paySearch.payType,
      type: "recharge"
    };
    queryItem.name = this.payTypesWeb[queryItem.name];
    getRechargeAndWithdrawItem(queryItem).then(res => {
      if (res.data.code != 200) {
        return;
      }
      if (!res.data.msg[0]) {
        this.$message.error("此支付方式暂无渠道");
        this.channels = [];
        return;
      }
      this.channels = res.data.msg[0].channel;
    });
  }
  submitAddPayInfo() {
    let queryItem = { ...this.addPayInfo };
    if (queryItem.payTypeOri == "ali_fix" && !queryItem.moneyRange) {
      this.$message.error("金额范围必填！");
      return;
    }
    queryItem.moneyRange
      ? (queryItem.moneyRange = queryItem.moneyRange.split(","))
      : (queryItem.moneyRange = []);
    if (queryItem.maxMoney == "") {
      queryItem.maxMoney = "0";
    }
    if (queryItem.minMoney == "") {
      queryItem.minMoney = "0";
    }
    if (queryItem.weight == "") {
      queryItem.weight = 0;
    }
    addPayTypeInfo(queryItem)
      .then(res => {
        if (res.data.code != 200) {
          return;
        }
        this.$message.success("添加成功");
        this.dialogAddPayInfo = false;
        this.loadPayInfo();
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  submitEditPayInfo() {
    let queryItem = { ...this.editPayInfo };
    queryItem.id = queryItem._id;
    if (queryItem.payTypeOri == "ali_fix" && !queryItem.moneyRange) {
      this.$message.error("金额范围必填！");
      return;
    }
    if (
      !queryItem.weightDownLimit ||
      !queryItem.weightUpLimit ||
      !queryItem.rate
    ) {
      this.$message.error("上限、下限、费率必填！");
      return;
    }
    queryItem.moneyRange
      ? (queryItem.moneyRange = queryItem.moneyRange.split(","))
      : (queryItem.moneyRange = []);
    if (queryItem.maxMoney == "") {
      queryItem.maxMoney = "0";
    }
    if (queryItem.minMoney == "") {
      queryItem.minMoney = "0";
    }
    if (queryItem.weight == "") {
      queryItem.weight = 0;
    }
    updatePayTypeInfo(queryItem)
      .then(res => {
        if (res.data.code != 200) {
          return;
        }
        this.$message.success("修改成功");
        this.dialogEditPayInfo = false;
        this.loadPayInfo();
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  submitAddPayType() {
    addPayType({
      payType: this.addPayTypeArr.payType,
      idx: this.addPayTypeArr.idx
    })
      .then(res => {
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.dialogPayType = false;
          this.loadPayType();
        }
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  submitEditPayType() {
    editPayType({ id: this.editPayTypeArr.id, idx: this.editPayTypeArr.idx })
      .then(res => {
        if (res.data.code == 200) {
          this.$message.success("修改成功");
          this.editDialogPayType = false;
          this.loadPayType();
        }
      })
      .catch(err => {
        if (err.code == 400) {
          return;
        }
        this.$message.error(err.err);
      });
  }
  deletePayType(row) {
    this.$confirm("此操作将删除该行信息, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      delPayType({ id: row._id })
        .then(res => {
          if (res.data.code != 200) {
            return;
          }
          this.$message.success("删除成功");
          this.loadPayType();
        })
        .catch(err => {
          if (err.code == 400) {
            return;
          }
          this.$message.error(err.err);
        });
    });
  }
  editPayType(row) {
    this.editPayTypeArr.payType = row.payType;
    this.editPayTypeArr.id = row._id;
    this.editPayTypeArr.idx = row.idx;
    this.editDialogPayType = true;
  }
}
</script>
<style lang="scss" scoped>
.bottomList {
  display: flex;
  width: 100%;
}
.payInfo {
  width: 1150px;
  padding-left: 30px;
  margin-right: 50px;
}
.searchBox {
  margin: 20px;
}
.payType {
  width: 450px;
  margin-top: 20px;
}
.pageBox {
  padding: 20px;
}
</style>
