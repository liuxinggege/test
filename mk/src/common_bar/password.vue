<style lang="less">
</style>
<template>
        <div>
            <span style="margin: 10px;">
                在进行操作前必须进行权限确认，请输入管理员用户密码。
            </span>
            <br>
            <br>
            <el-form :model="passForm" status-icon  label-width="50px" class="demo-ruleForm">
                    <el-form-item label="用户">
                        <el-input type="text" v-model="passForm.userName" readonly size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" 
                            v-model="passForm.password" 
                            @keydown.enter.native="handleSubmit('passForm')" 
                            size="small" 
                            :autofocus="true"
                            autoComplete="new-password">
                        </el-input>
                    </el-form-item>
                    <el-form-item  style="text-align:right;">
                        <el-button   @click="cancelEnter" size="small">取消</el-button>
                        <el-button type="primary" @click="handleSubmit('passForm')" size="small">确定</el-button>
                    </el-form-item>
            </el-form>
        </div>
</template>
<script>
import api from 'src/api'
import store from 'src/store'


export default {
    data(){
        return {
            passForm:{
                userName:'',
                password:''
            },
            
            state: store.state,
            action: store.actions,
        }
    },
    mounted(){},
    created(){
         this.passForm = {
            userName:JSON.parse(window.localStorage.getItem('sysuser')).name,
            password:''
        }
    },
    methods: {
        handleSubmit(){
            api.user.verifyPassword({password:this.passForm.password}).then(res => {
                if(res.data.status==0){ 
                    this.state.passwordShow = false;
                    window.localStorage.setItem('times',Date.now() + 300000);
                    if(this.state.nextrouter){
                        this.$router.push({
                             name:this.state.nextrouter.name,
                             path:this.state.nextrouter.path,
                             params:this.state.nextrouter.params||{},
                             query:this.state.nextrouter.query||{},
                        });
                    }         
                }else{
                    this.$message.error(res.data.msg);
                }
            })       
        },
        cancelEnter(){
             this.state.passwordShow = false; 
            if((this.state.routeName[this.state.nextrouter.name] && this.$route.path=="/" )|| (this.$route.name == this.state.nextrouter.name)){
                this.$router.push(this.state.home);
            }
        },
    }
};
</script>
