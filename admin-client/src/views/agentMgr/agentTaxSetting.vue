<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<div>
				<span>转账到总代</span>
				<span>项目：</span>
				<el-select v-model="pid" placeholder="请选择pid" style="width:110px">
					<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
					</el-option>
				</el-select>
			</div>
			<br>
			<el-input type="textarea" v-model="transferFromAgencyIds" :rows="10" style="width:1000px; margin:0 10px"></el-input>
			<el-button type="primary" @click="transferFromAgencyIdsToZongDai">转入至总代</el-button>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { AgentTaxSettingState } from "../../store/stateInterface";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgentTaxSetting extends Vue {
  gameTax: string = "";
  changeRate: string = "";
  currId = "";
  pidList: any[] = [];
  pid: string = "A";

  agentTaxSetting: AgentTaxSettingState = this.$store.state.agentTaxSetting;

  transferFromAgencyIds: string = "";

  transferFromAgencyIdsToZongDai() {
    let pid = this.pid;
    if (this.transferFromAgencyIds) {
      this.transferFromAgencyIds = this.transferFromAgencyIds.replace("\n", "");
      let tmp = this.transferFromAgencyIds.split(",");
      let agencyIds = tmp.map(e => parseInt(e));
      let checkIds = agencyIds.filter(e => typeof e === "number" && !isNaN(e));
      if (checkIds.length !== agencyIds.length) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请输入正确的代理id"
        });
        return;
      }
      this.$confirm(`共计${agencyIds.length}个账号是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          myDispatch(this.$store, "TransferFromAgencyIdsToZongDai", {
            fromAgencyIds: agencyIds,
            pid: pid
          })
            .then(() => {
              let code = this.$store.state.agentTaxSetting.code;
              let msg = this.$store.state.agentTaxSetting.msg;
              if (code === 200) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "成功转账:" + msg
                });
                return;
              }
              this.$message({
                showClose: true,
                type: "error",
                message: "修改失败!" + msg
              });
            })
            .catch(err => {
              console.error("err:", err);
              this.$message({
                type: "error",
                message: "操作失败!"
              });
              return;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  }

  //生命周期钩子函数
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }


  close() {
    this.gameTax = "";
    this.changeRate = "";
    this.currId = "";
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
