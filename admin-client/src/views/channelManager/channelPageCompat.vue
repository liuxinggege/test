<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="落地页兼容查询"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>落地页兼容查询</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <span>兼容路径</span>
          <el-input v-model="htmlPath" :clearable="true" style="width:200px; margin:0 10px"></el-input>
          <span>secret</span>
          <el-input v-model="secret" :clearable="true" style="width:200px; margin:0 10px"></el-input>
          <el-button type="primary" @click="refresh">搜索</el-button>
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="primary" @click="addManyCompat">批量添加</el-button>
        </div>
        <el-table :data="channelPageCompatList" border highlight-current-row style="margin: 20px 0">
          <el-table-column prop="htmlPath" label="兼容路径" min-width="200" align="center"></el-table-column>
          <el-table-column prop="pid" label="项目" min-width="100" align="center" :formatter="pidFormat"></el-table-column>
          <el-table-column prop="channel" label="渠道" min-width="100" align="center" :formatter="channelFormat"></el-table-column>

          <el-table-column prop="secret" label="secret" min-width="200" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 添加 -->
      <el-dialog title="添加" :visible.sync="addFlag" width="400px" @close="close">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">路径</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addPath"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 40px">secret</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addSecret"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确定</el-button>
        </div>
      </el-dialog>
      <!-- 批量添加 -->
      <el-dialog :visible.sync="dialogAddList">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width:500px; margin-left:50px;">
          <el-form-item style="margin-left:120px;" label="批量添加:">
            <span>注意：csv文件格式为，兼容路径,secret，为一条数据。</span>
            <csvUpload @child-intCSV="intCSV"></csvUpload>
            <a style="color:blue" href="../../static/channelPageCompat.csv">下载csv模版</a>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="confirmStages" @click="confirmAddMany">确 定</el-button>
        </div>
      </el-dialog>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>
<script lang = 'ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getChannelPageCompat,
  addChannelPageCompat,
  addMany
} from "../../api/admin/channelManager/channelManager";
import csvUpload from "../csvUpload.vue";
@Component({
  components: {
    csvUpload: csvUpload
  }
})
export default class channelPageCompat extends Vue {
  created() {
    this.pidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }
  //initData
  channelPageCompatList: object[] = [];
  htmlPath: string = "";
  secret: string = "";
  pidList: any[] = [];
  totalCount: Number = 0;
  page: number = 1;
  count: number = 10;
  addFlag: boolean = false;
  addPath: string = "";
  addSecret: string = "";
  // 批量添加
  addList: any = "";
  dialogAddList: boolean = false;
  /*method*/
  async loadData() {
    let req: any = {};
    req.page = this.page;
    req.count = this.count;
    if (this.secret.trim()) {
      req.secret = this.secret;
    }
    if (this.htmlPath.trim()) {
      req.htmlPath = this.htmlPath;
    }
    let ret = await myAsyncFn(getChannelPageCompat, req);
    if (ret.code === 200) {
      this.channelPageCompatList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  //读取
  refresh() {
    this.page = 1;
    this.loadData();
  }
  //添加
  add() {
    this.addPath = "";
    this.addSecret = "";
    this.addFlag = true;
  }
  //添加确认
  addConfirm() {
    if (!this.addPath) {
      this.$message({
        type: "error",
        message: "路径不能为空!"
      });
    } else if (!this.addSecret) {
      this.$message({
        type: "error",
        message: "secret不能为空!"
      });
    } else {
      let data = {
        htmlPath: this.addPath,
        secret: this.addSecret
      };
      this.$confirm("此操作将添加,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(addChannelPageCompat, data);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.addFlag = false;
            this.loadData();
          } else {
            this.$message({
              type: "error",
              message: `操作失败${ret.err}`
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
  }
  //csv转换
  intCSV(data) {
    this.addList = data.csvStr;
  }
  //批量添加
  addManyCompat() {
    this.addList = "";
    this.dialogAddList = true;
  }
  confirmAddMany() {
    let dataArr = this.addList;
    let dataTrArr: any = [];
    if(dataArr.length===0){
      this.$message({
          type: "error",
          message: "请选择csv文件！"
        });
        return;
    }
    for (let k in dataArr) {
      let tr = dataArr[k];
      if (tr.length !== 2) {
        this.$message({
          type: "error",
          message: "兼容路径,secret,都为必填"
        });
        return;
      }
      let insertData = {
        htmlPath: tr[0],
        secret: tr[1]
      };
      dataTrArr.push(insertData);
    }
    this.$confirm("此操作将批量添加,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          datas: dataTrArr
        };
        let ret = await myAsyncFn(addMany, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功！"
          });
          this.dialogAddList = false;
          this.loadData();
        } 
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.dialogAddList = false;
      });
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
  channelFormat(row) {
    if (row.channel === "") {
      return "官方";
    } else {
      return row.channel;
    }
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
  close() {}
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
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
</style>
