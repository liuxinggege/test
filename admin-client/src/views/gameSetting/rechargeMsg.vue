<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="充值通知"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">充值通知</span>
      </el-col>
      <div class="box">
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择" style="width:90px;margin:0px 20px 0px 10px">
          <el-option v-for="item in pidList" :key="item.value" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>状态</span>
        <el-select v-model="active" placeholder="请选择" style="width:90px;margin:0px 20px 0px 10px">
          <el-option v-for="item in activeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>次数</span>
        <el-select v-model="type" placeholder="请选择" style="width:120px;margin:0px 2px 0px 10px">
          <el-option v-for="item in typeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
        <el-button type="primary" @click="addPushCfg" style="margin:0px 0px 10px 10px">添加</el-button>
      </div>
      <!--列表-->
      <el-table :data="msgData" border highlight-current-row style="width: 99%;" max-height="600">
        <el-table-column prop="active" label="状态" width="80" :formatter="activeFormat" align="center"/>
        <el-table-column prop="pid" label="项目" width="100" :formatter="pidFormat" align="center"/>
        <el-table-column prop="type" label="次数" width="150" :formatter="typeFormat" align="center"/>
        <el-table-column prop="description" label="内容" min-width="200" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" min-width="700">
              <p>{{ scope.row.content }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag v-if="scope.row.content" size="medium">{{ scope.row.content.slice(0,70)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-setting" @click="edit(scope.row)"></el-button>
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="del(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>

      <el-dialog :visible.sync="addDialog" @close="close">
        <el-form :inline="false" class="small-space" label-position="left" label-width="100px" style="width:800px; margin-left:20px;">
          <el-form-item label="项目">
            <el-select v-model="addPid" placeholder="请选择" style="width:90px;">
              <el-option v-for="item in addPidList" :key="item.value" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="次数">
            <el-select v-model="addType" placeholder="请选择" style="width:120px;">
              <el-option v-for="item in addTypeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否开启">
            <el-switch v-model="addActive"></el-switch>
          </el-form-item>
          <el-form-item label="内容">
            <el-input rows="5" type="textarea" v-model="addContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 100px" @click="cancelStages">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确认</el-button>
      </el-dialog>
      <el-dialog :visible.sync="editDialog" @close="close">
        <el-form :inline="false" class="small-space" label-position="left" label-width="100px" style="width:800px; margin-left:20px;">
          <el-form-item label="项目">
            <el-input style="width:120px;" disabled v-model="addPid"></el-input>
          </el-form-item>
          <el-form-item label="次数">
            <el-select v-model="addType" placeholder="请选择" style="width:120px;">
              <el-option v-for="item in addTypeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否开启">
            <el-switch v-model="addActive"></el-switch>
          </el-form-item>
          <el-form-item label="内容">
            <el-input rows="5" type="textarea" v-model="addContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 100px" @click="cancelStages">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确认</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
declare var require: any;
declare var process: any;
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index";
import {
  getRechargeMsg,
  addRechargeMsg,
  delRechargeMsg,
  updateRechargeMsg
} from "../../api/admin/gameSetting/gameSetting";

interface QueryItem {
  active?: string | boolean;
  type?: string | number;
  pid?: string;
  page?: number;
  count?: number;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RechargeMsg extends Vue {
  totalCount: number = 0;
  msgData: any[] = [];
  page: number = 1; //当前页
  count: number = 10;
  active: string | boolean = "";
  type: string | number = "";
  pid: string = "";
  pidList: any = [];
  addPidList: any = [];
  addPid: string = "A";
  addType: number = 1;
  addActive: boolean = true;
  addContent: string = "";
  addKeyId: string = "";
  addTeamId: string = "";
  addBundleId: string = "";
  curId: string = "";
  addDialog: boolean = false;
  editDialog: boolean = false;
  typeOpts: any[] = [
    { value: "", label: "全部" },
    { value: 1, label: "每日首次" },
    { value: 2, label: "首次弹出" },
    { value: 3, label: "每次弹出" }
  ];
  addTypeOpts: any[] = [
    { value: 1, label: "每日首次" },
    { value: 2, label: "首次弹出" },
    { value: 3, label: "每次弹出" }
  ];
  activeOpts: any[] = [
    { value: "", label: "全部" },
    { value: true, label: "开启" },
    { value: false, label: "关闭" }
  ];
  //生命周期钩子函数
  created() {
    this.addPidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.pidList = [{ name: "全部", pid: "" }, ...this.addPidList];

    this.loadData();
  }
  //初始化数据
  async loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getRechargeMsg, queryItem);
    if (ret.code === 200) {
      this.msgData = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    }
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }

  del(row) {
    this.$confirm("此操作将删除这条通知, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delRechargeMsg, { id: row._id });
        if (ret.code === 200) {
          this.$message({ type: "success", message: "删除成功！" });
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
  }
  getQueryItem() {
    let tmp: QueryItem = {};
    if (this.pid) {
      tmp.pid = this.pid;
    }
    if (this.active !== "") {
      tmp.active = this.active;
    }
    if (this.type) {
      tmp.type = this.type;
    }
    return tmp;
  }
  close() {
    this.addDialog = false;
    this.editDialog = false;
  }
  addPushCfg() {
    this.addPid = "A";
    this.addType = 1;
    this.addActive = true;
    this.addContent = "";
    this.addDialog = true;
  }
  async addConfirm() {
    if (!this.addContent) {
      this.$message({ type: "error", message: "内容不能为空！" });
      return;
    }
    let req = {
      active: this.addActive,
      type: this.addType,
      content: this.addContent,
      pid: this.addPid
    };
    let ret = await myAsyncFn(addRechargeMsg, req);
    if (ret.code === 200) {
      this.$message({ type: "success", message: "添加成功！" });
      this.loadData();
    }
  }
  edit(row) {
    this.addPid = this.pidFormat(row);
    this.addType = row.type;
    this.addActive = row.active;
    this.addContent = row.content;
    this.curId = row._id;
    this.editDialog = true;
  }
  async editConfirm() {
    if (!this.addContent) {
      this.$message({ type: "error", message: "内容不能为空！" });
      return;
    }
    let req = {
      active: this.addActive,
      type: this.addType,
      content: this.addContent,
      id: this.curId
    };
    let ret = await myAsyncFn(updateRechargeMsg, req);
    if (ret.code === 200) {
      this.$message({ type: "success", message: "修改成功！" });
      this.loadData();
      this.editDialog = false;
    }
  }
  cancelStages() {
    this.addDialog = false;
    this.editDialog = false;
  }
  pidFormat(row) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  activeFormat(row) {
    return row.active ? "开启" : "关闭";
  }
  typeFormat(row) {
    let item: any[] = this.typeOpts.filter(e => e.value === row.type);
    return item[0].label;
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
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
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
