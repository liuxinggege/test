<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="回归列表"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">防掉签配置</span>
      </el-col>
      <div class="box">
        <el-table :data="antiDropData" v-loading="loading" highlight-current-row border style="width: 100%">
          <el-table-column :formatter="pidFormatter" prop="pid" align="center" label="平台"></el-table-column>
          <el-table-column prop="registerMoney" align="center" label="注册金额大于等于（元）"></el-table-column>
          <el-table-column align="center" prop="registerDays" label="注册天数大于等于（天）"></el-table-column>
          <el-table-column prop="title" label="更新标题"></el-table-column>
          <el-table-column prop="content" label="更新提示语"></el-table-column>
          <el-table-column prop="url" label="跳转链接"></el-table-column>
          <el-table-column prop="desUrl" label="描述文件地址"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="editCongfig(scope.row)" type="text" size="small">编辑</el-button>/
              <span v-if="scope.row.active" style="color:green">开启</span>
              <span v-else style="color:#ccc">关闭</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="防掉签编辑" :visible.sync="EditDialogCode" width="30%" :before-close="handleClose">
          <el-row>
            <el-col :span="12">
              <div style="text-align: center" class="grid-content bg-purple">注册金额大于等于（元）</div>
            </el-col>
            <el-col :span="12">
              <el-input placeholder="请输入修改信息" v-model="registerMoney"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">注册天数大于等于（天）</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-input placeholder="请输入修改信息" v-model="registerDays"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">更新标题</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-input placeholder="请输入修改信息" v-model="title"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">更新提示语</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-input placeholder="请输入修改信息" v-model="content"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">跳转链接</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-input placeholder="请输入修改信息" v-model="url"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">描述文件地址</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-input placeholder="请输入修改信息" v-model="desUrl"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="text-align: center;line-height: 36px;" class="grid-content bg-purple">开关</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-switch v-model="active" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="backInformation">取 消</el-button>
            <el-button type="primary" @click="upAddSeverWx">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  getPreventConfig,
  updatePreventConfig
} from "../../api/admin/gameSetting/gameSetting";

interface QueryItem {
  id: string;
  pid: string;
  registerDays: number;
  registerMoney: number;
  title: string;
  content: string;
  url: string;
  active: boolean;
  desUrl: string;
}

@Component
export default class preventSignOffConfig extends Vue {
  loading: boolean = false; //加载状态
  EditDialogCode: boolean = false; //编辑弹窗状态
  pid: string = ""; //项目
  registerDays: number = null;
  registerMoney: number = null;
  title: string = "";
  content: string = "";
  url: string = "";
  desUrl: string = "";
  active: boolean = false;
  curId: string = "";

  antiDropData: Array<any> = []; //列表数据
  pidList: { pid: string; name: string }[]; //项目数据

  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }
  loadData() {
    this.loading = true;
    getPreventConfig()
      .then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "搜索成功"
          });
          this.antiDropData = res.data.msg;
          this.loading = false;
        }
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: err
        });
        this.loading = false;
      });
  }
  //项目格式
  pidFormatter(row) {
    let pid;
    this.pidList.forEach(item => {
      if (item.pid == row.pid) {
        pid = item.name;
      }
    });
    return pid;
  }
  //编辑
  editCongfig(row) {
    this.pid = row.pid;
    this.curId = row._id;
    this.registerDays = row.registerDays;
    this.registerMoney = row.registerMoney;
    this.title = row.title;
    this.content = row.content;
    this.url = row.url;
    this.active = row.active;
    this.desUrl = row.desUrl;
    this.EditDialogCode = true;
  }
  upAddSeverWx() {
    if (!this.title || !this.content || !this.url || !this.desUrl) {
      this.$message({
        type: "error",
        message: "不能为空！"
      });
      return;
    }
    if (
      Math.floor(Number(this.registerMoney)) === Number(this.registerMoney) &&
      Number(this.registerMoney) >= 0 &&
      Math.floor(Number(this.registerDays)) === Number(this.registerDays) &&
      Number(this.registerDays) >= 0
    ) {
      let queryItem: QueryItem = {
        pid: this.pid,
        id: this.curId,
        desUrl: this.desUrl ? this.desUrl : "",
        registerDays: this.registerDays,
        registerMoney: this.registerMoney,
        title: this.title,
        content: this.content,
        url: this.url,
        active: this.active
      };
      this.$confirm("此操作将修改防掉签配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updatePreventConfig(queryItem)
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.EditDialogCode = false;
                this.loadData();
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    } else {
      this.$message({
        type: "error",
        message: "输入天数或金额错误!"
      });
      return;
    }
  }
  backInformation() {
    this.EditDialogCode = false;
  }
  handleClose(done) {
    this.$confirm("确认关闭？")
      .then(_ => {
        done();
      })
      .catch(_ => {});
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
</style>