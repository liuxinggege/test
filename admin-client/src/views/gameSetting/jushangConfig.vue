<template>
   <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="聚商配置">
      </el-popover>
      <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
      <span class="title">
        <b>聚商配置</b>
      </span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus"
          @click="insertFakeClick"> 添加
        </el-button>      
      </span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 20px 10px 0" 
          @click="loadData"> 读取
        </el-button>      
      </span>
      
      <el-table :data="jushangConfig.subFaLocation" border highlight-current-row style="width: 100%; margin:10px 0px 0 0" >
        <el-table-column prop="pid" label="项目" min-width="120" align="center" :formatter="pidFormat" ></el-table-column>
        <el-table-column prop="uid" label="聚商" min-width="120" align="center" ></el-table-column>
        <el-table-column prop="rate" label="(商人to玩家)比例" min-width="120" align="center"></el-table-column>
        <el-table-column prop="rateToJS" label="(系统to聚商)比例" min-width="120" align="center"></el-table-column>
        <el-table-column prop="rateToMer" label="(聚商to商人)比例" min-width="120" align="center"></el-table-column>
        <el-table-column prop="adminUsers" label="后台账号名" :formatter="timeFormat2" min-width="300" align="center"></el-table-column>
        <el-table-column prop="users" label="商人" min-width="300" :formatter="timeFormat1" align="center"></el-table-column>
        <el-table-column label="操作" min-width="150" align="center" >
          <template slot-scope="scope">
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit"
              @click="fixFakeClick(scope.$index, scope.row)">
            </el-button>
            <!-- <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete"
              @click="deleteJushangConfig(scope.$index, scope.row)">
            </el-button>   -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-col class="toolbar2" style="margin:0 0px 0px 60%">
          <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
            @current-change="handleCurrentChange" 
            @size-change="handleSizeChange" 
            :current-page="page" 
            :page-sizes="[10,20,30,50]" 
            :page-size="count" 
            :total="jushangConfig.totalCount">
          </el-pagination>
      </el-col> -->

      <el-dialog :visible.sync="insterJushangConfigisible" width=600px >
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">玩家id</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="insertUid"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 20px">(商人to玩家)比例</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertRate"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 20px">(聚商to商人)比例</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertRateToMer"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 20px">(系统to聚商)比例</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertRateToJS"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">商人</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertUsers"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">账号</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertAccount"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="insertClose">取 消</el-button>
            <el-button type="primary" @click="insertJushangConfig">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="fixJushangConfigisible" width=900px>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">项目</span>
          <el-select v-model="fixPid" placeholder="请选择项目" disabled style='width:200px; margin:10px 30px 10px 32px'>
             <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
          </el-option>
      </el-select>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">聚商</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixUid" disabled></el-input>
        </div>
         <div>
          <span style="font-size:12pt; margin:10px 0px 10px 20px">(商人to玩家)比例</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixRate"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 20px">(聚商to商人)比例</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixRateToMer"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 20px">(系统to聚商)比例</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixRateToJS"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">商人</span>
          <el-input type='textarea' autosize style='width:800px;margin:10px 30px 10px 32px' disabled  v-model="fixUsers"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">账号</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixAccount"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="fixClose">取 消</el-button>
            <el-button type="primary" @click="fixJushangConfig">确定</el-button>
        </div>
      </el-dialog> 
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { JushangConfig } from "../../store/stateInterface"; //state Interface
import { myDispatch } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class jushangConfig extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  /*inital data*/
  pidList: any[] = [];
  pid: string = "A";
  checkNullFlag: boolean = true; //判别是否有空值
  jushangConfig: JushangConfig = this.$store.state.jushangConfig; //表单数据
  insterJushangConfigisible: boolean = false;
  fixJushangConfigisible: boolean = false;

  insertUid: string = "";
  insertRate: string = "";
  insertUsers: string = "";
  insertRateToMer: string = "";
  insertRateToJS: string = "";
  insertAccount: string = "";

  fixUid: number = 0;
  fixPid: string = "";
  fixRate: string = "";
  fixUsers: string = "";
  fixRateToMer: string = "";
  fixRateToJS: string = "";
  fixAccount: string = "";
  page: number = 1; //当前页
  count: number = 10;
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetJushangConfig").then(() => {});
  }

  //   handleCurrentChange(val) {
  //     this.page = val;
  //     this.loadData();
  //   }
  //   //每页显示数据量变更
  //   handleSizeChange(val) {
  //     this.count = val;
  //     this.loadData();
  //   }

  getJushangConfig() {
    this.loadData();
  }

  insertFakeClick() {
    this.insertUid = "";
    this.insertRate = "";
    this.insertUsers = "";
    this.insertRateToMer = "";
    this.insertRateToJS = "";
    this.insertAccount = "";
    this.insterJushangConfigisible = true;
  }

  fixFakeClick(index, row) {
    this.fixJushangConfigisible = true;
    this.fixPid = row.pid;
    this.fixUid = row.uid;
    this.fixRate = row.rate;
    this.fixRateToMer = row.rateToMer;
    this.fixRateToJS = row.rateToJS;
    this.fixAccount = row.adminUsers.join(",");
    this.fixUsers = row.users.join(",");
  }

  insertClose() {
    this.insterJushangConfigisible = false;
  }

  fixClose() {
    this.fixJushangConfigisible = false;
  }

  timeFormat1(row, column) {
    if(row.users){
      let users = row.users;
      let userStr = users.join(",");
      return userStr;
    }
    return row.users;
  }
  timeFormat2(row, column) {
    let account = row.adminUsers;
    let accountStr = account.join(",");
    return accountStr;
  }

  insertJushangConfig(index, row) {
    this.$confirm("此操作将添加新用户,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "InsertJushangConfig", {
          uid: this.insertUid,
          rate: this.insertRate,
          rateToJS: this.insertRateToJS,
          rateToMer: this.insertRateToMer,
          adminUsers: this.insertAccount.split(","),
          users: this.insertUsers.split(",")
        })
          .then(() => {
            if (this.jushangConfig.insertCode == 200) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.insterJushangConfigisible = false;
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
            this.insterJushangConfigisible = false;
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.insterJushangConfigisible = false;
      });
  }
  fixJushangConfig(index, row) {
    let data:any = { uid: this.fixUid,rate: this.fixRate,rateToJS: this.fixRateToJS,rateToMer: this.fixRateToMer,adminUsers: this.fixAccount.split(",")}
    if(this.fixUsers){
       data.users =   this.fixUsers.split(",")
    }
    this.$confirm("此操作将修改该用户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "FixJushangConfig", data)
          .then(() => {
            if (this.jushangConfig.fixCode == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.fixJushangConfigisible = false;
              this.loadData();
              return;
            }
            if (this.jushangConfig.fixCode == 500) {
              this.$message({
                type: "error",
                message: "修改失败!"
              });
              this.fixJushangConfigisible = false;
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

  deleteJushangConfig(index, row) {
    let uid = row.uid;
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeletJushangConfig", {
          uid: uid
        })
          .then(() => {
            if (this.jushangConfig.deletCode == 200) {
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
      // this.jushangConfig.minUserCount = 2;
      // this.jushangConfig.maxUserCount = 20;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(2~20)!"
      });
    }
  }
  pidFormat(row, column){
    let name = "";
    this.pidList.forEach(element => {
        if(element.pid === row.pid){
          name =  element.name ;
        }
    });
    return name ;
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
</style>
