<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="白名单 (每条数据都以换行分割)">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>匹配ip白名单 (内填游戏玩家uid，每条数据都以换行分割)</b>
		</span>
		<span style="position:absolute; right:0; top:1">
			<el-button type="primary" style="margin:0 10px 10px 0" 
				@click="getSubWhiteList"> 读取
			</el-button>
			<el-button type="primary" style="margin:0 100px 10px 0" 
				@click="saveSubWhiteList" > 保存
			</el-button>                
		</span>
    <div style="margin:0px 0px 10px 40px">
    <div>
      <el-input type='textarea' :rows="12" style="width:600px" v-model='matchIP'> </el-input>
    </div>
   </div>
	</el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SubWhiteList } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js"
//subWhiteList

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class subWhiteList extends Vue {
  // lifecycle hook
 created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  subWhiteList: SubWhiteList = this.$store.state.subWhiteList; //表单数据
  matchIP:string = "";
  /*method*/
  loadData() {
    myDispatch(this.$store,"GetSubWhiteList",{},true)
    .then(()=>{
      this.matchIP = this.subWhiteList.matchIP.join("\n");
      
    });
  }
  getSubWhiteList() {
    this.loadData();
  }
  saveSubWhiteList() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
    this.subWhiteList.matchIP = this.matchIP.split("\n");
    let tmp = this.subWhiteList.matchIP.map((e:any) =>  e );
    myDispatch(this.$store,"UpdateSubWhiteList", {matchIP:tmp})
      .then(() => {
        if (this.subWhiteList.code === 200) {
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
      // this.subWhiteList.minUserCount = 2;
      // this.subWhiteList.maxUserCount = 20;
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
