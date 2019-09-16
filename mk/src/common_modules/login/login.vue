<style>
    .login-con{
        position: absolute;
        right: 160px;
        top: 50%;
        transform: translateY(-60%);
        width: 300px;
    }
    .login {
        clear: both;
        position: relative;
        height: 100%;
        width: 100%;
        margin: 0;
        z-index: 5;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    .login .login_iocn_size{
        font-size: 16px;
        color: #666;
    }
    .login .el-form-item__error{
       margin-left:50px; 
    }
    .login .el-input-group__append, 
    .login .el-input-group__prepend{
        padding: 0 15px;
    }
</style>
<template>
<div class="login" style="background-image:url(static/img/bg.jpg)">
<div class="login-con">
    <el-card>
        <p slot="header">
            <img src="../../assets/lg.png" alt="" height="30px"/>
        </p>
        <el-form ref="loginForm" :model="form" :rules="rules" autoComplete="new-password">
            <el-form-item prop="userName">
                <el-input size="small" v-model="form.userName" placeholder="请输入用户名" autofocus>
                    <span slot="prepend">
                        <span class="fa fa-user login_iocn_size"></span>
                    </span>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password"  size="small" v-model="form.password" placeholder="请输入密码" @keydown.enter.native="handleSubmit" autoComplete="new-password">
                    <span slot="prepend">
                        <span class="fa fa-lock login_iocn_size"></span>
                    </span>
                </el-input>
            </el-form-item>
            <div style="margin-bottom:10px;">
                <el-button size="small" @click="handleSubmit" type="primary" style="width:100%;">登录</el-button>
            </div>
        </el-form>
    </el-card>
</div>
</div>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
export default {
    data () {
        return {
            state:store.state,
            action: store.actions,
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    mounted() {
       
    },
    created(){
        this.state.isLogin == 1;
    	this.form = {
            userName: '',
            password: ''
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                      api.user.signin({name: this.form.userName,password: this.form.password}).then((res) => {
                            if(res.data.status==0){
                                res.data.user.password = this.form.password;
                                this.action.login(res.data.user,res.data.permission);
                                this.$store.dispatch("getCenter");//获取 模拟图底图
                                if(res.data.isuse == 0){
                                    this.$router.push({name:"projectinfo"});//初次登录系统 需要编辑保存煤矿简介
                                }else{
                                    this.$router.push(this.state.home);//首页
                                }
                            } else{
                                this.$message.error('账号或密码错误');
                            }
				      })
                }else{
                	this.$message.error('账号或密码不能为空！');
                }
            });
        }
    }

};
</script>


