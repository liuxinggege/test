<template>
    <el-card class="dashboard-second">
		<!--列表-->
        <el-table :data="agentModel.agentList" ref="multipleTable" border highlight-current-row style="width: 100%;margin-top: 20px">
          <!-- <el-table-column type="selection" label="批量操作" width="55"></el-table-column> -->
          <el-table-column prop="uid" label="代理推广ID" align="center" ></el-table-column>
          <el-table-column prop="userName" label="代理名称" align="center"></el-table-column>
          <el-table-column prop="grade" label="推广等级" align="center"></el-table-column>
          <el-table-column :formatter="initDateStr" label="注册时间" align="center"> </el-table-column>
          <el-table-column prop="settlementSetting" label="结算周期" align="center">
              <template slot-scope="scope">
                <span slot="content">{{scope.row.settlementSetting?scope.row.settlementSetting.name:""}}</span>
              </template>
            </el-table-column>
            <el-table-column :formatter="initSettlementTimeStr" label="结算时间" align="center"></el-table-column>
            <el-table-column prop="hystereticDays" label="滞压天数" align="center"></el-table-column>
            <el-table-column prop="settlementStatus" label="状态" align="center">
              <template slot-scope="scope">
                 <span style="color:blue" v-if="scope.row.settlementStatus===10">手动结算</span>
                 <span style="color:#409EFF" v-else-if="scope.row.settlementStatus===20">自动结算</span>
                 <span style="color:red" v-else-if="scope.row.settlementStatus===30">停止结算</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="updateAgent(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>  
		<div class="pagination-container">
			<el-pagination @selection-change="handleSelectionChange" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryModel.page"
				:page-sizes="[10,20,30, 50]" :page-size="queryModel.count" layout="total, sizes, prev, pager, next, jumper" :total="agentModel.total">
			</el-pagination>
		</div>
    <el-dialog title="编辑代理" :visible.sync="dialogFormVisible" class="agent-edit-content" width="30%">
      <el-form :model="agentModel.agent" label-width="120px">
        <el-form-item label="结算周期">
            <el-select @change="selectName" v-model="agentModel.agent.settlementSetting.val" placeholder="请选结算周期">
              <el-option v-for="item in libInitVal.settlementCycleItems" :key="item.vul" :label="item.name" :value="item.val"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="结算时间" label-width="120px">
          <el-time-picker type="fixed-time" placeholder="结算时间" v-model="agentModel.agent.settlementTime"></el-time-picker>
        </el-form-item>
        <el-form-item label="滞压天数" label-width="120px">
          <el-input type="number" placeholder="滞压天数" v-model="agentModel.agent.hystereticDays"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-select v-model="agentModel.agent.settlementStatus" placeholder="请选结算状态">
            <el-option label="手动结算" value="10"></el-option>
            <el-option label="自动结算" value="20"></el-option>
            <el-option label="停止结算" value="30"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogOK()">确定</el-button>
      </span>
    </el-dialog>
	</el-card>
    
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AgentQueryModel, AgentModel,LibInitVal } from "../../../../store/stateInterface";
import QRCode from "qrcode";
import { export_json_to_excel } from "../../../../vendor/Export2Excel.js";
import { formUtil } from "../../../../utils/formatUtils";

@Component
export default class agentManagerTable extends Vue {
  agentModel: AgentModel = this.$store.state.agentModel;
  queryModel: AgentQueryModel = this.$store.state.agentQueryModel;
  libInitVal: LibInitVal = this.$store.state.libInitVal;
  dialogFormVisible: boolean = false;
  multipleSelection: any[]=[];

  created() {
   
  }
  handleCurrentChange(val) {
    this.queryModel.page = val;
    this.loadData();
  }

  selectName(d){
    this.libInitVal.settlementCycleItems.forEach(element => {
      if(d==element.val){
        this.agentModel.agent.settlementSetting.name=element.name;
        this.agentModel.agent.settlementSetting.val=element.val;
      }
    });
  }

  handleSelectionChange(val) {
        this.multipleSelection = val;
  }

  initDateStr(row, column) {
    return formUtil.getDateYYYYMMDDHHmmss(row.createTime);
  }

  initSettlementTimeStr(row, column){
    let str=formUtil.getDateYYYYMMDDHHmmss(row.settlementTime);
    if(str){
      return str.split(" ")[1];
    }
  
    return "";
  }

  handleSizeChange(val) {
    this.queryModel.count = val;
    this.loadData();
  }

  updateAgent(d) {
     this.$store .dispatch("getSettlementCycleListBySelect")
    this.agentModel.agent = d;
    if(!this.agentModel.agent.settlementSetting){
      this.agentModel.agent.settlementSetting={
        name:"",
        val:null
      }
    }
    this.dialogFormVisible = true;
  }

  dialogOK() {
    if (!this.agentModel.agent) {
      return;
    }
    if (this.agentModel.agent.settlementSetting.name == "") {
      this.$message({ type: "error", message: "请选择结算周期!" });
      return;
    }
    if (this.agentModel.agent.settlementTime == "") {
      this.$message({ type: "error", message: "请选择结算时间!" });
      return;
    }
     if (this.agentModel.agent.hystereticDays == "") {
      this.$message({ type: "error", message: "请输入滞压天数!" });
      return;
    }
    this.$store .dispatch("updateAgentSettlementSetting", this.agentModel.agent)
    .then(() => {
        if (this.agentModel.code === 200) {
          this.$message({ type: "success", message: "操作成功!" });
          this.loadData();
          this.dialogFormVisible = false;
          return;
        } else {
          this.$message({ type: "error", message: "保存失败!" });
          return;
        }
      })
      .catch(err => {
        this.$message({ type: "error", message: err });
        return;
      });
  }

  loadData() {
    this.$store.dispatch("getAgentList", this.queryModel);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
