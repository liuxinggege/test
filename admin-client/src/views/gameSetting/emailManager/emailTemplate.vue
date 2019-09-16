<template>
    <div>
        <!--工具条-->
        <el-col class="toolbar1">
            <div style="margin:0 20px">
                <span>类别</span>
                <el-input v-model="type" style="width:150px;margin:10px"></el-input>
                <span>创建者</span>
                <el-input v-model="operator" style="width:150px;margin:10px"></el-input>
                <el-button type="success" @click="search" style="margin:10px">搜索</el-button>
                <el-button type="success" @click="add" style="margin:10px">添加</el-button>
            </div>
        </el-col>
        <!--列表-->
        <el-table :data="templateData" border highlight-current-row style="width: 100%">
            <el-table-column prop="pid" label="状态" min-width="20px" align="center" fixed>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.state" @change="changeState(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="pid" label="操作" min-width="20px" align="center" fixed>
                <template slot-scope="scope">
                    <el-button type="text" @click="editMailTemplate(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
                    <el-button type="text" @click="deleteMailTemplate(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="weights" label="权重" min-width="18px" align="center">
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="30px" align="center">
            </el-table-column>
            <el-table-column prop="type" label="类别" min-width="30px" align="center">
            </el-table-column>
            <el-table-column prop="content" label="内容" min-width="100px" align="center">
            </el-table-column>
            <el-table-column prop="operator" label="编辑者" min-width="50px" align="center">
            </el-table-column>
            <el-table-column prop="updateDate" label="修改时间" min-width="50px" align="center" :formatter="updateDateFormat">
            </el-table-column>
            <el-table-column prop="logDate" label="添加时间" min-width="50px" align="center" :formatter="logDateFormat">
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col class="toolbar2">
            <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,40,60,80]" :page-size="count" :total="totalCount">
            </el-pagination>
        </el-col>

        <!--添加-->
        <el-dialog :visible.sync="dialogAddVisible" @close="close">
            <div style="margin:10px;font-size:20px">
                <el-input size="small" maxlength="6" clearable placeholder="请输入标题" v-model="addTitle">
                    <template slot="prepend">标题:</template>
                </el-input>
            </div>
            <div style="margin:10px;font-size:20px">
                <el-input size="small" maxlength="6" clearable placeholder="请输入类别" v-model="addType">
                    <template slot="prepend">类别:</template>
                </el-input>
            </div>
            <div style="margin:10px">
                <span>权重：</span>
                <el-input-number size="small" :controls="false" placeholder="请输入权重" v-model="addWeights">
                </el-input-number>
            </div>
            <div style="margin:10px;">
                <span>内容：</span>
            </div>
            <div style="margin:10px;">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 20}" placeholder="请输入内容" v-model="addContent"></el-input>
            </div>
            <el-button type="primary" @click="confirm" style="margin:10px">确定</el-button>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { MailManagerState } from "../../../store/stateInterface";
import { myDispatch, removeReapetItem } from "../../../utils/index";

interface QueryItem {}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SenMail extends Vue {
  mailManager: MailManagerState = this.$store.state.mailManager;
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  templateData: any[] = [];
  type: string = "";
  operator: string = "";
  isAddTemplate: boolean = true;

  dialogAddVisible: boolean = false;
  id: string = "";
  addTitle: string = "";
  addType: string = "";
  addContent: string = "";
  addWeights: string = "";

  act: string = "";
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*method*/
  search() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let cond = {
      type: this.type,
      operator: this.operator,
      page: this.page,
      count: this.count
    };
    myDispatch(this.$store, "GetMailTemplate", cond).then(() => {
      this.totalCount = this.mailManager.mailTemplate.totalCount;
      this.templateData = this.mailManager.mailTemplate.data;
    });
  }
  add() {
    this.dialogAddVisible = true;
    this.isAddTemplate = true;
  }
  async toAdd(addData) {
    let ret = await myDispatch(this.$store, "AddMailTemplate", addData);
    if (this.mailManager.mailTemplateCode === 200) {
      this.$message({
        type: "success",
        message: "添加成功!"
      });
      this.dialogAddVisible = false;
      this.loadData();
    } else {
      this.$message({
        showClose: true,
        message: this.mailManager.mailTemplate.err,
        type: "error"
      });
    }
  }
  async toUpdate(addData) {
    let ret = await myDispatch(this.$store, "UpdateMailTemplate", addData);
    if (this.mailManager.mailTemplateCode === 200) {
      this.$message({
        type: "success",
        message: "修改成功!"
      });
      this.dialogAddVisible = false;
      this.loadData();
    } else {
      this.$message({
        showClose: true,
        message: this.mailManager.mailTemplate.err,
        type: "error"
      });
    }
  }
  // 确认添加或者修改
  confirm() {
    let addData = {
      title: this.addTitle,
      type: this.addType,
      weights: Number(this.addWeights),
      content: this.addContent,
      id: this.id
    };
    this.$confirm("确认添加快捷回复, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        if (this.isAddTemplate) {
          this.toAdd(addData);
        } else {
          this.toUpdate(addData);
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  close() {
    this.addTitle = "";
    this.addType = "";
    this.addWeights = "";
    this.addContent = "";
  }
  // 修改状态
  changeState(row) {
    let data = { id: row._id, state: row.state };
    this.$confirm("确认修改快捷回复状态, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        this.toUpdate(data);
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
        row.state = !row.state;
      });
  }
  // 编辑
  editMailTemplate(index, row) {
    this.dialogAddVisible = true;
    this.isAddTemplate = false;
    this.addTitle = row.title;
    this.addType = row.type;
    this.addWeights = row.weights;
    this.addContent = row.content;
    this.id = row._id;
  }
  // 删除
  deleteMailTemplate(index, row) {
    this.$confirm("确认删除快捷回复, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myDispatch(this.$store, "DelMailTemplate", {
          id: row._id
        });
        if (this.mailManager.mailTemplateCode === 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.dialogAddVisible = false;
          this.loadData();
        } else {
          this.$message({
            showClose: true,
            message: this.mailManager.mailTemplate.err,
            type: "error"
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }

  //   页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //   每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
  //   整形
  updateDateFormat(row) {
    if (row.updateDate) {
      let date = new Date(row.updateDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  logDateFormat(row) {
    if (row.logDate) {
      let date = new Date(row.logDate);
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
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
th {
  text-align: center !important;
}
</style>