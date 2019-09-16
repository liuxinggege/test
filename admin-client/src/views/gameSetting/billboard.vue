<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <div>
        <el-col class="toolbar1" style="margin-bottom: 20px">
          <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="编辑公告"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title">编辑公告</span>
          <span style="position:absolute; right:0; top:1">
            <span>项目：</span>
            <el-select v-model="pid" @change="change" placeholder="请选择pid" style="width:110px">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
            <el-button type="primary" style="margin:0 10px" icon="el-icon-search" @click="getBillboard">读取</el-button>
            <el-button type="primary" style="margin:0 100px 10px 0" icon="el-icon-edit" @click="addBillboard">添加</el-button>
          </span>
        </el-col>
        <el-table :data="billboardArr" border highlight-current-row style="width: 100%;margin: 20px 0">
          <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>            -->
          <el-table-column prop="active" label="状态" width="50" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.active"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
              <el-button type="text" icon="el-icon-edit" @click="edit(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="pid" label="项目" width="70" align="center" :formatter="pidFormatter"></el-table-column>
          <el-table-column prop="title" label="大标题" width="100" align="center"></el-table-column>
          <el-table-column prop="subTitle" label= "小标题" width="170" align="center"></el-table-column>
          <el-table-column prop="idx" label="idx" width="100" align="center"></el-table-column>
          <el-table-column prop="sequence" label="排序" width="100" align="center"></el-table-column>
          <el-table-column label="内容" align="left" height="50">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" width="700">
                <p>公告内容: {{ scope.row.content }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.content.slice(0,70)+"......" }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加小画面 -->
        <el-dialog :visible.sync="addBillboardFg" width="800px">
          <div>
            <span style="font-size:12pt;">
              主标题
              <el-input style="width:400px; margin:5px" v-model="tmp_subTitle" :maxlength="18"></el-input>
            </span>
          </div>
          <div style="margin: 20px 0 ">
            <span style="font-size:12pt;">
              小标题
              <el-input style="width:110px; margin:5px" v-model="tmp_title" :maxlength="6"></el-input>
            </span>
            <span style="font-size:12pt;" :maxlength="6">
              排序
              <el-input style="width:60px; margin:5px" v-model="tmp_sequence"></el-input>
            </span>
            <span>项目：</span>
            <el-select v-model="tmp_pid" placeholder="请选择pid" style="width:110px">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
            <el-checkbox style="margin-left:10px" v-model="tmp_active"></el-checkbox>
            <span>激活</span>
          </div>
          <div>
            <el-input type="textarea" :autosize="{ minRows:8, maxRows: 10}" style="width:700px; margin:5px" v-model="tmp_content" placeholder="请输入内容(800个字符)"></el-input>
          </div>
          <el-button type="primary" style="margin:10px 700px 0" @click="saveAddBillboard">确定</el-button>
        </el-dialog>
        <!-- 编辑小画面 -->
        <el-dialog :visible.sync="editBillboardFg" width="800px">
          <div>
            <span style="font-size:12pt;">
              主标题
              <el-input style="width:400px; margin:5px" v-model="tmp_subTitle" :maxlength="18"></el-input>
            </span>
          </div>
          <div style="margin: 20px 0 ">
            <span style="font-size:12pt;">
              小标题
              <el-input style="width:110px; margin:5px" v-model="tmp_title" :maxlength="6"></el-input>
            </span>
            <span style="font-size:12pt;" :maxlength="6">
              排序
              <el-input style="width:60px; margin:5px" v-model="tmp_sequence"></el-input>
            </span>
            <span>项目：</span>
            <el-select v-model="tmp_pid" placeholder="请选择pid" style="width:110px">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
            <el-checkbox style="margin-left:10px" v-model="tmp_active"></el-checkbox>
            <span>激活</span>
          </div>
          <div>
            <el-input type="textarea" :autosize="{ minRows:8, maxRows: 10}" style="width:700px; margin:5px" v-model="tmp_content" placeholder="请输入内容(800个字符)"></el-input>
          </div>
          <el-button type="primary" style="margin:10px 700px 0" @click="saveEditBillboard">确定</el-button>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BillboardState } from "../../store/stateInterface";
import { BillboardArr } from "../../store/modules/gameSetting/billboard";
import { myDispatch } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Billboard extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  billboard: BillboardState = this.$store.state.billboard; //整个marqueState
  billboardArr: BillboardArr[] = []; //表单数据
  editBillboardFg: boolean = false;
  addBillboardFg: boolean = false;
  id = 0;
  // 零时数据
  tmp_active = false;
  tmp_subTitle = "";
  tmp_title = "";
  tmp_sequence = "";
  tmp_content = "";
  tmp_pid = "A";
  pid = "A";
  pidList: any[] = [];
  /*method*/
  async loadData() {
    await myDispatch(this.$store, "GetBillboard", { pid: this.pid });
    this.billboardArr = this.billboard.billboardArr.sort((a,b)=>a.sequence-b.sequence);
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  getBillboard() {
    this.loadData();
  }
  change() {
    this.loadData();
  }
  //添加
  addBillboard() {
    if (this.billboardArr.length >= 5) {
      this.$message({
        type: "warning",
        message: "公告最多5条!"
      });
    }
    this.tmp_active = false;
    this.tmp_subTitle = "";
    this.tmp_title = "";
    this.tmp_sequence = "";
    this.tmp_content = "";
    this.tmp_pid = "";
    this.addBillboardFg = true;
  }
  //添加保存
  async saveAddBillboard() {
    if (
      !this.tmp_subTitle ||
      !this.tmp_title ||
      !this.tmp_sequence ||
      !this.tmp_content ||
      !this.tmp_pid
    ) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    let tmp = {
      active: this.tmp_active,
      subTitle: this.tmp_subTitle,
      title: this.tmp_title,
      sequence: this.tmp_sequence,
      content: this.tmp_content,
      pid: this.tmp_pid
    };
    this.$confirm("此操作将添加新公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "AddBillboard", tmp);
        if (this.billboard.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.addBillboardFg = false;
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.billboard.msg}`
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
  //编辑
  edit(row, index) {
    this.id = row._id;
    this.tmp_active = row.active;
    this.tmp_subTitle = row.subTitle;
    this.tmp_title = row.title;
    this.tmp_sequence = row.sequence;
    this.tmp_content = row.content;
    this.tmp_pid = row.pid;
    this.editBillboardFg = true;
  }
  //编辑保存
  async saveEditBillboard() {
    if (
      !this.tmp_subTitle ||
      !this.tmp_title ||
      !this.tmp_sequence ||
      !this.tmp_content ||
      !this.tmp_pid
    ) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    let tmp = {
      id: this.id,
      active: this.tmp_active,
      subTitle: this.tmp_subTitle,
      title: this.tmp_title,
      sequence: this.tmp_sequence,
      content: this.tmp_content,
      pid: this.tmp_pid
    };
    this.$confirm("此操作将修改公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "UpdateBillboard", tmp);
        if (this.billboard.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editBillboardFg = false;
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.billboard.msg}`
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
  //删除
  async del(id) {
    this.$confirm("此操作将删除公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "DelBillboard", { id: id });
        if (this.billboard.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.billboard.msg}`
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
  pidFormatter(row) {
    let data;
    this.pidList.forEach(element => {
      if (element.pid === row.pid) data = element;
    });
    return data.name;
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
  &-marquee {
    margin-top: 25px;
    position: relative;
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
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
th {
  text-align: center !important;
}
</style>
