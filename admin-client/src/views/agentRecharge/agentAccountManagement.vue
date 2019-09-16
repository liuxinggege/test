<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="商人ID">
            <el-input v-model="search.uid"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="search.act"></el-input>
          </el-form-item>
          <el-form-item label="支付类型">
            <el-select v-model="search.type" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in payTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker v-model="search.logDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border cell-class-name="tableTd" header-cell-class-name="tableTh" width="100%">
        <el-table-column label="账号/二维码" width="210" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.account" v-if="scope.row.actType=='qr'" style="max-width:200px;">
            <span v-else>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="type" :formatter="payTypesFormat" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="optType" label="操作类型" :formatter="optFormat" align="center"></el-table-column>
        <el-table-column prop="oldAccount" label="操作前账号/二维码" width="210" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.oldAccount" v-if="scope.row.oldActType=='qr'" style="max-width:200px;">
            <span v-else>{{scope.row.oldAccount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oldName" label="操作前姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="oldName" label="操作前支付方式" :formatter="payTypesFormat2" width="120" align="center"></el-table-column>
        <el-table-column prop="oldName" label="操作前姓名" width="120" align="center"></el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { agentActHistory } from "@/api/admin/agentRecharge/agentRecharge";
export default {
  components: {
    //serviceTalk
  },
  data() {
    return {
      totalCount: 0,
      count: 10,
      page: 0,
      search: {},
      tableData: [],
      payTypeArr: [
        { label: "支付宝账号", value: "ali_pay_act", type: "act" },
        { label: "支付宝扫码", value: "ali_pay_qr", type: "qr" },
        { label: "微信扫码", value: "wx_pay_qr", type: "qr" },
        { label: "银联账号", value: "union_pay_act", type: "act" },
        { label: "信用卡扫码", value: "xy_pay_qr", type: "qr" },
        { label: "花呗扫码", value: "hb_pay_qr", type: "qr" },
        { label: "云闪付扫码", value: "yun_pay_qr", type: "qr" },
        { label: "QQ钱包扫码", value: "qq_pay_qr", type: "qr" },
        { label: "京东扫码", value: "jd_pay_qr", type: "qr" }
      ]
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    searchData() {
      this.page = 0;
      this.loadData();
    },
    loadData() {
      let queryItem = { ...this.search };
      queryItem.page = this.page;
      queryItem.count = this.count;
      if (queryItem.logDate) {
        queryItem.logDateStart = queryItem.logDate[0]
          ? queryItem.logDate[0]
          : undefined;
        queryItem.logDateEnd = queryItem.logDate[1]
          ? queryItem.logDate[1]
          : undefined;
      }

      this.clean(queryItem);
      agentActHistory(queryItem).then(res => {
        console.log(res);
        this.tableData = res.data.msg.pageData;
        this.totalCount = res.data.msg.totalCount;
      });
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
    },
    payTypesFormat(row) {
      let label = "";
      this.payTypeArr.some(element => {
        if (row.type == element.value) {
          label = element.label;
        }
        return element.label == label;
      });
      return label;
    },
    payTypesFormat2(row) {
      let label = "";
      this.payTypeArr.some(element => {
        if (row.oldType == element.value) {
          label = element.label;
        }
        return element.label == label;
      });
      return label;
    },
    optFormat(row) {
      let label = "";
      switch (row.optType) {
        case 0:
          label = "增加";
          break;
        case 1:
          label = "删除";
          break;
        case 2:
          label = "修改";
          break;
      }
      return label;
    },
    modifyLine(row) {
      //打开修改弹窗
      this.dialogId = row.payId;
      this.dialogRecharge = true;
      this.editArr = { ...row };
      this.editArr.imgEdit = false;
    },
    handleSizeChange(e) {
      this.count = e;
      this.loadData();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.loadData();
    }
  }
};
</script>
<style lang="scss" scoped>
.pageBox {
  margin: 20px;
  display: flex;
  justify-content: center;
}
</style>
