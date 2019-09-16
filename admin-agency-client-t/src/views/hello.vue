<template>
	<div class="dashboard-editor-container">
		<!-- <div class=" clearfix">
        <pan-thumb style="float: left" :image="avatar"> Your roles:
            <span class="pan-info-roles" :key='item' v-for="item in roles">{{item}}</span>
        </pan-thumb>
        <github-corner></github-corner>
        <div class="info-container">
            <span class="display_name">{{name}}</span>
            <span style="font-size:20px;padding-top:20px;display:inline-block;">editor : dashboard</span>
        </div>
        </div> -->
		<!-- <div style="margin-top: 250px">
            <img class="emptyGif" :src="emptyGif">
        </div> -->
		<div style="width:100%; text-align:center">
			<h1 style="font-size:80px; margin:auto ;display:inline-block" class="title">代理后台管理系统</h1>
			<h2>{{name}}</h2>
		</div>

	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Login extends Vue {
  //    emptyGif =  'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
  name: any = sessionStorage.getItem("name");
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #fff;
  min-height: 100vh;
  margin-top: -50px;
  padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
