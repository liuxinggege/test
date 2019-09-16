<template>
  <div class="dashboard-editor-container">
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="项目">
          <el-select v-model="search.pid" placeholder="请选择">
            <el-option v-for="item in pidArr" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="search.submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">读取</el-button>
          <el-button type="primary" @click="dialogAdd=true">新增活动</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="pageData" border cell-class-name="tableTd" header-cell-class-name="tableTh" style="width: 100%">
      <el-table-column prop="_id" label="活动ID" align="center"></el-table-column>
      <el-table-column prop="pid" fixed label="项目" :formatter="pidFormat" width="150" align="center"></el-table-column>
      <el-table-column label="活动时间" width="280" align="center" prop="startDate" :formatter="activeDateFormat"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" :formatter="optDateFormat" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" :formatter="stateFormat" align="center"></el-table-column>
      <el-table-column prop="type" label="活动类型" align="center" :formatter="typeFormat"></el-table-column>
      <el-table-column prop="agencyCount" label="参与人数" align="center"></el-table-column>
      <el-table-column prop="totalFund" label="资金池金额" align="center"></el-table-column>
      <el-table-column prop="successFund" label="已领取金额" align="center"></el-table-column>
      <el-table-column prop="idx" label="排序" align="center"></el-table-column>
      <el-table-column prop="opt" label="操作人" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.state" size="small" @click="stateChange(scope.row)">关闭</el-button>
          <el-button type="primary" v-else size="small" @click="stateChange(scope.row)">开启</el-button>
          <el-button type="primary" size="small" @click="updateLine(scope.row)">编辑</el-button>
          <el-button type="primary" size="small" @click="deleteLine(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <el-dialog :title="'修改活动：'+dialogId" :visible.sync="dialogRecharge" width="700px">
      <el-form>
        <el-form-item label="开始时间" label-width="80px">
          <el-date-picker v-model="updateArr.startDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="80px">
          <el-date-picker v-model="updateArr.endDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecharge=false">取 消</el-button>
        <el-button type="primary" @click="updateAccount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增活动" :visible.sync="dialogAdd" width="700px">
      <el-form>
        <el-form-item label="项目" label-width="80px">
          <el-select v-model="addArr.pid" placeholder="请选择">
            <el-option v-for="item in pidArr" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型" label-width="80px">
          <el-select v-model="addArr.type" placeholder="请选择">
            <el-option v-for="(item,index) in activeArr" :key="index" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" label-width="80px">
          <el-input type="number" v-model="addArr.idx" style="width:100px;"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" label-width="80px">
          <el-date-picker v-model="addArr.startDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="80px">
          <el-date-picker v-model="addArr.endDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否开启" label-width="80px">
          <el-switch v-model="addArr.state"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd=false">取 消</el-button>
        <el-button type="primary" @click="submitActive">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  getActivity,
  changeActivityCfgState,
  updateActivity,
  insertActivity,
  getActivityType,
  deleteActivity
} from "../../api/admin/agentMgr/agentMgr";
import { Provide } from "vue-property-decorator";
@Component
export default class AgencyWelfareRecord extends Vue {
  search: any = {};
  pageData: any[] = [];
  page: number = 1;
  count: number = 10;
  totalCount: number = 0;
  updateArr: any = {};
  addArr: any = {
    state: false
  };
  dialogAdd: boolean = false;
  dialogRecharge: boolean = false;
  dialogId: any = "";
  pidArr: any = [];
  stateArr: any = [
    { value: true, label: "开启" },
    { value: false, label: "关闭" }
  ];
  activeArr: any = [];
  async created() {
    await this.loadActive();
    this.loadData();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid") as any);
    this.pidArr.push({pid:undefined,name:'全部'})
  }
  loadActive() {
    return new Promise(resolve => {
      getActivityType().then(res => {
        this.activeArr = res.data.msg;
        resolve();
      });
    });
  }
  stateChange(row) {
    changeActivityCfgState({ id: row._id }).then(res => {
      this.$message.success("状态切换成功");
      this.loadData();
    });
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let query = { ...this.search };
    if (query.submitDate && query.submitDate.length > 0) {
      query.startDate = query.submitDate[0];
      query.endDate = query.submitDate[1];
    }
    query.page = this.page;
    query.count = this.count;
    getActivity(query).then(res => {
      this.pageData = res.data.msg.pageData;
      this.totalCount = res.data.msg.totalCount;
    });
  }
  updateLine(row) {
    this.updateArr = {
      id: row._id, //_id
      startDate: row.startDate,
      endDate: row.endDate
    };
    this.dialogRecharge = true;
  }
  updateAccount() {
    let query = { ...this.updateArr };
    updateActivity(query).then(res => {
      this.$message.success("修改成功！");
      this.loadData();
      this.dialogRecharge = false;
    });
  }
  deleteLine(row) {
    this.$confirm("此操作将删除该活动, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteActivity({ id: row._id }).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.loadData()
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  submitActive() {
    let query = { ...this.addArr };
    insertActivity(query).then(res => {
      this.$message.success("添加成功！");
      this.loadData();
      this.dialogAdd = false;
    });
  }
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  pidFormat(row) {
    let name: any = "";
    if (row.pid) {
      name = this.pidArr.find(i => i.pid == row.pid);
    }
    return name.name;
  }
  optDateFormat(row) {
    if (row.createDate) {
      let newDate = new Date(row.createDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
  activeDateFormat(row) {
    let str = "";
    if (row.startDate) {
      let newDate = new Date(row.startDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      str += sdate;
    }
    if (row.endDate) {
      let newDate = new Date(row.endDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      str += " 至 " + sdate;
    }
    return str;
  }
  stateFormat(row) {
    let item = this.stateArr.find(i => i.value == row.state);
    return item.label;
  }
  typeFormat(row) {
    let item = this.activeArr.find(i => i.type == row.type);
    return item.name;
  }
}
</script>
<style lang="scss" scoped>
.searchBox {
  margin: 20px;
}
</style>