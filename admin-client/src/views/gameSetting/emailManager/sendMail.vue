<template>
    <div>
        <el-col  class="toolbar1" style="margin-bottom: 20px">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="主动推送">
            </el-popover>            
            <span class="title">主动推送</span>           
        </el-col> 
        <el-col  class="toolbar2">
            <span>项目</span>
            <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
              </el-option>
            </el-select>
            <span >收件人id</span>
            <el-input type="textarea" :rows="1" v-model="uid" style="width:200px;margin:20px"></el-input>
            <span>(allUser为全服发送)</span>
            <el-button type="success" @click="sendMail" style="margin:0 0  20px 70px">发送</el-button>
            <span>(限300字)</span>
        </el-col>
        <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="mailContent">
        <br>
        </el-input>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { MailManagerState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SenMail extends Vue {
    // lifecycle hook

    /*inital data*/
    mailManager: MailManagerState = this.$store.state.mailManager; //整个marqueState
    uid:string = ""
    pidList: any[] = [];
    pid: string = "A";
    mailContent:string = ""
    /*method*/
    created() {
        this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    }
    sendMail(){
        if(!this.uid || !this.mailContent){
            this.$message({
                showClose: true,
                message: "发送内容为空",
                type: "warning"
            })
            return 
        }
        this.$confirm("是否确认发送?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.uid != "allUser") {
            let uids = this.uid.split(",");           
            myDispatch(this.$store, "SendMail", {
               type: 1,
               pid:this.pid,
               uids: uids,
               content: this.mailContent,
               allUser: false
            }).then(()=>{
                if(this.mailManager.sendCode === 200){
                    this.$message({
                        showClose: true,
                        message: "发送成功",
                        type: "success"
                    })
                    return
                }else{
                    this.$message({
                        showClose: true,
                        message: "发送失败",
                        type: "error"
                    })
                    return
                }
            })
          } else {
             myDispatch(this.$store, "SendMail", {
               type: 1,
               uids: [],
               pid:this.pid,
               content: this.mailContent,
               allUser: true
            }).then(()=>{
                if(this.mailManager.sendCode === 200){
                    this.$message({
                        showClose: true,
                        message: "发送成功",
                        type: "success"
                    })
                    return
                }else{
                    this.$message({
                        showClose: true,
                        message: "发送失败",
                        type: "error"
                    })
                    return
                }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发送"
          });
        });
       
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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