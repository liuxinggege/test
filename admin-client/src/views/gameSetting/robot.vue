<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="机器人配置">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>机器人配置</b>
		</span>
		<span style="position:absolute; right:0; top:1">
			<el-button type="primary" style="margin:0 10px 10px 0" 
			@click="getRobot"> 读取
			</el-button>
			<el-button type="primary" style="margin:0 100px 10px 0" 
			@click="saveRobot" > 保存
			</el-button>                
		</span>
		<div>
			<span style="font-size:12pt; margin:10px 30px 10px 30px">假广播最低金额</span>
			<el-input type='text' style='width:100px; margin:10px 0px 20px 100px' v-model='robot.withdrawNoticeMoneyMin'></el-input>
		</div>
		<div>
			<span style="font-size:12pt; margin:10px 10px 10px 30px">间隔发假广播的时间段(秒为单位):</span>
			<el-input type='text' style='width:100px; margin:10px 5px 20px 0px' v-model='robot.withdrawNoticeFrequencyMin'></el-input>~
			<el-input type='text' style='width:100px; margin:10px 0px 20px 0px' v-model='robot.withdrawNoticeFrequencyMax'></el-input>
		</div>
		<div>
			<el-checkbox type='text'  style="width:180px; font-size:12pt; margin:0px 0px 0px 30px" class="checkbox" id="matchIp" label="是否开启假广播" border
			v-model="robot.withdrawNoticeActive">
			</el-checkbox>
			<el-checkbox type='text'  style="width:180px; font-size:12pt; margin:0px 0px 0px 30px" class="checkbox" id="matchIp" label="机器人开关" border
			v-model="robot.robotSwitch">
			</el-checkbox>
			<el-checkbox type='text'  style="width:180px; font-size:12pt; margin:0px 0px 0px 30px" class="checkbox" id="matchIp" label="活跃房" border
			v-model="robot.activeRoomSwitch">
			</el-checkbox>
			<el-checkbox type='text'  style="width:180px; font-size:12pt; margin:0px 0px 0px 30px" class="checkbox" id="matchIp" label="凑桌机器人开关" border
			v-model="robot.joinRobotSwitch">
			</el-checkbox>
		</div><br />
		<div>
			<span style="font-size:12pt; margin:200px 30px 10px 30px">机器人位置</span><br />
			<el-input type="textarea"  v-model="location" style="width:450px;margin:20px 0px 0px 30px" :rows="5"></el-input>
		</div>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Robot } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js"
//robot

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class robot extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  robot: Robot = this.$store.state.robot; //表单数据
  location: string = "";
  /*method*/
  loadData() {
    myDispatch(this.$store,"GetRobot",{},true)
    .then(()=>{
        this.location = JSON.stringify(this.robot.location);
    });
      
    
  }
  getRobot() {
    this.loadData();
  }
  saveRobot() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
    this.robot.location = JSON.parse(this.location);
    myDispatch(this.$store,"UpdateRobot", this.robot)
      .then(() => {
        if (this.robot.code === 200) {
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
      // this.robot.minUserCount = 2;
      // this.robot.maxUserCount = 20;
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
