<template>
	<div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="登陆白名单">
      </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">
          <b>登陆白名单</b>
        </span>
        <span style="position:absolute; right:0; top:1">
          <el-button type="primary" style="margin:0 100px 10px 0" 
             @click="addAllowLoginDialog" > 增加
          </el-button>                
        </span>
        <div style="margin:20px 0px 10px 40px">
         <el-table :data="allowLoginIps.adminIps" border highlight-current-row style="width: 100%;" >
          <el-table-column prop="createTime" label="创建时间" min-width="100"  align="center" :formatter="timeFormat" ></el-table-column>
          <el-table-column prop="adminIp" label="ip" min-width="100"  align="center"  ></el-table-column>
          <el-table-column prop="operator" label="操作人" min-width="100"  align="center"  ></el-table-column>
          <el-table-column prop="description" label="描述" min-width="100"  align="center"  ></el-table-column>
          <el-table-column label="操作" min-width="100"  align="center" >
            <template slot-scope="scope">
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="deleteAllowLoginIps(scope.$index, scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
        <el-dialog :visible.sync="addAllowVisible"  title="新建登陆ip白名单">
          <div>
            <span style="font-size:12pt; margin:10px 18px 10px 64px">ip:</span>
            <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="adminIp"></el-input>
          </div>
          <div>
            <span style="font-size:12pt; margin:10px 0px 10px 64px">描述:</span>
            <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="description"></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="closeAddAllowVisible">取 消</el-button>
              <el-button type="primary" @click="addAllowLoginIps">确 定</el-button>
          </div>
        </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AllowLoginIpState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js"
//allowLoginIp

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class allowLoginIp extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  allowLoginIps: AllowLoginIpState = this.$store.state.allowLoginIp; //表单数据
  addAllowVisible:boolean = false;
  adminIp:string = "";
  description:string = "";
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetAllowLoginIp", {}).then(()=>{
      this.allowLoginIps =  this.$store.state.allowLoginIp;;
    });
  }
  getAllowLoginIp() {
    this.loadData();
  }
  addAllowLoginDialog(){
    this.addAllowVisible=true;
    this.adminIp = "";
    this.description= "";
  }
  deleteAllowLoginIps(index,row) {
     myDispatch(this.$store, "DeleteAllowLoginIp",{adminIp:row.adminIp}).then(() => {
        if (this.allowLoginIps.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.loadData();
          return;
        } else if(this.allowLoginIps.code !== 400) {
          this.$message({
            type: "error",
            message: this.allowLoginIps.message
          });
          return;
        }
      });
  }
  addAllowLoginIps() {
     myDispatch(this.$store, "AddAllowLoginIp",{adminIp:this.adminIp,description:this.description}).then(() => {
        if (this.allowLoginIps.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.loadData();
          this.addAllowVisible=false;
          return;
        } else if(this.allowLoginIps.code !== 400) {
          this.$message({
            type: "error",
            message: "添加失败!"
          });
          return;
        }
      });
  }
  closeAddAllowVisible(){
    this.addAllowVisible=false;
  }
   //整形
  timeFormat(row, column) {
    let date = new Date(row.createTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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
}
</style>
