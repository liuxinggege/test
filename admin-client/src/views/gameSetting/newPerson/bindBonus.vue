<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="绑定奖励">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>绑定奖励</b>
		</span>
		<span style="position:absolute; right:0; top:1">
			<el-button type="primary" style="margin:0 10px 10px 0" 
				@click="getBindBonus"> 读取
			</el-button>
			<el-button type="primary" style="margin:0 100px 10px 0" 
				@click="saveBindBonus" > 保存
			</el-button>                
		</span>
    <div style="margin:0px 0px 10px 40px">
    <div>
      <span>正常奖励</span>
      <el-input type='text' style='width:100px; margin:10px 30px 10px 0px' @change="valueChange" v-model="bindBonus.money"></el-input>
      <span>低奖励</span>
       <el-input type='text' style='width:100px; margin:10px 30px 10px 0px' @change="valueChange" v-model="bindBonus.lowMoney"></el-input>
      <el-checkbox type='text'  style="width:100px; font-size:12pt; margin:0px 0px 0px 188px" class="checkbox" id="matchIp" label="active" border
				v-model="bindBonus.active">
			</el-checkbox>
    </div>
    </div>
	</el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BindBonus } from "../../../store/stateInterface"; //state Interface
import { myDispatch } from "../../../utils/index.js"
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class bindBonus extends Vue {
  // lifecycle hook
 created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  bindBonus: BindBonus = this.$store.state.bindBonus; //表单数据
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetBindBonus",{},true)
  }
  getBindBonus() {
    this.loadData();
  }
  saveBindBonus() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
    myDispatch(this.$store, "UpdateBindBonus", this.bindBonus)
      .then(() => {
        if (this.bindBonus.code === 200) {
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
    if (value <= 20 && value >= 2) {
      return;
    } else {
      // this.bindBonus.minUserCount = 2;
      // this.bindBonus.maxUserCount = 20;
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
