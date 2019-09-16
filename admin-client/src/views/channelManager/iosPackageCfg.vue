<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="商店包TIPS管理"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>商店包TIPS管理</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <span>名称</span>
          <el-input v-model="name" :clearable="true" style="width:150px; margin:0 10px"></el-input>
          <el-button type="primary" @click="refresh">搜索</el-button>
          <el-button type="primary" @click="add">添加</el-button>
        </div>
        <el-table :data="packageCfgList" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="update(scope.row)"></el-button>
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="100" align="center"></el-table-column>
          <el-table-column prop="bundleId" label="包ID" min-width="150" align="center"></el-table-column>
          <el-table-column prop="url" label="商店包链接" min-width="200" align="center"></el-table-column>
          <el-table-column label="TIPS图片" width="300" align="center">
            <template slot-scope="scope">
              <img style="width:200px;" :src="scope.row.tipsImgUrl">
            </template>
          </el-table-column>
          <el-table-column prop="isOnline" label="是否在线" width="100" align="center" :formatter="isOnlineFormat"></el-table-column>
        </el-table>
      </div>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
      <!-- 添加 -->
      <el-dialog title="添加" :visible.sync="addFlag" width="600px" @close="close">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 30px">商店包名称</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addName"></el-input>
          <el-switch v-model="isOnline" active-text="在线" inactive-text="离线"></el-switch>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 30px">包ID</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addBundleId"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 30px">商店包链接</span>
          <el-input type="text" style="width:350px; margin:15px 30px 10px 15px" v-model="addUrl"></el-input>
        </div>
        <div>
          <p style="font-size:12pt; margin:10px 0px 0px 30px">TIPS图片</p>
          <el-upload style="margin-left:140px" ref="upload" class="upload-demo" list-type="picture-card" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :on-remove="remove" :limit="1">
            <el-button size="small" type="primary">上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog title="添加" :visible.sync="editFlag" width="600px" @close="close">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 30px">商店包名称</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addName"></el-input>
          <el-switch v-model="isOnline" active-text="在线" inactive-text="离线"></el-switch>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 30px">包ID</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="addBundleId"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 30px">商店包链接</span>
          <el-input type="text" style="width:350px; margin:15px 30px 10px 15px" v-model="addUrl"></el-input>
        </div>
        <div>
          <p style="font-size:12pt; margin:10px 0px 0px 30px">TIPS图片</p>
          <el-upload style="margin-left:140px" ref="upload" class="upload-demo" list-type="picture-card" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :limit="1">
            <el-button size="small" type="primary">上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
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
  getIosPackageCfg,
  addIosPackageCfg,
  updateIosPackageCfg,
  delIosPackageCfg
} from "../../api/admin/channelManager/channelManager";
import oss from "../../utils/oss.js";
@Component
export default class channelPageHost extends Vue {
  created() {
    this.loadData();
  }
  //initData
  packageCfgList: object[] = [];
  api: string = "";
  id: string = "";
  addFlag: boolean = false;
  editFlag: boolean = false;
  name: string = "";
  totalCount: Number = 0;
  page: number = 1;
  count: number = 10;
  //add
  addName: string = "";
  addBundleId: string = "";
  addUrl: string = "";
  tipsImgUrl: string = "";
  isOnline: boolean = true;
  //edit
  editHost: string = "";
  editSecret: string = "";
  /*method*/
  async loadData() {
    let req: any = {};
    req.page = this.page;
    req.count = this.count;
    if (this.name.trim()) {
      req.name = this.name;
    }
    let ret = await myAsyncFn(getIosPackageCfg, req);
    if (ret.code === 200) {
      this.packageCfgList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  fnUploadRequest(option) {
    oss.ossUploadFile(option, "channelManager/iosPackageCfg/");
  }
  remove() {
    this.tipsImgUrl = "";
  }
  errorFunc() {
    this.$message({
      message: "上传失败",
      type: "error"
    });
  }

  successFunc(url) {
    this.$message({
      message: "上传成功",
      type: "success"
    });
    this.tipsImgUrl = url;
  }
  beforeAvatarUpload(file) {
    console.log(file.size / 1000);
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      this.$message({
        showClose: true,
        type: "warning",
        message: "图片只能上传jpg/png格式!"
      });
      return false;
    }
    if (file.size > 500 * 1000) {
      this.$message({
        showClose: true,
        type: "warning",
        message: "图片太大!"
      });
      return false;
    }
  }
  //读取
  refresh() {
    this.page = 1;
    this.loadData();
  }
  //添加
  add() {
    if (this.tipsImgUrl) {
      const ref: any = this.$refs["upload"];
      ref.clearFiles();
    }
    this.addName = "";
    this.tipsImgUrl = "";
    this.isOnline = true;
    this.addBundleId = "";
    this.addUrl = "";
    this.addFlag = true;
  }
  //添加确认
  addConfirm() {
    if (!this.addName) {
      this.$message({
        type: "warning",
        message: "包名称不能为空!"
      });
    } else if (!this.addBundleId) {
      this.$message({
        type: "warning",
        message: "包ID不能为空!"
      });
    } else if (!this.addUrl) {
      this.$message({
        type: "warning",
        message: "商店包链接不能为空!"
      });
    } else if (!this.tipsImgUrl) {
      this.$message({
        type: "warning",
        message: "请上传TIPS图片!"
      });
    } else {
      let data = {
        name: this.addName,
        bundleId: this.addBundleId,
        isOnline: this.isOnline,
        url: this.addUrl,
        tipsImgUrl: this.tipsImgUrl
      };
      this.$confirm("此操作将添加,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(addIosPackageCfg, data);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.addFlag = false;
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

  // 修改
  update(row) {
    this.addName = row.name;
    this.tipsImgUrl = row.tipsImgUrl;
    this.isOnline = row.isOnline;
    this.addBundleId = row.bundleId;
    this.addUrl = row.url;
    this.id = row._id;
    this.editFlag = true;
  }

  //修改确认
  async editConfirm() {
    if (!this.addName) {
      this.$message({
        type: "warning",
        message: "包名称不能为空!"
      });
    } else if (!this.addBundleId) {
      this.$message({
        type: "warning",
        message: "包ID不能为空!"
      });
    } else if (!this.addUrl) {
      this.$message({
        type: "warning",
        message: "商店包链接不能为空!"
      });
    } else if (!this.tipsImgUrl) {
      this.$message({
        type: "warning",
        message: "请上传TIPS图片!"
      });
    } else {
      this.$confirm("此操作将修改数据,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = {
            id: this.id,
            name: this.addName,
            bundleId: this.addBundleId,
            isOnline: this.isOnline,
            url: this.addUrl,
            tipsImgUrl: this.tipsImgUrl
          };
          let ret = await myAsyncFn(updateIosPackageCfg, data);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.editFlag = false;
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
  //删除
  del(id) {
    this.$confirm("此操作将修改数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delIosPackageCfg, { id: id });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editFlag = false;
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
  isOnlineFormat(row) {
    if (row.isOnline) {
      return "在线";
    } else {
      return "离线";
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
