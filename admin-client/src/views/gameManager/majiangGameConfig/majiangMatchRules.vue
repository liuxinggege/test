<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="麻将金币房规则">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b> 麻将金币房规则</b>
		</span>
		<span style="position:absolute; right:0; top:1">
			<el-button type="primary" style="margin:0 10px 10px 0" 
				@click="getMJMatRule"> 读取
			</el-button>
			<el-button type="primary" style="margin:0 100px 10px 0" 
				@click="saveMJMatRule" > 保存
			</el-button>                
		</span>
		<div>
			<el-checkbox type='text' class="checkbox" id="noBillMatchRobot" label="没充值只匹配机器人" border
				v-model="majiangMatchRules.noBillMatchRobot">
			</el-checkbox>
      <el-checkbox type='text' class="checkbox" id="chkIp" label="匹配ip" border
				v-model="majiangMatchRules.chkIp">
			</el-checkbox>
		</div>
		<div>

			<label for="kickTime" class="label">开始时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.startTime">
			</el-input>
			<label for="kickTime" class="label">无操作踢出时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.kickTime">
			</el-input>

			<label for="kickTime" class="label">等待时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.waitTime">
			</el-input>
			<label for="kickTime" class="label">发牌时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.sendCardTime">
			</el-input>

		</div>   
		<div>
			<label for="kickTime" class="label">定缺时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.dingQueTime">
			</el-input>
			<label for="kickTime" class="label">用户操作时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.userOptTime">
			</el-input>

      <label for="kickTime" class="label">换三张时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.changeThreeCardTime">
			</el-input>
			<label for="kickTime" class="label">换三张动画时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.changeThreeCardAnimalTime">
			</el-input>
		</div> 
		<div>
			<label for="kickTime" class="label">匹配范围</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.matchRange">
			</el-input>
			<label for="kickTime" class="label">游戏结算时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.gameResultTime">
			</el-input>

      <label for="kickTime" class="label">税率</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.taxRate">
			</el-input>
      <label for="kickTime" class="label">个人水位(输)</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.userLoseRate">
			</el-input>
      <label for="kickTime" class="label">个人水位(赢)</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="majiangMatchRules.userWinRate">
			</el-input> 
		</div>         
    <div>
    </div>    
	</el-card>
  
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { MajiangMatchRulesState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js"
//MajiangMatchRules

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class MajiangMatchRules extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  majiangMatchRules: MajiangMatchRulesState = this.$store.state.majiangMatchRules; //表单数据
  /*method*/
  loadData() {
     myDispatch(this.$store, "GetMajiangMatchRules", {}, true)
    // this.$store.dispatch("GetMajiangMatchRules");
  }
  getMJMatRule() {
    this.loadData();
  }
  saveMJMatRule() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
    myDispatch(this.$store, "UpdateMajiangMatchRules", this.majiangMatchRules)
    // this.$store
    //   .dispatch("UpdateMajiangMatchRules", this.majiangMatchRules)
      .then(() => {
        if (this.majiangMatchRules.code === 200) {
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
  inputvalit(value) {
    if (value <= 4 && value >= 1) {
      return;
    } else {
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(1~4)!"
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
