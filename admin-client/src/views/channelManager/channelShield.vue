<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道列表"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">渠道列表</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;" @change="getFather">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>渠道ID</span>
        <el-input v-model="channelId" style="width:120px; margin:0 10px"></el-input>

        <span>类型</span>
        <el-select v-model="channelType" placeholder="全部" style="width:150px; margin:0 10px;">
          <el-option v-for="item in channelTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>父渠道</span>
        <el-select v-model="fatherChannel" filterable placeholder="全部" style="width:150px; margin:0 10px;">
          <el-option v-for="(item,index) in fatherChannels" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>状态</span>
        <el-select v-model="state" placeholder="全部" style=" width:100px; margin:0 10px;">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button type="primary" @click="addChannelShield" icon="plus">添加</el-button>
        <el-button type="primary" @click="isDbatch">批量修改</el-button>
        <el-button type="success" @click="getExcel">导出EXCEL</el-button>
      </span>
      <div style="margin-top:10px;">
        <span style="margin:5px 50px 0 0">游戏内主页修改:</span>
        <span>原域名:</span>
        <el-input v-model="oldWebDomain" style="width:200px; margin:5px 10px"></el-input>
        <span>新域名:</span>
        <el-input v-model="newWebDomain" style="width:200px; margin:5px 10px"></el-input>
        <el-button type="primary" @click="changeChannelWebDomain">修改</el-button>
        <el-button type="primary" @click="delChannelDomain">删除</el-button>
        <br>
      </div>
      <!--列表-->
      <el-table :data="channelShield.channelShieldData" border>
        <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="channel" label="渠道" min-width="100" align="center" :formatter="channelFormat"></el-table-column>
        <el-table-column prop="web" label="游戏内主页" min-width="280" align="center"></el-table-column>
        <el-table-column prop="enableTyShield" label="天御" min-width="100" align="center" :formatter="tYStateFormat"></el-table-column>
        <el-table-column prop="enableShield" label="屏蔽" min-width="50" align="center" :formatter="enableShieldFormat"></el-table-column>
        <el-table-column prop="enableStatusJmp" label="渠道跳转" min-width="50" align="center" :formatter="enableStatusJmpFormat"></el-table-column>
        <el-table-column prop="enableBanMaster" label="屏蔽全民代理" min-width="50" align="center" :formatter="enableBanMasterFormat"></el-table-column>
        <el-table-column prop="enableReportAgent" label="举报开关" min-width="50" align="center" :formatter="enableReportAgentFormat"></el-table-column>
        <el-table-column prop="enableRechargeEnforce" label="充值策略" min-width="50" align="center" :formatter="enableRechargeEnforceFormat"></el-table-column>
        <el-table-column prop="enableOnlineRecharge" label="在线支付开关" min-width="50" align="center" :formatter="enableOnlineRechargeFormat"></el-table-column>
        <el-table-column prop="enableLowerBonus" label="使用低奖励" min-width="50" align="center" :formatter="enableLowerBonusFormat"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="100" align="center" :formatter="stateFormat"></el-table-column>
        <el-table-column prop="father" label="父渠道" min-width="100" align="center"></el-table-column>
        <el-table-column prop="type" label="渠道类型" min-width="100" align="center" :formatter="typeFormat"></el-table-column>
        <el-table-column prop="enableLowerBonus" label="微信" min-width="150" align="center" :formatter="wxsFormat"></el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" style="margin-left:20px;" @click="del(scope.$index, scope.row)">
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="dialogAdd" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select v-model="addPid" placeholder="请选择项目">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <span>注意：csv文件格式为，每一行是一条渠道信息，信息顺序不能乱，每条信息必填，格式:渠道号,ios下载地址,安卓下载地址,模版名称,落地页入口域名,地推域名。</span>
            <csvUpload @child-intCSV="intCSV"></csvUpload>
            <a style="color:blue" href="../../static/channelShield.csv">下载csv模版</a>
          </el-form-item>
          <el-form-item label="游戏内主页">
            <el-checkbox v-model="curGameUrl"></el-checkbox>
            <span style="color:green">
              （勾选将游戏内主页设为落地页域名一致
              <span style="color:red">(需勾选渠道跳转)</span>，不勾选默认没有游戏内主页）
            </span>
          </el-form-item>
          <br>
          <el-checkbox v-model="curEnableTyShield" style="margin:10px;" label="关闭天御" border></el-checkbox>
          <el-checkbox v-model="curEnableShield" style="margin:10px;" label="屏蔽" border></el-checkbox>
          <el-checkbox v-model="curEnableStatusJmp" style="margin:10px;" label="渠道跳转" border></el-checkbox>
          <el-checkbox v-model="curEnableBanMaster" style="margin:10px;" label="屏蔽全民代理" border></el-checkbox>
          <el-checkbox v-model="curEnableReportAgent" style="margin:10px;" label="举报开关" border></el-checkbox>
          <el-checkbox v-model="curEnableRechargeEnforce" style="margin:10px;" label="充值策略" border></el-checkbox>
          <el-checkbox v-model="curEnableOnlineRecharge" style="margin:10px;" label="在线支付开关" border></el-checkbox>
          <el-checkbox v-model="curEnableLowerBonus" style="margin:10px;" label="使用低奖励" border></el-checkbox>
          <!-- <el-form-item label="渠道跳转"> <el-checkbox   v-model="curGo"/></el-form-item> -->
          <!-- <el-form-item label="代理切换开关"><el-checkbox  v-model="curSwitch"/> </el-form-item> -->
          <el-form-item label="微信">
            <el-input type="textarea" :rows="3" v-model="curWX" style="width:600px; margin:0 10px"></el-input>
          </el-form-item>
          <el-form-item label="父渠道">
            <el-input v-model="curFather"></el-input>
          </el-form-item>
          <el-form-item label="渠道类型">
            <el-select v-model="curType" placeholder="全部" style="margin:0 10px;" :disabled="true">
              <el-option v-for="item in curTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="curState" placeholder="全部" style="margin:0 10px;">
              <el-option v-for="item in curStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 300px" @click="cancelStages">取 消</el-button>
        <el-button type="primary" @click="confirmStages">确认</el-button>
      </el-dialog>

      <el-dialog :visible.sync="dialogEditVisible" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select v-model="addPid" disabled placeholder="请选择项目">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <span>{{curChannel}}</span>
          </el-form-item>
          <el-form-item label="游戏内主页">
            <el-input v-model="curWeb"></el-input>
            <span style="color:red">若修改、请勾选渠道跳转</span>
          </el-form-item>
          <br>
          <el-checkbox v-model="curEnableTyShield" style="margin:10px;" label="关闭天御" border></el-checkbox>
          <el-checkbox v-model="curEnableShield" style="margin:10px;" label="屏蔽" border></el-checkbox>
          <el-checkbox v-model="curEnableStatusJmp" style="margin:10px;" label="渠道跳转" border></el-checkbox>
          <el-checkbox v-model="curEnableBanMaster" style="margin:10px;" label="屏蔽全民代理" border></el-checkbox>
          <el-checkbox v-model="curEnableReportAgent" style="margin:10px;" label="举报开关" border></el-checkbox>
          <el-checkbox v-model="curEnableRechargeEnforce" style="margin:10px;" label="充值策略" border></el-checkbox>
          <el-checkbox v-model="curEnableOnlineRecharge" style="margin:10px;" label="在线支付开关" border></el-checkbox>
          <el-checkbox v-model="curEnableLowerBonus" style="margin:10px;" label="使用低奖励" border></el-checkbox>
          <!-- <el-form-item label="渠道跳转"> <el-checkbox   v-model="curGo"/></el-form-item> -->
          <!-- <el-form-item label="代理切换开关"><el-checkbox  v-model="curSwitch"/> </el-form-item> -->
          <el-form-item label="微信">
            <el-input type="textarea" :rows="3" v-model="curWX" style="width:600px; margin:0 10px"></el-input>
          </el-form-item>
          <el-form-item label="父渠道">
            <el-input v-model="curFather"></el-input>
          </el-form-item>
          <el-form-item label="渠道类型">
            <span>{{curType}}</span>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="curState" placeholder="全部" style="margin:0 10px;">
              <el-option v-for="item in curStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogBatch" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width:800px; margin-left:30px;">
          <el-form-item label="项目">
            <el-select v-model="addPid" placeholder="请选择项目">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <el-input type="textarea" :rows="20" v-model="curChannel" style="width:600px; margin:0 10px" placeholder="多个渠道用英文逗号分开，使用all修改全部渠道"/>
          </el-form-item>
          <br>
          <div>
            <span>游戏内主页</span>
            <el-input type="text" v-model="curWebUrl" style="width:200px; margin:0  10px 0 35px"></el-input>若配置,请勾选渠道跳转
            <el-button type="primary" style="margin:10px 20px;" @click="confirmWebUrl">确认</el-button>
          </div>
          <el-checkbox v-model="curEnableTyShield" style="margin:10px 20px;" label="关闭天御" border></el-checkbox>
          <el-button type="primary" style="margin:10px 20px;" @click="EnableTyShieldByChannelsConfirm">确认</el-button>
          <el-checkbox v-model="curEnableShield" style="margin:10px 20px;" label="屏蔽" border></el-checkbox>
          <el-button type="primary" style="margin:10px 84px;" @click="EnableShieldByChannelsConfirm">确认</el-button>
          <br>
          <el-checkbox v-model="curEnableStatusJmp" style="margin:10px 20px;" label="渠道跳转" border></el-checkbox>
          <el-button type="primary" style="margin:10px 20px;" @click="EnableStatusJmpByChannelsConfirm">确认</el-button>
          <el-checkbox v-model="curEnableBanMaster" style="margin:10px 20px;" label="屏蔽全民代理" border></el-checkbox>
          <el-button type="primary" style="margin:10px 25px;" @click="EnableBanMasterByChannelsConfirm">确认</el-button>
          <br>
          <el-checkbox v-model="curEnableReportAgent" style="margin:10px 20px;" label="举报开关" border></el-checkbox>
          <el-button type="primary" style="margin:10px 20px;" @click="EnableReportAgentByChannelsConfirm">确认</el-button>
          <el-checkbox v-model="curEnableRechargeEnforce" style="margin:10px 20px;" label="充值策略" border></el-checkbox>
          <el-button type="primary" style="margin:10px 54px;" @click="EnableRechargeEnforceByChannelsConfirm">确认</el-button>
          <br>
          <el-checkbox v-model="curEnableOnlineRecharge" style="margin:10px 20px;" label="在线支付开关" border></el-checkbox>
          <el-button type="primary" style="margin:10px -7px;" @click="EnableOnlineRechargeByChannelsConfirm">确认</el-button>
          <el-checkbox v-model="curEnableLowerBonus" style="margin:10px 45px;" label="使用低奖励" border></el-checkbox>
          <el-button type="primary" style="margin:10px 20px;" @click="EnableLowerBonusByChannelsConfirm">确认</el-button>
          <br>
          <el-form-item label="微信">
            <el-input type="textarea" :rows="3" v-model="curWX" style="width:600px; margin:0 10px"></el-input>
          </el-form-item>
          <el-button type="primary" @click="confirmWX">确认</el-button>
        </el-form>
        <!-- <el-button style="margin:0px 0px 10px 300px" @click="cancelBatch">取 消</el-button> -->
      </el-dialog>

      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="channelShield.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>
 
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import STATUS from "../../utils/channelShield";
import { ChannelShieldState } from "../../store/stateInterface";
import { myDispatch, myAsyncFn } from "../../utils/index.js";
import QRCode from "qrcode";
import JSZip from "JSZip";
import FileSaver from "file-saver";
import { getChannelShieldsExcel } from "../../api/admin/channelManager/channelManager";
import csvUpload from "../csvUpload.vue";
interface QueryItem {
  pid: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    csvUpload: csvUpload
  }
})
export default class ChannelShield extends Vue {
  // lifecycle hook
  created() {
    // this.warn()

    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData(); //初始化-->加载数据
    this.getFather();
  }
  warn() {
    this.$alert("配置或者修改了游戏内主页， 请勾选渠道跳转", "确认", {
      confirmButtonText: "确定"
    });
  }
  /*inital data*/
  channelShield: ChannelShieldState = this.$store.state.channelShield; //表单数据
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 50;
  totalCount: number = 0;
  pidList: any[] = [];
  pidListForAdd: any[] = [];
  pid: string = "A";
  downloadPid: string = "A";
  addPid: string = "";
  dialogAdd: boolean = false;
  newchannel: string = "";
  shield: boolean = false;
  alias: boolean = false;
  dialogEditVisible: boolean = false;
  addChannelCSV: any = "";

