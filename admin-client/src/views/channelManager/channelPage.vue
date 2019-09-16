<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道落地页配置"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">渠道落地页配置</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>渠道ID</span>
        <el-input v-model="channelId" :clearable="true" style="width:120px; margin:0 10px"></el-input>
        <span>secret</span>
        <el-input v-model="secret" :clearable="true" style="width:180px; margin:0 10px"></el-input>
        <span>入口地址</span>
        <el-input v-model="qrUrls" :clearable="true" style="width:180px; margin:0 10px"></el-input>
        <span>跳转地址</span>
        <el-input v-model="dlUrls" :clearable="true" style="width:180px; margin:0 10px"></el-input>
        <span>类型</span>
        <el-select v-model="channelType" placeholder="全部" style="width:150px; margin:0 10px;">
          <el-option v-for="item in channelTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button type="success" @click="getExcel">导出EXCEL</el-button>
        <el-button type="primary" style=" margin:0 20px" @click="isDbatch">批量修改</el-button>
      </span>
      <div style="margin-top:10px;">
        <span style="margin:5px 20px 0 0">入口地址:</span>
        <span>原域名:</span>
        <el-input v-model="oldDomain" style="width:200px; margin:0 10px"></el-input>
        <span>新域名:</span>
        <el-input v-model="newDomain" style="width:200px; margin:0 10px"></el-input>
        <el-button type="primary" @click="changeChannelDomain">修改</el-button>
        <br>
        <br>
        <span style="margin:5px 20px 0 0">修改普通渠道入口地址:</span>
        <span>原域名:</span>
        <el-input v-model="oldGD" style="width:200px; margin:0 10px"></el-input>
        <span>新域名:</span>
        <el-input v-model="newGD" style="width:200px; margin:0 10px"></el-input>
        <span>是否同时修改游戏内主页:</span>
        <el-checkbox style="margin:0 10px" v-model="isChangeWeb"></el-checkbox>
        <el-button type="primary" @click="changeGD">修改</el-button>
        <br>
        <br>
        <span>跳转地址:</span>
        <el-input v-model="toUrl" style="width:200px; margin:0 10px"></el-input>
        <el-button type="primary" @click="changeUrl">修改</el-button>
        <br>
        <br>
        <span style="margin:5px 20px 0 0">地推域名更换:</span>
        <span>原地推域名:</span>
        <el-input v-model="oldGPDomain" style="width:200px; margin:0 10px"></el-input>
        <span>新地推域名:</span>
        <el-input v-model="newGPDomain" style="width:200px; margin:0 10px"></el-input>
        <el-button type="primary" @click="changeGroundPushDomain">修改</el-button>
        <br>
        <br>
        <span style="margin:5px 20px 0 0">ios下载地址批量替换:</span>
        <span>原地址:</span>
        <el-input v-model="oldIosUrl" style="width:450px; margin:0 10px"></el-input>
        <span>新地址:</span>
        <el-input v-model="newIosUrl" style="width:450px; margin:0 10px"></el-input>
        <el-button type="primary" @click="changeIosurl">修改</el-button>
        <br>
        <br>
        <span style="margin:5px 20px 0 0">安卓下载地址批量替换:</span>
        <span>原地址:</span>
        <el-input v-model="oldAndUrl" style="width:450px; margin:0 10px"></el-input>
        <span>新地址:</span>
        <el-input v-model="newAndUrl" style="width:450px; margin:0 10px"></el-input>
        <el-button type="primary" @click="changeAndUrl">修改</el-button>
        <br>
        <br>
        <span>批量导出二维码下载：</span>
        <span>项目</span>
        <el-select v-model="downloadPid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>落地页域名</span>
        <el-input v-model="LandingURL" style="width:120px; margin:0 10px 20px 10px"></el-input>
        <el-button type="primary" @click="downloadUrls">批量导出下载</el-button>
      </div>
      <!--列表-->
      <el-table :data="channelPage.channelPageData" border>
        <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="channel" label="渠道" min-width="100" align="center" :formatter="channelFormat"></el-table-column>
        <el-table-column prop="type" label="类型" min-width="100" align="center" :formatter="typeFormat"></el-table-column>
        <el-table-column prop="dlUrls" label="跳转地址" min-width="200" align="center"></el-table-column>
        <el-table-column label="入口地址" min-width="200" align="left">
          <template slot-scope="scope">
            <div style="display:inline-block;text-align:left;" v-for="(item,index) in scope.row.qrUrls" :key="index">
              <p>域名：{{item.url}}</p>
              <p>落地页地址：{{item.longUrl}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地推域名" min-width="200" align="left">
          <template slot-scope="scope">
            <div style="display:inline-block;text-align:left;" v-for="(item,index) in scope.row.gpUrls" :key="index">
              <p>域名：{{item.url}}</p>
              <p>落地页地址：{{item.longUrl}}</p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="oldGroundPushDomain" label="地推域名" min-width="80" align="center">
          <template slot-scope>地推域名字段使用 scope.row.oldGroundPushDomain</template>
        </el-table-column>-->
        <el-table-column label="详情" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
          <br>
          <el-form-item label="落地页">
            <el-input type="textarea" :rows="3" v-model="curDownloadUrl"></el-input>以英文逗号分隔
          </el-form-item>
          <el-button @click="editUrl">修改</el-button>
        </el-form>
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
            <span>代理后台推广页</span>
            <el-input type="textarea" :rows="3" v-model="curUrl" style="width:200px; margin:0 10px"></el-input>
            <el-button type="primary" style="margin:10px 20px;" @click="confirmUrl">确认</el-button>以英文逗号分隔
          </div>
        </el-form>
        <!-- <el-button style="margin:0px 0px 10px 300px" @click="cancelBatch">取 消</el-button> -->
      </el-dialog>
      <!--详情-->
      <el-dialog :visible.sync="dialogDetail">
        <p>
          <span>项目：{{addPidFormat(this.addDlInfosPid)}}，</span>
          <span>渠道：{{addChannelFormat(this.addDlInfosChannel)}}</span>
        </p>
        <el-button type="primary" style="margin:10px 0px;" @click="showAdd">添加</el-button>
        <el-table :data="detailData.dlInfos" border>
          <el-table-column prop="iosUrl" label="ios下载地址" min-width="200" align="center"></el-table-column>
          <el-table-column prop="adrUrl" label="安卓下载地址" min-width="200" align="center"></el-table-column>
          <el-table-column prop="dlTmpl" label="模版名称" min-width="80" align="center"></el-table-column>
          <el-table-column prop="secret" label="secret" min-width="120" align="center"></el-table-column>
          <el-table-column label="操作" min-width="80" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="showEdit(scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--添加-->
      <el-dialog :visible.sync="dialogAdd" @close="close" width="700px">
        <el-form :inline="false" class="small-space" label-position="left" label-width="100px" style="width:500px; margin-left:30px;">
          <el-form-item label="项目:">
            <span>{{addPidFormat(this.addDlInfosPid)}}</span>
          </el-form-item>
          <el-form-item label="渠道:">
            <span>{{addChannelFormat(this.addDlInfosChannel)}}</span>
          </el-form-item>
          <el-form-item label="模版名称:">
            <el-select style="margin:0 10px" v-model="addDlInfosDlTmpl" placeholder="请选择项目">
              <el-option v-for="item in dlTmplOpts" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ios下载地址:">
            <el-input type="text" v-model="addDlInfosIosUrl" style="width:450px; margin:0 10px"></el-input>
          </el-form-item>
          <el-form-item label="安卓下载地址:">
            <el-input type="text" v-model="addDlInfosAdrUrl" style="width:450px; margin:0 10px"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin:0px 0px 10px 520px" @click="addConfirm">确定</el-button>
      </el-dialog>
      <!--修改-->
      <el-dialog :visible.sync="dialogEdit" @close="close" width="700px">
        <el-form :inline="false" class="small-space" label-position="left" label-width="100px" style="width:500px; margin-left:30px;">
          <el-form-item label="项目:">
            <span>{{addPidFormat(this.addDlInfosPid)}}</span>
          </el-form-item>
          <el-form-item label="渠道:">
            <span>{{addChannelFormat(this.addDlInfosChannel)}}</span>
          </el-form-item>
          <el-form-item label="模版名称:">
            <el-select style="margin:0 10px" v-model="addDlInfosDlTmpl" placeholder="请选择项目">
              <el-option v-for="item in dlTmplOpts" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ios下载地址:">
            <el-input type="text" v-model="addDlInfosIosUrl" style="width:450px; margin:0 10px"></el-input>
          </el-form-item>
          <el-form-item label="安卓下载地址:">
            <el-input type="text" v-model="addDlInfosAdrUrl" style="width:450px; margin:0 10px"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin:0px 0px 10px 520px" @click="updateConfirm">确定</el-button>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="channelPage.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>
 
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { ChannelShieldState } from "../../store/stateInterface";
import { myAsyncFn, myDispatch } from "../../utils/index.js";
import QRCode from "qrcode";
import JSZip from "JSZip";
import FileSaver from "file-saver";
import {
  addDlInfos,
  updateDlInfos,
  getTmplByPid,
  updateIosUrl,
  updateAndrUrl,
  changeDl,
  getChannelPagesExcel,
  changeGeneralDomain,
  changeGPDomain
} from "../../api/admin/channelManager/channelManager";
interface QueryItem {
  pid: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ChannelShield extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData(); //初始化-->加载数据
  }

  /*inital data*/
  channelPage = this.$store.state.channelPage; //表单数据
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 50;
  totalCount: number = 0;
  pidList: any[] = [];
  pidListForAdd: any[] = [];
  pid: string = "A";
  downloadPid: string = "A";
  addPid: string = "";
  newchannel: string = "";
  shield: boolean = false;
  alias: boolean = false;
  dialogEditVisible: boolean = false;
  dialogDetail: boolean = false;
  detailData: object = {};
  qrUrls: string = "";
  dlUrls: string = "";
  secret: string = "";
  newIosUrl: string = "";
  oldIosUrl: string = "";
  newAndUrl: string = "";
  oldAndUrl: string = "";
  oldGD: string = "";
  newGD: string = "";
  isChangeWeb: boolean = false;
  //修改地推域名
  oldGPDomain: string = "";
  newGPDomain: string = "";
  //添加dlInfos
  dialogAdd: boolean = false;
  addDlInfosPid: string = "";
  addDlInfosChannel: string = "";
  addDlInfosIosUrl: string = "";
  addDlInfosAdrUrl: string = "";
  addDlInfosDlTmpl: string = "default";
  dlTmplOpts: any = [];
  //修改dlInfos
  dialogEdit: boolean = false;
  curSecret: string = "";

  curChannel: string = "";
  curUrl: string = "";
  curDownloadUrl: string = "";
  curTypes: any = [
    {
      value: 0,
      label: "普通渠道"
    },
    {
      value: 1,
      label: "全民代理"
    }
  ];
  channelTypes: any = [
    {
      value: "",
      label: "全部"
    },
    {
      value: 0,
      label: "普通渠道"
    },
    {
      value: 1,
      label: "全民代理"
    }
  ];
  channelId: string = "";
  LandingURL: string = ""; //落地页域名
  channelType: string = "";
  state: number = -1;
  domain: string = "";
  channelStartEnd: number = 0;

  dialogBatch: boolean = false;
  oldDomain: string = "";
  newDomain: string = "";
  oldWebDomain: string = "";
  newWebDomain: string = "";
  newGameUrlFlag: boolean = false;
  toUrl: string = "";

  changeUrl() {
    changeDl({ domain: this.toUrl }).then(res => {
      this.$message.success("修改成功");
    });
  }

  //批量处理
  isDbatch() {
    this.dialogBatch = true;
  }
  cancelBatch() {
    this.dialogBatch = false;
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
        if (this.channelPage.eidtCode === 200) {
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
          message: `操作失败${this.channelPage.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }

  //更换地推域名
  async changeGroundPushDomain() {
    if (!this.oldGPDomain || !this.newGPDomain) {
      this.$message({
        type: "error",
        message: "原地推域名和新地推域名必填",
        duration: 1500
      });
      return;
    }
    this.$confirm("此操作将修改地推域名,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let data = {
          oldDomain: this.oldGPDomain,
          newDomain: this.newGPDomain
        };
        let ret = await myAsyncFn(changeGPDomain, data);
        console.log(ret, "更换地推域名");
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }

  async changeGD() {
    if (!this.oldGD || !this.newGD) {
      this.$message({
        type: "error",
        message: "原域名和新域名必填"
      });
      return;
    }
    this.$confirm("此操作将修改普通渠道入口地址,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let data = {
          oldDomain: this.oldGD,
          newDomain: this.newGD,
          isChangeWeb: this.isChangeWeb
        };
        let ret = await myAsyncFn(changeGeneralDomain, data);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.loadData();
        }
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
        if (this.channelPage.eidtCode === 200) {
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
          message: `操作失败${this.channelPage.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }
  //批量修改落地页
  async confirmUrl() {
    if (!this.curChannel) {
      this.$message({ type: "error", message: "渠道未填写", duration: 1500 });
      return;
    }
    if (!this.curUrl) {
      this.$message({ type: "error", message: "域名未填写", duration: 1500 });
      return;
    }
    this.$confirm("此操作将批量修改代理后台推广页,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let channels = this.curChannel.split(",");
        let data = {
          pid: this.addPid,
          channels: channels,
          url: this.curUrl.trim().split(",")
        };
        await myDispatch(this.$store, "ChangeManyChannelUrl", data);
        if (this.channelPage.eidtCode === 200) {
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
          message: `操作失败${this.channelPage.msg}`,
          duration: 1500
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消修改" });
      });
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  async loadData() {
    let tmp: any = { pid: this.pid };
    if (this.channelId.trim()) {
      tmp.channel = this.channelId;
    }
    if (this.qrUrls.trim()) {
      tmp.qrUrl = this.qrUrls;
    }
    if (this.dlUrls.trim()) {
      tmp.dlUrls = this.dlUrls;
    }
    if (this.secret.trim()) {
      tmp.secret = this.secret;
    }
    if (this.channelType !== "") {
      tmp.type = parseInt(this.channelType);
    }
    if (this.state !== -1) {
      tmp.state = this.state;
    }
    (tmp.page = this.page), (tmp.count = this.count);
    myDispatch(this.$store, "GetChannelPage", tmp, true).then(data => {
      this.totalCount = this.channelPage.totalCount;
    });
  }
  async getExcel() {
    let tmp: any = { pid: this.pid };
    if (this.channelId.trim()) {
      tmp.channel = this.channelId;
    }
    if (this.qrUrls.trim()) {
      tmp.qrUrl = this.qrUrls;
    }
    if (this.dlUrls.trim()) {
      tmp.dlUrls = this.dlUrls;
    }
    if (this.secret.trim()) {
      tmp.secret = this.secret;
    }
    if (this.channelType !== "") {
      tmp.type = parseInt(this.channelType);
    }
    if (this.state !== -1) {
      tmp.state = this.state;
    }
    let ret = await myAsyncFn(getChannelPagesExcel, tmp);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "创建导出任务成功！"
      });
    }
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
  //ios下载地址批量替换
  changeIosurl() {
    if (!this.oldIosUrl || !this.newIosUrl) {
      this.$message({
        type: "error",
        message: "新旧地址不能为空！"
      });
    } else {
      this.$confirm("此操作将批量修改ios下载地址", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let req = {
            oldIosUrl: this.oldIosUrl,
            newIosUrl: this.newIosUrl
          };
          let ret = await myAsyncFn(updateIosUrl, req);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.oldIosUrl = "";
            this.newIosUrl = "";
            this.loadData();
          } else {
            this.$message({
              type: "error",
              message: ret.err
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
  //安卓下载地址批量替换
  changeAndUrl() {
    if (!this.oldAndUrl || !this.newAndUrl) {
      this.$message({
        type: "error",
        message: "新旧地址不能为空！"
      });
    } else {
      this.$confirm("此操作将批量修改安卓下载地址", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let req = {
            oldDomain: this.oldAndUrl,
            newDomain: this.newAndUrl
          };
          let ret = await myAsyncFn(updateAndrUrl, req);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.oldAndUrl = "";
            this.newAndUrl = "";
            this.loadData();
          } else {
            this.$message({
              type: "error",
              message: ret.err
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
  getExportQueryItem(pid) {
    let temp: QueryItem = { pid: pid };

    if (this.logTime && this.logTime.length === 2) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
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
  addPidFormat(pid) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === pid) {
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
  addChannelFormat(channel) {
    if (channel === "") {
      return "官方";
    } else {
      return channel;
    }
  }
  typeFormat(row, column) {
    if (row.type === 1) {
      return "全民代理";
    } else if (row.type === 0) {
      return "普通渠道";
    }
  }

  handleEdit(index, row) {
    this.dialogEditVisible = true;
    this.addPid = row.pid;

    this.curChannel = row.channel;
    let qrUrls: any = [];
    if (row.qrUrls) {
      for (let i = 0; i < row.qrUrls.length; i++) {
        let element: { url: string; secret: string } = row.qrUrls[i];
        qrUrls.push(element.url);
      }
    }
    this.curDownloadUrl = qrUrls.join(",");
  }

  cancelEdit() {
    this.dialogEditVisible = false;
  }
  editUrl() {
    let temp: any = {};
    temp.channel = this.curChannel;
    temp.pid = this.addPid;
    if (this.curDownloadUrl && this.curDownloadUrl.trim()) {
      temp.qrUrls = this.curDownloadUrl.split(",");
    }

    this.$confirm("此操作将修改该渠道的落地页", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$store
          .dispatch("UpdateOneChannel", temp)
          .then(() => {
            if (this.channelPage.eidtCode === 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.loadData();
              return;
            }
            this.$message({
              type: "error",
              message: "修改失败!" + this.channelPage.msg
            });
            return;
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
  //打开详情
  async showDetail(row) {
    let ret = await myAsyncFn(getTmplByPid, { pid: row.pid });
    if (ret.code === 200) {
      this.dialogDetail = true;
      this.detailData = row;
      this.addDlInfosPid = this.detailData["pid"];
      this.addDlInfosChannel = this.detailData["channel"];
      this.dlTmplOpts = ret.msg.tmpl;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  //添加
  showAdd() {
    this.addDlInfosIosUrl = "";
    this.addDlInfosAdrUrl = "";
    this.addDlInfosDlTmpl = "default";
    this.dialogAdd = true;
    this.addDlInfosPid = this.detailData["pid"];
    this.addDlInfosChannel = this.detailData["channel"];
  }
  async addConfirm() {
    let req = {
      pid: this.addDlInfosPid,
      channel: this.addDlInfosChannel,
      iosUrl: this.addDlInfosIosUrl,
      adrUrl: this.addDlInfosAdrUrl,
      dlTmpl: this.addDlInfosDlTmpl
    };
    if (!this.addDlInfosIosUrl && !this.addDlInfosAdrUrl) {
      this.$message({
        type: "error",
        message: "地址至少填写一个！"
      });
    } else {
      let ret = await myAsyncFn(addDlInfos, req);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "添加成功！"
        });
        this.loadData();
        this.dialogAdd = false;
        this.dialogDetail = false;
        this.addDlInfosIosUrl = "";
        this.addDlInfosAdrUrl = "";
      } else {
        this.$message({
          type: "error",
          message: ret.err
        });
      }
    }
  }
  //修改dlInfos
  showEdit(row) {
    this.dialogEdit = true;
    this.addDlInfosIosUrl = row.iosUrl;
    this.addDlInfosAdrUrl = row.adrUrl;
    this.addDlInfosDlTmpl = row.dlTmpl;
    this.curSecret = row.secret;
  }
  async updateConfirm() {
    let req = {
      pid: this.addDlInfosPid,
      channel: this.addDlInfosChannel,
      iosUrl: this.addDlInfosIosUrl,
      adrUrl: this.addDlInfosAdrUrl,
      dlTmpl: this.addDlInfosDlTmpl,
      secret: this.curSecret
    };
    if (!this.addDlInfosIosUrl && !this.addDlInfosAdrUrl) {
      this.$message({
        type: "error",
        message: "地址至少填写一个！"
      });
    } else {
      let ret = await myAsyncFn(updateDlInfos, req);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功！"
        });
        this.loadData();
        this.dialogEdit = false;
        this.dialogDetail = false;
      } else {
        this.$message({
          type: "error",
          message: ret.err
        });
      }
    }
  }
  close() {
    this.curChannel = "";
    this.curDownloadUrl = "";
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
      let tempArr = this.channelPage.downloadUrlsData;
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
