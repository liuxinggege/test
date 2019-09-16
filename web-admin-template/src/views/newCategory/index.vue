<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
  }
  &-marquee {
    position: relative;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  //   font-family: Fantasy;
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

<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <el-col class="toolbar1" style="margin-bottom:20px">
        <el-popover ref="popover1" placement="top" trigger="hover" content="newCategory"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">newCategory</span>
      </el-col>
      <!--工具条-->
      <div>
        <el-button type="primary" @click="addup(-1)">添加</el-button>
        <el-button type="primary" @click="findAll">查询所有</el-button>
        <br />
        <br />
        <el-input v-model="findId" placeholder="请输入查询的id" type="text" style="width:300px;margin-right:10px;"></el-input>
        <el-button type="primary" @click="find" :disabled="!findId">查询</el-button>
      </div>
    </el-card>
    <!-- 编辑 -->
    <el-dialog :visible.sync="editWindowState" :title="editWindowTitle" width="400px">
      <el-form ref="editform" :model="editform" label-width="80px">
        <el-form-item label="ID" prop="id">
          <el-input-number v-model="editform.id" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="pid父分类" prop="pid">
          <el-input-number v-model="editform.pid" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="删除标识" prop="deleted">
          <el-input-number v-model="editform.deleted" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="父类名称" prop="name">
          <el-input v-model="editform.name" placeholder="请输入内容父类名称"></el-input>
        </el-form-item>
        <el-form-item label="url封面" prop="img_url">
          <el-input v-model="editform.img_url" placeholder="请输入内容url封面"></el-input>
        </el-form-item>
        <el-form-item label="ckey值" prop="c_key">
          <el-input-number v-model="editform.c_key" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="editform.sort" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="handlesSaveEdit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  newCategoryCreate,
  newCategoryUpdate,
  newCategoryDelete,
  newCategoryFind,
  newCategoryFindAll
} from "@/api/newCategory";
// import axios from "axios";

export interface NewCategoryForm {
  id: number;
  pid: number;
  name: string;
  deleted?: number;
  img_url?: string;
  sort: number;
  c_key?: number;
}

@Component({ name: "newCategory" })
export default class extends Vue {
  private editWindowState: boolean = false;
  private editWindowTitle: string = "";
  private findId: string = "";
  private editform: NewCategoryForm = {
    id: 0,
    pid: 0,
    name: "",
    sort: 0
  };

  created() {}

  mounted() {}

  private addup(row: any) {
    this.editWindowState = true;
    if (-1 === row) {
      this.editWindowTitle = "添加";
      this.editform = {
        id: 0,
        pid: 0,
        sort: 0,
        name: "",
        deleted: 0,
        img_url: "",
        c_key: 0
      };
    } else {
      this.editWindowTitle = "编辑";
      this.editform = row;
    }
  }

 private async findAll() {
     let res =  await newCategoryFindAll()
     console.log("查询所有:",res)
 }

  private async find() {
     let res =  await newCategoryFind( { id : parseInt(this.findId) })
     console.log("一条:",res)
  }

  private async handlesSaveEdit() {
    let res = await newCategoryCreate(this.editform);
    console.log("添加一条:", res);
  }
}
</script>