  curChannel: string = "";
  curWebUrl: string = "";
  curGameUrl: boolean = false;
  curWeb: string = "";
  curGo: string = "";
  curSwitch: string = "";
  curFather: string = "";
  curType: string = "";
  curState: number = 0;
  curWX: string = "";
  curEnableTyShield: boolean = false;
  curEnableShield: boolean = false;
  curEnableStatusJmp: boolean = false;
  curEnableBanMaster: boolean = false;
  curEnableReportAgent: boolean = false;
  curEnableRechargeEnforce: boolean = false;
  curEnableOnlineRecharge: boolean = false;
  curEnableLowerBonus: boolean = false;

  fatherChannel: string = "";
  fatherChannels: any = [
    {
      value: "",
      label: "全部"
    }
  ];
  curTypes: any = [
    {
      value: "0",
      label: "普通渠道"
    },
    {
      value: "1",
      label: "全民代理"
    }
  ];
  channelTypes: any = [
    {
      value: "",
      label: "全部"
    },
    {
      value: "0",
      label: "普通渠道"
    },
    {
      value: "1",
      label: "全民代理"
    }
  ];
  channelId: string = "";
  LandingURL: string = ""; //落地页域名
  channelType: string = "";
  state: number = -1;
  states: any = [
    {
      value: -1,
      label: "全部"
    },
    {
      value: 0,
      label: "未启用"
    },
    {
      value: 1,
      label: "已启用"
    },
    {
      value: 2,
      label: "已停用"
    }
  ];
  curStates: any = [
    {
      value: 0,
      label: "未启用"
    },
    {
      value: 1,
      label: "已启用"
    },
    {
      value: 2,
      label: "已停用"
    }
  ];
  domain: string = "";
  channelStartEnd: number = 0;

