<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="举报配置">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">
				<b>举报配置</b>
			</span>
			<div style="margin:10px 10px 10px 40px">
				<div style="margin:10px 10px 10px 40px">
					<el-button type="primary" style="margin:0 10px 10px 0" @click="getReport"> 读取
					</el-button>
				</div>
				<el-table :data="report.list" border highlight-current-row style="margin: 20px 0">
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
							<el-button type='text' icon='el-icon-edit' @click="editReport(scope.row)"></el-button>
						</template>
					</el-table-column>
					<el-table-column prop="pid" label="项目" min-width="70" align="center" :formatter="pidFormat">
					</el-table-column>
					<el-table-column prop="switch" label="举报总开关" min-width="100" align="center">
						<template slot-scope="scope">
							{{scope.row.switch?"开":"关"}}
						</template>
					</el-table-column>
					<el-table-column prop="bonus" label="举报奖励" min-width="70" align="center">
					</el-table-column>
					<el-table-column prop="wx" label="微信" min-width="170" align="center">
					</el-table-column>
				</el-table>
			</div>
			<el-dialog :visible.sync="editFlag" width=900px>
				<div>
					<el-checkbox style="width:300px; margin:15px 30px 10px 220px" label="举报总开关" border v-model="tmp_switch"></el-checkbox>
				</div>
				<div>
					<span style="font-size:12pt; margin:0px 0px 10px 121px">举报奖励</span>
					<el-input type='text' style='width:300px; margin:15px 30px 10px 32px' v-model="tmp_bonus"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:0px 34px 10px 121px">微信</span>
					<el-input type='text' style='width:300px; margin:15px 30px 10px 32px' v-model="tmp_wx"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:0px 34px 10px 121px">项目</span>
					<el-input type='text' style='width:300px; margin:15px 30px 10px 32px' disabled v-model="tmp_pid"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="editConfirm">确定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Report } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//report
// @Component 修饰符注明了此类为一个 Vue 组件

@Component
export default class Reportcfg extends Vue {
  // lifecycle hook
  report: Report = this.$store.state.report; //整个marqueState

  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }
  /*inital data*/

  tmp_switch: boolean = false;
  tmp_bonus: string = "";
  tmp_wx: string = "";
  tmp_pid: string = "";
  pidList: any[] = [];
  editFlag: boolean = false;
  /*method*/
  getReport() {
    this.loadData();
  }

  //添加
  editReport(row) {
    this.editFlag = true;
    this.tmp_switch = row.switch;
    this.tmp_bonus = row.bonus;
    this.tmp_wx = row.wx;
    this.tmp_pid = row.pid;
  }
  //添加确认
  async editConfirm() {
    let data = {
      switch: this.tmp_switch,
      bonus: this.tmp_bonus,
      wx: this.tmp_wx,
      pid: this.tmp_pid
    };
    console.log(data);
    this.$confirm("此操作将修改,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "UpdateReport", data);
        if (this.report.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editFlag = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.report.msg}`
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

  loadData() {
    myDispatch(this.$store, "GetReport");
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
    margin-top: 80px;
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
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
</style>
