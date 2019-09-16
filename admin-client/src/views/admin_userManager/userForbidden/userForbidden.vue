<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="下注配置">
				</el-popover>
			</el-col>
		
	
			<!--  -->
			<div>&nbsp;&nbsp;</div>
			<el-tabs v-model="activeName">
				<el-tab-pane label="后台封号" name="first">
					<adminUserForbidden v-if="activeName=='first'"></adminUserForbidden>
				</el-tab-pane>
				<el-tab-pane label="系统封号" name="second">
					<systemUserForbidden v-if="activeName=='second'"></systemUserForbidden>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../utils/index.js";
import adminUserForbidden from "./adminUserForbidden.vue";
import systemUserForbidden from "./systemUserForbidden.vue";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    adminUserForbidden: adminUserForbidden,
    systemUserForbidden: systemUserForbidden
  }
})
export default class UserForbidden extends Vue {
  activeName: string = "first";
  created() {
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
  margin: 5px 40px 5px 0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 10px;
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
</style>