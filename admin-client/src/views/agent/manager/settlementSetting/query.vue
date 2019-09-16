<template>
	<el-row class="query-content">
    <el-col :span="24">
      <el-input placeholder="输入推广ID查询" class="query-input" v-model="queryModel.uid">
        <template slot="prepend">推广ID</template>
      </el-input>
      <div class="query-input-double">
        <el-input class="query-input-left" v-model="queryModel.downTaxRate">
          <template slot="prepend">下级税收</template>        
        </el-input>
          <span class="query-title-center">到</span>        
          <el-input class="query-input-right" v-model="queryModel.toDownTaxRate"></el-input>
      </div>
      <el-button @click="loadData()">搜索</el-button>
    </el-col>
    <el-dialog title="添加代理" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="agentModel.agent">
        <el-form-item label="代理名字" :label-width="formLabelWidth">
          <el-input v-model="agentModel.agent.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏ID" :label-width="formLabelWidth">
          <el-input v-model="agentModel.agent.gameId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ" :label-width="formLabelWidth">
          <el-input v-model="agentModel.agent.QQ" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="agentModel.agent.mobileNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="利润比例" :label-width="formLabelWidth">
          <el-input type="number" v-model="agentModel.agent.taxRate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="agentModel.agent.remarks" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取消</el-button>
        <el-button type="primary" @click="dialogOK()">确定</el-button>
      </span>
    </el-dialog>
  </el-row>  
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AgentQueryModel, AgentModel } from "../../../../store/stateInterface";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class agentManagerQuery extends Vue {
  queryModel: AgentQueryModel = this.$store.state.agentQueryModel;
  agentModel: AgentModel = this.$store.state.agentModel;
  dialogFormVisible: boolean = false;
  formLabelWidth: string = "80px";

  created() {
    this.loadData();
  }

  loadData() {
    this.$store.dispatch("getAgentList", this.queryModel);
  }

  dialogCancel() {
    this.dialogFormVisible = false;
    this.$store.dispatch("initAgentVal");
  }
  dialogOK() {
    if (!this.agentModel.agent) {
      return;
    }
    if (this.agentModel.agent.userName == "") {
      this.$message({ type: "error", message: "请输入代理名字!" });
      return;
    }
    if (this.agentModel.agent.userName == "") {
      this.$message({ type: "error", message: "请输入手机号!" });
      return;
    }
    this.$store
      .dispatch("addAgent", this.agentModel.agent)
      .then(() => {
        if (this.agentModel.code === 200) {
          this.$message({ type: "success", message: "添加成功!" });
          this.loadData();
          this.dialogCancel();
          return;
        } else {
          this.$message({ type: "error", message: this.agentModel.msg });
          return;
        }
      })
      .catch(err => {
        this.$message({ type: "error", message: err });
        return;
      });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.query-content {
  padding: 15px 10px;
  .query-input {
    width: 250px;
  }
  .query-input-double {
    display: inline-block;
    position: relative;
    width: 252px;

    .query-input-left input {
      width: 60px;
      padding-right: 5px;
      border-right: none;
      border-color: #dcdfe6;
    }
    .query-input-right {
      position: absolute;
      left: 180px;
      top: 0;
      width: 70px;
      input {
        width: 70px;
        padding-right: 5px;
        border-left: none;
        border-color: #dcdfe6;
      }
    }
    .query-title-center {
      position: absolute;
      left: 145px;
      z-index: 200;
      top: 0;
      padding: 8px 15px;
      display: block;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
    }
  }
  .add-agent {
    float: right;
  }
}
</style>
