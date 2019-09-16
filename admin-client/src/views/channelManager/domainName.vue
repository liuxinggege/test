<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="域名维护"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">域名维护</span>
      </el-col>
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="项目">
            <el-select v-model="search.pid" style="width:100px" placeholder="请选择">
              <el-option v-for="(item,index) in pidArr" :key="index" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="域名">
            <el-input v-model="search.url" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="search.state" placeholder="请选择">
              <el-option v-for="(item,index) in stateArr" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="search.type" placeholder="请选择">
              <el-option v-for="(item,index) in typeArr" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="primary" @click="showAdd">批量新增</el-button>
            <el-button type="primary" @click="deleteList">批量删除</el-button>
            <el-button type="primary" @click="downloadExcel">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange" cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="pid" fixed label="项目" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="domain" fixed label="主域名" align="center"></el-table-column>
        <el-table-column prop="state" label="使用状态" :formatter="stateFormat" align="center"></el-table-column>
        <el-table-column prop="channelsNum" label="使用个数" align="center"></el-table-column>
        <el-table-column prop="type" label="域名类型" :formatter="typeFormat" align="center"></el-table-column>
        <el-table-column prop="closeDate" label="被封时间" align="center" :formatter="closeTimeFormat"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="createTimeFormat" width="160" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="editLine(scope.row)" size="small">编辑</el-button>
            <el-button type="primary" v-if="scope.row.state!==1" @click="deleteLine(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="48" class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50,100]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
    <el-dialog title="批量新增" :visible.sync="dialogAdd" width="500px">
      <el-form>
        <el-form-item label="项目" label-width="80px">
          <el-select v-model="addArr.pid" placeholder="请选择pid" style="width:110px">
            <template v-for="item in pidArr">
              <el-option :key="item.pid" :label="item.name" :value="item.pid" v-if="item.pid!=undefined"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="域名" label-width="80px">
          <el-input type="textarea" v-model="addArr.urls" :rows="2" placeholder="请输入域名，多个域名用英文逗号(,)隔开"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-select v-model="addArr.type" placeholder="请选择域名类型">
            <el-option label="入口域名" value="general"></el-option>
            <el-option label="跳转域名" value="dl"></el-option>
            <el-option label="独立域名" value="independent"></el-option>
            <el-option label="地推域名" value="groundpushdomain"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd=false">取消</el-button>
        <el-button type="primary" @click="addFuc">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`编辑:${dialogId}`" :visible.sync="dialogEditor" width="500px">
      <el-form>
        <el-form-item label="域名" label-width="80px">
          <el-input type="textarea" v-model="editArr.url" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditor=false">取消</el-button>
        <el-button type="primary" @click="updateFuc">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  getUrlMaintenance,
  addUrlMaintenance,
  updateUrlMaintenance,
  deleteUrlMaintenance,
  downUrlMaintenanceExcel
} from "../../api/admin/channelManager/channelManager";
import { myAsyncFn } from "../../utils";
@Component
export default class ChannelInfo extends Vue {
  page: number = 1;
  count: number = 10;
  totalCount = 0;
  search = {
    pid: undefined,
    url: undefined,
    state: undefined,
    type: undefined
  };
  stateArr = [
    { label: "全部", value: undefined },
    { label: "已使用", value: 1 },
    { label: "未使用", value: 0 },
    { label: "被封", value: 2 }
  ];
  typeArr = [
    { label: "全部", value: undefined },
    { label: "独立域名", value: "independent" },
    { label: "入口域名", value: "general" },
    { label: "跳转域名", value: "dl" },
    { label: "地推域名", value: "groundpushdomain" }
  ];
  pidArr: any = [];
  tableData = [];
  dialogId: any = "";
  addArr: any = {
    urls: "",
    type: "",
    pid: ""
  };
  editArr: any = {
    url: ""
  };
  dialogEditor: boolean = false;
  dialogAdd: boolean = false;
  multipleSelection: any = [];
  created() {
    this.pidArr = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.pidArr.push({ name: "全部", pid: undefined });
    this.loadData();
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let queryItem: any = { ...this.search };
    if (typeof queryItem.url === "undefined" || queryItem.url === "") {
      delete queryItem.url;
    }
    if (typeof queryItem.state === "undefined" || queryItem.state === "") {
      delete queryItem.state;
    }
    if (typeof queryItem.type === "undefined" || queryItem.type === "") {
      delete queryItem.type;
    }
    queryItem.page = this.page;
    queryItem.count = this.count;
    getUrlMaintenance(queryItem).then(res => {
      if (res.data.code != 200) {
        if (res.data.code != 400) {
          this.$message.error(res.data.err);
        }
        return;
      }
      this.tableData = res.data.msg.pageData;
      this.totalCount = res.data.msg.totalCount;
    });
  }
  showAdd() {
    this.dialogAdd = true;
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
  addFuc() {
    let queryItem = { ...this.addArr };
    if (queryItem.urls.trim() == "") {
      this.$message.error("域名不能为空");
      return;
    }
    queryItem.urls = queryItem.urls.split(",");

    function checkDuplicationNormal(arr) {
      return arr.some((val, idx) => {
        return arr.includes(val, idx + 1);
      });
    }
    if (checkDuplicationNormal(queryItem.urls)) {
      this.$message.error("域名有重复");
      return;
    }
    addUrlMaintenance(queryItem).then(res => {
      if (res.data.code != 200) {
        this.$message.error(res.data.err);
        return;
      }
      this.$message.success("添加成功！");
      this.loadData();
      this.addArr.urls = "";
      this.addArr.type = "";
      this.addArr.pid = "";
      this.dialogAdd = false;
    });
  }
  editLine(row) {
    this.dialogEditor = true;
    this.dialogId = row.domain;
  }
  updateFuc() {
    let queryItem = {
      beforUrl: this.dialogId,
      afterUrl: this.editArr.url
    };
    updateUrlMaintenance(queryItem).then(res => {
      if (res.data.code != 200) {
        if (res.data.code != 400) {
          this.$message.error(res.data.err);
        }
        return;
      }
      this.$message.success("修改成功！");
      this.dialogEditor = false;
      this.editArr.url = "";
      this.loadData();
    });
  }
  deleteList() {
    console.log(this.multipleSelection);
    let urls: string[] = [];
    for (let index = 0; index < this.multipleSelection.length; index++) {
      const element = this.multipleSelection[index];
      urls.push(element.domain);
    }
    this.$confirm(`此操作将批量删除选中域名, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteUrlMaintenance({ urls: urls })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
            }
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err.err
            });
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  deleteLine(row) {
    //删除确认
    this.$confirm(`此操作将删除域名"${row.domain}", 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteUrlMaintenance({ urls: [row.domain] })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
            }
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err.err
            });
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  pidFormat(row) {
    let key = row.pid;
    let prod = "";
    this.pidArr.some(item => {
      if (item.pid == key) {
        prod = item.name;
      }
      return item.pid == key;
    });
    return prod;
  }
  createTimeFormat(row) {
    if (row.createDate) {
      let newDate = new Date(row.createDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
  closeTimeFormat(row) {
    if (row.closeDate) {
      let newDate = new Date(row.closeDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
  stateFormat(row) {
    let str = "-";
    this.stateArr.forEach(item => {
      if (row.state == item.value) {
        str = item.label;
      }
    });
    return str;
  }
  typeFormat(row) {
    if (row.type) {
      switch (row.type) {
        case "general":
          return "入口域名";
        case "dl":
          return "跳转域名";
        case "independent":
          return "独立域名";
        case "groundpushdomain":
          return "地推域名";

        default:
          break;
      }
    }
    return row.type;
  }
  handleSelectionChange(val) {
    this.multipleSelection = val;
  }
  //导出
  async downloadExcel() {
    let queryItem: any = { ...this.search };
    if (typeof queryItem.url === "undefined" || queryItem.url === "") {
      delete queryItem.url;
    }
    if (typeof queryItem.state === "undefined" || queryItem.state === "") {
      delete queryItem.state;
    }
    if (typeof queryItem.type === "undefined" || queryItem.type === "") {
      delete queryItem.type;
    }
    let ret = await myAsyncFn(downUrlMaintenanceExcel, queryItem);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "创建任务成功！"
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
