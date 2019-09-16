<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="新增账号">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>新增账号</b>
		</span>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px" style="margin:20px 50px 10px 30%;width:500px">
      <el-form-item label="手机："  prop="act">
        <el-input v-model="user.act"></el-input>
      </el-form-item>
      <el-form-item label="密码："  prop="pwd">
        <el-input v-model="user.pwd"></el-input>
      </el-form-item>
      <el-form-item label="渠道："  prop="channel">
        <el-input v-model="user.channel"></el-input>
      </el-form-item>
      <el-form-item label="平台："  prop="platform">
        <el-select v-model="user.platform" placeholder="请选择平台">
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目："  prop="pid">
        <el-select v-model="user.pid" placeholder="请选择项目">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button  @click="clean">清空</el-button>
      </el-form-item>
    </el-form>
	</el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BrnnMatchRulesState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js"
//brnnMatchRules

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AddUser extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  pidList: any[] = [];
  platformList = [
    {
      value: "android",
      label: "android"
    },
    {
      value: "ios",
      label: "ios"
    }
  ];
  checkNullFlag: boolean = true; //判别是否有空值
  user= {  act: '',  pwd: '',  channel: '',  pid: '',platform:''};
  rules={
      act: [
        { required: true, message: '请输入手机号', trigger: 'change' }
      ],
      pid: [
        { required: true, message: '请选择项目', trigger: 'change' }
      ],
      channel: [
        { required: true, message: '请输入渠道号', trigger: 'change' }
      ],
       platform: [
        { required: true, message: '请选择平台', trigger: 'change' }
      ],
      pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 17, message: '长度在 6 到 16 个字符', trigger: 'blur' }
      ],
  }
  brnnMatchRules: BrnnMatchRulesState = this.$store.state.brnnMatchRules; //表单数据
  /*method*/
  loadData() {
     this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  onSubmit(){
    if(this.user.act!==''&&this.user.pwd!==''&&this.user.pid!==''&&this.user.channel!==''){
      let pidName ;
      this.pidList.forEach(element => {
        if(element.pid===this.user.pid){
          pidName = element.name;
        }
      });
      this.$confirm(`此操作将添加手机号为：${this.user.act}，密码：${this.user.pwd}，渠道：${this.user.channel===""?"官方":this.user.channel},项目：${pidName},平台:${this.user.platform}的账号, 是否继续?`, '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
      }).then(() => {
         myDispatch(this.$store,"AddGeneralUser",this.user).then(()=>{
           if( this.$store.state.userCreate.code===200){
             this.$message({  message: '创建成功',  type: 'success'})
           }else if(this.$store.state.userCreate.code===9006){
             this.$message({  message: `创建失败，改手机号已注册账号！`,  type: 'error'})
           }else if(this.$store.state.userCreate.code!==400){
             this.$message({  message: `创建失败，${this.$store.state.userCreate.msg}`,  type: 'error'})
           }
         });
      });
    }else{
      this.$message({  message: '请输入信息',  type: 'error'})
    }
  }
  clean(){
    this.user= {act: '',pwd: '',channel: '',pid: '',platform:''};
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
