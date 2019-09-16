<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="落地页短域名管理"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>落地页短域名管理</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <span>域名</span>
          <el-input v-model="host" :clearable="true" style="width:200px; margin:0 10px"></el-input>
          <span>secret</span>
          <el-input v-model="secret" :clearable="true" style="width:200px; margin:0 10px"></el-input>
          <el-button type="primary" @click="refresh">搜索</el-button>
          <el-button type="primary" @click="addBlackList">添加</el-button>
        </div>
        <el-table :data="channelPageHostList" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="update(scope.row)"></el-button>
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="host" label="域名" min-width="200" align="center"></el-table-column>
          <el-table-column prop="pid" label="项目" min-width="100" align="center" :formatter="pidFormat"></el-table-column>
          <el-table-column prop="channel" label="渠道" min-width="100" align="center" :formatter="channelFormat"></el-table-column>

          <el-table-column prop="secret" label="secret" min-width="200" align="center"></el-table-column>
        </el-table>
      </div>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
      <!-- 添加 -->
      <el-dialog title="添加" :visible.sync="addFlag" width="400px" @close="close">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">域名</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addHost"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 40px">secret</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addSecret"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog title="修改" :visible.sync="editFlag" width="400px" @close="close">
        <div style="width:200px; margin:15px 30px 10px 0px">
          <span style="font-size:12pt; margin:0px 0px 10px 50px">项目：{{pid}}</span>
        </div>
        <div style="width:200px; margin:15px 30px 10px 0px">
          <span style="font-size:12pt; margin:0px 0px 10px 50px">渠道：{{channel}}</span>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">域名</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="editHost"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 40px">secret</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="editSecret"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editConfirm">确定</el-button>
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
  getChannelPageHost,
  addChannelPageHost,
  updateChannelPageHost,
  delChannelPageHost
} from "../../api/admin/channelManager/channelManager";
@Component
export default class channelPageHost extends Vue {
  created() {
    this.pidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }
  //initData
  channelPageHostList: object[] = [];
  pid: string = "";
  channel: string = "";
  id: string = "";
  addFlag: boolean = false;
  editFlag: boolean = false;
  host: string = "";
  secret: string = "";
  pidList: any[] = [];
  totalCount: Number = 0;
  page: number = 1;
  count: number = 10;
  //add
  addHost: string = "";
  addSecret: string = "";
  //edit
  editHost: string = "";
  editSecret: string = "";
  /*method*/
  async loadData() {
    let req: any = {};
    req.page = this.page;
    req.count = this.count;
    if (this.secret.trim()) {
      req.secret = this.secret;
    }
    if (this.host.trim()) {
      req.host = this.host;
    }
    let ret = await myAsyncFn(getChannelPageHost, req);
    if (ret.code === 200) {
      this.channelPageHostList = ret.msg.pageData;
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
  addBlackList() {
    this.addHost = "";
    this.addSecret = "";
    this.addFlag = true;
  }
  //添加确认
  async addConfirm() {
    if (!this.addHost) {
      this.$message({
        type: "error",
        message: "域名不能为空!"
      });
    } else if (!this.addSecret) {
      this.$message({
        type: "error",
        message: "secret不能为空!"
      });
    } else {
      let data = {
        host: this.addHost,
        secret: this.addSecret
      };
      this.$confirm("此操作将添加,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(addChannelPageHost, data);
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

  // 修改
  update(row) {
    this.editFlag = true;
    this.id = row._id;
    this.editHost = row.host;
    this.editSecret = row.secret;
    this.pid = this.pidFormat(row);
    this.channel = this.channelFormat(row);
  }

  //修改确认
  async editConfirm() {
    let data = {
      id: this.id,
      host: this.editHost,
      secret: this.editSecret
    };
    if (!this.editHost) {
      this.$message({
        type: "error",
        message: `域名不能为空！`
      });
    } else if (!this.editSecret) {
      this.$message({
        type: "error",
        message: `secret不能为空！`
      });
    } else {
      this.$confirm("此操作将修改数据,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(updateChannelPageHost, data);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.editFlag = false;
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
  //删除
  del(id) {
    this.$confirm("此操作将修改数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delChannelPageHost, { id: id });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editFlag = false;
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
