<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="金花金币房规则">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>百人牛牛金币房规则</b>
		</span>
		<span style="position:absolute; right:0; top:1">
			<el-button type="primary" style="margin:0 10px 10px 0" 
				@click="getJhMatRule"> 读取
			</el-button>
			<el-button type="primary" style="margin:0 100px 10px 0" 
				@click="saveJhMatRule" > 保存
			</el-button>                
		</span>
		<div>
			<el-checkbox type='text' class="checkbox" id="chkIp" label="匹配ip" border
				v-model="brnnMatchRules.chkIp">
			</el-checkbox>
		</div>
    <div>
      <span style="font-size:12pt; margin:10px 10px 10px 30px">无操作踢出时间</span>
      <el-input type='text' style='width:100px; margin:10px 30px 10px 0px' @change="valueChange" v-model="brnnMatchRules.kickTime"></el-input>
      <span style="font-size:12pt; margin:10px 10px 10px 48px">税率</span>
      <el-input type='text' style='width:100px; margin:10px 30px 10px 0px' @change="valueChange" v-model="brnnMatchRules.taxRate"></el-input>
      <span style="font-size:12pt; margin:10px 10px 10px 0px">游戏开始时间</span>
      <el-input type='text' style='width:100px; margin:10px 0px 10px 0px' @change="valueChange" v-model="brnnMatchRules.startTime"></el-input>
    </div>
    <div>
      <span style="font-size:12pt; margin:10px 10px 10px 62px">用户最小量</span>
      <el-input type='text' style='width:100px; margin:10px 30px 10px 0px' @change="valueChange" @blur='inputvalit' v-model="brnnMatchRules.minUserCnt" disabled></el-input>
      <span style="font-size:12pt; margin:10px 10px 10px 0px">用户最大量</span>
      <el-input type='text' style='width:100px; margin:10px 0px 10px 0px' @change="valueChange" @blur='inputvalit' v-model="brnnMatchRules.maxUserCnt" disabled></el-input>

    </div> 
    <div>
      <span style="font-size:12pt; margin:10px 10px 10px 55px">个人水位(输)</span>
      <el-input type='text' style='width:100px; margin:10px 30px 10px 0px' @change="valueChange"  v-model="brnnMatchRules.userLoseProb"></el-input>
      <span style="font-size:12pt; margin:10px 10px 10px -10px">个人水位(赢)</span>
      <el-input type='text' style='width:100px; margin:10px 0px 10px 0px' @change="valueChange"  v-model="brnnMatchRules.userWinProb"></el-input>
    
        
        <span style="font-size:12pt; margin:10px 10px 10px 10px">通杀几率</span>
        <el-input type='text' @change="valueChange" style='width:100px; margin:10px 10px 10px 0px' v-model="brnnMatchRules.gameAllKillProb"></el-input>
        <span style="font-size:12pt; margin:10px 10px 10px 10px">通赔几率</span>
        <el-input type='text' @change="valueChange" style='width:100px; margin:10px 0px 10px 0px' v-model="brnnMatchRules.gameAllLoseProb"></el-input>
    </div>     
	</el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BrnnMatchRulesState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js"
//brnnMatchRules

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class brnnMatchRules extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  brnnMatchRules: BrnnMatchRulesState = this.$store.state.brnnMatchRules; //表单数据
  /*method*/
  loadData() {
     myDispatch(this.$store,"GetBrnnMatchRules", {}, true);
    // this.$store.dispatch("GetBrnnMatchRules");
  }
  getJhMatRule() {
    this.loadData();
  }
  saveJhMatRule() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
     myDispatch(this.$store,"UpdateBrnnMatchRules", this.brnnMatchRules)
    // this.$store
    //   .dispatch("UpdateBrnnMatchRules", this.brnnMatchRules)
      .then(() => {
        if (this.brnnMatchRules.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          return;
        } else {
          this.$message({
            type: "error",
            message: "保存失败!"
          });
          return;
        }
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: err
        });
        return;
      });
  }
  valueChange(value) {
    if (value === undefined || value === null || !value.trim()) {
      this.checkNullFlag = false;
    } else {
      this.checkNullFlag = true;
    }
  } 
  inputvalit(event) {
    if (event.target.value <= 20 && event.target.value >= 2) {
      return;
    } else {
      this.brnnMatchRules.minUserCnt = 2;
      this.brnnMatchRules.maxUserCnt = 20;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(2~20)!"
      });
    }
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
</style>
