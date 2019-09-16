<template>
	 <el-card class="dashboard-second" style="margin: 40px; width: 600px; height: 540px">       
        <el-col  class="toolbar1" style="margin-bottom: 20px">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="允许登录（IP每条数据都以换行分割，支持正则表达式）">
            </el-popover>
            <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
            <span class="title">允许登录（IP每条数据都以换行分割，支持正则表达式）</span>
        </el-col>
        <!--列表-->
        <div>
          <el-button type="primary" style="margin:20px" @click="loadData">读取</el-button>
          <el-button type="primary" @click="updateAllowLoginIP">保存</el-button>
       </div>
        <!-- <div style="margin:10px 0px 10px 0px">          
            <el-checkbox v-model="active" label="是否激活" border></el-checkbox>
        </div> -->
        <div>
            <el-input v-model="allowLoginIP.allowLoginIPArr" type="textarea" style="width:500px" :rows="15"></el-input>
        </div>
      </el-card> 
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AllowLoginIP } from "../../../store/stateInterface";
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
  allowLoginIP: AllowLoginIP = this.$store.state.allowLoginIP; //表单数据

  /*method*/
  loadData() {
     myDispatch(this.$store,"GetAllowLoginIP", {}, true) 
    // this.$store.dispatch("GetAllowLoginIP"); 
  }
  updateAllowLoginIP() {
    let ipArr: string[] = [];
    this.allowLoginIP.allowLoginIPArr.split("\n").forEach(item => {
      item = item.trim();
      if (item) {
        ipArr.push(item);
      }
    });
    myDispatch(this.$store,"UpdateAllowLoginIP", {
      ip: ipArr,
      switch: this.allowLoginIP.switch
    }, true)
    // this.$store.dispatch("UpdateAllowLoginIP", {
    //   ip: ipArr,
    //   switch: this.allowLoginIP.switch
    // })
    .then(()=>{
      if (this.$store.state.allowLoginIP.code === 200) {
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
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
