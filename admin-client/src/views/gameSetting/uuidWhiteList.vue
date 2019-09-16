<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover
        ref="popover1"
        placement="top-start"
        itle="标题"
        width="200"
        trigger="hover"
        content="uuid白名单管理"
      >
      </el-popover>
      <el-button
        v-popover:popover1
        type='text'
        class='el-icon-info'
      ></el-button>
      <span class="title">
        <b>uuid白名单管理</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <el-button
            type="primary"
            @click="addBlackList"
          > 添加
          </el-button>
          <el-button
            type="primary"
            @click="refresh"
          > 读取
          </el-button>
        </div>
        <el-table
          :data="uuidWhiteList"
          border
          highlight-current-row
          style="margin: 20px 0"
        >
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type='text'
                icon='el-icon-delete'
                @click="del(scope.row.uid)"
              ></el-button>
              <!-- <el-button
                type='text'
                icon='el-icon-edit'
                @click="update(scope.row)"
              ></el-button> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="uid"
            label="uid"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="70"
            align="center"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="info"
            label="信息"
            min-width="170"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="reason"
            label="理由"
            min-width="170"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="operator"
            label="操作人"
            min-width="70"
            align="center"
          >
          </el-table-column> -->
        </el-table>
      </div>
      <el-col class="toolbar2">
        <el-pagination
          layout="total,sizes,prev, pager, next,jumper"
          class="pag"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[10,20,30,50]"
          :page-size="count"
          :total="totalCount"
        >
        </el-pagination>
      </el-col>
      <!-- 添加 -->
      <el-dialog
        :visible.sync="addFlag"
        width=400px
        @close="close"
      >
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">uid</span>
          <el-input
            type='text'
            style='width:200px; margin:15px 30px 10px 15px'
            v-model="uid"
          ></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 40px">备注</span>
          <el-input
            type='text'
            style='width:200px; margin:15px 30px 10px 15px'
            v-model="remark"
          ></el-input>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="addConfirm"
          >确定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
      <!-- <el-dialog
        :visible.sync="editFlag"
        width=400px
        @close="close"
      >
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">旧uid</span>
          <el-input
            type='text'
            style='width:200px; margin:15px 30px 10px 15px'
            v-model="uid"
            :disabled="true"
          ></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 50px">新uid</span>
          <el-input
            type='text'
            style='width:200px; margin:15px 30px 10px 15px'
            v-model="editUid"
          ></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:0px 0px 10px 57px">备注</span>
          <el-input
            type='text'
            style='width:200px; margin:15px 30px 10px 15px'
            v-model="remark"
          ></el-input>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="editConfirm"
          >确定</el-button>
        </div>
      </el-dialog> -->
    </el-card>
  </div>
</template>
<script lang = 'ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getUuidWhiteList,
  addUuidWhiteList,
  delUuidWhiteList
} from "../../api/admin/gameSetting/gameSetting";

@Component
export default class uuidWhiteList extends Vue {
  created() {
    this.loadData();
  }
  /*inital data*/
  uuidWhiteList: object[] = [];
  addFlag: boolean = false;
  editFlag: boolean = false;
  remark: string = "";
  uid: string = "";
  totalCount: Number = 0;
  editUid: string = "";
  page: number = 1;
  count: number = 10;
  /*method*/
  async loadData() {
    let req: any = {};
    req.page = this.page;
    req.count = this.count;
    let ret = await myAsyncFn(getUuidWhiteList, req);
    if (ret.code === 200) {
      this.uuidWhiteList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  //读取
  refresh(){
    this.page = 1;
    this.loadData()
  }
  //添加
  addBlackList() {
    this.addFlag = true;
  }
  //添加确认
  async addConfirm() {
    if(!this.uid){
      this.$message({
            type: "error",
            message: "uid不能为空!"
          });
    }else if(!this.remark){
        this.$message({
            type: "error",
            message: "备注不能为空!"
          });
    }else{
      let data = {
        uid: this.uid,
        remark: this.remark
    };
    this.$confirm("此操作将添加,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(addUuidWhiteList, data);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.addFlag = false;
          this.uid = "";
          this.remark = "";
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
  async del(uid) {
    this.$confirm("此操作将删除数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delUuidWhiteList, { uid });
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
  // 修改
  // async update(row) {
  //   this.editFlag = true;
  //   this.uid = row.uid;
  //   this.remark = row.remark;
  // }

  // 修改确认
  // async editConfirm() {
  //   let data = {
  //     uid: this.uid,
  //     updateUid: this.editUid,
  //     remark: this.remark
  //   };
  //   if(!this.editUid){
  //     this.$message({
  //           type: "error",
  //           message: `新uid不能为空！`
  //         });
  //   }else{
  //     this.$confirm("此操作将修改数据,是否继续?", "提示", {
  //     confirmButtonText: "确定",
  //     cancelButtonText: "取消",
  //     type: "warning"
  //   })
  //     .then(async () => {
  //       let ret = await myAsyncFn(updateUuidWhiteList, data);
  //       if (ret.code === 200) {
  //         this.$message({
  //           type: "success",
  //           message: "操作成功!"
  //         });
  //         this.editFlag = false;
  //         this.uid = "";
  //         this.editUid = "";
  //         this.remark = "";
  //         this.loadData();
  //       } else {
  //         this.$message({
  //           type: "error",
  //           message: `操作失败${ret.err}`
  //         });
  //       }
  //     })
  //     .catch(() => {
  //       this.$message({
  //         type: "info",
  //         message: "已取消操作"
  //       });
  //     });
  //   }
  // }
  // getReq() {
  //   let tmp = {};
  //   if (this.type) {
  //     tmp.type = this.type;
  //   }
  //   if (this.info) {
  //     tmp.info = this.info;
  //   }
  //   return tmp;
  // },

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
  typeFormat(row) {
    switch (row.type) {
      case 0:
        return "账号";
      case 1:
        return "银行卡";
      case 2:
        return "支付宝";
      case 3:
        return "名字";
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
  close() {
    this.uid = "";
    this.editUid = "";
    this.remark = "";
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
