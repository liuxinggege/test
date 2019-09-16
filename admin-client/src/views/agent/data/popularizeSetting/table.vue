<template>
    <el-card class="dashboard-second">
		<!--列表-->
        <el-table :data="agentModel.agentList" border highlight-current-row style="width: 100%;margin: 20px 0">
            <el-table-column prop="uid" label="代理ID" align="center" ></el-table-column>
            <el-table-column prop="userName" label="代理名称" align="center"></el-table-column>
            <el-table-column prop="grade" label="推广等级" align="center"></el-table-column>
            <el-table-column prop="QRCode" label="推广二维码" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    <img :src="scope.row.imgQRCode" width="120px" height="120px" />
                  </div>
                  <img :src="scope.row.imgQRCode" width="30px" height="30px" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="xcyUrl" label="宣传页下载" align="center"></el-table-column>
            <el-table-column prop="platform" label="渠道号" align="center"></el-table-column>
            <el-table-column prop="mobileNum" label="手机号" align="center"></el-table-column>
            <el-table-column prop="pwd" label="后台密码"  align="center"></el-table-column>
            <el-table-column prop="tgUrl" label="推广地址" align="center"></el-table-column>
           	<el-table-column label="创建时间" align="center" :formatter="initDateStr"> </el-table-column>
            <el-table-column label="操作" min-width="80" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="updateAgent(scope.row)">修改</el-button>
                  <!-- <el-button type="text" @click="export2Excel(scope.row)">生成Excel</el-button> -->
                  <!-- <el-button type="text" @click="deleteAgent(scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>  
		<div class="pagination-container">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryModel.page"
				:page-sizes="[10,20,30, 50]" :page-size="queryModel.count" layout="total, sizes, prev, pager, next, jumper" :total="agentModel.total">
			</el-pagination>
		</div>
    <el-dialog title="编辑代理" :visible.sync="dialogFormVisible" class="agent-edit-content" width="35%">
      <el-form :model="agentModel.agent" label-width="120px">
        <el-form-item label="代理名字">
            <el-input v-model="agentModel.agent.userName"></el-input>
        </el-form-item>
                <el-form-item label="游戏ID">
                    <el-input v-model="agentModel.agent.gameId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="QQ">
                    <el-input v-model="agentModel.agent.QQ" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="agentModel.agent.mobileNum" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="推广等级">
                    <el-input type="number" v-model="agentModel.agent.grade"></el-input>
                </el-form-item>
                <el-form-item label="推广地址">
                    <el-input placeholder="输入下载地址" v-model="agentModel.agent.tgUrl"></el-input>
                </el-form-item>
				<el-form-item label="渠道号">
                    <el-input placeholder="输入渠道号" v-model="agentModel.agent.platform"></el-input>
                </el-form-item>
                <el-form-item label="二维码">
                    <el-input @input="changeQRCode" placeholder="输入下载地址" v-model="agentModel.agent.QRCode"></el-input>
                    <canvas id="canvas" style="display:none"></canvas>
                    <img :src="agentModel.agent.imgQRCode" />
                </el-form-item>
                <el-form-item label="宣传页地址">
                    <el-input placeholder="输入宣传页地址" v-model="agentModel.agent.xcyUrl"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="2" v-model="agentModel.agent.remarks"></el-input>
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
import { AgentQueryModel, AgentModel } from "../../../../store/stateInterface";
import QRCode from "qrcode";
import { export_json_to_excel } from "../../../../vendor/Export2Excel.js";
import { formUtil } from "../../../../utils/formatUtils";

@Component
export default class agentManagerTable extends Vue {
  agentModel: AgentModel = this.$store.state.agentModel;
  queryModel: AgentQueryModel = this.$store.state.agentQueryModel;
  dialogFormVisible: boolean = false;

  created() {}
  handleCurrentChange(val) {
    this.queryModel.page = val;
    this.loadData();
  }

  initDateStr(row, column) {
    return formUtil.getDateYYYYMMDDHHmmss(row.createTime);
  }

  handleSizeChange(val) {
    this.queryModel.count = val;
    this.loadData();
  }

  updateAgent(d) {
    this.agentModel.agent = d;
    this.dialogFormVisible = true;
  }
  export2Excel(d) {
    export_json_to_excel(
      [
        "",
        "推广ID",
        "推广员名字",
        "游戏ID",
        "下级利润比",
        "自己利润比",
        "手机号",
        "QQ",
        "推广地址",
        "二维码下载"
      ],
      [
        [
          "1",
          d.uid,
          d.userName,
          d.gameId,
          d.downTaxRate,
          d.taxRate,
          d.mobileNum,
          d.QQ,
          d.tgUrl,
          d.QRCode
        ]
      ]
    );
  }

  changeQRCode() {
    QRCode.toDataURL(this.agentModel.agent.QRCode)
      .then(url => {
        this.agentModel.agent.imgQRCode = url;
      })
      .catch(err => {
        console.error(err);
      });
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
      .dispatch("updateAgent", this.agentModel.agent)
      .then(() => {
        if (this.agentModel.code === 200) {
          this.$message({ type: "success", message: "添加成功!" });
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

  deleteAgent(d) {
    this.$store
      .dispatch("deleteAgent", d)
      .then(() => {
        if (this.agentModel.code === 200) {
          this.$message({ type: "success", message: "删除成功!" });
          this.loadData();
          return;
        } else {
          this.$message({ type: "error", message: "操作失败!" });
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
