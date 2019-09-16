<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="用户信息"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">用户信息</span>
      </el-col>
      <span class="content_font"></span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus" @click="insertClick">添加</el-button>
      </span>
      <!--列表-->
      <el-table :data="adminUserManager.userData" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column prop="name" label="账号名" min-width="100" align="center"></el-table-column>
        <el-table-column label="角色名" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.role}}</span>
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="eidtRoleClick(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="密码" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.pwd}}</span>
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="editPwdClick(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="deleteClick(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="addUserVisible" title="编辑角色">
        <span style="font-size:12pt; margin:10px 0px 10px 64px">账号名</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 20px" v-model="addUserName"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">密码</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" v-model="addUserPwd"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">选择角色</span>
        <el-select v-model="addUserRole" placeholder="请选择" style="width:200px; margin:0px 0px 0px 20px">
          <el-option v-for="item in adminUserManager.roleAdminData" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditUser">取 消</el-button>
          <el-button type="primary" @click="saveEditUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="editRoleVisible" title="修改角色">
        <span style="font-size:12pt; margin:10px 0px 10px 64px">账号名</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 20px" v-model="editUserName" :disabled="true"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">选择角色</span>
        <el-select v-model="editUserRole" placeholder="请选择" style="width:200px; margin:0px 0px 0px 10px">
          <el-option v-for="item in adminUserManager.roleAdminData" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditUserRole">取 消</el-button>
          <el-button type="primary" @click="saveEditUserRole">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="editPWDVisible" title="修改密码">
        <span style="font-size:12pt; margin:10px 0px 10px 64px">账号名</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 20px" v-model="editUserName" :disabled="true"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">密码</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 20px" v-model="editUserPwd"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditUserPwd">取 消</el-button>
          <el-button type="primary" @click="saveEditUserPwd">确 定</el-button>
        </div>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="adminUserManager.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AdminUserManagerState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//AdminUserManager
interface QueryItem {
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AdminUserManager extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
    this.loadRoleList();
  }
  /*inital data*/
  adminUserManager: AdminUserManagerState = this.$store.state.adminUserManager; //表单数据
  page: number = 1; //当前页
  count: number = 10;

  addUserVisible: boolean = false;
  editRoleVisible: boolean = false;
  editPWDVisible: boolean = false;

  addUserName: string = "";
  addUserPwd: string = "";
  addUserRole: string = "";

  editUserName: string = "";
  editUserPwd: string = "";
  editUserRole: string = "";

  roleList = [
    { value: "ASC", label: "升序" },
    { value: "DESC", label: "降序" }
  ];

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;

    myDispatch(this.$store, "GetAdminUserManager", queryItem, true).then(
      () => {}
    );
  }

  loadRoleList() {
    let queryItem = {
      page: 1,
      count: 100,
      type: "admin"
    };
    myDispatch(this.$store, "GetAdminRole", queryItem, true).then(() => {});
  }

  deleteClick(index, row) {
    let createData = {
      name: row.name
    };
    this.$confirm("此操作将删除账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeleteAdminUserManager", createData)
          .then(() => {
            if (this.adminUserManager.deletCode == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "删除失败!"
            });
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  insertClick() {
    this.addUserVisible = true;
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};

    temp.page = this.page;
    temp.count = this.count;
    return temp;
  }

  closeEditUser() {
    this.addUserVisible = false;
  }
  saveEditUser() {
    let createData = {
      name: this.addUserName,
      pwd: this.addUserPwd,
      role: this.addUserRole
    };
    this.$confirm("此操作将添加新账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddAdminUserManager", createData)
          .then(() => {
            if (this.adminUserManager.code == 200) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.addUserVisible = false;
              this.loadData();
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            this.addUserVisible = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.addUserVisible = false;
      });
  }

  eidtRoleClick(index, row) {
    this.editUserName = row.name;
    this.editUserRole = row.role;
    this.editRoleVisible = true;
  }
  closeEditUserRole() {
    this.editRoleVisible = false;
  }
  saveEditUserRole() {
    let createData = {
      name: this.editUserName,
      role: this.editUserRole
    };
    this.$confirm("此操作将修改此账号角色,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UpdateAdminUserRole", createData)
          .then(() => {
            if (this.adminUserManager.eidtRoleCode == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.editRoleVisible = false;
              this.loadData();
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "修改失败!"
            });
            this.editRoleVisible = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
        this.editRoleVisible = false;
      });
  }

  editPwdClick(index, row) {
    this.editUserName = row.name;
    this.editUserPwd = row.pwd;
    this.editPWDVisible = true;
  }
  closeEditUserPwd() {
    this.editPWDVisible = false;
  }
  saveEditUserPwd() {
    let createData = {
      name: this.editUserName,
      pwd: this.editUserPwd
    };
    this.$confirm("此操作将修改此账号角色,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UpdateAdminUserManager", createData)
          .then(() => {
            if (this.adminUserManager.eidtPwdCode == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.editPWDVisible = false;
              this.loadData();
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "修改失败!"
            });
            this.editPWDVisible = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
        this.editPWDVisible = false;
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
  submitTimeFunc(row, column) {
    if (row.createTime) {
      let date = new Date(row.createTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }

  sumDateFunc(row, column) {
    let date = new Date(row.sumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  logDateFunc(row, column) {
    let date = new Date(row.localeSumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }

  userChannelFunc(row, column) {
    if (row.userChannel === "") {
      return "官方";
    } else {
      return row.userChannel;
    }
  }

  billRecordsTime(row, column) {
    if (row.time) {
      let date = new Date(row.time);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
