<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道账号管理"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">渠道账号管理</span>
                <span class="headerBtn">
                    <span class="text">项目</span>
                    <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
                        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                    </el-select>
                    <span class="text">搜索</span>
                    <el-input class="handleSearch" v-model="searchUser" placeholder="请输入要搜索的管理员"></el-input>
                    <el-button class="filter-item" @click="searchData" type="primary" icon="plus">搜索</el-button>
                    <el-button class="filter-item" @click="handleCreate" type="primary" icon="plus">添加</el-button>
                </span>
            </el-col>
            <el-table :data="tableData" border highlight-current-row style="width: 99%;">
                <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat"></el-table-column>
                <el-table-column label="管理员" min-width="200" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.act}}</span>
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
                            <i class="el-icon-edit"></i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="子管理员数据" min-width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showMember(scope.$index, scope.row)">详细信息</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="渠道" min-width="250" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.channels.join(',')}}</span>
                        <el-button type="text" @click="editChannels(scope.$index, scope.row)">
                            <i class="el-icon-edit"></i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="deleteLeader(scope.$index, scope.row)">
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[1,10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
            </el-col>
            <!-- 添加新成员信息 -->
            <el-dialog :visible.sync="dialogMemberVisible" @close="close">
                <el-form class="small-space" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                    <el-form-item label="成员账号">
                        <el-input v-model="memberAct"></el-input>
                    </el-form-item>
                    <el-form-item label="成员密码">
                        <el-input v-model="memberPwd"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="兑换显示"><el-checkbox v-model="editAuthority"></el-checkbox></el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="memberCancel">取 消</el-button>
                    <el-button type="primary" @click="memberConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 添加用户 -->
            <el-dialog :visible.sync="dialogInsertVisible" @close="close">
                <span style="width: 400px; margin-left:50px;">项目</span>
                <el-select v-model="pid" placeholder="请选择pid" style="margin:25px 20px 5px 10px;width:110px;">
                    <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <el-form class="small-space" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                    <el-form-item label="管理者账号">
                        <el-input v-model="newAct"></el-input>
                    </el-form-item>
                    <el-form-item label="管理者密码">
                        <el-input v-model="newPwd"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="兑换显示"><el-checkbox v-model="newWidthDraw"></el-checkbox></el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelInsert">取 消</el-button>
                    <el-button type="primary" @click="InsertConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑成员渠道 -->
            <el-dialog :visible.sync="dialogEditMemberChannelVisible" @close="close">
                <el-form class="small-space" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                    <el-form-item label="成员账号">
                        <span>{{newMember}}</span>
                    </el-form-item>
                    <el-form-item label="成员渠道">
                        <el-input v-model="newMemChannel"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelMemEditChannel">取 消</el-button>
                    <el-button type="primary" @click="editMemChannelConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑管理者渠道 -->
            <el-dialog :visible.sync="dialogEditChannelVisible" @close="close">
                <el-form class="small-space" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
                    <el-form-item label="管理者账号">
                        <span>{{newAct}}</span>
                    </el-form-item>
                    <el-form-item label="管理者渠道">
                        <el-input v-model="editChannel"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEditChannel">取 消</el-button>
                    <el-button type="primary" @click="editChannelConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑渠道用户信息 -->
            <el-dialog :visible.sync="dialogEditVisible">
                <el-form class="small-space" label-position="left" label-width="70px" style="width: 50%; margin-left:50px;">
                    <el-form-item label="账号">
                        <span>{{curAct}}</span>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="editPwd" style="width: 200px"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="兑换显示"><el-checkbox v-model="editAuthority"></el-checkbox></el-form-item> -->
                    <el-form-item label="结算开关">
                        <el-checkbox v-model="settlementSwitch"></el-checkbox>
                        <el-select v-model="setType" style="margin:0 10px; width:110px">
                            <el-option v-for="item in setTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 各种权限选项 -->
                    <span style="display:inline-block;margin:20px 0;">页面权限配置</span>
                    <el-checkbox-group v-model="pagePermission" style="width:190%">
                        <el-checkbox-button v-for="option in pagePermissions" :label="option" :key="option" style="margin:5px 10px; border: 50px">{{option}}</el-checkbox-button>
                    </el-checkbox-group>
                    <span style="display:inline-block;margin:20px 0;">页面内部节点权限配置</span>
                    <el-checkbox-group v-model="domPermission" style="width:190%">
                        <el-checkbox-button v-for="option in domPermissions" :label="option" :key="option" style="margin:5px 10px; border: 50px">{{option}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">取 消</el-button>
                    <el-button type="primary" @click="update">确 定</el-button>
                </div>
            </el-dialog>
            <!--  -->
            <el-dialog :visible.sync="dialogSonVisible" width="60%">
                <el-button style="margin-left: 10px;" @click="handleMemeberCreate" type="primary" icon="edit">添加</el-button>
                <el-table :data="sonMembers" border highlight-current-row style="width: 100%;margin-bottom:25px">
                    <el-table-column prop="act" label="账号" width="130" align="center"></el-table-column>
                    <el-table-column label="渠道" min-width="200" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.channels.join(',')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click.native.prevent="editMemFuc(scope.$index, scope.row)">
                                <i class="el-icon-edit"></i>
                            </el-button>&emsp;
                            <el-button type="text" @click.native.prevent="deleteMembers(scope.$index, scope.row)">
                                <i class="el-icon-delete"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-col>
                    <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="memberHandleCurrentChange" @size-change="memberHandleSizeChange" :current-page="memberPage" :page-sizes="[1,10,20,30,50]" :page-size="memberCount" :total="memberTotalCount"></el-pagination>
                </el-col>
            </el-dialog>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { ChannelAccountState } from "../../store/stateInterface";

interface QueryItem {
    pid: string;
    channel?: string;
    page?: number;
    count?: number;
}

const CHANNEL_WITHDRAWSHOW = 0x000000002;
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SubChannelAccountMgr extends Vue {
    channelAccount: ChannelAccountState = this.$store.state.channelAccount;

    setType: string = "税收结算";
    setTypes: any = [
        { value: "税收结算", label: "税收结算" },
        { value: "利润结算", label: "利润结算" }
    ];
    pidList: any[] = [];
    pid: string = "A";
    settlementSwitch: boolean = false;
    pagePermission: string[] = ["主页", "渠道明细"];
    pagePermissions: string[] = [
        "主页",
        "渠道明细",
        "充值统计",
        "新用户统计",
        "留存统计",
        "权限管理",
        "渠道账号信息",
        "扣量比设置",
        "子渠道显示配置",
        "用户信息"
    ];
    domPermission: string[] = [
        "充值金额",
        "在线充值",
        "代理充值",
        "注册用户",
        "绑定用户",
        "绑定率",
        "登录用户",
        "新增充值金额",
        "新增充值人数",
        "充值人数",
        "总税收"
    ];
    domPermissions: string[] = [
        "总营收",
        "充值金额",
        "在线充值",
        "代理充值",
        "总兑换",
        "注册用户",
        "绑定用户",
        "绑定率",
        "登录用户",
        "新增充值金额",
        "新增充值人数",
        "充值人数",
        "总税收",
        "金花税收",
        "牛牛税收",
        "梭哈税收",
        "捕鱼税收",
        "经典牛牛税收",
        "跑得快税收",
        "百人牛牛税收",
        "麻将税收",
        "红黑税收",
        "龙虎斗税收",
        "二人麻将税收",
        "斗地主税收",
        "德州扑克税收",
        "抢红包税收",
        "二八杠税收",
        "多福多财税收",
        "次日留存",
        "三日留存",
        "七日留存",
        "十五日留存",
        "三十日留存",
        "显示扣量"
    ];
    dialogNewVisible: boolean = false;
    dialogEditFormVisible: boolean = false;
    dialogEditVisible: boolean = false;
    dialogInsertVisible: boolean = false;
    dialogSonVisible: boolean = false;
    dialogEditChannelVisible: boolean = false;
    dialogMemberVisible: boolean = false;
    dialogEditMemberChannelVisible: boolean = false;
    curAct: string = "";
    //当前页码
    page: number = 1;
    //默认每页数据量
    count: number = 10;
    totalCount: number = 0;

    memberPage: number = 1;
    memberCount: number = 10;
    memberTotalCount: number = 0;

    act: string = "";
    pwd: string = "";
    data: string = "";
    type: string = "";
    // 搜索的内容
    searchUser: any = "";
    //编辑的用户
    editPwd: string = "";
    editAuthority: any = "";
    //添加用户
    newAct: string = "";
    newPwd: string = "";
    newWidthDraw: string = "";
    //添加新成员
    memberAct: string = "";
    memberPwd: string = "";
    //添加渠道数据
    newMember: string = "";
    newMemChannel: string = "";
    //编辑渠道
    editChannel: string = "";
    tableData: any = [];
    sonMembers: any = [];

    sonIndex: number = 0;

    //生命周期钩子函数
    created() {
        this.loadData();
        this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    }

    //函数
    refresh() {
        this.loadData();
    }

    check(status, constStatus) {
        return (status & constStatus) > 0 ? true : false;
    }
    set(status, constStatus) {
        return status | constStatus;
    }
    unset(status, constStatus) {
        return status & ~constStatus;
    }

    //初始化数据
    loadData() {
        let cond = {
            pid: this.pid,
            page: this.page,
            count: this.count,
            act: this.searchUser
        };
        myDispatch(this.$store, "GetLeader", cond, true)
            .then(() => {
                console.log("搜索成功！", this.searchUser);
                this.tableData = this.channelAccount.leaderData;
                this.totalCount = this.channelAccount.totalCount;
            })
            .catch(ex => {
                console.error(ex);
                this.$message({
                    type: "error",
                    message: ex.message
                });
                return;
            });
    }

    deleteLeader(index, row) {
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("DeleteRelation", {
                        leaderAct: row.act
                    })
                    .then(result => {
                        if (this.channelAccount.deleteCode == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.loadData();
                            return;
                        } else {
                            this.$message({
                                type: "error",
                                message: "删除失败!"
                            });
                            this.loadData();
                            return;
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
    }

    handleEdit(index, row) {
        this.pid = row.pid;
        this.dialogEditVisible = true;
        this.pagePermission = [];
        this.domPermission = [];
        this.settlementSwitch = false;
        myDispatch(this.$store, "GetUserByAct", {
            pid: this.pid,
            act: row.act
        }).then(result => {
            this.curAct = <string>this.channelAccount.userData.act;
            this.editPwd = <string>this.channelAccount.userData.pwd;
            this.editAuthority = this.check(
                this.channelAccount.userData.authority,
                CHANNEL_WITHDRAWSHOW
            );

            let page = {
                homePage: {
                    key: "主页"
                },
                home: {
                    key: "渠道明细"
                },
                charge: {
                    key: "充值统计"
                },
                newUser: {
                    key: "新用户统计"
                },
                retention: {
                    key: "留存统计"
                },
                authority: {
                    key: "权限管理"
                },
                channelAccountInfo: {
                    key: "渠道账号信息"
                },
                channelDiscount: {
                    key: "扣量比设置"
                },
                subChannelDiscount: {
                    key: "子渠道显示配置"
                },
                userInfo: {
                    key: "用户信息"
                }
                //  "financeManage":
                //  {key:"财务管理"}
                //  "settlementAccount":
                //  {key:"结算账户"}
                //  "submitSettlement":
                //  {key:"提交结算"}
                //  "settlementRecords":
                //  {key:"结算记录"}
            };
            let dom = {
                home_totalProfit: {
                    key: "总营收"
                },
                home_showRate: {
                    key: "显示扣量"
                },
                home_chargeTotal: {
                    key: "充值金额"
                },
                home_onlineCharge: {
                    key: "在线充值"
                },
                home_agentCharge: {
                    key: "代理充值"
                },
                home_totalWithdraw: {
                    key: "总兑换"
                },
                home_newUser: {
                    key: "注册用户"
                },
                home_bindCount: {
                    key: "绑定用户"
                },
                home_bindRate: {
                    key: "绑定率"
                },
                home_loginCount: {
                    key: "登录用户"
                },
                home_newUserChargeMoney: {
                    key: "新增充值金额"
                },
                home_newUserChargeUsers: {
                    key: "新增充值人数"
                },
                home_totalChargeUsers: {
                    key: "充值人数"
                },
                home_jinhuaTax: {
                    key: "金花税收"
                },
                home_gameTax: {
                    key: "总税收"
                },
                home_niuniuTax: {
                    key: "牛牛税收"
                },
                home_suohaTax: {
                    key: "梭哈税收"
                },
                home_brniuniuTax: {
                    key: "百人牛牛税收"
                },
                home_buyuTax: {
                    key: "捕鱼税收"
                },
                home_jdniuniuTax: {
                    key: "经典牛牛税收"
                },
                home_paodekuaiTax: {
                    key: "跑得快税收"
                },
                home_xuezhanTax: {
                    key: "麻将税收"
                },
                home_hongheiTax: {
                    key: "红黑税收"
                },
                home_ermjTax: {
                    key: "二人麻将税收"
                },
                home_longhuTax: {
                    key: "龙虎斗税收"
                },
                home_doudizhuTax: {
                    key: "斗地主税收"
                },
                home_dezhoupukeTax: {
                    key: "德州扑克税收"
                },
                home_qianghongbaoTax: {
                    key: "抢红包税收"
                },
                home_erbagangTax: {
                    key: "二八杠税收"
                },
                home_duofuduocaiTax: {
                    key: "多福多财税收"
                },
                retention_retentionDay2: {
                    key: "次日留存"
                },
                retention_retentionDay3: {
                    key: "三日留存"
                },
                retention_retentionDay7: {
                    key: "七日留存"
                },
                retention_retentionDay15: {
                    key: "十五日留存"
                },
                retention_retentionDay30: {
                    key: "三十日留存"
                }
            };
            if (!this.channelAccount.userData.purview) {
                this.pagePermission = ["主页", "渠道明细"];
                this.domPermission = [
                    "充值金额",
                    "在线充值",
                    "代理充值",
                    "注册用户",
                    "绑定用户",
                    "绑定率",
                    "登录用户",
                    "新增充值金额",
                    "新增充值人数",
                    "充值人数",
                    "总税收"
                ];
                this.settlementSwitch = false;
                return;
            }
            let { page: pageArr, dom: domArr } = this.channelAccount.userData.purview;
            for (let k in pageArr) {
                if (k === "financeManage") {
                    this.settlementSwitch = true;
                    if (this.channelAccount.userData.billingType === "taxSet") {
                        this.setType = "税收结算";
                    } else if (this.channelAccount.userData.billingType === "profitSet") {
                        this.setType = "利润结算";
                    }
                } else {
                    let v = page[k];
                    if (v) {
                        this.pagePermission.push(v.key);
                    }
                }
            }
            for (let k in domArr) {
                let v = dom[k];
                this.domPermission.push(v.key);
            }
        });
    }

    cancelEditChannel() {
        this.dialogEditChannelVisible = false;
    }
    memberCancel() {
        this.dialogMemberVisible = false;
    }

    editChannels(index, row) {
        this.dialogEditChannelVisible = true;
        this.newAct = row.act;
        this.editChannel = row.channels.join(",");
    }

    cancelMemEditChannel(index, row) {
        this.dialogEditMemberChannelVisible = false;
        // this.curAct = row.act;
    }

    editMemChannelConfirm() {
        this.$confirm("此操作将永久修改该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("UpdateMembers", {
                        pid: this.pid,
                        leaderAct: this.curAct,
                        memberAct: this.newMember,
                        channels: this.newMemChannel.split(",").map(s => s.trim())
                    })
                    .then(() => {
                        if (this.channelAccount.eidtCode == 200) {
                            this.$message({
                                type: "success",
                                message: "编辑成功!"
                            });
                            this.dialogEditMemberChannelVisible = false;
                            let cond = {
                                pid: this.pid,
                                leader: this.curAct,
                                page: this.memberPage,
                                count: this.memberCount
                            };
                            this.getMembers(cond);
                            return;
                        }
                        if (this.channelAccount.eidtCode == 1307) {
                            this.$message({
                                type: "error",
                                message: "渠道错误,存在不属于父渠道的渠道!"
                            });
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        this.dialogEditMemberChannelVisible = false;
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
    }
    editMemFuc(index, row) {
        this.dialogEditMemberChannelVisible = true;
        this.newMember = row.act;
        this.newMemChannel = row.channels.join(",");
        this.sonIndex = index;
    }
    showMember(index, row) {
        this.pid = row.pid;
        this.dialogSonVisible = true;
        this.curAct = row.act;
        let cond = {
            pid: this.pid,
            leader: this.curAct,
            page: this.memberPage,
            count: this.memberCount
        };
        this.getMembers(cond);
    }
    getMembers(cond) {
        myDispatch(this.$store, "Getmember", cond).then(() => {
            this.sonMembers = this.channelAccount.memberData;
            this.memberTotalCount = this.channelAccount.memberTotalCount;
        });
    }
    deleteMembers(index, row) {
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("DeleteMembers", {
                        pid: row.pid,
                        leaderAct: this.curAct,
                        memberAct: row.act
                    })
                    .then(result => {
                        if (this.channelAccount.deleteCode == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.dialogEditChannelVisible = false;
                            let cond = {
                                pid: row.pid,
                                leader: this.curAct,
                                page: this.memberPage,
                                count: this.memberCount
                            };
                            this.getMembers(cond);
                            return;
                        } else {
                            this.$message({
                                type: "error",
                                message: "操作失败!"
                            });
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        this.dialogEditChannelVisible = false;
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
    }
    editChannelConfirm() {
        this.$confirm("此操作将永久修改该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("UpdateChannel", {
                        pid: this.pid,
                        leaderAct: this.newAct,
                        channels: this.editChannel.split(",").map(s => s.trim())
                    })
                    .then(result => {
                        if (this.channelAccount.eidtCode == 200) {
                            this.$message({
                                type: "success",
                                message: "编辑成功!"
                            });
                            this.dialogEditChannelVisible = false;
                            this.loadData();
                            return;
                        } else {
                            this.$message({
                                type: "error",
                                message: "编辑失败!"
                            });
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        this.dialogEditChannelVisible = false;
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消编辑"
                });
            });
    }

    memberConfirm() {
        this.$confirm("此操作将添加新用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("AddMembers", {
                        pid: this.pid,
                        leaderAct: this.curAct,
                        memberAct: this.memberAct.trim(),
                        memberPwd: this.memberPwd
                    })
                    .then(() => {
                        if (this.channelAccount.addCode == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功!"
                            });
                            this.dialogMemberVisible = false;
                            this.sonMembers.push({
                                act: this.memberAct.trim(),
                                channels: []
                            });
                            this.loadData();
                            return;
                        } else if (this.channelAccount.addCode == 1016) {
                            this.$message({
                                type: "error",
                                message: "账号已存在!"
                            });
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        this.dialogMemberVisible = false;
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
    }

    authOper(row, column) {
        return this.judgeAuth(row.authority);
    }
    judgeAuth(row) {
        let type = "";
        let data = "";
        if (row.childAct == "无") {
            type = "渠道员";
            data = row.channel;
        } else {
            type = "管理员";
            data = row.childAct;
        }
        this.type = type;
        this.data = data;
    }
    convertAuth(type, data) {
        let channel;
        let childAct;
        switch (type) {
            case "管理员":
                {
                    if (Array.isArray(data)) {
                        childAct = data;
                    } else {
                        childAct = data.split(",");
                    }
                    channel = [];
                }
                break;
            case "渠道员":
                {
                    if (Array.isArray(data)) {
                        channel = data;
                    } else {
                        channel = data.split(",");
                    }
                    childAct = [];
                }
                break;
        }
        return {
            channel: channel,
            childAct: childAct
        };
    }

    handleCreate() {
        this.dialogInsertVisible = true;
    }
    handleMemeberCreate() {
        this.dialogMemberVisible = true;
    }
    edit(index, row) {
        this.dialogEditFormVisible = true;
        this.pid = row.pid;
        this.curAct = row.act;
        this.act = row.act;
        this.pwd = row.pwd;
        this.judgeAuth(row);
    }
    cancelEdit() {
        this.dialogEditVisible = false;
    }
    cancelInsert() {
        this.dialogInsertVisible = false;
    }
    update() {
        if (this.editPwd.length < 6) {
            this.$message({
                showClose: true,
                type: "error",
                message: "密码不得小于6位!"
            });
            return;
        }
        let status: any = 1;
        if (this.editAuthority) {
            status = this.set(status, CHANNEL_WITHDRAWSHOW);
        } else {
            status = this.unset(status, CHANNEL_WITHDRAWSHOW);
        }
        //结算开关
        if (this.settlementSwitch) {
            this.pagePermission.push(
                this.setType,
                "结算账户",
                "提交结算",
                "结算记录"
            );
        }
        this.$confirm("此操作将修改该用户信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("UpdateUser", {
                        act: this.curAct,
                        pwd: this.editPwd,
                        pid: this.pid,
                        authority: parseInt(status),
                        pagePermission: this.pagePermission,
                        domPermission: this.domPermission
                    })
                    .then(() => {
                        if (this.channelAccount.eidtCode === 200) {
                            this.$message({
                                type: "success",
                                message: "修改成功!"
                            });
                            this.dialogEditVisible = false;
                            this.pagePermission = [];
                            this.domPermission = [];
                            this.setType = "";
                            this.loadData();
                            return;
                        } else {
                            this.$message({
                                type: "error",
                                message: "操作失败!"
                            });
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        this.dialogEditVisible = false;
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
    }
    InsertConfirm() {
        let status = 1;
        if (this.newWidthDraw) {
            status = status | CHANNEL_WITHDRAWSHOW;
        }
        if (this.newAct === "" || this.newPwd === "" || this.pid === "") {
            this.$message({
                type: "error",
                message: "请输入完整数据!"
            });
        }
        this.$confirm("此操作将添加该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.$store
                    .dispatch("CreateRelation", {
                        leaderAct: this.newAct,
                        leaderPwd: this.newPwd,
                        pid: this.pid,
                        authority: status
                    })
                    .then(() => {
                        if (this.channelAccount.addCode == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功!"
                            });
                            this.dialogInsertVisible = false;
                            this.loadData();
                        } else if (this.channelAccount.addCode == 1016) {
                            this.$message({
                                type: "error",
                                message: "账号已存在!"
                            });
                        }
                    })
                    .catch(ex => {
                        console.error(ex);
                        this.$message({
                            type: "error",
                            message: ex.message
                        });
                        this.dialogInsertVisible = false;
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
    }

    handleCurrentChange(val) {
        this.page = val;
        this.loadData();
    }
    //每页显示数据量变更
    handleSizeChange(val) {
        this.count = val;
        this.loadData();
    }
    memberHandleCurrentChange(val) {
        this.memberPage = val;
        let cond = {
            pid: this.pid,
            leader: this.curAct,
            page: this.memberPage,
            count: this.memberCount
        };
        this.getMembers(cond);
    }
    //每页显示数据量变更
    memberHandleSizeChange(val) {
        this.memberCount = val;
        let cond = {
            pid: this.pid,
            leader: this.curAct,
            page: this.memberPage,
            count: this.memberCount
        };
        this.getMembers(cond);
    }
    //检索数据
    searchData() {
        this.page = 1;
        this.loadData();
    }
    close() {
        this.memberAct = "";
        this.memberPwd = "";
        this.newAct = "";
        this.newPwd = "";
        this.newMemChannel = "";
        this.editChannel = "";
    }
    pidFormat(row, column) {
        let name = "";
        this.pidList.forEach(element => {
            if (element.pid === row.pid) {
                name = element.name;
            }
        });
        return name;
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.headerBtn {
    display: flex;
    position: absolute;
    top: 20px;
    right: 30px;
    justify-content: flex-start;
    .text {
        display: inline-block;
        width: 60px;
        text-align: center;
        line-height: 46px;
    }
    .handleSearch {
        width: 200px;
        input {
            margin-top: 6px;
            width: 200px;
        }
    }
}
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
    padding: 20px;
    background-color: #f9fafc;
    border: 2px;
}
.pag {
    margin: -10px 0px 0px 10px;
    float: right;
}
</style>