  dialogBatch: boolean = false;
  oldDomain: string = "";
  newDomain: string = "";
  oldWebDomain: string = "";
  newWebDomain: string = "";
  newGameUrlFlag: boolean = false;
  //csv转换
  intCSV(data) {
    this.addChannelCSV = data.csvStr;
  }
  //批量处理
  isDbatch() {
    this.dialogBatch = true;
  }
  cancelBatch() {
    this.dialogBatch = false;
  }
  async EnableShieldByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableShield: this.curEnableShield
    };
    await myDispatch(this.$store, "EnableShieldByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableStatusJmpByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableStatusJmp: this.curEnableStatusJmp
    };
    await myDispatch(this.$store, "EnableStatusJmpByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableBanMasterByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableBanMaster: this.curEnableBanMaster
    };
    await myDispatch(this.$store, "EnableBanMasterByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableReportAgentByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableReportAgent: this.curEnableReportAgent
    };
    await myDispatch(this.$store, "EnableReportAgentByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableRechargeEnforceByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableRechargeEnforce: this.curEnableRechargeEnforce
    };
    await myDispatch(this.$store, "EnableRechargeEnforceByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableOnlineRechargeByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableOnlineRecharge: this.curEnableOnlineRecharge
    };
    await myDispatch(this.$store, "EnableOnlineRechargeByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableLowerBonusByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableLowerBonus: this.curEnableLowerBonus
    };
    await myDispatch(this.$store, "EnableLowerBonusByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async EnableTyShieldByChannelsConfirm() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    if (this.curChannel === "all") {
      this.$confirm("此操作将修改此账号角色,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    }
    let channels = this.curChannel.split(",");
    let data = {
      // wxs :this.curWX?this.curWX.split(","):undefined,
      pid: this.addPid,
      channels: channels,
      enableTyShield: this.curEnableTyShield
    };
    await myDispatch(this.$store, "EnableTyShieldByChannels", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      //   this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  //代理微信
  async confirmWX() {
    if (!this.curChannel) {
      this.$message({
        type: "error",
        message: "渠道未填写",
        duration: 1500
      });
      return;
    }
    let channels = this.curChannel.split(",");
    let data = {
      pid: this.addPid,
      channels: channels,
      wxs: this.curWX.trim() ? this.curWX.split(",") : undefined
    };
    await myDispatch(this.$store, "FixWXByBatch", data);
    if (this.channelShield.eidtCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1500
      });
      this.dialogBatch = false;
      this.loadData();
      return;
    }
    this.$message({
      type: "error",
      message: `操作失败${this.channelShield.msg}`,
      duration: 1500
    });
  }
  async changeChannelDomain() {
    if (!this.oldDomain || !this.newDomain) {
      this.$message({
        type: "error",
        message: "原域名和新域名必填",
        duration: 1500
      });
      return;
    }
    this.$confirm("此操作将修改代理后台推广页,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let data = {
          oldDomain: this.oldDomain,
          newDomain: this.newDomain,
          newGameUrlFlag: false
        };
        await myDispatch(this.$store, "ChangeDomain", data);
        if (this.channelShield.eidtCode === 200) {
          this.$message({
            type: "success",
            message: "修改成功",
            duration: 1500
          });
          this.dialogBatch = false;
          this.loadData();
          return;
        }
        this.$message({
          type: "error",
          message: `操作失败${this.channelShield.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }
  async changeChannelWebDomain() {
    if (!this.oldWebDomain || !this.newWebDomain) {
      this.$message({
        type: "error",
        message: "原域名和新域名必填",
        duration: 1500
      });
      return;
    }
    this.$confirm("此操作将修改游戏内主页,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let data = {
          oldDomain: this.oldWebDomain,
          newDomain: this.newWebDomain,
          newGameUrlFlag: true
        };
        await myDispatch(this.$store, "ChangeWeb", data);
        if (this.channelShield.eidtCode === 200) {
          this.$message({
            type: "success",
            message: "修改成功",
            duration: 1500
          });
          this.dialogBatch = false;
          this.loadData();
          return;
        }
        this.$message({
          type: "error",
          message: `操作失败${this.channelShield.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }
  async delChannelDomain() {
    if (!this.oldWebDomain) {
      this.$message({ type: "error", message: "原域名必填", duration: 1500 });
      return;
    }
    this.$confirm("此操作将删除游戏内主页,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let data = { oldDomain: this.oldWebDomain };
        await myDispatch(this.$store, "DelDomain", data);
        if (this.channelShield.eidtCode === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 1500
          });
          this.dialogBatch = false;
          this.loadData();
          return;
        }
        this.$message({
          type: "error",
          message: `操作失败${this.channelShield.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }
  //批量修改游戏内主页
  async confirmWebUrl() {
    if (!this.curChannel) {
      this.$message({ type: "error", message: "渠道未填写", duration: 1500 });
      return;
    }
    if (!this.curWebUrl) {
      this.$message({ type: "error", message: "域名未填写", duration: 1500 });
      return;
    }
    this.$confirm("此操作将批量修改游戏内主页,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let channels = this.curChannel.split(",");
        let data = {
          pid: this.addPid,
          channels: channels,
          url: this.curWebUrl.trim(),
          gameUrlFlag: true
        };
        await myDispatch(this.$store, "ChangeManyWeb", data);
        if (this.channelShield.eidtCode === 200) {
          this.$message({
            type: "success",
            message: "修改成功",
            duration: 1500
          });
          this.dialogBatch = false;
          this.loadData();
          return;
        }
        this.$message({
          type: "error",
          message: `操作失败${this.channelShield.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }
  async getExcel() {
    this.fatherChannels = [{ value: "", label: "全部" }];
    await myDispatch(this.$store, "GetChannelFather", { pid: this.pid }, true);
    this.channelShield.fatherChannels.forEach(e => {
      let temp = {
        value: e,
        label: e
      };
      this.fatherChannels.push(temp);
    });

    let tmp: any = { pid: this.pid };
    if (this.channelId.trim()) {
      tmp.channel = this.channelId;
    }
    if (this.channelType.trim()) {
      tmp.type = parseInt(this.channelType);
    }
    if (this.fatherChannel.trim()) {
      tmp.father = this.fatherChannel;
    }
    if (this.state !== -1) {
      tmp.state = this.state;
    }
    let ret = await myAsyncFn(getChannelShieldsExcel, tmp);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "创建导出任务成功！"
      });
    }
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  async getFather() {
    this.fatherChannels = [{ value: "", label: "全部" }];
    await myDispatch(this.$store, "GetChannelFather", { pid: this.pid }, true);
    this.channelShield.fatherChannels.forEach(e => {
      let temp = {
        value: e,
        label: e
      };
      this.fatherChannels.push(temp);
    });
  }
  loadData() {
    let tmp: any = { pid: this.pid };
    if (this.channelId.trim()) {
      tmp.channel = this.channelId;
    }
    if (this.channelType.trim()) {
      tmp.type = parseInt(this.channelType);
    }
    if (this.fatherChannel.trim()) {
      tmp.father = this.fatherChannel;
    }
    if (this.state !== -1) {
      tmp.state = this.state;
    }
    (tmp.page = this.page), (tmp.count = this.count);
    myDispatch(this.$store, "GetChannelShield", tmp, true).then(data => {
      this.totalCount = this.channelShield.totalCount;
    });
  }
  //获取查询条件
  getQueryItem(pid) {
    let temp: QueryItem = { pid: pid };
    temp.page = this.page;
    temp.count = this.count;
    if (this.logTime && this.logTime.length === 2) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }

  getExportQueryItem(pid) {
    let temp: QueryItem = { pid: pid };

    if (this.logTime && this.logTime.length === 2) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }

  stateFormat(row, column) {
    if (row.state === 0) {
      return "未启用";
    } else if (row.state === 1) {
      return "已启用";
    } else if (row.state === 2) {
      return "已关闭";
    }
  }

  tYStateFormat(row, column) {
    return row.enableTyShield ? "未开启" : "已开启";
  }

  addAgencyChannel() {
    myDispatch(this.$store, "GetChannelShield", { pid: this.pid }, true).then(
      () => {}
    );
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
  channelFormat(row, column) {
    if (row.channel === "") {
      return "官方";
    } else {
      return row.channel;
    }
  }

  enableShieldFormat(row, column) {
    if (row.enableShield) {
      return "开";
    } else {
      return "关";
    }
  }
  enableStatusJmpFormat(row, column) {
    if (row.enableStatusJmp) {
      return "开";
    } else {
      return "关";
    }
  }
  enableBanMasterFormat(row, column) {
    if (row.enableBanMaster) {
      return "开";
    } else {
      return "关";
    }
  }
  enableReportAgentFormat(row, column) {
    if (row.enableReportAgent) {
      return "开";
    } else {
      return "关";
    }
  }
  enableRechargeEnforceFormat(row, column) {
    if (row.enableRechargeEnforce) {
      return "开";
    } else {
      return "关";
    }
  }
  enableOnlineRechargeFormat(row, column) {
    if (row.enableOnlineRecharge) {
      return "开";
    } else {
      return "关";
    }
  }
  enableLowerBonusFormat(row, column) {
    if (row.enableLowerBonus) {
      return "开";
    } else {
      return "关";
    }
  }
  wxsFormat(row, column) {
    if (row.wxs && row.wxs.length) {
      return row.wxs.join(",");
    } else {
      return "-";
    }
  }

  typeFormat(row, column) {
    if (row.type === 1) {
      return "全民代理";
    } else if (row.type === 0) {
      return "普通渠道";
    }
  }

  enbaleShowChannelAgentFormat(row, column) {
    if (row.enbaleShowChannelAgent) {
      return "开";
    } else {
      return "关";
    }
  }
  del(index, row) {
    this.$confirm("此操作将永久删除该渠道, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeleteChannelShield", {
          channel: row.channel,
          pid: row.pid
        })
          .then(result => {
            if (this.channelShield.deleteCode === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
            } else {
              this.$message({
                type: "error",
                message: this.channelShield.msg
              });
            }
          })
          .catch(ex => {
            console.error(ex);
            this.$message({
              type: "error",
              message: ex.message
            });
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  cancelStages() {
    this.dialogAdd = false;
  }

  confirmStages() {
    let temp: any = {};
    let dataArr: any = this.addChannelCSV;
    if (dataArr.length === 0) {
      this.$message({
        type: "error",
        message: "请选择csv文件！"
      });
      return;
    }
    let dataTrArr: any = [];
    for (let k in dataArr) {
      let tr = dataArr[k];
      if (tr && tr.length !== 6) {
        this.$message({
          type: "error",
          message:
            "渠道号,ios下载地址,安卓下载地址,模版名称,落地页入口域名,地推域名都为必填！"
        });
        return;
      }
      if (tr) {
        let insertData = {
          channel: tr[0],
          iosUrl: tr[1],
          adrUrl: tr[2],
          dlTmpl: tr[3],
          qrUrl: tr[4],
          gpUrl: tr[5]
        };
        dataTrArr.push(insertData);
      }
    }
    temp.channelInfo = dataTrArr;
    temp.type = this.curType;
    temp.wxs = this.curWX.trim() ? this.curWX.split(",") : undefined;
    temp.enableTyShield = this.curEnableTyShield;
    temp.enableShield = this.curEnableShield;
    temp.enableStatusJmp = this.curEnableStatusJmp;
    temp.enableBanMaster = this.curEnableBanMaster;
    temp.enableReportAgent = this.curEnableReportAgent;
    temp.enableRechargeEnforce = this.curEnableRechargeEnforce;
    temp.enableOnlineRecharge = this.curEnableOnlineRecharge;
    temp.enableLowerBonus = this.curEnableLowerBonus;
    temp.state = this.curState;
    temp.pid = this.addPid;
    temp.webState = this.curGameUrl;
    if (this.curFather && this.curFather.trim()) {
      temp.father = this.curFather;
    }

    let have = this.channelShield.fatherChannels.indexOf(this.curFather);
    if (have === -1) {
      this.$confirm("此操作会新添一个父渠道，是否确认添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$confirm("是否确认添加?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            myDispatch(this.$store, "AddChannelShield", temp)
              .then(msg => {
                if (this.channelShield.addCode == 200) {
                  this.$message({
                    type: "success",
                    message: "数据添加成功",
                    duration: 1500
                  });
                  this.dialogAdd = false;
                  this.loadData();
                  return;
                }
                this.$message({
                  type: "error",
                  message: "数据添加失败" + this.channelShield.msg,
                  duration: 1500
                });
              })
              .catch(ex => {
                this.$message({
                  message: ex.message,
                  duration: 1500
                });
                this.newchannel = "";
                this.shield = false;
                this.alias = false;
                this.dialogAdd = false;
                return;
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      });
    } else {
      this.$confirm("是否确认添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          myDispatch(this.$store, "AddChannelShield", temp)
            .then(msg => {
              if (this.channelShield.addCode == 200) {
                this.$message({
                  type: "success",
                  message: "数据添加成功",
                  duration: 1500
                });
                this.dialogAdd = false;
                this.loadData();
                return;
              }
              this.$message({
                type: "error",
                message: "数据添加失败" + this.channelShield.msg,
                duration: 1500
              });
              return;
            })
            .catch(ex => {
              this.$message({
                message: ex.message,
                duration: 1500
              });
              this.newchannel = "";
              this.shield = false;
              this.alias = false;
              this.dialogAdd = false;
              return;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }

  addChannelShield() {
    this.curChannel = "";
    this.curType = "0";
    this.curEnableTyShield = false;
    this.curEnableShield = false;
    this.curEnableStatusJmp = false;
    this.curEnableBanMaster = false;
    this.curEnableReportAgent = false;
    this.curEnableRechargeEnforce = false;
    this.curEnableOnlineRecharge = false;
    this.curEnableLowerBonus = false;
    this.curFather = "";
    this.curState = 0;
    this.dialogAdd = true;
    this.addChannelCSV = "";
    this.curGameUrl = false;
  }

  handleEdit(index, row) {
    this.dialogEditVisible = true;
    this.addPid = row.pid;
    this.curWX = row.wxs ? row.wxs.join(",") : "";
    this.curChannel = row.channel;
    this.curWeb = row.web;
    this.curType = this.typeFormat(row, index) || "-";
    this.curEnableShield = row.enableShield;
    this.curEnableTyShield = row.enableTyShield;
    this.curEnableStatusJmp = row.enableStatusJmp;
    this.curEnableBanMaster = row.enableBanMaster;
    this.curEnableReportAgent = row.enableReportAgent;
    this.curEnableRechargeEnforce = row.enableRechargeEnforce;
    this.curEnableOnlineRecharge = row.enableOnlineRecharge;
    this.curEnableLowerBonus = row.enableLowerBonus;
    this.curFather = row.father;
    this.curState = row.state;
  }

  cancelEdit() {
    this.dialogEditVisible = false;
  }

  update() {
    let temp: any = {};
    temp.channel = this.curChannel;
    temp.pid = this.addPid;
    temp.wxs = this.curWX.trim() ? this.curWX.split(",") : undefined;
    temp.enableTyShield = this.curEnableTyShield;
    temp.enableShield = this.curEnableShield;
    temp.enableStatusJmp = this.curEnableStatusJmp;
    temp.enableBanMaster = this.curEnableBanMaster;
    temp.enableReportAgent = this.curEnableReportAgent;
    temp.enableRechargeEnforce = this.curEnableRechargeEnforce;
    temp.enableOnlineRecharge = this.curEnableOnlineRecharge;
    temp.enableLowerBonus = this.curEnableLowerBonus;
    temp.state = this.curState;
    if (this.curWeb && this.curWeb.trim()) {
      temp.web = this.curWeb;
    }
    if (this.curFather && this.curFather.trim()) {
      temp.father = this.curFather;
    }

    this.$confirm("此操作将修改该渠道", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$store
          .dispatch("EditChannelShield", temp)
          .then(() => {
            if (this.channelShield.eidtCode === 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.dialogEditVisible = false;
              this.loadData();
              return;
            }
            this.$message({
              type: "error",
              message: "修改失败!" + this.channelShield.msg
            });
            return;
          })
          .catch(ex => {
            console.error(ex);
            this.$message({
              type: "error",
              message: ex.message
            });
            this.dialogEditVisible = false;
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  close() {
    this.curChannel = "";
    this.curWX = "";
    this.curWeb = "";
    this.curGo = "";
    this.curSwitch = "";
    this.curFather = "";
    this.curType = "";
    this.curState = 0;
    this.curEnableTyShield = false;
    this.curEnableShield = false;
    this.curEnableStatusJmp = false;
    this.curEnableBanMaster = false;
    this.curEnableReportAgent = false;
    this.curEnableRechargeEnforce = false;
    this.curEnableOnlineRecharge = false;
    this.curEnableLowerBonus = false;
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
  async downloadUrls() {
    await myDispatch(
      this.$store,
      "GetDownloadUrls",
      { pid: this.downloadPid, domain: this.LandingURL },
      true
    ).then(() => {
      let tempArr = this.channelShield.downloadUrlsData;
      let urlArr: any[] = [];
      if (tempArr) {
        tempArr.map(item => {
          urlArr.push(item.downloadUrl);
        });
        this.createQRCode(urlArr);
      }
    });
  }
  createQRCode(arr) {
    var zip = new JSZip();
    let self = this;
    //var img = zip.folder("images");
    let bianli = new Promise(resolve => {
      arr.map((item, index) => {
        var filename = item.split("/").pop();
        if (!filename.includes(".html")) {
          console.error(item + "未包含有效文件名");
          return;
        }
        filename = filename.replace(".html", "");
        QRCode.toDataURL(item)
          .then(url => {
            let realImg = url.split(",")[1];
            zip.file(`${filename}.jpg`, realImg, { base64: true });
            if (index == arr.length - 1) {
              resolve();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    });
    bianli.then(() => {
      zip.generateAsync({ type: "blob" }).then(function(content) {
        // see FileSaver.js
        FileSaver.saveAs(content, "QRCode.zip");
        self.$message({
          message: "二维码已打包下载中",
          type: "success"
        });
      });
    });
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
  margin: 0px 50px 10px 0;
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
