<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="客服配置"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">客服配置</span>
            </el-col>
            <div class="box">
                <br>
                <span>项目</span>
                <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
                    <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <span>玩家ID</span>
                <el-input style="width:200px; margin:0 10px" v-model="userId" placeholder="请输入玩家ID"></el-input>
                <span>微信号</span>
                <el-input style="width:200px; margin:0 10px" v-model="weixinId" placeholder="请输入微信号"></el-input>
                <span>状态</span>
                <el-select v-model="vipCode" placeholder="请选择项目" style="width:120px; margin:10px">
                    <el-option v-for="item in vipCodeList" :key="item.vipCodeId" :label="item.name" :value="item.vipCodeId"></el-option>
                </el-select>
                <el-button type="primary" @click="SearchData" style="margin:10px">搜索</el-button>
                <el-button type="success" @click="addAll" style="margin:10px">批量添加</el-button>
                <el-button type="success" @click="ExcelData" style="margin:10px">导出excel</el-button>
                <el-table v-loading="loading" :cell-class-name="bindClass" @cell-dblclick="handleState" :cell-style="stateColor" :data="weixinData" border style="width: 100%">
                    <el-table-column align="center" prop="KFName" label="客服名称"></el-table-column>
                    <el-table-column align="center" prop="serviceWx" label="客服微信号"></el-table-column>
                    <el-table-column :formatter="pidFormatter" align="center" prop="pid" label="项目"></el-table-column>
                    <el-table-column align="center" :formatter="changeUid" prop="uid" label="分配玩家ID"></el-table-column>
                    <el-table-column align="center" prop="uidNum" label="分配数量"></el-table-column>
                    <el-table-column align="center" prop="state" label="状态"></el-table-column>
                    <el-table-column align="center" :formatter="localeSumDateFormatter" prop="optTime" label="操作时间"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="50">
                        <template slot-scope="scope">
                            <el-button @click="deleteServiceWx(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="total,sizes,prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
                <el-dialog title="批量添加" :visible.sync="addAllCode" width="30%">
                    <el-input type="textarea" placeholder="多个微信号以换行分开(请注意不要有多余的回车)" :autosize="{minRows:6}" v-model="weixinIds"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backCustome">取 消</el-button>
                        <el-button type="primary" @click="upCustome">提 交</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="状态修改" class="state_dialog" :visible.sync="stateDialogCode" width="30%">
                    <el-select v-model="stateCode" placeholder="请选择状态" style="width:120px;">
                        <el-option v-for="item in vipCodeList" :key="item.vipCodeId" :label="item.name" :value="item.vipCodeId"></el-option>
                    </el-select>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backCustome">取 消</el-button>
                        <el-button type="primary" @click="upState">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="项目修改" class="state_dialog" :visible.sync="pidDialogCode" width="30%">
                    <el-select v-model="pidDialog" placeholder="请选择项目" style="width:120px;">
                        <el-option v-for="item in pidListDialog" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                    </el-select>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backCustome">取 消</el-button>
                        <el-button type="primary" @click="upAlterPid">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="名称修改" class="state_dialog" :visible.sync="serverNameDialog" width="30%">
                    <el-input style="width:200px; margin:0 10px" v-model="serverName" placeholder="请输入修改的客服名称"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="backCustome">取 消</el-button>
                        <el-button type="primary" @click="upName">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";
import {
    getCusSer,
    updateWxState,
    exportCusSerCfgsExcel,
    addServiceWx,
    deleteServiceWx,
    updateServicePid,
    updateKFName
} from "../../api/admin/VIPManager/VIPManager"

