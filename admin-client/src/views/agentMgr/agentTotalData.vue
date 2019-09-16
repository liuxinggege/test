<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理总数据"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代理总数据</span>
      </el-col>
      <div class="box">
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>代理ID</span>
        <el-input v-model="agentId" style="width:120px; margin:0 10px"></el-input>
        <span>代理名称</span>
        <el-input v-model="agentName" style="width:120px; margin:0 10px"></el-input>
        <span>代理类别</span>
        <el-select v-model="agentType" placeholder="全部" style="width:120px;margin:0 10px;">
          <el-option v-for="item in agentTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>状态</span>
        <el-select v-model="state" placeholder="全部" style="margin:0 10px;width:80px">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>代理渠道</span>
        <el-input v-model="agentChannel" style="width:120px; margin:0 10px"></el-input>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 0">搜索</el-button>
        <el-button type="primary" @click="downloadExcel" style="margin:10px">导出execel</el-button>
        <el-button type="primary" @click="addAgencyBlance" style="margin:10px">批量添加奖励</el-button>
      </div>

      <br>
      <!--列表-->
      <el-table :data="agentTotalData.agentTotalDataDatas" border highlight-current-row style="width: 99%;" max-height="600">
        <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat" fixed/>
        <el-table-column prop="agencyId" label="代理ID" min-width="125" align="center" fixed/>
        <el-table-column prop="name" label="代理名称" width="120" align="center" fixed/>
        <el-table-column prop="channel" label="代理渠道" width="150" align="center" fixed/>
        <el-table-column prop="level" label="代理等级" width="100" align="center" fixed/>
        <el-table-column prop="myChannelTotalGameTax" label="直推总税收" width="120" align="center" fixed/>
        <el-table-column prop="balance" label="待结算利润" width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.balance}}</span>
            <el-button type="text" @click="editBalance(scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="totalSettleMoney" label="总提现" width="150" align="center"/>
        <el-table-column prop="totalIncome" label="总利润" width="150" align="center"/>
        <el-table-column prop="taxRate" label="利润比例" width="100" align="center"/>
        <el-table-column prop="myChannelTotalIncome" label="直推总利润" width="120" align="center"/>
        <el-table-column prop="subPromotionProfit" label="下级推广总利润" width="150" align="center"/>
        <el-table-column prop label="税收扣量" width="100" align="center"/>
        <el-table-column prop="subPromotionGameTax" label="下级总贡献税收" width="150" align="center"/>
        <el-table-column prop="parentId" label="上级代理ID" width="100" align="center"/>
        <el-table-column prop="remarks" label="备注" width="200" align="center"/>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="agentTotalData.totalCount"></el-pagination>
      </el-col>
      <!-- 小页面-->
      <el-dialog :visible.sync="dialogEditBalanceVisible" @close="close">
        <el-form class="small-space" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
          <el-form-item>代理ID：{{currAgencyId}}</el-form-item>
          <el-form-item>
            奖励金额：
            <br>
            <el-input-number :controls="false" v-model="addMoney" style="width:120px"></el-input-number>
          </el-form-item>
          <el-form-item>
            备注（请认真填写,用于代理查看）：
            <el-input v-model="remarks" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmEditAlipay">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量添加 -->
      <el-dialog :visible.sync="dialogAddList">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width:500px; margin-left:50px;">
          <el-form-item style="margin-left:120px;" label="项目:">
            <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="批量添加:">
            <span>注意：csv文件格式为，代理ID,奖励金额,备注 为一条数据。</span>
            <csvUpload @child-intCSV="intCSV"></csvUpload>
            <a style="color:blue" href="../../static/agentTotalData.csv">下载csv模版</a>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="confirmStages" @click="confirmAdd">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { myAsyncFn, myDispatch } from "../../utils/index";
import { AgentTotalDataState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { addAgencyBlanceBatch } from "../../api/admin/agentMgr/agentMgr";
import csvUpload from "../csvUpload.vue";

interface QueryItem {
  pid: string;
  agencyId?: string;
  name?: string;
  type?: string;
  page?: number;
  count?: number;
  channel?: string;
  status?: boolean;
  showRate?: boolean;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    csvUpload: csvUpload
  }
})
export default class AgentTotalData extends Vue {
  page: number = 1; //当前页
  count: number = 10;

