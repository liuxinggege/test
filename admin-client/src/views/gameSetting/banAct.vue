<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="手机号前缀黑名单"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>手机号前缀黑名单</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <span>手机号前缀</span>
          <el-input style="width:150px;margin:0 15px;" type="primary" v-model="searchAct"></el-input>
          <el-button type="primary" @click="refresh">搜索</el-button>
          <el-button type="primary" @click="addBanAct">添加</el-button>
        </div>
        <el-table :data="banActList" border highlight-current-row style="margin: 20px 0">
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="act" label="手机号前缀" min-width="100" align="center"></el-table-column>
        </el-table>
      </div>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
      <!-- 添加 -->
      <el-dialog :visible.sync="addFlag" width="500px" @close="close" title="添加">
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">手机号前缀</span>
          <el-input type="text" style="width:200px; margin:15px 30px 10px 15px" v-model="act"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addConfirm">确定</el-button>
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
  getBanAct,
  addBanAct,
  delBanAct
} from "../../api/admin/gameSetting/gameSetting";

@Component
export default class banAct extends Vue {
  created() {
    this.loadData();
  }
  /*inital data*/
  banActList: object[] = [];
  addFlag: boolean = false;
  act: string = "";
  searchAct: string = "";
  totalCount: Number = 0;
  page: number = 1;
  count: number = 10;
  /*method*/
  async loadData() {
    let req: any = {};
    req.page = this.page;
    req.count = this.count;
    if (this.searchAct) {
      req.act = this.searchAct;
    }
    let ret = await myAsyncFn(getBanAct, req);
    if (ret.code === 200) {
      this.banActList = ret.msg.pageData;
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
  addBanAct() {
    this.act = "";
    this.addFlag = true;
  }
  //添加确认
  async addConfirm() {
    if (!this.act) {
      this.$message({
        type: "error",
        message: "手机号前缀不能为空!"
      });
    } else {
      let data = {
        act: this.act
      };
      this.$confirm("此操作将添加,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let ret = await myAsyncFn(addBanAct, data);
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
  // 删除
  async del(id) {
    this.$confirm("此操作将删除数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delBanAct, { id });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
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
  close() {
    this.act = "";
    this.addFlag;
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
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
</style>
