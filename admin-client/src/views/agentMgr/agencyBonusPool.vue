<template>
  <div class="dashboard-editor-container">
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="项目">
          <el-select v-model="search.pid" placeholder="请选择">
            <el-option v-for="item in pidArr" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理ID">
          <el-input type="number" v-model="search.agencyId"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="search.submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="search.status" placeholder="请选择">
            <el-option v-for="item in stateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">搜索</el-button>
          <el-button type="primary" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border cell-class-name="tableTd" header-cell-class-name="tableTh" style="width: 100%">
      <el-table-column prop="_id" label="活动ID" align="center"></el-table-column>
      <el-table-column prop="pid" label="项目" :formatter="pidFormat" align="center"></el-table-column>
      <el-table-column prop="agencyId"label="代理id" align="center"></el-table-column>
      <el-table-column prop="money" label="申请金额" width="120" align="center"></el-table-column>
      <el-table-column prop="applyDate" label="提交时间" :formatter="applyDateFormat" align="center"></el-table-column>
      <el-table-column prop="optDate" label="操作时间" :formatter="optDateFormat" width="160" align="center"></el-table-column>
      <!-- :formatter="typeFormat" -->
      <el-table-column prop="status" label="状态" :formatter="stateFormat" width="120" align="center"></el-table-column>
      <el-table-column prop="operator" label="操作人" width="120" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status=='await'" size="small" @click="pass(scope.row._id)">通过</el-button>
          <el-button type="primary" v-if="scope.row.status=='await'" size="small" @click="refuse(scope.row._id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <el-dialog title="拒绝提示" :visible.sync="dialogRefuse" width="30%">
      <el-form>
        <el-input type="textarea" v-model="refuseInfo" :rows="2" placeholder="请输入拒绝原因"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRefuse=false">取消</el-button>
        <el-button type="primary" @click="refuseSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  getAgencyBonusPoolOrder,
  passAgencyBonusPoolOrder,
  refuseAgencyBonusPoolOrder,
  exportAgency
} from "../../api/admin/agentMgr/agentMgr";
@Component
export default class AgencyWelfareRecord extends Vue {
  search: any = {
    pid: undefined,
    agencyId: undefined,
    submitDate: undefined,
    status: undefined
  };
  dialogRefuse: boolean = false;
  dialogId: any;
  refuseInfo: string = "";
  page: number = 1;
  count: number = 10;
  totalCount: number = 0;
  stateArr: any = [
    { value: undefined, label: "全部" },
    { value: "success", label: "成功" },
    { value: "fail", label: "失败" },
    { value: "await", label: "等待审核" }
  ];
  tableData: any = [];
  pidArr: any = [];
  created() {
    this.loadData();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid") as any);
    this.pidArr.push({pid:undefined,name:'全部'})
  }
  loadData() {
    let queryItem = { ...this.search };
    if (queryItem.submitDate && queryItem.submitDate.length > 0) {
      queryItem.startDate = queryItem.submitDate[0];
      queryItem.endDate = queryItem.submitDate[1];
    }
    queryItem.page = this.page;
    queryItem.count = this.count;
    getAgencyBonusPoolOrder(queryItem).then(res => {
      this.tableData = res.data.msg.pageData;
      this.totalCount = res.data.msg.totalCount;
    });
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  pass(id) {
    passAgencyBonusPoolOrder({ id: id }).then(res => {
      this.$message.success("操作成功！");
      this.loadData();
    });
  }
  refuse(id) {
    this.dialogRefuse = true;
    this.dialogId = id;
  }
  refuseSubmit() {
    if(!this.refuseInfo){
      this.$message.error("拒绝原因必填");
      return
    }
    refuseAgencyBonusPoolOrder({
      id: this.dialogId,
      info: this.refuseInfo
    }).then(res => {
      this.$message.success("操作成功！");
      this.loadData();
      this.dialogRefuse = false;
    });
  }
  exportData() {
    let queryItem = { ...this.search };
    if (queryItem.submitDate && queryItem.submitDate.length > 0) {
      queryItem.startDate = queryItem.submitDate[0];
      queryItem.endDate = queryItem.submitDate[1];
    }
    exportAgency(queryItem).then(res => {
      this.$message.success("导出成功！");
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
  applyDateFormat(row) {
    if (row.applyDate) {
      let newDate = new Date(row.applyDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
  optDateFormat(row) {
    if (row.optDate) {
      let newDate = new Date(row.optDate);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
  stateFormat(row) {
    if (row.status) {
      let item = this.stateArr.find(i => i.value == row.status);
      return item.label;
    }
  }
  pidFormat(row) {
    let name: any = "";
    if (row.pid) {
      name = this.pidArr.find(i => i.pid == row.pid);
    }
    return name.name;
  }
}
</script>
<style lang="scss" scoped>
.searchBox {
  margin: 20px;
}
</style>
