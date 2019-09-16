<template>
    <el-card class="dashboard-second">
        <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="绑定奖励"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">
            <b>游戏开关</b>
        </span>
        <span style="position:absolute; right:0; top:1">
            <span>项目：</span>
            <el-select v-model="pid" placeholder="请选择pid" style="width:110px">
                <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
            <el-button type="primary" style="margin:0 20px 10px 10px" @click="getSubGameSwitch">读取</el-button>
        </span>
        <el-table :data="subGameSwitch.subGames" border highlight-current-row style="width: 100%;margin-top:10px" key="table">
            <el-table-column label="操作" min-width="80" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">修改</el-button>
                    <el-button type="text" style="color:red" v-if="scope.row.state==6 && scope.row.status & 0x000002000 && !scope.row.refStatus" @click="refund(scope.$index,scope.row)">退款</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="active" label="状态" min-width="80" align="center" :formatter="stateFormat"></el-table-column>
            <el-table-column prop="id" label="游戏" min-width="250" align="center" :formatter="gameFormat"></el-table-column>
            <el-table-column prop="pid" label="项目" min-width="250" align="center" :formatter="pidFormat"></el-table-column>
            <el-table-column prop="idx" label="排序(idx)" min-width="250" align="center"></el-table-column>
        </el-table>
        <el-dialog width="300px" :visible.sync="isEdit">
            <div style="margin:0px 0px 20px 40px;">
                <span>项目:</span>
                <span>{{editPid}}</span>
            </div>
            <div style="margin:0px 0px 20px 40px;">
                <span>游戏:</span>
                <span>{{editId}}</span>
            </div>
            <div style="margin:0px 0px 20px 40px;">
                <span>状态:</span>
                <el-switch v-model="editActive"></el-switch>
            </div>

            <div style="margin:0px 0px 0px 40px;">
                <span>排序:</span>
                <el-input style="width:150px" type="number" min="1" placeholder="请输入数字" v-model="editIdx"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SubGameSwitch } from "../../../store/stateInterface"; //state Interface
import { myDispatch } from "../../../utils/index.js"
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class subGameSwitch extends Vue {
    // lifecycle hook
    created() {
        this.loadData();
    }
    /*inital data*/
    subGameSwitch: SubGameSwitch = this.$store.state.subGameSwitch; //表单数据
    pid = "A";
    pidList: any[] = [];
    curId: string = "";
    isEdit: boolean = false;
    editId: string = "";
    editPid: string = "";
    editIdx = 0;
    editActive: boolean = false;
    gameType = {
        "JH": "金花",
        "BRNN": "百人牛牛",
        "SUOHA": "梭哈",
        "QZNN": "牛牛",
        "XUEZHAN": "血战",
        "DDZ": "斗地主",
        "DZPK": "德州扑克",
        "QHB": "抢红包",
        "EBG": "二八杠",
        "DFDC": "多福多财",
        "HH": "红黑",
        "ERMJ": "二人麻将",
        "LH": "龙虎斗",
        "BY": "捕鱼",
        "JDNN": "经典牛牛",
        "PDK": "跑得快"
    }
    /*method*/
    loadData() {
        myDispatch(this.$store, "GetSubGameSwitch", { pid: this.pid }, true)
            .then(() => { });
        this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    }
    // 修改
    edit(row) {
        this.isEdit = true;
        this.editId = this.gameType[row.id];
        this.curId = row.id;
        this.editPid = row.pid;
        this.editIdx = row.idx;
        this.editActive = row.active;
    }
    confirmEdit() {
        let temp = {
            active: this.editActive,
            idx: this.editIdx,
            pid: this.editPid,
            id: this.curId
        }
        myDispatch(this.$store, "UpdateSubGameSwitch", temp, true)
            .then(() => {
                if (this.subGameSwitch.code === 200) {
                    this.$message({
                        type: "success",
                        message: "修改成功!"
                    });
                    this.isEdit = false;
                    this.loadData();
                } else {
                    this.$message({
                        type: "error",
                        message: this.subGameSwitch.err
                    });
                }
            })
            .catch(err => {
                this.$message({
                    type: "error",
                    message: err
                });
                return;
            });
    }
    getSubGameSwitch() {
        this.loadData();
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
    gameFormat(row) {
        return this.gameType[row.id]
    }
    stateFormat(row) {
        return row.active ? "开启" : "关闭"
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
        margin-top: 80px;
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
