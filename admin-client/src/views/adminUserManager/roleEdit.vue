<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="角色编辑"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">admin角色编辑</span>
            </el-col>
            <!--工具条-->
            <span class="content_font"></span>
            <span style="position:absolute; right:0; top:1">
                <el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus" @click="insertClick('admin')">添加</el-button>
            </span>
            <!--列表-->
            <el-table :data="roleEdit.roleAdminData" border highlight-current-row style="width: 100%;" max-height="600">
                <el-table-column prop="name" label="角色名" min-width="100" align="center"></el-table-column>
                <el-table-column prop="pages" label="页面权限" min-width="100" align="center" :formatter="pagesDateFunc"></el-table-column>
                <el-table-column prop="nodes" label="节点权限" min-width="100" align="center" :formatter="nodesDateFunc"></el-table-column>
                <el-table-column label="操作" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="editMineClick(scope.$index, scope.row ,'admin')">编辑本角色</el-button>
                        <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="editSonClick(scope.$index, scope.row ,'admin')">编辑子角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleADCurrentChange" @size-change="handleADSizeChange" :current-page="adpage" :page-sizes="[10,20,30,50]" :page-size="adcount" :total="roleEdit.adminTotalCount"></el-pagination>
            </el-col>
        </el-card>
        <el-dialog :visible.sync="addRoleVisible" title="新建角色">
            <span style="font-size:12pt; margin:10px 0px 10px 64px">角色名称</span>
            <el-input type="text" style="width:200px; margin:10px 30px 10px 20px" v-model="addRoleName"></el-input>
            <div style="margin:10px 0px 10px 34px">
                <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 20px" class="checkbox" label="是否能编辑客服微信号" borde v-model="addEditVipServiceWx"></el-checkbox>
                <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 60px" class="checkbox" label="是否能查看vip玩家手机号" borde v-model="addSeeVipPhoneNumber"></el-checkbox>
            </div>
            <div style="margin:10px 0px 10px 34px">
                <span v-for="(item, index) in currtPages" :key="index">
                    <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 20px" class="checkbox" :label="item.alias" borde v-model="item.isChoose"></el-checkbox>
                </span>
            </div>
            <div style="margin:10px 0px 10px 34px">
                <span v-for="(item, index) in currtNodes" :key="index">
                    <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 20px" class="checkbox" :label="item.alias" borde v-model="item.isChoose"></el-checkbox>
                </span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddRole">取 消</el-button>
                <el-button type="primary" @click="saveAddRole">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="editRoleVisible" title="编辑角色">
            <span style="font-size:12pt; margin:10px 0px 10px 64px">角色名称</span>
            <el-input type="text" style="width:200px; margin:10px 30px 10px 20px" v-model="addRoleName"></el-input>
            <div style="margin:10px 0px 10px 34px">
                <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 20px" class="checkbox" label="是否能编辑客服微信号" borde v-model="canEditVipServiceWx"></el-checkbox>
                <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 60px" class="checkbox" label="是否能查看vip玩家手机号" borde v-model="canSeeVipPhoneNumber"></el-checkbox>
            </div>
            <div style="margin:10px 0px 10px 34px">
                <span v-for="(item, index) in currtPages" :key="index">
                    <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 20px" class="checkbox" :label="item.alias" borde v-model="item.isChoose"></el-checkbox>
                </span>
            </div>
            <div style="margin:10px 0px 10px 34px">
                <span v-for="(item, index) in currtNodes" :key="index">
                    <el-checkbox type="text" style="width:100px; font-size:12pt; margin:5px 20px" class="checkbox" :label="item.alias" borde v-model="item.isChoose"></el-checkbox>
                </span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditRole">取 消</el-button>
                <el-button type="primary" @click="saveEditRole">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="sonRoleVisible" title="子角色" width="1000px">
            <span class="title">子角色</span>
            <span style="position:absolute; right:0; top:1">
                <el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus" @click="insertClick('son')">添加</el-button>
            </span>
            <div style=" margin:20px 0px 30px 0px">
                <el-table :data="roleEdit.sonData" border highlight-current-row style="width: 100%;" max-height="600">
                    <el-table-column prop="name" label="角色名" min-width="60" align="center"></el-table-column>
                    <el-table-column prop="pages" label="页面权限" min-width="100" align="center" :formatter="pagesDateFunc"></el-table-column>
                    <el-table-column prop="nodes" label="节点权限" min-width="100" align="center" :formatter="nodesDateFunc"></el-table-column>
                    <el-table-column label="操作" min-width="80" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="editMineClick(scope.$index, scope.row)">编辑本角色</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleSONCurrentChange" @size-change="handleSONSizeChange" :current-page="sonpage" :page-sizes="[10,20,30,50]" :page-size="soncount" :total="roleEdit.sonTotalCount"></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { RoleEditState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
import { getRoleEdit } from '../../api/admin/adminUserManager/adminUserManager'
//RoleEdit
interface QueryItem {
    type?: string;
    page?: number;
    count?: number;
    parentName?: string;
}