interface QueryItem {
    pid?: string
    uid?: number
    serviceWx?: string
    state?: number
    page: number
    count: number
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RegressionList extends Vue {
    loading: boolean = true;
    addAllCode: boolean = false; //批量添加弹框状态
    stateDialogCode: boolean = false; //修改状态弹框
    pidDialogCode: boolean = false; //修改状态弹框
    serverNameDialog: boolean = false;

    vipCode: number = null; //vip状态
    stateCode: number = 0;
    vipCodeList: Array<Object> = [
        {
            vipCodeId: 0,
            name: "全部"
        },
        {
            vipCodeId: 1,
            name: "正常"
        },
        {
            vipCodeId: 2,
            name: "异常"
        },
        {
            vipCodeId: 3,
            name: "封停"
        }
    ]; //vip状态数组

    userId: number = null; //玩家ID
    weixinId: string = ""; //微信号
    weixinIds: string = ""; //多个微信号
    pid: string = ""; //项目
    pidDialog: string = ""; //弹框项目
    weixinIdArray: Array<string> = []; //微信号数组
    operateId: string = ""; //操作人
    serverName: string = ""; //客服名字
    page: number = 1; //当前页数
    count: number = 10; //当前条数
    totalCount: number = 0; //数据条数

    pidList: Array<any> = []; //项目列表
    pidListDialog: Array<any> = []; //项目列表弹框
    weixinData: Array<string> = []; //数据列表 
    upstateData = {
        serviceWx: ""
    }

    created() {
        this.pidList = [
            { name: "全部", pid: "" },
            ...JSON.parse(<string>sessionStorage.getItem("pid"))
        ];
        this.pidListDialog = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
        this.loadData();
    }
    activated() {
        this.loadData();
    }
    initQueryItem() {
        let queryItem: QueryItem = {
            pid: this.pid,
            uid: this.userId,
            serviceWx: this.weixinId,
            state: this.vipCode,
            page: this.page,
            count: this.count
        }
        return queryItem
    }
    loadData() {
        this.loading = true;
        let queryItem = this.initQueryItem();
        getCusSer(queryItem).then(res => {
            if (res.data.code == 200) {
                this.weixinData = res.data.msg.message;
                this.totalCount = res.data.msg.logCount.msg;
                this.changeState(this.weixinData);
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
        this.loading = true;
        exportCusSerCfgsExcel({
            uid: this.userId,
            serviceWx: this.weixinId,
            state: this.vipCode
        }).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "导出成功"
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
    //批量添加
    addAll() {
        this.addAllCode = true;
    }
    backCustome() {
        this.pidDialogCode = false;
        this.addAllCode = false;
        this.stateDialogCode = false;
        this.serverNameDialog = false;
    }
    upCustome() {
        this.$confirm('此操作将添加微信号, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            addServiceWx({
                serviceWxs: this.weixinIds.split("\n")
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '提交成功!'
                    });
                    this.SearchData();

                }
                this.addAllCode = false;
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消提交'
            });
        });
    }
    upName() {
        this.$confirm('此操作将修改此名称, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            updateKFName({
                serviceWx: this.upstateData.serviceWx,
                KFName: this.serverName
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.SearchData();
                    this.serverNameDialog = false;
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
    localeSumDateFormatter(row, index) {
        let date = new Date(row.optTime);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    //状态
    changeState(data) {
        data.forEach(element => {
            switch (element.state) {
                case 1: element.state = "正常"; break;
                case 2: element.state = "异常"; break;
                case 3: element.state = "封停"; break;
            }
        });
    }
    handleState(row, column) {
        this.upstateData.serviceWx = row.serviceWx;
        if (column.label == "状态") {
            this.stateDialogCode = true;
            switch (row.state) {
                case "正常": this.stateCode = 1; break;
                case "异常": this.stateCode = 2; break;
                case "封停": this.stateCode = 3; break;
            }
        }
        if (column.label == "项目") {
            this.pidListDialog.forEach(item => {
                if (item.pid == row.pid) {
                    this.pidDialog = item.name
                }
            })
            this.pidDialogCode = true;
        }
        if (column.label == "客服名称") {
            this.serverNameDialog = true;
            this.serverName = row.KFName;
        }
    }
    stateColor(row) {
        if (row.column.label == "状态") {
            switch (row.row.state) {
                case "正常": return { "color": "green" }; break;
                case "异常": return { "color": "orange" }; break;
                case "封停": return { "color": "red" }; break;
            }
        }

    }
    bindClass(row) {
        if (row.column.label == "状态") {
            return "handlehover"
        }
    }
    upState() {
        if (this.stateCode == 0) {
            this.$message({
                type: 'error',
                message: '请选择一个状态!'
            });
            return
        }
        this.$confirm('此操作将修改状态, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            updateWxState({
                serviceWx: this.upstateData.serviceWx,
                state: this.stateCode
            }).then(res => {
                if (res.data.code == 200) {
                    this.SearchData();
                }
                this.stateDialogCode = false;
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
            this.$message({
                type: 'success',
                message: '提交成功!'
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消提交'
            });
        });
    }
    //玩家ID
    changeUid(row) {
        let uidString = row.uid.join(",");
        return uidString
    }
    //删除客服微信
    deleteServiceWx(row) {
        this.$confirm('是否继续删除这个萌萌哒的微信客服?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteServiceWx({ wx: row.serviceWx }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: "残忍删除"
                    })
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
                message: '已取消删除'
            });
        });
    }
    //平台格式化
    pidFormatter(row) {
        let pid;
        this.pidList.forEach(item => {
            if (item.pid == row.pid) {
                pid = item.name
            }
        })
        return pid
    }
    //平台修改提交
    upAlterPid() {
        this.$confirm('此操作将修改项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            updateServicePid({
                serviceWx: this.upstateData.serviceWx,
                pid: this.pidDialog
            }).then(res => {
                if (res.data.code == 200) {
                    this.SearchData();
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                }
                this.pidDialogCode = false;
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
.stateInput input {
    text-align: center;
    border-style: none;
}
.green input {
    color: green;
}
.yellow input {
    color: yellow;
}
.red input {
    color: red;
}
.state_dialog .el-dialog__body {
    text-align: center;
}
.handlehover:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>