<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="短信配置"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>短信配置</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <el-button type="primary" @click="refresh">读取</el-button>
        </div>
        <el-table :data="smsInfoCfgList" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="update(scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat"></el-table-column>
          <el-table-column prop="index" label="权重" width="70" align="center"></el-table-column>
          <el-table-column prop="smsName" label="名称" min-width="70" align="center"></el-table-column>
          <el-table-column prop="active" label="状态" width="70" align="center" :formatter="activeFormat"></el-table-column>
          <el-table-column prop="sid" label="sid" min-width="70" align="center"></el-table-column>
          <el-table-column prop="token" label="token" min-width="70" align="center"></el-table-column>
          <el-table-column prop="appid" label="appid" min-width="70" align="center"></el-table-column>
          <el-table-column prop="backAccount" label="backAccount" min-width="70" align="center"></el-table-column>
          <el-table-column prop="backPassword" label="backPassword" min-width="70" align="center"></el-table-column>
          <el-table-column prop="templateid" label="模版ID" min-width="70" align="center"></el-table-column>
          <el-table-column prop="signature" label="签名" min-width="70" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 修改 -->
      <el-dialog :title="'修改'+'('+curName+')'" :visible.sync="updateFlag" width="400px">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">权重</span>
          <el-input type="number" min="0" style="width:200px; margin:15px 30px 10px 18px" v-model="index"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">签名</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 18px" v-model="signature"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 20px">是否开启</span>
          <el-switch v-model="active" style="margin:15px 30px 10px 15px" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateConfirm">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script lang = 'ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getSmsInfo,
  updateSmsInfo
} from "../../api/admin/gameSetting/gameSetting";

@Component
export default class smsInfoCfgList extends Vue {
  created() {
    this.pidList = JSON.parse(sessionStorage.getItem("pid"));
    this.loadData();
  }
  /*inital data*/
  smsInfoCfgList: object[] = [];
  pidList: any = [];
  updateFlag: boolean = false;
  index: any = 0;
  active: boolean = true;
  curName: string = "";
  signature: string = "";
  curId: string = "";
  /*method*/
  async loadData() {
    let ret = await myAsyncFn(getSmsInfo);
    if (ret.code === 200) {
      this.smsInfoCfgList = ret.msg;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  //读取
  refresh() {
    this.loadData();
  }
  //添加
  update(row) {
    this.curId = row._id;
    this.active = row.active;
    this.index = row.index;
    this.signature = row.signature;
    this.curName = row.smsName;
    this.updateFlag = true;
  }
  //修改确认
  async updateConfirm() {
    console.log(this.index);
    if (this.index === '') {
      this.$message({
        type: "error",
        message: "权重不能为空!"
      });
    } else if (!this.signature) {
      this.$message({
        type: "error",
        message: "签名不能为空!"
      });
    } else {
      let data = {
        index: this.index,
        signature: this.signature,
        active: this.active,
        id: this.curId
      };
      this.$confirm("此操作将修改数据,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(updateSmsInfo, data);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.updateFlag = false;
            this.loadData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
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
  dateFormat(row, column) {
    if (row.createDate) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
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
