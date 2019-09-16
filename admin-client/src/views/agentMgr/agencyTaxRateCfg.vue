<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second" style="width:90%;">
      <div class="bottomList">
        <div class="payInfo">
          <el-col class="toolbar1">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理初始点位配置">
            </el-popover>
            <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
            <span class="title">代理初始点位配置</span>
          </el-col>
          <el-table :data="taxRateDefaultCfgData" border highlight-current-row>
			    	<el-table-column prop="pid" label="项目" width="60" align="center" :formatter="pidFormat" >
			    	</el-table-column>
			    	<el-table-column prop="rateTax" label="初始点位" width="360" align="center" :formatter="rateTaxFormat">
			    	</el-table-column>
			    	<el-table-column prop="GeneralAgencyTaxRateMax" label="全民最高点位" width="70" align="center">
			    	</el-table-column>
			    	<el-table-column prop="isDiscount" label="是否扣量" width="60"  align="center"  :formatter="isDiscountFormat">
			    	</el-table-column>
			    </el-table>
        </div>
        <div>
          <el-col class="toolbar1">
            <el-popover ref="popover2" placement="top" itle="标题" trigger="hover" content="代理税收扣量比配置">
            </el-popover>
            <el-button v-popover:popover2 type='text' class='el-icon-info'></el-button>
            <span class="title">代理税收扣量比配置</span>
          </el-col>
          <span>选择项目</span>
          <el-select  v-model="curPid"  placeholder="请选择项目"  style="margin:5px 20px 5px 10px;width:120px;">
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
          <el-button type="primary" @click="addCfg" style="margin:10px">添加</el-button>
          <el-button type="primary" @click="loadData" style="margin:10px">刷新</el-button>
          <el-table :data="taxRateCfgData" border highlight-current-row>
			    	<el-table-column label="直推税收" width="200" align="center">
			    		<template slot-scope="scope">
			    			<span style="color:red;font-size:18px">
			    				{{scope.row.gameTax}}
			    			</span>
			    		</template>
			    	</el-table-column>
			    	<el-table-column prop="changeRate" label="扣量比" width="200" align="center">
			    		<template slot-scope="scope">
			    			<span style="color:red;font-size:18px">
			    				{{scope.row.changeRate}}
			    			</span>
			    		</template>
			    	</el-table-column>
			    	<el-table-column label="操作" width="200" align="center">
			    		<template slot-scope="scope">
			    			<el-button @click="edit(scope.row)" type="text">编辑</el-button>
			    			<el-button @click="del(scope.row)" type="text">删除</el-button>
			    		</template>
			    	</el-table-column>
			    </el-table>
        </div>
      </div>
      <el-dialog :visible.sync="dialogDiscountAgencyRateCfgVisible" @close="close">
				<div style="font-size:18px;color:#aaa">{{"新增/修改代理税收扣量比配置 "}}</div>
				<span style="margin:10px 10px 10px 120px">直推税收</span>
				<el-input v-model="gameTax" style="width:120px; margin:10px 50px"></el-input>
				<br>
				<span style=" margin:10px 65px 10px 120px">扣量比</span>
				<el-input v-model="changeRate" style="width:120px; margin:10px 10px"></el-input>
				<br>
				<br>
				<el-button type="primary" @click="fixAgencyRateCfg" style="margin:10px 0 0 400px">保存</el-button>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { AgentTaxSettingState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgencyTaxRateCfg extends Vue {
  taxRateCfgData: any[] = [];
  taxRateDefaultCfgData: any[] = [];
  gameTax: string = "";
  changeRate: string = "";
  curPid: string = "A";
  editPid: string = "";
  pidList: any[] = [];
  currId = "";
  dialogDiscountAgencyRateCfgVisible: boolean = false;

  agentTaxSetting: any = this.$store.state.agencyTaxRateCfg;
  //生命周期钩子函数
  created() {
    this.pidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }

  //初始化数据
  loadData() {
    myDispatch(
      this.$store,
      "GetAgencyDiscountRateCfg",
      { pid: this.curPid },
      true
    ).then(() => {
      this.taxRateCfgData = this.agentTaxSetting.taxRateCfgData;
    });
    myDispatch(this.$store, "GetDefaultRateCfg", { pid: this.curPid }, true).then(
      () => {
        this.taxRateDefaultCfgData = this.agentTaxSetting.taxRateDefaultCfg;
      }
    );
  }

  // 添加
  addCfg() {
    this.dialogDiscountAgencyRateCfgVisible = true;
  }
  fixAgencyRateCfg() {
    //修改
    if (this.currId) {
      myDispatch(this.$store, "UpdateAgencyDiscountRateCfg", {
        gameTax: this.gameTax,
        changeRate: this.changeRate,
        id: this.currId,
        pid: this.curPid
      }).then(() => {
        if (this.agentTaxSetting.code === 200) {
          this.$message({
            showClose: true,
            type: "success",
            message: "操作成功!"
          });
          this.loadData();
          this.dialogDiscountAgencyRateCfgVisible = false;
          return;
        } else if (this.agentTaxSetting.code !== 400) {
          this.$message({
            showClose: true,
            type: "error",
            message: "操作失败!" + this.agentTaxSetting.err
          });
        }
        this.$message({
          showClose: true,
          type: "error",
          message: this.agentTaxSetting.err
        });
      });
    } else {
      myDispatch(this.$store, "AddAgencyDiscountRateCfg", {
        gameTax: this.gameTax,
        changeRate: this.changeRate,
        pid: this.curPid
      }).then(() => {
        if (this.agentTaxSetting.code === 200) {
          this.$message({
            showClose: true,
            type: "success",
            message: "操作成功!"
          });
          this.loadData();
          this.dialogDiscountAgencyRateCfgVisible = false;
          return;
        } else if (this.agentTaxSetting.code !== 400) {
          this.$message({
            showClose: true,
            type: "error",
            message: "操作失败!" + this.agentTaxSetting.err
          });
        }
        this.$message({
          showClose: true,
          type: "error",
          message: this.agentTaxSetting.err
        });
      });
    }
  }
  edit(row) {
    this.dialogDiscountAgencyRateCfgVisible = true;
    this.gameTax = row.gameTax;
    this.changeRate = row.changeRate;
    this.currId = row._id;
  }
  del(row) {
    let id = row._id;
    this.$confirm("确认是否删除", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DelAgencyDiscountRateCfg", { id }).then(() => {
          if (this.agentTaxSetting.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "操作成功!"
            });
            this.loadData();
            this.dialogDiscountAgencyRateCfgVisible = false;
            return;
          } else if (this.agentTaxSetting.code !== 400) {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!" + this.agentTaxSetting.err
            });
          }
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消" });
      });
  }
  close() {
    this.gameTax = "";
    this.changeRate = "";
    this.currId = "";
  }
  pidFormat(row) {
      let key = row.pid;
      let prod = "";
      this.pidList.some(item => {
        if (item.pid == key) {
          prod = item.name;
        }
        return item.pid == key;
      });
      return prod;
    }
  isDiscountFormat(row) {
      return row.isDiscount===true?"是":"否";
    }
  rateTaxFormat(row) {
    let str = "";
    if(row.rateTax){
      for (let index = 0; index < row.rateTax.length; index++) {
        const element = row.rateTax[index];
        switch (index) {
          case 0:
            str="总代："+element+"，"
            break;
          case 1:
            str+="组长："+element+"，"
            break;
          case 2:
            str+="组员："+element+"，"
            break;
          case 3:
            str+="全民："+element+"，"
            break;
          default:
            str+=str+","
            break;
        }
      }
      return str
    }
      return "";
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.bottomList {
  display: flex;
  width: 100%;
}
.payInfo {
  width: 800px;
  padding-left: 10px;
  margin-right: 30px;
}
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
