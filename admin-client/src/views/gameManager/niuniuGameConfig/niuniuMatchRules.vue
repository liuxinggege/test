<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="金花金币房规则">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>牛牛金币房规则</b>
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
				v-model="niuniuMatchRules.chkIp">
			</el-checkbox>
		</div>
		<div>	
			<label for="taxRate" class="label">税率</label>
			<el-input type='text' class="input" id="taxRate"
				@change="valueChange" v-model="niuniuMatchRules.taxRate">
			</el-input>		
      <label for="kickTime" class="label">无操作踢出时间</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="niuniuMatchRules.kickTime">
			</el-input> 
			<label for="minUserCnt" class="label">最小用户数</label>
			<el-input type='text' class="input" id="minUserCnt"
				@change="valueChange" v-model="niuniuMatchRules.minUserCnt" disabled>
			</el-input>			
			<label for="maxUserCnt" class="label">最大用户数</label>
			<el-input type='text' class="input" id="maxUserCnt"
				@change="valueChange" v-model="niuniuMatchRules.maxUserCnt" disabled>
			</el-input> 
		</div>
    <div>	
			<label for="startTime" class="label">开始前的等待时间</label>
			<el-input type='text' class="input" id="startTime"
				@change="valueChange" v-model="niuniuMatchRules.startTime">
			</el-input>			
      <label for="kickTime" class="label">个人水位(输)</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="niuniuMatchRules.userLoseProb">
			</el-input>
      <label for="kickTime" class="label">个人水位(赢)</label>
			<el-input type='text' class="input" id="kickTime"
				@change="valueChange" v-model="niuniuMatchRules.userWinProb">
			</el-input>  
		</div>       
	</el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { NiuniuMatchRulesState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js"
//niuniuMatchRules

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class niuniuMatchRules extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  niuniuMatchRules: NiuniuMatchRulesState = this.$store.state.niuniuMatchRules; //表单数据
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetNiuniuMatchRules", {}, true)
    // this.$store.dispatch("GetNiuniuMatchRules");
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
    myDispatch(this.$store, "UpdateNiuniuMatchRules", this.niuniuMatchRules)
    // this.$store
    //   .dispatch("UpdateNiuniuMatchRules", this.niuniuMatchRules)
      .then(() => {
        if (this.niuniuMatchRules.code === 200) {
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
