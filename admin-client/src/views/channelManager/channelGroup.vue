<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道组">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">渠道组</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus"
          @click="insertClick()"> 添加
        </el-button>      
      </span>
     <!--列表-->
      <el-table :data="channelGroup.parentChannels" border highlight-current-row style="width: 100%;" max-height="600">
          <el-table-column prop="name" label="名字" min-width="100"  align="center"></el-table-column>
          <el-table-column prop="channels" label="渠道" min-width="100"  align="center" :formatter="channelsFunc"></el-table-column>
          <el-table-column label="操作" min-width="150" align="center" >
            <template slot-scope="scope">
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit"
                @click="editMineClick(scope.$index, scope.row ,'admin')">编辑父渠道
              </el-button>
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit"
                @click="editSonClick(scope.$index, scope.row ,'admin')">编辑子渠道
              </el-button>
              <!-- <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete"
                @click="deleteClick(scope.$index, scope.row ,'admin')">删除父渠道
              </el-button> -->
            </template>
          </el-table-column>
      </el-table> 
       <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
          :current-page="page" 
          :page-sizes="[10,20,30,50]" 
          :page-size="count" 
          :total="channelGroup.totalCount">
        </el-pagination>
      </el-col>
	  </el-card >
      
    <el-dialog :visible.sync="addChannelisible"  title="创建渠道">
        <span style="font-size:12pt; margin:10px 0px 10px 64px">名字</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="addRoleName"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 34px">渠道</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="addChannel"></el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeAddRole">取 消</el-button>
            <el-button type="primary" @click="saveAddRole">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="editRoleVisible"  title="编辑渠道">
        <span style="font-size:12pt; margin:10px 0px 10px 64px">名字</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="editName" :disabled="true"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">渠道</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="editChannel"></el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeEditRole">取 消</el-button>
            <el-button type="primary" @click="saveEditRole">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="sonRoleVisible"  title="子角色" width=1000px>
         <span class="title">子渠道</span>
         <span style="position:absolute; right:0; top:1">
            <el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus"
              @click="insertClick()"> 添加
            </el-button>   
        </span>
        <div style=" margin:20px 0px 30px 0px">
          <el-table :data="channelGroup.sonChannels" border highlight-current-row style="width: 100%;" max-height="600">
            <el-table-column prop="name" label="名字" min-width="60"  align="center"></el-table-column>
            <el-table-column prop="channels" label="渠道" min-width="100"  align="center" :formatter="channelsFunc"></el-table-column>
            <el-table-column label="操作" min-width="80" align="center" >
            <template slot-scope="scope">
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit"
                @click="editMineClick(scope.$index, scope.row)">编辑本角色
              </el-button>
            </template>
            </el-table-column>
          </el-table> 
        </div>
        <div>
          <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
            @current-change="handleSONCurrentChange" 
            @size-change="handleSONSizeChange" 
            :current-page="sonPage" 
            :page-sizes="[10,20,30,50]" 
            :page-size="sonCount" 
            :total="channelGroup.sonTotalCount">
          </el-pagination>
        </div>
    </el-dialog>
    
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { ChannelGroupState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js"
//ChannelGroup
interface QueryItem {

  name?: string;
  page?: number;
  count?: number;
  parentName?: string;
}



// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ChannelGroup extends Vue {
  // lifecycle hook
  created() {
    this.loadAdminData(); //初始化-->加载数据
  }
  /*inital data*/
  channelGroup: ChannelGroupState = this.$store.state.channelGroup; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  sonPage: number = 1; //当前页
  sonCount: number = 10;

  addChannelisible:boolean = false;
  sonRoleVisible:boolean = false;
  editRoleVisible:boolean = false;

  currentParentName:string = "";
  currtType:string = "";
  addRoleName:string = "";
  addChannel:string = "";
  currentPower:string[] = [];

  editName:string = "";
  editChannel:string = "";

  loadAdminData() {

    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store,"GetParents", queryItem, true).then(()=>{
    });
  }

  loadSonData(){

    if (this.currentParentName != undefined && this.currentParentName != "" && this.sonRoleVisible){
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.sonPage;
        queryItem.count = this.sonCount;
        queryItem.parentName = this.currentParentName;
        myDispatch(this.$store,"GetSubs", queryItem, true).then(()=>{
        });
    }
  }


  editMineClick(index, row ,type){

    this.editName = row.name;
    this.editChannel = row.channels.join(",");

    this.editRoleVisible = true;

  }

  closeEditRole(){
     this.editRoleVisible = false;
  }

  saveEditRole(){
   
    let upateData:any = {
      name: this.editName,
      channels: this.editChannel.split(","),
    };

    this.$confirm("此操作将修改渠道,是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
         myDispatch(this.$store, "UpdateChannelGroup",upateData)
          .then(() => {
             if (this.channelGroup.editCode == 200) {
               this.$message({
                 type: "success",
                 message: "修改成功!"
               });
               this.editRoleVisible = false;
               this.loadAdminData();
                this.loadSonData();
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
                this.loadAdminData();
                 this.loadSonData();
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

  editSonClick(index, row, type){

    this.currentParentName = row.name;
    this.sonRoleVisible = true;
    this.loadSonData();
  }

  insertClick(){
    this.addRoleName = "";
    this.addChannel = "";
    this.addChannelisible = true;
  }



  closeAddRole(){
    this.addChannelisible = false;
  }


  saveAddRole(){

      let createData:any = {
        name:this.addRoleName,
        channels:this.addChannel.split(","),
      };

      let sqString:string = "CreateParent";

      if (this.currentParentName != undefined && this.currentParentName != "" && this.sonRoleVisible){
        createData = {
          name:this.addRoleName,
          channels:this.addChannel.split(","),
          parentName:this.currentParentName,
        };
         sqString = "CreateSub";
      }
  
      this.$confirm("此操作将添加新渠道,是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
         myDispatch(this.$store, sqString,createData)
          .then(() => {
             if (this.channelGroup.addCode == 200) {
               this.$message({
                 type: "success",
                 message: "添加成功!"
               });
               this.addChannelisible = false;
               this.loadAdminData();
               this.loadSonData();
               return;
             } 
          })
          .catch(err => {
                console.error("err:", err);
                this.$message({
                  type: "error",
                  message: "添加失败!"
                });
                this.addChannelisible = false;
                this.loadAdminData();
                 this.loadSonData();
                return;
              });
           })
        .catch(() => {
         this.$message({
           type: "info",
           message: "已取消添加"
         });
         this.addChannelisible = false;
     });
  }

  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};


    return temp;
  }

  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadAdminData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadAdminData();
  }

  handleSONCurrentChange(val) {
    this.sonPage = val;
    this.loadAdminData();
  }
  //每页显示数据量变更
  handleSONSizeChange(val) {
    this.sonCount = val;
    this.loadAdminData();
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

 
 channelsFunc(row, column){
    return row.channels.join(",");
 }


  deleteClick(row, column){
    
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
