<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="组长管理">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">组长管理</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>

      <span style="position:absolute; right:100px; top:1">

        <span>昵称</span>
				<el-input v-model="name" style="width:120px; margin:0 10px"></el-input>
        <span>账号</span>
				<el-input v-model="act" style="width:120px; margin:0 10px"></el-input>

        
        <el-button type="primary" style="margin:0px 100px 10px 0px" @click="loadData">搜索</el-button>

        <!-- <el-button type="primary" icon="plus" @click="addRelation">添加组长</el-button> -->
      </span>
     <!--列表-->
      <el-table :data="groupRelation.fatherData" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column prop="data" label="添加时间" align="center"></el-table-column>
        <el-table-column prop="name" label="组长昵称" align="center"></el-table-column>
        <el-table-column prop="act" label="组长账号" align="center"></el-table-column>
        <el-table-column prop="pwd" label="组长密码" align="center"></el-table-column>
        <el-table-column prop="count" label="组员数量" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">       
        <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>&emsp;&emsp;
              <el-button type="text" @click="deleteRow(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
        </el-table-column>    
      </el-table>
      <el-dialog :visible.sync="dialogAdd">
         <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
              <el-form-item label="组长昵称"><el-input v-model="addName" style="width:150px"></el-input></el-form-item>
              <el-form-item label="组长账号(主后台)"><el-input v-model="addAct" style="width:150px"></el-input></el-form-item>
              <el-form-item label="组长密码"><el-input v-model="addPwd" style="width:150px"></el-input></el-form-item>
              <el-form-item label="组长账号(代理后台)"><el-input v-model="addAgentAct" style="width:150px"></el-input></el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="cancelEdit">取 消</el-button>
              <el-button type="confirmStages" @click="confirmStages">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog :visible.sync="dialogEditFormVisible">
          <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
              <el-form-item label="组长昵称"><el-input v-model="addName" style="width:150px"></el-input></el-form-item>
              <el-form-item label="组长账号(主后台)"><el-input v-model="addAct" style="width:150px" disabled></el-input></el-form-item>
              <el-form-item label="组长密码"><el-input v-model="addPwd" style="width:150px"></el-input></el-form-item>
              <el-form-item label="组长账号(代理后台)"><el-input v-model="addAgentAct" style="width:150px"></el-input></el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="cancelEdit">取 消</el-button>
              <el-button type="primary" @click="update">确 定</el-button>
          </div>
      </el-dialog>
       <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
          :current-page="page" 
          :page-sizes="[10,20,30,50]" 
          :page-size="count" 
          :total="groupRelation.fatherTotalCount">
        </el-pagination>
      </el-col>
	  </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { GroupRelationState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js";
//ChannelRelation
interface QueryItem {
  name?: string;
  adminAct?: string;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class FatherRalation extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  groupRelation: GroupRelationState = this.$store.state.groupRelation; //表单数据
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;

  dialogAdd: boolean = false;
  dialogEditFormVisible: boolean = false;

  name:string = "";
  act:string = "";


  addName: string = "";
  addAct: string = "";
  addPwd: string = "";
  addAgentAct: string = "";


  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetGroupRelation", queryItem, true).then(
      () => {}
    );
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};

    if (this.name && this.name.trim()){
      temp.name = this.name;
    }

    if (this.act && this.act.trim()){
      temp.adminAct = this.act;
    }
    return temp;
  }

  getExportQueryItem() {
    let temp: QueryItem = {};

 
    return temp;
  }

  deleteRow(index, row) {
    let tmp = {
      channel: row.channel
    };
    this.$confirm("是否删除该组长？删除后其组员将处于无归属状态,可重新分配组长,是否删除?", "提示", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning"
    }).then(()=>{
      this.$confirm("此操作将删除该组长,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          myDispatch(this.$store, "DeleteGroupRelation", tmp)
            .then(() => {
              if (this.groupRelation.code == 200) {
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
    })
    
  }

  confirmStages() {
    let tmp: any = {
      act: this.addAct,
      name: this.addName,
      pwd: this.addPwd,
      agencyAct: this.addAgentAct,
    };
    this.$confirm("此操作将添加新账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddGroupRelation", tmp)
          .then(() => {
            if (this.groupRelation.code == 200) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.dialogAdd = false;
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
            this.dialogAdd = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.dialogAdd = false;
      });
  }

  addRelation() {
    this.addAct = "";
    this.addName = "";
    this.addPwd = "";
    this.addAgentAct = "";
    this.dialogAdd = true;
  }

  editRow(index, row) {
    this.addAct = row.act;
    this.addName = row.name;
    this.addPwd = "";
    this.addAgentAct = row.agentAct;
    this.dialogEditFormVisible = true;
  }

  update() {
    let tmp: any = {

    };
    this.$confirm("此操作将修改账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "EditChannelRelation", tmp)
          .then(() => {
            if (this.groupRelation.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.dialogEditFormVisible = false;
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
            this.dialogEditFormVisible = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
        this.dialogEditFormVisible = false;
      });
  }

  cancelEdit() {
    this.dialogEditFormVisible = false;
    this.dialogAdd = false;
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
