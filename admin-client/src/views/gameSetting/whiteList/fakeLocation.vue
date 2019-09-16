<template>
	<el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="伪装地址">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>伪装地址</b>
		</span>
		<span style="position:absolute; right:0; top:1">
			<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-plus"
				@click="insertFakeClick"> 添加
			</el-button>      
		</span>
    
    <el-table :data="fakeLocation.subFaLocation" border highlight-current-row style="width: 100%; margin:10px 0px 0 0" max-height="500">
      <el-table-column prop="uid" label="玩家id" min-width="120" align="center" ></el-table-column>
      <el-table-column prop="location" label="位置" min-width="300" align="center"></el-table-column>
      <el-table-column label="激活" min-width="100" align="center">
        <template slot-scope="scope"><el-checkbox v-model="scope.row.active" disabled></el-checkbox></template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="center" >
        <template slot-scope="scope">
          <el-button type="primary"  style="margin:0 10px 10px 0" icon="el-icon-edit"
				    @click="fixFakeClick(scope.$index, scope.row)">
			    </el-button>
          <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete"
				    @click="deleteFakeLocation(scope.$index, scope.row)">
			    </el-button>  
        </template>
      </el-table-column>
    </el-table>
    <el-col class="toolbar2" >
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
          :current-page="page" 
          :page-sizes="[10,20,30,50]" 
          :page-size="count" 
          :total="fakeLocation.totalCount">
        </el-pagination>
    </el-col>

    <el-dialog :visible.sync="insterFakeLocaitonisible" width=600px >
      <div>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">玩家id</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="insertUid"></el-input>
      </div>
      <div>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">位置</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertLocation"></el-input>
      </div>
      <div>
        <el-checkbox type='text'  style="width:100px; font-size:12pt; margin:10px 0px 0px 132px" class="checkbox" id="matchIp" label="激活" border
				  v-model="insertActive">
			  </el-checkbox>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="insertClose">取 消</el-button>
          <el-button type="primary" @click="insertFakeLocation">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="fixFakeLocaitonisible" width=600px>
      <div>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">玩家id</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="fixUid"></el-input>
      </div>
      <div>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">位置</span>
        <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixLocation"></el-input>
      </div>
      <div>
        <el-checkbox type='text'  style="width:100px; font-size:12pt; margin:10px 0px 0px 132px" class="checkbox" id="matchIp" label="激活" border
				  v-model="fixActive">
			  </el-checkbox>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="fixClose">取 消</el-button>
          <el-button type="primary" @click="fixFakeLocation">确定</el-button>
      </div>
    </el-dialog> 
	</el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { FakeLocation } from "../../../store/stateInterface"; //state Interface
import { myDispatch } from "../../../utils/index.js"

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class fakeLocation extends Vue {
  // lifecycle hook
 created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  fakeLocation: FakeLocation = this.$store.state.fakeLocation; //表单数据
  insterFakeLocaitonisible: boolean = false;
  fixFakeLocaitonisible : boolean = false;

  insertUid: string = "";
  insertLocation: string = "";
  insertActive: boolean = false;
  fixUid:string = "";
  fixLocation:string = "";
  fixActive:boolean = false;
  page: number = 1; //当前页
  count: number = 10;
  /*method*/
  loadData() {
    // this.$store.dispatch("GetFakeLocation")
    myDispatch(this.$store,"GetFakeLocation", {},true);
  }

  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }

  getFakeLocation() {
    this.loadData();
  }

  insertFakeClick(){
    this.insterFakeLocaitonisible = true;
  }

  fixFakeClick(index, row){
    this.fixFakeLocaitonisible = true;
    this.fixUid = row.uid;
    this.fixLocation = row.location;
    this.fixActive = row.active;
  }

  insertClose(){
    this.insterFakeLocaitonisible = false;
  }

  fixClose(){
    this.fixFakeLocaitonisible = false;
  }



  insertFakeLocation(index, row){

     this.$confirm("此操作将添加新用户,是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
         myDispatch(this.$store,"InsertFakeLocation", {
             uid: this.insertUid,
             location: this.insertLocation,
             active: this.insertActive
           })
           .then(() => {
             if (this.fakeLocation.insertCode == 200) {
               this.$message({
                 type: "success",
                 message: "添加成功!"
               });
               this.insterFakeLocaitonisible = false;
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
                this.insterFakeLocaitonisible = false;
                return;
              });
           })
        .catch(() => {
         this.$message({
           type: "info",
           message: "已取消添加"
         });
         this.insterFakeLocaitonisible = false;
     });
  }
  fixFakeLocation(index, row) {

     this.$confirm("此操作将修改该用户, 是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
         myDispatch(this.$store,"FixFakeLocation", {
             uid: this.fixUid,
             data:{
               active: this.fixActive,
               location : this.fixLocation
             }
           }).then(() => {
             
             if (this.fakeLocation.fixCode == 200) {
               this.$message({
                 type: "success",
                 message: "修改成功!"
               });
               this.fixFakeLocaitonisible =false;
               this.loadData();
               return;
             }
              if (this.fakeLocation.fixCode == 500) {
                this.$message({
                  type: "error",
                  message: "修改失败!"
                });
                this.fixFakeLocaitonisible = false;
              }
           })
           .catch(err => {
             console.error("err:", err);
             this.$message({
               type: "error",
               message: "修改失败!"
             });
           });
       })
       .catch(() => {
         this.$message({
           type: "info",
           message: "已取消修改"
         });
     });
  }

  deleteFakeLocation(index, row) {
    let uid = row.uid;
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store,"DeletFakeLocation", {
            uid: uid
          })
          .then(() => {
            if (this.fakeLocation.deletCode == 200) {
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
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
    });
  }

  valueChange(value) {
    if (value === undefined || value === null || !value.trim()) {
      this.checkNullFlag = false;
    } else {
      this.checkNullFlag = true;
    }
  } 
  inputvalit(value) {
    if (value <= 20 && value >= 2) {
      return;
    } else {
      // this.fakeLocation.minUserCount = 2;
      // this.fakeLocation.maxUserCount = 20;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(2~20)!"
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.toolbar2 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 10px;
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
</style>