interface currtPowers {
    alias?: string;
    name?: string;
    isChoose?: boolean;
}

interface createDatetyep {
    name: string;
    parentName?: string;
    type: string;
    pages: string[];
    nodes: string[];
    canEditVipServiceWx?: boolean;
    canSeeVipPhoneNumber?: boolean;
}

interface upadteDataType {
    name: string;
    pages: string[];
    nodes: string[];
    canEditVipServiceWx?: boolean;
    canSeeVipPhoneNumber?: boolean;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RoleEdit extends Vue {
    // lifecycle hook
    created() {
        this.loadAdminData(); //初始化-->加载数据
        this.loadChannelData(); //初始化-->加载数据
        this.loadPower();
    }
    /*inital data*/
    roleEdit: RoleEditState = this.$store.state.roleEdit; //表单数据
    adpage: number = 1; //当前页
    adcount: number = 10;
    chpage: number = 1; //当前页
    chcount: number = 10;
    sonpage: number = 1; //当前页
    soncount: number = 10;

    addRoleVisible: boolean = false;
    sonRoleVisible: boolean = false;
    editRoleVisible: boolean = false;
    canEditVipServiceWx: boolean = false;
    canSeeVipPhoneNumber: boolean = false;
    addEditVipServiceWx: boolean = false;
    addSeeVipPhoneNumber: boolean = false;

    currentParentName: string = "";
    currtType: string = "";
    addRoleName: string = "";
    currentPower: string[] = [];

    currtPages: currtPowers[] = [];
    currtNodes: currtPowers[] = [];

    loadAdminData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.adpage;
        queryItem.count = this.adcount;
        queryItem.type = "admin";
        myDispatch(this.$store, "GetAdminRoleEdit", queryItem, true).then(res => {
        });
    }
    getRoleEditChecked(name) {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.adpage;
        queryItem.count = this.adcount;
        queryItem.type = "admin";
        getRoleEdit(queryItem).then(res => {
            res.data.msg.data.forEach(element => {
                if (element.name == name) {
                    this.canEditVipServiceWx = element.canEditVipServiceWx;
                    this.canSeeVipPhoneNumber = element.canSeeVipPhoneNumber;
                }
            });
        })
    }
    loadChannelData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.chpage;
        queryItem.count = this.chcount;
        queryItem.type = "channel";
        myDispatch(this.$store, "GetChannelRoleEdit", queryItem, true).then(() => {
        });
    }

    loadSonData() {
        if (this.currentParentName === "" || this.currentParentName === undefined) {
            return;
        }
        let queryItem: QueryItem | undefined = {};
        queryItem.page = this.sonpage;
        queryItem.count = this.soncount;
        queryItem.parentName = this.currentParentName;
        myDispatch(this.$store, "GetSonRoleEdit", queryItem, true).then(() => { });
    }

    loadPower() {
        myDispatch(this.$store, "GetPower", {}, true).then(() => {
            this.roleEdit.pages.forEach(a => {
                let tmp: currtPowers = {};
                tmp.alias = a.alias;
                tmp.name = a.name;
                tmp.isChoose = false;
                this.currtPages.push(tmp);
            });
            this.roleEdit.nodes.forEach(a => {
                let tmp: currtPowers = {};
                tmp.alias = a.alias;
                tmp.name = a.name;
                tmp.isChoose = false;
                this.currtNodes.push(tmp);
            });
        });
    }

    editMineClick(index, row, type) {
        this.currtType = type;
        this.addRoleName = row.name;
        this.getRoleEditChecked(row.name);
        this.currtPages.forEach(b => {
            b.isChoose = false;
        });
        this.currtNodes.forEach(b => {
            b.isChoose = false;
        });
        row.pages.forEach(a => {
            this.currtPages.forEach(b => {
                if (a === b.name) {
                    b.isChoose = true;
                }
            });
        });

        row.nodes.forEach(a => {
            this.currtNodes.forEach(b => {
                if (a === b.name) {
                    b.isChoose = true;
                }
            });
        });

        this.editRoleVisible = true;
    }

    closeEditRole() {
        this.editRoleVisible = false;
    }

    saveEditRole() {
        let upateData: upadteDataType = {
            name: "",
            nodes: [],
            pages: [],
            canEditVipServiceWx: this.canEditVipServiceWx,
            canSeeVipPhoneNumber: this.canSeeVipPhoneNumber
        };
        upateData.name = this.addRoleName;

        let nodeArr: any[] = [];
        let pageArr: any[] = [];
        this.currtNodes.forEach(a => {
            if (a.isChoose) {
                nodeArr.push(a.name);
            }
        });
        this.currtPages.forEach(a => {
            if (a.isChoose) {
                pageArr.push(a.name);
            }
        });

        upateData.pages = pageArr;
        upateData.nodes = nodeArr;

        this.$confirm("此操作将修改角色,是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                myDispatch(this.$store, "UpdateRoleEdit", upateData)
                    .then(() => {
                        if (this.roleEdit.addCode == 200) {
                            this.$message({
                                type: "success",
                                message: "修改成功!"
                            });
                            this.editRoleVisible = false;
                            this.loadAdminData();
                            this.loadChannelData();
                            this.loadSonData();
                            return;
                        }
                    })
                    .catch(err => {
                        console.error("err:", err);
                        this.$message({
                            type: "error",
                            message: "修改失败!"
                        });
                        this.editRoleVisible = false;
                        this.loadAdminData();
                        this.loadChannelData();
                        this.loadSonData();
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消修改"
                });
                this.editRoleVisible = false;
            });
    }

    editSonClick(index, row, type) {
        this.currtType = type;
        this.currentParentName = row.name;
        this.sonRoleVisible = true;
        this.loadSonData();
    }

    insertClick(type) {
        this.addEditVipServiceWx = false;
        this.addSeeVipPhoneNumber = false;
        if (type === "son") {
        } else {
            this.currtType = type;
        }
        this.addRoleName = "";
        this.currtNodes.forEach(a => {
            a.isChoose = false;
        });
        this.currtPages.forEach(a => {
            a.isChoose = false;
        });

        this.addRoleVisible = true;
    }

    closeAddRole() {
        this.addRoleVisible = false;
    }

    saveAddRole() {
        let createData: createDatetyep = {
            name: "",
            type: "",
            parentName: undefined,
            nodes: [],
            pages: [],
            canEditVipServiceWx: this.addEditVipServiceWx,
            canSeeVipPhoneNumber: this.addSeeVipPhoneNumber
        };
        if (
            this.currentParentName != "" &&
            this.currentParentName != undefined &&
            this.sonRoleVisible
        ) {
            createData.parentName = this.currentParentName;
        }
        createData.name = this.addRoleName;
        createData.type = this.currtType;
        let nodeArr: any[] = [];
        let pageArr: any[] = [];
        this.currtNodes.forEach(a => {
            if (a.isChoose) {
                nodeArr.push(a.name);
            }
        });
        this.currtPages.forEach(a => {
            if (a.isChoose) {
                pageArr.push(a.name);
            }
        });
        createData.pages = pageArr;
        createData.nodes = nodeArr;

        this.$confirm("此操作将添加新角色,是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                myDispatch(this.$store, "AddRoleEdit", createData)
                    .then(() => {
                        if (this.roleEdit.addCode == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功!"
                            });
                            this.addRoleVisible = false;
                            this.loadAdminData();
                            this.loadChannelData();
                            this.loadSonData();
                            return;
                        }
                    })
                    .catch(err => {
                        console.error("err:", err);
                        this.$message({
                            type: "error",
                            message: "添加失败!"
                        });
                        this.addRoleVisible = false;
                        this.loadAdminData();
                        this.loadChannelData();
                        this.loadSonData();
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消添加"
                });
                this.addRoleVisible = false;
            });
    }

    //获取查询条件
    getQueryItem() {
        let temp: QueryItem = {};

        return temp;
    }
    //日期整形
    timeFormat1(row, column) {
        let date = new Date(row.transferTime);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    timeFormat2(row, column) {
        let date = new Date(row.logTime);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    //页码变更
    handleADCurrentChange(val) {
        this.adpage = val;
        this.loadAdminData();
    }
    //每页显示数据量变更
    handleADSizeChange(val) {
        this.adcount = val;
        this.loadAdminData();
    }

    //页码变更
    handleCHCurrentChange(val) {
        this.chpage = val;
        this.loadChannelData();
    }
    //每页显示数据量变更
    handleCHSizeChange(val) {
        this.chcount = val;
        this.loadChannelData();
    }

    handleSONCurrentChange(val) {
        this.sonpage = val;
        this.loadSonData();
    }
    //每页显示数据量变更
    handleSONSizeChange(val) {
        this.soncount = val;
        this.loadSonData();
    }

    submitTimeFunc(row, column) {
        if (row.createTime) {
            let date = new Date(row.createTime);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate;
        } else {
            return "";
        }
    }

    sumDateFunc(row, column) {
        let date = new Date(row.sumDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    pagesDateFunc(row, column) {
        let arr: any = [];
        row.pages.forEach(a => {
            this.currtPages.forEach(b => {
                if (a == b.name) {
                    arr.push(b.alias);
                }
            })
        })
        return arr.join(",");
    }

    nodesDateFunc(row, column) {

        let arr: any = [];
        row.nodes.forEach(a => {
            this.currtNodes.forEach(b => {
                if (a == b.name) {
                    arr.push(b.alias);
                }
            })
        })
        return arr.join(",");
    }

    billRecordsTime(row, column) {
        if (row.time) {
            let date = new Date(row.time);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate;
        } else {
            return "";
        }
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
.toolbar1 {
    padding: 5px;
    background-color: #f9fafc;
    border: 2px;
    display: block;
    margin: 0;
}
.toolbar2 {
    padding: 30px;
    background-color: #f9fafc;
    border: 2px;
    margin: 0px 0px;
}
.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}
</style>
