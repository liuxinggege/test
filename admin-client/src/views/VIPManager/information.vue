<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="信息库"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">信息库</span>
            </el-col>
            <div class="box">
                <br>
                <span>项目</span>
                <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
                    <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <span>用户ID</span>
                <el-input style="width:160px; margin:0 10px" v-model="userId" placeholder="请输入玩家ID"></el-input>
                <span>用户微信号</span>
                <el-input style="width:160px; margin:0 10px" v-model="weixinId" placeholder="请输入用户微信号"></el-input>
                <span>手机号</span>
                <el-input style="width:240px; margin:0 10px" v-model="phone" placeholder="请输入手机号"></el-input>
                <span>状态</span>
                <el-select v-model="state" placeholder="请选择状态" style="width:120px; margin:10px">
                    <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <span>注册时间</span>
                <el-date-picker v-model="rsgTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <span>登陆时间</span>
                <el-date-picker v-model="loginTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <span>维护时间</span>
                <el-date-picker v-model="maintainTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <el-button type="primary" @click="SearchData" style="margin:10px">搜索</el-button>
                <el-button type="success" @click="ExcelData" style="margin:10px">导出excel</el-button>
                <el-button type="success" @click="addVipUser" style="margin:10px">添加Vip用户 =></el-button>
                <el-input style="width:200px; margin:0 10px" v-model="addUserId" placeholder="请输入需要添加的Vip用户"></el-input>
                <el-table @cell-dblclick="switchTable" :cell-class-name="bindClass" :cell-style="informationStyle" :data="informationData" v-loading="loading" highlight-current-row border style="width: 100%">
                    <el-table-column :formatter="pidFormatter" align="center" prop="pid" label="项目"></el-table-column>
                    <el-table-column class="blue" align="center" prop="uid" label="用户ID"></el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="registerTime" label="注册时间"></el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="lastLoginTime" label="最后登录时间"></el-table-column>
                    <el-table-column align="center" prop="wx" label="用户微信"></el-table-column>
                    <el-table-column align="center" prop="wxRemark" label="微信备注"></el-table-column>
                    <el-table-column align="center" prop="serviceWx" label="客服微信"></el-table-column>
                    <el-table-column align="center" prop="mobilePhone" label="用户手机号"></el-table-column>
                    <el-table-column align="center" prop="age" label="年龄"></el-table-column>
                    <el-table-column :formatter="birthdayFormat" align="center" prop="birthday" label="生日"></el-table-column>
                    <el-table-column align="center" prop="occupation" label="职业"></el-table-column>
                    <el-table-column align="center" prop="city" label="城市"></el-table-column>
                    <el-table-column :formatter="stateFormat" align="center" prop="state" label="状态"></el-table-column>
                    <el-table-column align="center" label="维护日志">记录</el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="lastServeTime" label="最后维护时间"></el-table-column>
                </el-table>
                <!---------------------------------------------------------------- 维护日志弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 维护日志弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 维护日志弹框 -------------------------------------------------------------------->
                <el-dialog :title="'用户ID：'+this.userIdA" :visible.sync="recordDialogA" width="80%" :before-close="handleClose">
                    <span>记录时间</span>
                    <el-date-picker v-model="recordDialogTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                    <span>记录人</span>
                    <el-input style="width:200px; margin:0 10px" v-model="recordUser" placeholder="请输入记录人"></el-input>
                    <el-button type="primary" @click="SearchRecordData" style="margin:10px">搜索</el-button>
                    <el-button type="success" @click="excelRecordData" style="margin:10px">导出excel</el-button>
                    <el-button type="primary" @click="addRecordData" style="margin:10px">新增记录</el-button>
                    <el-table :data="logginList" v-loading="loadingB" highlight-current-row border style="width: 100%">
                        <el-table-column :formatter="localeSumDateFormatter" align="center" prop="logTime" label="记录时间"></el-table-column>
                        <el-table-column align="center" prop="logContent" label="日志记录"></el-table-column>
                        <el-table-column align="center" prop="opt" label="记录人"></el-table-column>
                        <el-table-column align="center" prop="uid" label="用户ID"></el-table-column>
                        <el-table-column label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button style="color: green" @click="editRecord(scope.row)" type="text" size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog title="新增日志" :visible.sync="recordDialogB" append-to-body :before-close="handleClose" width="30%">
                        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="logginContent"></el-input>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="backRecordDialogA">取 消</el-button>
                            <el-button type="primary" @click="upAddRecord">添 加</el-button>
                        </span>
                    </el-dialog>
                    <el-dialog title="编辑日志" :visible.sync="recordEditDialogB" append-to-body :before-close="handleClose" width="30%">
                        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="logginContent"></el-input>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="backRecordDialogA">取 消</el-button>
                            <el-button type="primary" @click="upEditRecord">提 交</el-button>
                        </span>
                    </el-dialog>
                </el-dialog>
                <!---------------------------------------------------------------- 用户ID弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 用户ID弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 用户ID弹框 -------------------------------------------------------------------->
                <el-dialog :title="'用户ID:'+userIdA" :before-close="handleClose" :visible.sync="userIdDialog" append-to-body width="80%">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <dir>
                                    <span>总充值：</span>
                                    <span>{{this.userIdDialogData.totalChargeMoney || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>总提现：</span>
                                    <span>{{this.userIdDialogData.totalWithdrawMoney || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>总输赢：</span>
                                    <span>{{this.userIdDialogData.totalWinLose || "0"}}</span>
                                </dir>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <dir>
                                    <span>最后登录当日充值：</span>
                                    <span>{{this.userIdDialogData.lastLoginDayCharge || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>最后登录当日提现：</span>
                                    <span>{{this.userIdDialogData.lastLoginDayWithdraw || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>最后登录当日输赢：</span>
                                    <span>{{this.userIdDialogData.lastLoginDayWinLose || "0"}}</span>
                                </dir>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <dir>
                                    <span>首日总充值：</span>
                                    <span>{{this.userIdDialogData.firstDayCharge || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>第一笔充值：</span>
                                    <span>{{this.userIdDialogData.firstCharge || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>单日最高充值：</span>
                                    <span>{{this.userIdDialogData.maxChargeByDay || "0"}}</span>
                                </dir>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <dir>
                                    <span>日均充值次数：</span>
                                    <span>{{this.userIdDialogData.avgChargeTimesByDay || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>日均提现次数：</span>
                                    <span>{{this.userIdDialogData.avgWithdrawTimesByDay || "0"}}</span>
                                </dir>
                                <dir>
                                    <span>最后玩的游戏：</span>
                                    <span>{{this.initLastGame(this.userIdDialogData)}}</span>
                                </dir>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="14">
                            <div class="grid-content bg-purple">
                                <div class="userId_title">游戏局数</div>
                                <div id="echart"></div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <div class="userId_title">游戏输赢</div>
                                <div v-for=" (value,key) in this.userIdDialogData.winLoseMap" class="gameVet">
                                    <span>{{key}}</span>
                                    <span>{{value}}</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="grid-content bg-purple">
                                <div class="userId_title">用户概述</div>
                                <div>
                                    <i @click="editUserDescription" style="float: right;font-size:40px;cursor: pointer;" class="el-icon-edit-outline"></i>
                                    <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="userDescrptton"></el-input>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-dialog>
                <!---------------------------------------------------------------- 客服微信弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 客服微信弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 客服微信弹框 -------------------------------------------------------------------->
                <el-dialog title="客服微信填写" :visible.sync="severWxDialog" width="30%" :before-close="handleClose">
                    <el-row>
                        <el-col :span="12">
                            <div style="text-align: center" class="grid-content bg-purple">用户ID</div>
                        </el-col>
                        <el-col :span="12">
                            <div style="text-align: center" class="grid-content bg-purple-light">{{this.userIdA}}</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">客服微信</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content bg-purple-light">
                                <el-input :rows="8" placeholder="请输入修改信息" v-model="VipInformationDialog"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                    <p style="text-align: center;line-height: 40px;font-size:18px;">
                        填写客服微信时，会给玩家发送游戏内VIP通知，请仔细核对微信号是否
                        <span style="color:red">正确且能正常使用</span>
                    </p>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backInformation">取 消</el-button>
                        <el-button type="primary" @click="upAddSeverWx">确 定</el-button>
                    </span>
                </el-dialog>
                <!---------------------------------------------------------------- 普通修改弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 普通修改弹框 -------------------------------------------------------------------->
                <!---------------------------------------------------------------- 普通修改弹框 -------------------------------------------------------------------->
                <el-dialog title="vip信息修改" :visible.sync="vipInforDialog" width="30%" :before-close="handleClose">
                    <div v-if="this.vipInforText == '生日'">
                        <el-row>
                            <el-col :span="12">
                                <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">日期</div>
                            </el-col>
                            <el-col :span="12">
                                <div class="grid-content bg-purple-light">
                                    <el-input :rows="8" placeholder="请输入修改信息" v-model="newDay"></el-input>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">月份</div>
                            </el-col>
                            <el-col :span="12">
                                <div class="grid-content bg-purple-light">
                                    <el-input :rows="8" placeholder="请输入修改信息" v-model="newMonth"></el-input>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row v-else>
                        <el-col :span="12">
                            <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">{{this.vipInforText}}</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content bg-purple-light">
                                <el-input :rows="8" placeholder="请输入修改信息" v-model="VipInformationDialog"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backInformation">取 消</el-button>
                        <el-button type="primary" @click="upChangeVip">确 定</el-button>
                    </span>
                </el-dialog>
                <el-pagination layout="total,sizes,prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {
    vipList,
    vipDetail,
    changeVipAll,
    getVipLogByUid,
    getVipLogMsg,
    updateVipLog,
    addVipLog,
    exportVipLogExcel,
    exportVipList,
    addVipUser
} from "../../api/admin/VIPManager/VIPManager"
import echarts from 'echarts'
import { deflate } from 'zlib';

interface QueryItem {
    pid?: string
    uid?: number
    wx?: string
    phone?: string
    state?: number
    page?: number
    count?: number
    registerTimeStart?: string
    registerTimeEnd?: string
    loginTimeStart?: string
    loginTimeEnd?: string
    serveTimeStart?: string
    serveTimeEnd?: string
}

interface ChangeData {
    uid?: number
    newMonth?: number
    newDay?: number
    newValue?: string
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Information extends Vue {
    loading: boolean = false; //加载
    loadingB: boolean = false; //弹窗列表加载
    recordDialogA: boolean = false; //记录弹窗
    recordDialogB: boolean = false; //记录弹窗
    userIdDialog: boolean = false; //用户ID弹窗
    recordEditDialogB: boolean = false; //用户编辑弹窗
    severWxDialog: boolean = false; //客服微信填写
    vipInforDialog: boolean = false; //vip信息弹框修改

    //数据绑定


    userId: number = null; //用户id
    userIdA: number = null; //用户idA
    userIdB: number = null; //用户idB
    phone: number = null; //手机号
    state: number = 0; //状态
    month: number = 1; //月份
    day: number = 1; //日期
    newDay: number = 1; //修改日期
    newMonth: number = 1; //修改月份
    page: number = 1; //当前页数
    count: number = 10; //当前条数
    totalCount: number = 0; //数据条数
    addUserId: number = null; //添加Vip用户

    userCode: string = ""; //用户状态
    userDescrptton: string = ""; //用户概述
    logginContent: string = ""; //日志记录编辑
    recordUser: string = ""; //记录人
    weixinId: string = ""; //微信号
    pid: string = ""; //项目id
    VipInformationDialog: string = ""; //Vip弹窗信息修改
    vipInforText: string = ""; //Vip信息中转变量

    pidList: Array<any> = []; //项目列表
    informationList: Array<any> = []; //信息库列表数据
    rsgTime: Array<string> = []; //注册时间
    loginTime: Array<string> = []; //登陆时间
    maintainTime: Array<string> = []; //维护时间
    informationData: Array<string> = []; //信息列表数据
    recordDialogTime: Array<string> = []; //记录时间
    logginList: Array<string> = []; //日志记录列表
    userIdDialogData: Array<any> = []; //用户ID详细记录

    fillterArray: Array<string> = ["用户微信", "微信备注", "用户手机号", "年龄", "生日", "职业", "城市"]; //信息赛选

    //日志修改添加数据
    recordQueryItem = {
        uid: 0,
        opt: "",
        logContent: "",
        logTime: ""
    }

    stateList: Array<object> = [{
        id: 0,
        name: "全部"
    },
    {
        id: 1,
        name: "未联系"
    },
    {
        id: 2,
        name: "正常"
    },
    {
        id: 3,
        name: "预警"
    },
    {
        id: 4,
        name: "流失"
    }];//状态列表 

    //雷达
    option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['金花', '牛牛', '百人牛牛', '红黑', '龙虎', '跑得快', '经典牛牛', '斗地主', '德州扑克', '捕鱼', '麻将', '红包'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '40%',
                data: []
            }
        ]
    };

    created() {
        this.pidList = [
            { name: "全部", pid: "" },
            ...JSON.parse(<string>sessionStorage.getItem("pid"))
        ];
        this.loadData();
    }
    initEchart() {
        let chart = echarts.init(document.getElementById("echart"));
        chart.setOption(this.option);
    }
    initQueryItem(pid, uid, wx, phone, state, rsgTime, loginTime, maintainTime, page, count) {
        let queryItem: QueryItem = {
            pid: pid,
            uid: uid,
            wx: wx,
            phone: phone,
            state: state == 0 ? null : state,
            registerTimeStart: rsgTime && rsgTime.length == 2 ? rsgTime[0] : null,
            registerTimeEnd: rsgTime && rsgTime.length == 2 ? rsgTime[1] : null,
            loginTimeStart: loginTime && loginTime.length == 2 ? loginTime[0] : null,
            loginTimeEnd: loginTime && loginTime.length == 2 ? loginTime[1] : null,
            serveTimeStart: maintainTime && maintainTime.length == 2 ? maintainTime[0] : null,
            serveTimeEnd: maintainTime && maintainTime.length == 2 ? maintainTime[1] : null,
            page: page,
            count: count
        }
        return queryItem
    }
    loadData() {
        this.loading = true;
        let queryItem = this.initQueryItem(this.pid, this.userId, this.weixinId, this.phone, this.state, this.rsgTime, this.loginTime, this.maintainTime, this.page, this.count);
        vipList(queryItem).then(res => {
            if (res.data.code == 200) {
                this.informationData = res.data.msg.data;
                this.totalCount = res.data.msg.totalCount;
                this.$message({
                    type: "success",
                    message: "搜索成功"
                })
                this.loading = false;
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
            this.loading = false;
        })
    }
    SearchData() {
        this.page = 1;
        this.count = 10;
        this.loadData();
    }
    ExcelData() {
        let queryItem = this.initQueryItem(this.pid, this.userId, this.weixinId, this.phone, this.state, this.rsgTime, this.loginTime, this.maintainTime, this.page, this.count);
        exportVipList(queryItem).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "导出成功"
                })
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })

    }
    //修改信息库数据
    changeVipData(name) {
        let data: ChangeData = {
            uid: this.userIdA,
            newMonth: this.month,
            newDay: this.day,
            newValue: this.userDescrptton
        }
        this.$confirm('此操作将修改Vip用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            changeVipAll(data, name).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.userIdDialog = false;
                    this.severWxDialog = false;
                    this.vipInforDialog = false;
                    this.loadData();
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });
        });
    }
    //双击表格
    //初始最后游戏
    initLastGame(data) {
        let game = data.lastGid;
        switch (game) {
            case "QZNN": game = "牛牛"; break;
            case "JH": game = "金花"; break;
            case "XUEZHAN": game = "血战"; break;
            case "SUOHA": game = "梭哈"; break;
            case "BRNN": game = "百人牛牛"; break;
            case "DDZ": game = "斗地主"; break;
            case "HH": game = "红黑"; break;
            case "BY": game = "捕鱼"; break;
            case "JDNN": game = "经典牛牛"; break;
            case "PDK": game = "跑得快"; break;
            case "LH": game = "龙虎"; break;
            case "ERMJ": game = "二人麻将"; break;
            case "DZPK": game = "德州扑克"; break;
            case "EBG": game = "二八杠"; break;
            case "DFDC": game = "多福多财"; break;
            case "QHB": game = "抢红包"; break;
            default: return "还没有玩游戏";
        }
        return game;
    }
    switchTable(row, column) {
        if (column.label == "用户ID") {
            this.userIdA = row.uid;
            if (row.birthday) {
                this.month = row.birthday.month;
                this.day = row.birthday.day;
            } else {
                this.month = 1;
                this.day = 1;
            }
            this.userIdDialog = true;
            vipDetail({ uid: this.userIdA }).then(res => {
                if (res.data.code == 200) {
                    this.userIdDialogData = res.data.msg;
                    this.option.series[0].data = [
                        res.data.msg.jinhuaRound,
                        res.data.msg.niuniuRound,
                        res.data.msg.brniuniuRound,
                        res.data.msg.hongheiRound,
                        res.data.msg.longhuRound,
                        res.data.msg.paodekuaiRound,
                        res.data.msg.jdniuniuRound,
                        res.data.msg.doudizhuRound,
                        res.data.msg.dezhoupukeRound,
                        res.data.msg.buyuRound,
                        res.data.msg.ermjRound,
                        res.data.msg.qianghongbaoRound
                    ]
                    this.userDescrptton = res.data.msg.description;
                    this.initEchart();
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }
        if (column.label == "维护日志") {
            this.userIdA = row.uid;
            this.recordDialogA = true;
            this.loadDialogData();
        }
        if (column.label == "客服微信") {
            this.userIdA = row.uid;
            if (row.birthday) {
                this.month = row.birthday.month;
                this.day = row.birthday.day;
            } else {
                this.month = 1;
                this.day = 1;
            }
            this.VipInformationDialog = row.serviceWx;
            this.severWxDialog = true;
        }
        if (this.fillterArray.some(el => el == column.label)) {
            this.userIdA = row.uid;
            if (row.birthday) {
                this.month = row.birthday.month;
                this.day = row.birthday.day;
            } else {
                this.month = 1;
                this.day = 1;
            }
            this.vipInforText = column.label;
            this.VipInformationDialog = "";
            this.vipInforDialog = true;
        }
    }
    //弹窗数据列表加载
    loadDialogData() {
        this.loadingB = true;
        getVipLogByUid({
            uid: this.userIdA,
            opt: this.recordUser,
            startTime: this.recordDialogTime && this.recordDialogTime.length == 2 ? this.recordDialogTime[0] : null,
            endTime: this.recordDialogTime && this.recordDialogTime.length == 2 ? this.recordDialogTime[1] : null
        }).then(res => {
            if (res.data.code == 200) {
                this.logginList = res.data.msg;
                this.loadingB = false;
                this.$message({
                    type: 'success',
                    message: '搜索成功!'
                });
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
            this.loadingB = false;
        })
    }
    bindClass(row) {
        if (row.column.label == "用户ID" || row.column.label == "客服微信" || row.column.label == "维护日志") {
            return "handlehover"
        }
        if (this.fillterArray.some(el => el == row.column.label)) {
            return "handlehover"
        }
    }
    informationStyle(row) {
        if (row.column.label == "用户ID") {
            return { "color": "blue" }
        }
        if (row.column.label == "客服微信") {
            return { "color": "green" }
        }
        if (this.fillterArray.some(el => el == row.column.label)) {
            return { "color": "green" }
        }
        if (row.column.label == "状态") {
            switch (row.row.state) {
                case 1: return { "color": "#ccc" }; break;
                case 2: return { "color": "black" }; break;
                case 3: return { "color": "orange" }; break;
                case 4: return { "color": "red" }; break;
            }
        }

    }
    //状态修改
    stateFormat(row) {
        switch (row.state) {
            case 1: return "未联系"; break;
            case 2: return "正常"; break;
            case 3: return "预警"; break;
            case 4: return "流失"; break;
        }
    }
    //记录人搜索
    SearchRecordData() {
        this.loadDialogData();
    }
    //导出记录人数据
    excelRecordData() {
        exportVipLogExcel({
            uid: this.userIdA,
            opt: this.recordUser,
            startTime: this.recordDialogTime && this.recordDialogTime.length == 2 ? this.recordDialogTime[0] : null,
            endTime: this.recordDialogTime && this.recordDialogTime.length == 2 ? this.recordDialogTime[1] : null
        }).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: 'success',
                    message: '导出成功!'
                });
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
    }
    //新增记录人日志数据
    addRecordData() {
        this.recordDialogB = true;
        this.logginContent = "";
    }
    upAddRecord() {
        this.$confirm('此操作将添加日志信息信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            addVipLog({
                uid: this.userIdA,
                logContent: this.logginContent
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.recordDialogB = false;
                    this.loadDialogData();
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消添加'
            });
        });
    }
    //修改用户概述
    editUserDescription() {
        this.changeVipData("desc");
    }
    //内层弹窗退出
    backRecordDialogA() {
        this.recordEditDialogB = false;
        this.recordDialogB = false;
    }
    //日志记录编辑
    editRecord(row) {
        this.recordEditDialogB = true;
        this.logginContent = row.logContent;
        this.recordQueryItem = {
            uid: this.userIdA,
            opt: row.opt,
            logContent: this.logginContent,
            logTime: row.logTime
        }
    }
    upEditRecord() {
        this.recordQueryItem.logContent = this.logginContent;
        this.$confirm('此操作将修改日志信息信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            updateVipLog(this.recordQueryItem).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.recordEditDialogB = false;
                    this.loadDialogData();
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });
        });
    }
    //客服微信弹窗
    backInformation() {
        this.severWxDialog = false;
        this.vipInforDialog = false;
    }
    upAddSeverWx() {
        this.userDescrptton = this.VipInformationDialog;
        this.changeVipData("serviceWx");
    }
    // 信息修改弹框
    upChangeVip() {
        this.userDescrptton = this.VipInformationDialog;
        switch (this.vipInforText) {
            case "城市": this.changeVipData("city"); break;
            case "微信备注": this.changeVipData("wxRemark"); break;
            case "用户手机号": this.changeVipData("phone"); break;
            case "年龄": this.changeVipData("age"); break;
            case "职业": this.changeVipData("occupation"); break;
            case "生日": this.month = this.newMonth; this.day = this.newDay; this.changeVipData("birthday"); break;
            case "用户微信": this.changeVipData("wx"); break;
        }
    }
    //vip用户添加
    addVipUser() {
        this.$confirm('此操作将新增Vip用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            addVipUser({ uid: this.addUserId }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
                    this.loadData();
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消添加'
            });
        });
    }
    //当前页回调
    handleCurrentChange(val) {
        this.page = val;
        this.loadData();
    }
    //当前条数回调
    handleSizeChange(val) {
        this.count = val;
        this.loadData();
    }
    //时间格式
    initData(row) {
        if (row) {
            let date = new Date(row);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate
        }
    }
    localeSumDateFormatter(row, column, index) {
        let sdate;
        switch (column.label) {
            case "注册时间": sdate = this.initData(row.registerTime); break;
            case "最后登录时间": sdate = this.initData(row.lastLoginTime); break;
            case "最后维护时间": sdate = this.initData(row.lastServeTime); break;
            case "记录时间": sdate = this.initData(row.logTime); break;
        }
        return sdate;
    }
    birthdayFormat(row) {
        let birthday
        if (row.birthday) {
            birthday = row.birthday.month + "月" + row.birthday.day + "日";
        }
        else {
            birthday = null;
        }
        return birthday
    }
    handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => { });
    }
    pidFormatter(row) {
        let pid;
        this.pidList.forEach(item => {
            if (item.pid == row.pid) {
                pid = item.name
            }
        })
        return pid
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
.userId_title {
    text-align: center;
    border-bottom: 1px solid black;
    width: 100%;
}
.blue .cell {
    color: blue;
}
#echart {
    height: 500px;
    width: 100%;
}
.gameVet {
    display: flex;
    margin: 10px 30px;
    font-size: 20px;
    justify-content: space-between;
}
.handlehover:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>