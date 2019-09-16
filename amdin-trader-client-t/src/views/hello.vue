<template>
    <div class="dashboard-editor-container">
        <div  style="width:100%; text-align:center">
			<h1 style="font-size:80px; margin:auto ;display:inline-block" class="title">商人代理系统</h1>  
			<h2>欢迎：{{name}}</h2>      
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
	name: any = "";
	mounted(){
		console.log("进入hello");
	this.name = JSON.parse(<string>sessionStorage.getItem("userInfo")).name
	}
	created(){
		console.log("进入hello");
	}
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
