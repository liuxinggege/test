<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="充值地区配置">
      </el-popover>
      <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
      <span class="title">
        <b>充值地区配置</b>
      </span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 130px 10px 0"
          @click="getLocationRWRule"> 读取
        </el-button>      
      </span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 30px 10px 0" 
          @click="addLocationRWRuleDialog">添加
        </el-button>      
      </span>
      <el-table :data="locationRWRule.locationRWRuleDates" border highlight-current-row style="width: 100%; margin:10px 0px 0 0"  max-height="600">
          <el-table-column  label="删除" width="50" align="center">                         
            <template slot-scope="scope">
              <el-button type='text' icon='el-icon-delete' @click="delLocationRWRule(scope.row)"></el-button>
            </template>
          </el-table-column>
		      <el-table-column prop="location" label="地区" min-width="150"  align="center" />
          <el-table-column  label="在线充值" min-width="100" align="center">   
            <template slot-scope="scope" >             
                  <el-switch v-model="scope.row.rechargeOnline" ></el-switch>
            </template>
          </el-table-column>
          <el-table-column  label="个人充值" min-width="100" align="center">   
            <template slot-scope="scope" >             
                  <el-switch v-model="scope.row.rechargePerson" ></el-switch>
            </template>
          </el-table-column>
          <el-table-column  label="代理充值" min-width="100" align="center">   
            <template slot-scope="scope" >             
                  <el-switch v-model="scope.row.rechargeAgent" ></el-switch>
            </template>
          </el-table-column>
          <el-table-column  label="银行兑换" min-width="100" align="center">   
            <template slot-scope="scope" >             
                  <el-switch v-model="scope.row.withdrawB" ></el-switch>
            </template>
          </el-table-column>
          <el-table-column  label="支付宝兑换" min-width="100" align="center">   
            <template slot-scope="scope" >             
                  <el-switch v-model="scope.row.withdrawA" ></el-switch>
            </template>
          </el-table-column>
           <el-table-column  label="保存" min-width="100" align="center">   
            <template slot-scope="scope" >             
                  <el-button type="primary" @click="saveLocationRWRule(scope.row)" >保存</el-button>
            </template>
          </el-table-column>
		  </el-table>
      <el-dialog :visible.sync="dialogAddVisible" width=600px>
				<div>
          <span style="font-size:12pt; margin:10px 0px 10px 100px">地区:</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="location"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 40px 100px">在线充值：</span>
          <el-switch v-model="rechargeOnline" ></el-switch>
          <span style="font-size:12pt; margin:10px 0px 40px 100px">个人充值：</span>
          <el-switch v-model="rechargePerson" ></el-switch>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 40px 100px">代理充值：</span>
           <el-switch v-model="rechargeAgent" ></el-switch>
          <span style="font-size:12pt; margin:10px 0px 40px 100px">银行卡兑换：</span>
          <el-switch v-model="withdrawB" ></el-switch>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 40px 100px">支付宝兑换：</span>
          <el-switch v-model="withdrawA"  ></el-switch>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addLocationRWRule">确定</el-button>
        </div>
      </el-dialog> 
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { LocationRWRule } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//rechargeCfg

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class rechargeCfg extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  locationRWRule: LocationRWRule = this.$store.state.locationRWRule; //表单数据
  dialogAddVisible: boolean = false;
  location:string = "";
  rechargeOnline:boolean = false;
  rechargePerson:boolean = false;
  rechargeAgent:boolean = false;
  withdrawB:boolean = false;
  withdrawA:boolean = false;
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetLocationRWRule").then(() => {
      this.locationRWRule = this.$store.state.locationRWRule;
      if(this.locationRWRule.code===200){
      //   this.$message({type: "success",  message: "修改成功!"});
      }else{
        this.$message({type: "error",  message: "获取数据失败!"});
      }
    });
  }
  getLocationRWRule() {
    this.loadData();
  }
  addLocationRWRuleDialog(){
    this.dialogAddVisible = true;
  }
  saveLocationRWRule(row) {
    let data = {
      location:row.location,
      rechargeOnline:row.rechargeOnline,
      rechargePerson:row.rechargePerson,
      rechargeAgent:row.rechargeAgent,
      withdrawB:row.withdrawB,
      withdrawA:row.withdrawA,
    }
    myDispatch(this.$store, "UpdateLocationRWRule",data).then(() => {
      if(this.locationRWRule.code===200){
        this.$message({type: "success",  message: "保存成功!"});
        this.dialogAddVisible = false;
        this.loadData();
      }else{
        this.$message({type: "error",  message: "保存失败!"});
      }
    });
  }
  addLocationRWRule(){
    let data = {
      location:this.location,
      rechargeOnline:this.rechargeOnline,
      rechargePerson:this.rechargePerson,
      rechargeAgent:this.rechargeAgent,
      withdrawB:this.withdrawB,
      withdrawA:this.withdrawA,
    }
    myDispatch(this.$store, "AddLocationRWRule",data).then(() => {
      if(this.locationRWRule.code===200){
        this.$message({type: "success",  message: "新增成功!"});
        this.dialogAddVisible = false;
        this.loadData();
      }else{
        this.$message({type: "error",  message: "新增失败!"});
      }
    });
  }
  delLocationRWRule(row){
    let location = row.location;
    myDispatch(this.$store, "DeleteLocationRWRule",{location:location}).then(() => {
       if(this.locationRWRule.code===200){
        this.$message({type: "success",  message: "删除成功!"});
        this.dialogAddVisible = false;
        this.loadData();
      }else{
        this.$message({type: "error",  message: "删除失败!"});
      }
    });
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
