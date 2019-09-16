<template>
    <el-card class ="index-profile">
        <el-row>
            <span>聚商详情</span>
            <el-button type="primary" icon="caret-right" @click="loadData" class="button" >刷新</el-button>
        </el-row>
            <el-row>
                <el-col :span="5" align="center">
                <span class="jushangInfo">{{businessHome.cUid}}</span>
                <br>
                <span class="gray">ID</span>
            </el-col>
            <el-col :span="5" align="center">
                <span class="jushangInfo">{{businessHome.cAct}}</span>
                <br>
                <span class="gray">账号</span>
            </el-col>
            <el-col :span="5" align="center">
                <span class="jushangInfo">{{businessHome.cName}}</span>
                <br>
                <span class="gray">昵称</span>
            </el-col>
            <el-col :span="5" align="center">
                <span class="jushangInfo">{{businessHome.cGold}}</span>
                <br>
                <span class="gray">金币池</span>
            </el-col>
        </el-row>
    </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
// import { Getter, Action } from "vuex-class";
import { myDispatch } from "../../../utils/index";

import { BusinessHome } from "../../../store/stateInterface";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class BusinessDetails extends Vue {
  //初始化数据
  businessHome: BusinessHome = this.$store.state.businessHome;
  //函数
  created() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetJuBusinessInfo", {}, true);
  }
}
</script>


<style rel="stylesheet/scss" lang="scss">
.index {
  &-profile {
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    margin-top: 25px;
    height: 100px;
    position: relative;
  }
}
.jushangInfo {
  font-size: 24px;
}
.button {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 99;
}
.dashboard {
  &-container {
    margin-left: 15px;
    margin-right: 15px;
  }
  &-todaySum {
    margin-top: 25px;
  }
  &-totalSum {
    margin-top: 25px;
  }
  &-gameWinLose {
    margin-top: 25px;
  }
  &-dayOnline {
    margin-top: 25px;
  }
}
</style>