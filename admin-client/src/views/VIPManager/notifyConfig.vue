<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="VIP通知配置"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">VIP通知配置</span>
            </el-col>
            <div class="box">
                <br>
                <h2>VIP通知推送</h2>
                <span>项目：</span>
                <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
                    <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <span>收件人：</span>
                <el-input v-model="VIPemail" placeholder="请输入收件人（注：英文‘,’分隔, all为所有人）" style="width:400px; margin:10px"></el-input>
                <el-button type="primary" @click="sendEmail" style="margin:10px">发送</el-button>
                <div>
                    <el-input type="textarea" :autosize="{minRows:2}" placeholder="请输入内容" v-model="VIPmsg"></el-input>
                </div>
                <h2>新VIP推送通知</h2>
                <el-button type="primary" @click="newVipNotice" style="margin:10px">编辑</el-button>
                <el-input type="textarea" @focus="copyContent(newVIPmsg)" @blur="VIPcode(2)" :readonly="newVIPcode" :autosize="{minRows:8}" v-model="newVIPmsg"></el-input>
                <h2>日常展示通知</h2>
                <el-button type="primary" @click="dailyEdit" style="margin:10px">编辑</el-button>
                <el-input type="textarea" @focus="copyContent(dailyMsg)" @blur="VIPcode(1)" :readonly="dailyCode" :autosize="{minRows:4}" v-model="dailyMsg"></el-input>
                <h2>微信变更通知</h2>
                <el-button type="primary" @click="weixinEdit" style="margin:10px">编辑</el-button>
                <el-input type="textarea" @focus="copyContent(weixinMsg)" @blur="VIPcode(3)" :readonly="weixinCode" :autosize="{minRows:6}" v-model="weixinMsg"></el-input>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from "vue-class-component";
import {
    getVIPNotityPush,
    getConfig,
    updateConfig
} from "../../api/admin/VIPManager/VIPManager"
interface QueryItem {
    pid?: string
    content?: string
    uids?: Array<number>
    type?: number
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class NotifyConfig extends Vue {
    //消息状态
    newVIPcode: boolean = true; //新VIP编辑状态
    dailyCode: boolean = true; //日常展示状态
    weixinCode: boolean = true; //微信变更状态

    //数据绑定
    pidList: Array<string> = []; //项目列表
    pid: string = ""; //项目id
    VIPemail: string = ""; //邮箱发送地址
    VIPemailArray: Array<number> = []; //邮箱发送地址
    VIPmsg: string = ""; //VIP推送消息
    newVIPmsg: string = ""; //新VIP推送消息
    dailyMsg: string = ""; //日常展示通知
    weixinMsg: string = ""; //微信变更通知

    saveContent: string = "";

    created() {
        this.pidList = [
            { name: "全部", pid: "" },
            ...JSON.parse(<string>sessionStorage.getItem("pid"))
        ];
        this.getNotify();
    }
    //获取通知
    getNotify() {
        getConfig().then(res => {
            this.newVIPmsg = res.data.msg.newVipPushNotify;
            this.dailyMsg = res.data.msg.dailyNotify;
            this.weixinMsg = res.data.msg.wxChangeNotify;
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
    }
    //通知改变
    changeNotif(type, content) {
        updateConfig({
            type: type,
            content: content
        }).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "通知编辑成功"
                })
                this.getNotify();
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
    }
    //VIP发送消息
    sendEmail() {
        if (this.VIPemail == "all") {
            this.VIPemailArray = []
        }
        else {
            this.VIPemailArray = this.VIPemail.split(',').map(Number);
        }
        getVIPNotityPush({
            pid: this.pid,
            content: this.VIPmsg,
            uids: this.VIPemailArray
        }).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "通知推送成功"
                })
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })

    }
    newVipNotice() {
        this.newVIPcode = false;
    }
    dailyEdit() {
        this.dailyCode = false;
    }
    weixinEdit() {
        this.weixinCode = false;
    }
    copyContent(content) {
        if (!this.weixinCode || !this.dailyCode || !this.newVIPcode) {
            this.saveContent = content;
        }
    }
    VIPcode(type) {
        if (!this.weixinCode || !this.dailyCode || !this.newVIPcode) {
            this.$confirm('是否将继续更改通知消息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (type == 2) {
                    this.changeNotif(type, this.newVIPmsg)
                }
                else if (type == 1) {
                    this.changeNotif(type, this.dailyMsg)
                }
                else if (type == 3) {
                    this.changeNotif(type, this.weixinMsg)
                }
                this.newVIPcode = true;
                this.dailyCode = true;
                this.weixinCode = true;
            }).catch(() => {
                if (type == 2) {
                    this.newVIPmsg = this.saveContent;
                    this.newVIPcode = true;
                }
                else if (type == 1) {
                    this.dailyMsg = this.saveContent;
                    this.dailyCode = true;
                }
                else if (type == 3) {
                    this.weixinMsg = this.saveContent;
                    this.weixinCode = true;
                }
                this.$message({
                    type: 'info',
                    message: '已取消更改'
                });
            });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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