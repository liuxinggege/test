<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="谷歌验证">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">谷歌验证</span>
      </el-col>
      <span class="content_font"></span>
     <!--列表-->
      <el-table :data="adminUserManager.userData" border highlight-current-row style="width: 100%;" >
          <el-table-column prop="name" label="账号名" min-width="100"  align="center"  ></el-table-column>
          <el-table-column prop="role"  label="角色名" min-width="100"  align="center" > </el-table-column>
          <el-table-column prop="otpauth_url"  label="二维码" min-width="100"  align="center"  >
            <template slot-scope="scope">
              <img   :src="imgFormatter(scope.row)">
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center" >
            <template slot-scope="scope">
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-setting"
                @click="auth(scope.$index, scope.row)">
              </el-button>  
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
          :total="adminUserManager.totalCount">
        </el-pagination>
      </el-col>
	  </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import QRCode from "qrcode";
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
  }
  /*inital data*/
  adminUserManager: AdminUserManagerState = this.$store.state.adminUserManager; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  opts = {
  errorCorrectionLevel: "H",
  type: "image/png",
  rendererOpts: {
    quality: 0.95
  },
  width: 200
};
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;

    myDispatch(this.$store, "GetAdminUserUrl", queryItem).then(() => {
      this.adminUserManager = this.$store.state.adminUserManager; 
    });
  }
  auth(index,row){
    this.$confirm('此操作将添加或修改二维码，修改完后用户登录需要重新扫描二维码并使用新的验证码登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
    }).then(() => {
        myDispatch(this.$store, "GoogleAuth",{name:row.name} ).then(() => {
          if(this.$store.state.adminUserManager.code===200){
            this.$message({	type: "success",	message: `添加验证成功！`});
            this.loadData();
          }else{
             this.$message({	type: "error",	message: this.$store.state.adminUserManager.err});
          }
        });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });          
    });
  }
  imgFormatter(row){
    let result ;
    if(row.otpauth_url){
      QRCode.toDataURL(row.otpauth_url,this.opts,(err,url)=>{
       if(err){
         this.$message({	type: "error",	message: `生成二维码错误${err}`});
       }
       result = url;
     });
    }
    return result;
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};

    temp.page = this.page;
    temp.count = this.count;
    return temp;
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
