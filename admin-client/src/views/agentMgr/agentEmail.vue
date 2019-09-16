<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="收件人(代理ID)">
            <el-input type="number" v-model="search.agencyId"></el-input>
          </el-form-item>
          <el-form-item label="邮件状态">
            <el-select v-model="search.state" placeholder="请选择">
              <el-option v-for="item in stateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发件时间">
            <el-date-picker v-model="search.createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="primary" @click="dialogSend=true">批量发送邮件</el-button>
            <el-button type="primary" @click="exportExcel">批量导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="_id" fixed label="邮件编号" width="220" align="center"></el-table-column>
        <el-table-column prop="pid" fixed label="项目" :formatter="pidFormat" width="150" align="center"></el-table-column>
        <el-table-column prop="title" label="邮件标题" width="250" align="center"></el-table-column>
        <el-table-column prop="opt" label="发件人" width="150" align="center"></el-table-column>
        <el-table-column prop="agencyId" label="收件人(代理ID)" width="150" align="center"></el-table-column>
        <el-table-column prop="createTime" label="发件时间" :formatter="createTimeFormat" width="160" align="center"></el-table-column>
        <el-table-column prop="readTime" label="阅读时间" :formatter="readTimeFormat" width="160" align="center"></el-table-column>
        <el-table-column prop="state" label="邮件状态" :formatter="stateFormat" width="120" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="readMail(scope.row)" type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </el-card>
    <el-dialog :title="`邮件详情:${dialogName}`" :visible.sync="dialogMail" width="500px">
      <div class="mailDetail">{{dialogDetail}}</div>
    </el-dialog>
    <el-dialog title="发送邮件" :visible.sync="dialogSend" width="700px">
      <el-form>
        <el-form-item label="收件人" label-width="80px" required>
          <el-input v-model="sendArr.agencyIds" style="width:500px;" placeholder="多个收件人用英文逗号(,)隔开"></el-input>
        </el-form-item>
        <el-form-item label="邮件标题" label-width="80px" required>
          <el-input v-model="sendArr.title" maxlength="20" style="width:500px;"></el-input>
        </el-form-item>
        <el-form-item label="邮件正文" label-width="80px" required>
          <el-input type="textarea" style="width:500px;" maxlength="2000" rows="5" v-model="sendArr.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSend = false">取 消</el-button>
        <el-button type="primary" @click="sendEmail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAgencyMail,
  sendAgencyMail,
  exportAgencyMail
} from "@/api/admin/agentMgr/agentMgr";
import { downloadExcel } from "../../utils/downloadEXCEL";
export default {
  data() {
    return {
      stateArr: [
        { label: "全部", value: undefined },
        { label: "已读", value: true },
        { label: "未读", value: false }
      ],
      search: {
        agencyId: undefined,
        state: undefined,
        createDate: []
      },
      page: 1,
      count: 10,
      totalCount: 0,
      tableData: [], //邮件列表
      dialogSend: false, //发送邮件弹窗
      dialogMail: false, //阅读邮件弹窗
      dialogExport: false, //导出邮件弹窗
      dialogName: "",
      dialogDetail: "",
      sendArr: {
        agencyIds: undefined,
        title: undefined,
        content: undefined
      },
      pidArr: []
    };
  },
  created() {
    this.getData();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid"));
  },
  methods: {
    searchData() {
      this.page = 1;
      this.getData();
    },
    getData() {
      //获取邮件列表
      let queryItem = { ...this.search };
      for (let i in queryItem) {
        if (queryItem[i] == "") {
          queryItem[i] = undefined;
        }
      }
      queryItem.page = this.page;
      queryItem.count = this.count;
      if (queryItem.createDate) {
        queryItem.startDate = queryItem.createDate[0];
        queryItem.endDate = queryItem.createDate[1];
      }
      getAgencyMail(queryItem)
        .then(res => {
          if (res.data.err) {
            this.$message({
              type: "error",
              message: res.data.err
            });
            return;
          }
          this.tableData = res.data.msg.pageData;
          this.totalCount = res.data.msg.totalCount;
        })
        .catch(err => {
          this.$message.error(err.err);
        });
    },
    readMail(row) {
      this.dialogMail = true;
      this.dialogDetail = row.content;
      this.dialogName = row.title;
    },
    exportExcel() {
      let queryItem = { ...this.search };
      for (let i in queryItem) {
        if (queryItem[i] == "") {
          queryItem[i] = undefined;
        }
      }
      if (queryItem.createDate) {
        queryItem.startDate = queryItem.createDate[0];
        queryItem.endDate = queryItem.createDate[1];
      }
      exportAgencyMail(queryItem)
        .then(res => {
          if (res.data.err) {
            this.$message.error(res.data.err);
            return;
          }
          if (res.data.msg.length > 0) {
            let mailData = [...res.data.msg];
            console.log(mailData);
            for (let i in mailData) {
              mailData[i].state = this.stateFormat(mailData[i]);
            }
            this.downExcel(mailData);
          } else {
            this.$message("没有数据内容可供导出");
          }
        })
        .catch(err => {
          this.$message.error(err.err);
        });
    },
    downExcel(data) {
      //批量导出
      const downloadExcelCfg = [
        { title: "邮件ID", field: "_id", type: "string" },
        { title: "项目", field: "pid", type: "pidType" },
        { title: "发件人", field: "opt", type: "string" },
        { title: "收件人", field: "agencyId", type: "string" },
        { title: "邮件内容", field: "content", type: "string" },
        { title: "邮件状态", field: "state", type: "string" },
        { title: "标题", field: "title", type: "string" },
        { title: "发件时间", field: "createTime", type: "Date" }
      ];
      downloadExcel(ret,this);
    },
    sendEmail() {
      //发送邮件
      let queryItem = { ...this.sendArr };
      queryItem.agencyIds = queryItem.agencyIds.split(",");
      for (let i in queryItem.agencyIds) {
        queryItem.agencyIds[i] = parseInt(queryItem.agencyIds[i]);
        if (isNaN(queryItem.agencyIds[i])) {
          this.$message.error("收件人ID格式不合法！");
          return;
        }
      }
      if (queryItem.title == "") {
        this.$message.error("邮件标题必填！");
      }
      if (queryItem.content == "") {
        this.$message.error("邮件内容必填！");
      }
      sendAgencyMail(queryItem)
        .then(res => {
          if (res.data.err) {
            this.$message.error(res.data.err);
            return;
          }
          this.$message.success("发送成功！");
          this.getData();
          this.dialogSend = false;
          this.sendArr = {};
        })
        .catch(err => {
          this.$message.error(err.err);
        });
    },
    handleSizeChange(val) {
      this.count = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
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
    },
    createTimeFormat(row) {
      if (row.createTime) {
        let newDate = new Date(row.createTime);
        let sdate = newDate.toLocaleString(undefined, { hour12: false });
        return sdate;
      }
    },
    readTimeFormat(row) {
      if (row.readTime) {
        let newDate = new Date(row.readTime);
        let sdate = newDate.toLocaleString(undefined, { hour12: false });
        return sdate;
      }
    },
    stateFormat(row) {
      if (row.state) {
        return "已读";
      } else {
        return "未读";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.pageBox {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
}
</style>
