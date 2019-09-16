<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="域名状态管理"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">域名状态管理</span>
            </el-col>
            <div class="box">
                <br>
                <span>项目</span>
                <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
                    <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <span>域名：</span>
                <el-input style="width:260px; margin:0 10px" clearable v-model="domain" placeholder="请输入域名"></el-input>
                <span>主账号：</span>
                <el-input style="width:160px; margin:0 10px" v-model="mainAccount" placeholder="请输入主账号"></el-input>
                <span>渠道：</span>
                <el-input style="width:160px; margin:0 10px" v-model="channel" placeholder="请输入渠道"></el-input>
                <span>状态</span>
                <el-select v-model="status" placeholder="请选择状态" style="width:120px; margin:10px">
                    <el-option v-for="item in statusList" :key="item.status" :label="item.name" :value="item.status"></el-option>
                </el-select>
                <el-button type="primary" @click="SearchData" style="margin:10px">搜索</el-button>
                <el-button type="primary" @click="domainConfig" style="margin:10px">检测设置</el-button>
                <el-button type="danger" @click="AllCloseAlarm" style="margin:10px">移除所有报警</el-button>
                <el-table :data="domainStatusData" v-loading="loading" :cell-style="informationStyle" highlight-current-row border style="width: 100%">
                    <el-table-column :formatter="pidFormatter" align="center" prop="pid" label="平台"></el-table-column>
                    <el-table-column align="center" prop="channel" label="渠道">
                        <template slot-scope="scope">
                            <div class="text_flow">{{scope.row.channel.join("，")}}</div>
                            <el-button v-show="scope.row.channel.length !== 0" @click="tooltip($event)" type="primary" size="mini">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="mainAccount" label="主账号">
                        <template v-if="scope.row.pid.length == 1" slot-scope="scope">
                            <div class="text_flow">{{scope.row.mainAccount.join("，")}}</div>
                            <el-button v-show="scope.row.mainAccount.length !== 0" @click="tooltip($event)" type="primary" size="mini">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :formatter="statusFormatter" prop="status" label="异常类型"></el-table-column>
                    <el-table-column align="center" prop="domain" label="域名"></el-table-column>
                    <el-table-column align="center" :formatter="typeFormatter" prop="domainType" label="域名类型"></el-table-column>
                    <el-table-column align="center" label="报警">
                        <template slot-scope="scope">
                            <el-button @click="closeAlarm(scope.row)" type="danger" size="small">报警解除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="检测设置" :visible.sync="domainDialog" width="30%" :before-close="handleClose">
                    <el-row>
                        <el-col :span="12">
                            <div style="text-align: center" class="grid-content bg-purple">取消后检测时间间隔(分钟)</div>
                        </el-col>
                        <el-col :span="12">
                            <el-input :rows="8" placeholder="请输入修改取消后检测时间间隔" v-model="detectInterval"></el-input>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backInformation">取 消</el-button>
                        <el-button type="primary" @click="update">保存</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from "vue-class-component";
import {    getDomainStatus,
    updateCanceledInterval,
    deleteOne,
    deleteAll
} from "../../api/admin/channelManager/channelManager"
// @Component 修饰符注明了此类为一个 Vue 组件
interface QueryItem {
    pid: string
    channel: string
    mainAccount: string
    status: string
    domain: string
}
@Component
export default class domainStatusManager extends Vue {
    //数据绑定
    loading: boolean = false; //加载状态
    domainDialog: boolean = false; //弹框状态
    pidList: { pid: string, name: string }[]; //平台数组
    statusList: { status: string, name: string }[] = [{ status: "", name: "全部" }, { status: "1", name: "被封" }, { status: "2", name: "备案异常" }]; //平台数组
    pid: string = ""; //项目id
    channel: string = ""; //渠道
    mainAccount: string = ""; //主账号
    status: string = ""; //状态
    domain: string = ""; //域名
    detectInterval: number = 0; //间隔时间

    domainStatusData: Array<any> = []; //数据列表
    fillterArray: Array<string> = ["异常类型", "域名", "域名类型"]; //信息赛选
    created() {
        this.pidList = [
            { name: "全部", pid: "" },
            ...JSON.parse(<string>sessionStorage.getItem("pid"))
        ];
        this.loadData();
    }
    initQueryItem() {
        let queryItem: QueryItem = {
            pid: this.pid,
            channel: this.channel,
            mainAccount: this.mainAccount,
            status: this.status,
            domain: this.domain
        }
        return queryItem
    }
    loadData() {
        this.loading = true;
        let queryItem = this.initQueryItem();
        getDomainStatus(queryItem).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "搜索成功"
                })
                this.domainStatusData = res.data.msg[0].msg;
                this.detectInterval = res.data.msg[1].msg.waitTimeAfterRemove;
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
    closeAlarm(row) {
        this.$confirm('此操作将解除当前警报, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteOne({ domain: row.domain }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '解除成功!'
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
                message: '已取消解除'
            });
        });
    }
    AllCloseAlarm() {
        this.$confirm('此操作将解除所有警报, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteAll().then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '解除成功!'
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
                message: '已取消解除'
            });
        });
    }
    pidFormatter(row) {
        let name = "";
        if (row.pid.length < 2) {
            this.pidList.forEach(item => {
                if (item.pid == row.pid[0]) {
                    name = item.name
                }
            })
        } else {
            name = "多个";
        }
        return name
    }
    statusFormatter(row) {
        switch (row.status) {
            case 1: return "被封"; break;
            case 2: return "备案异常"; break;
        }
    }
    switchType(domain) {
        switch (domain) {
            case 1: return "安卓下载地址"; break;
            case 2: return "ios下载地址"; break;
            case 3: return "入口地址"; break;
            case 4: return "跳转地址"; break;
            case 5: return "游戏内主页"; break;
        }
    }

    typeFormatter(row) {
        let domainType: string = "";
        row.domainType.forEach((element, index) => {
            if (index > 0) {
                domainType = this.switchType(element) + "，" + domainType;
            } else {
                domainType = this.switchType(element) + domainType;
            }

        });
        return domainType
    }
    arrayFromatter(row) {
        if (row.channel) return row.channel.join("，")
        if (row.mainAccount) return row.channel.join("，")
    }
    SearchData() {
        this.loadData();
    }
    domainConfig() {
        this.domainDialog = true;
    }
    update() {
        if (Math.floor(Number(this.detectInterval)) === Number(this.detectInterval) && Number(this.detectInterval) > 0) {
            this.$confirm('此操作将修改取消后检测时间间隔, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateCanceledInterval({ waitTimeAfterRemove: this.detectInterval }).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.domainDialog = false;
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
        } else {
            this.$message({
                type: 'error',
                message: '请填写数字大于0且为整数!'
            });
            return
        }
    }
    backInformation() {
        this.domainDialog = false;
    }
    handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => { });
    }
    informationStyle(row) {
        if (this.fillterArray.some(el => el == row.column.label)) {
            return { "color": "red" }
        }
    }
    tooltip(e) {
        if (e.target.innerHTML == "查看") {
            e.currentTarget.previousElementSibling.classList.remove("text_flow");
            e.target.innerHTML = "隐藏";
        } else {
            e.currentTarget.previousElementSibling.classList.add("text_flow");
            e.target.innerHTML = "查看";
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
.text_flow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>