  agentTotalData: AgentTotalDataState = this.$store.state.agentTotalData;
  pidList: any[] = [];
  pidListForAdd: any[] = [];
  pid: string = "A";
  agentId: string = "";
  agentName: string = "";
  agentType: string = "";
  state: any = "";
  agentChannel: string = "";
  showDiscount: boolean = false;
  rowBalance: string = "";
  agentTypes: any = [
    { value: "", label: "全部" },
    { value: "business", label: "商人代理" },
    { value: "general", label: "全民代理" }
  ];
  states: any = [
    { value: "", label: "全部" },
    { value: true, label: "正常" },
    { value: false, label: "冻结" }
  ];

  dialogEditBalanceVisible: boolean = false;
  addMoney: string = "";
  currAgencyId: string = "";
  remarks: string = "";
  // 批量添加
  addList: any = "";
  dialogAddList: boolean = false;
  //生命周期钩子函数
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }
  //csv转换
  intCSV(data) {
    this.addList = data.csvStr;
  }
  //初始化数据
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetAgentTotalData", queryItem, true).then(
      () => {}
    );
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  addAgencyBlance() {
    this.addList = "";
    this.dialogAddList = true;
  }
  confirmAdd() {
    let dataArr = this.addList;
    let dataTrArr: any = [];
    if(dataArr.length===0){
      this.$message({
          type: "error",
          message: "请选择csv文件！"
        });
        return;
    }
    for (let k in dataArr) {
      let tr = dataArr[k];
      if (tr.length !== 3) {
        this.$message({
          type: "error",
          message: "代理ID,奖励金额,备注都为必填"
        });
        return;
      }
      let insertData = {
        pid: this.pid,
        agencyId: tr[0],
        addMoney: tr[1],
        remarks: tr[2]
      };
      dataTrArr.push(insertData);
    }
    this.$confirm("此操作将添加代理的金额,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          addAgencyBlanceList: dataTrArr,
          pid: this.pid
        };
        let ret = await myAsyncFn(addAgencyBlanceBatch, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功！"
          });
          this.dialogAddList = false;
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
          message: "已取消添加"
        });
        this.dialogAddList = false;
      });
  }
  getQueryItem() {
    let tmp: QueryItem = { pid: this.pid };
    if (this.agentType.trim()) {
      tmp.type = this.agentType;
    }
    if (this.agentName.trim()) {
      tmp.name = this.agentName;
    }
    if (this.agentId.trim()) {
      tmp.agencyId = this.agentId;
    }
    if (this.agentChannel.trim()) {
      tmp.channel = this.agentChannel;
    }
    if (this.state !== "") {
      tmp.status = this.state;
    }
    tmp.showRate = this.showDiscount;
    return tmp;
  }

  //修改余额
  editBalance(row) {
    this.dialogEditBalanceVisible = true;
    this.rowBalance = row.balance;
    this.currAgencyId = row.agencyId;
  }
  confirmEditAlipay() {
    if (
      new BigNumber(this.rowBalance).plus(new BigNumber(this.addMoney)).lt(0)
    ) {
      this.$message({
        type: "error",
        message: "不能将代理的钱扣为负数!"
      });
      return;
    }
    if (!this.remarks.trim()) {
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入!"
      });
      return;
    }
    let tmp = {
      agencyId: this.currAgencyId,
      addMoney: this.addMoney.toString(),
      remarks: this.remarks
    };
    myDispatch(this.$store, "AddAgencyBalance", tmp).then(() => {
      if (this.agentTotalData.code == 200) {
        this.$message({
          type: "success",
          message: "操作成功！"
        });
        this.dialogEditBalanceVisible = false;
        this.loadData();
      } else {
        this.$message({
          type: "error",
          message: `操作失败，${this.agentTotalData.msg}`
        });
      }
    });
  }
  close() {
    this.addMoney = "";
    this.currAgencyId = "";
    this.remarks = "";
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
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "代理ID", field: "agencyId", type: "string" },
      { title: "代理名称", field: "name", type: "string" },
      { title: "代理渠道", field: "channel", type: "channelType" },
      { title: "代理等级", field: "level", type: "string" },
      { title: "直推总税收", field: "myChannelTotalGameTax", type: "string" },
      { title: "待结算利润", field: "balance", type: "string" },
      { title: "总提现", field: "totalSettleMoney", type: "string" },
      { title: "总利润", field: "totalIncome", type: "string" },
      { title: "利润比例", field: "taxRate", type: "string" },
      { title: "直推总利润", field: "myChannelTotalIncome", type: "string" },
      { title: "下级推广总利润", field: "subPromotionProfit", type: "string" },
      { title: "下级总贡献税收", field: "subPromotionGameTax", type: "string" },
      { title: "上级代理ID", field: "parentId", type: "string" },
      { title: "备注", field: "remarks", type: "string" }
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetAgentTotalDataExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
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
