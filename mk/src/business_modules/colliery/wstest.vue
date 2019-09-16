<style>
    .statistics_item{
        margin-bottom:15px;
    }
    .red{
        color: red;
    }
    .green{
        color: green;
    }
</style>
<template>
    <el-card>
        <p slot="header">
            <span class="fa fa-exchange"> websocket实时通讯服务测试</span>
        </p>
        <el-row>
            <el-col :span="12">
                <el-card>
                    <p slot="header">
                        <span class="fa fa-cog"> 控制</span>
                    </p>
                    <div style="height:120px;">
                        <div class="statistics_item">
                            <el-button size="small" @click="startTest" :disabled="state.wstest.isOpen"><span class="fa fa-play-circle"> 开始测试</span></el-button>
                            <el-button size="small" @click="stopTset" :disabled="!state.wstest.isOpen"><span class="fa fa-pause-circle"> 结束测试</span></el-button>
                        </div>
                        <div class="statistics_item">
                            当前测试状态：
                            <span v-if="state.wstest.isOpen" class="green">测试中</span>
                            <span v-else class="red">结束中</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <p slot="header">
                        <span class="fa fa-building"> 测试期间统计</span>
                    </p>
                    <div style="height:120px;">
                        <el-row type="flex" class="row-bg" justify="space-around">
                            <el-col :span="10">
                                <div class="statistics_item">开始测试时间：{{state.wstest.startTime}}</div>
                            </el-col>
                            <el-col :span="10">
                                <div class="statistics_item">结束测试时间：{{state.wstest.stopTime}}</div>
                            </el-col>
                        </el-row>  
                        <el-row type="flex" class="row-bg" justify="space-around">
                            <el-col :span="10">
                                <div class="statistics_item green">连接成功次数：<span>{{state.wstest.connectCount}}次</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="statistics_item green">收到数据次数：<span>{{state.wstest.msgCount}}次</span></div>
                            </el-col>
                        </el-row>  
                        <el-row type="flex" class="row-bg" justify="space-around">
                            <el-col :span="10">
                                <div class="statistics_item red">连接错误次数：<span>{{state.wstest.errorCount}}次</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="statistics_item red">关闭断开次数：<span>{{state.wstest.closeCount}}次</span></div>
                            </el-col>
                        </el-row>  
                    </div>
                </el-card>
            </el-col>
        </el-row>  
        <el-card>
            <p slot="header">
                <span class="fa fa-tasks"> 测试期间心跳记录</span>
            </p>
            <el-row>
                <el-table :data="state.wstest.heartbeatList"  border stripe>
                    <el-table-column v-for="item in heartbeatColumn" :prop="item.key" :label="item.title" :width="item.width" align="left">
                        <template scope="scope">
                            <span :class="scope.row.alarm?'red':'green'">{{scope.row[item.key]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>
    </el-card>
</template>

<script>
import store from "src/store.js";
import api from "src/api";
export default {
components:{},
props:{},
computed: {
},
watch:{
},
 data() {
    return { 
        state:store.state,
        action:store.actions,
        heartbeatColumn:[
            {title:"时间",key:"time",width:200},
            {title:"内容",key:"msg"},
            {title:"断开原因",key:"reason"},
            {title:"断开状态码",key:"code",width:100},
            {title:"是否正常断开",key:"wasClean",width:100}
            
        ]
    }
},
methods:{
    startTest(){
        api.user.testWebsocketStart({wsid:this.state.wsid})
            .then(res => {
                if(res.data.status == 0){
                    this.action.startWsTest();
                    this.$message({type: 'success',message: res.data.msg});
                }else{
                    this.$message.error(res.data.msg);
                }
            })
    },
    stopTset(){
        api.user.testWebsocketStop({wsid:this.state.wsid})
            .then(res => {
                if(res.data.status == 0 ){
                    this.action.stopWsTest();
                    this.$message({type: 'success',message: res.data.msg});
                }else{
                     this.$message.error(res.data.msg);
                }
            })
    }
},
created(){},
mounted(){},
beforeDestroy(){},
destroyed(){}
}
</script>