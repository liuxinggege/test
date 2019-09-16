<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="个人水位配置">
      </el-popover>
      <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
      <span class="title">
        <b>个人水位配置</b>
      </span>
      <span style="position:absolute; right:10%; top:1">
          <el-button type="primary" style="margin:0px 0px 10px 50px" @click="getPersonWaterCfg">读取</el-button>
      </span> 
         <!--列表-->
         <el-button type="primary" style="margin:10px 0 -15px 20px" @click="addPersonWaterCfg">添加水位线配置</el-button>
         <el-table :data="personWaterCfgData" border highlight-current-row style="width: 80%;margin: 2% 10% 0 10%"> 
              <el-table-column prop="rechargeMinRange" label="充值区间" align="center">
              </el-table-column>
              <el-table-column prop="winLimit" label="放水线" align="center">
              </el-table-column>
              <el-table-column prop="loseLimit" label="杀分线" align="center">
              </el-table-column>
            <el-table-column  label="编辑" width="80" align="center">                         
              <template slot-scope="scope">       
                <el-button type='text'  icon="el-icon-edit"  @click="edit(scope.$index)"></el-button>       
              </template>              
            </el-table-column>             
            <el-table-column  label="删除" width="80" align="center">                         
              <template slot-scope="scope">
                <el-button type='text' icon='el-icon-delete' @click="del(scope.$index)"></el-button>         
              </template>              
            </el-table-column> 
        </el-table>

         <el-dialog :visible.sync="dialogRechargeSectionVisible">               
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">最小充值数</span>
                <el-input v-model="rechargeMinRange" style="width:90px; margin:0 10px"></el-input> 
                 <span style="font-size:15px;">放水线</span>
                <el-input v-model="winLimit" style="width:90px; margin:0 10px"></el-input>
                 <span style="font-size:15px;">杀分线</span>
                <el-input v-model="loseLimit" style="width:90px; margin:0 10px"></el-input>           
            </div> 
             <el-button type="primary" @click="confirmRechargeSection" style="margin:0 0 0 400px">确认</el-button>
        </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { PersonWaterCfg } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//PersonWaterCfg

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class personWaterCfg extends Vue {
  // lifecycle hook
  created() {
    // this.loadData();
    this.getPersonWaterCfg();
  }
  /*inital data*/
  personWaterCfg:PersonWaterCfg = this.$store.state.personWaterCfg;
  personWaterCfgData: any = [];
  relpersonWaterCfgData: any = [];
  dialogRechargeSectionVisible: boolean = false;
  rechargeMinRange:string = "";
  winLimit:string = "";
  loseLimit:string = "";
  _id:string = "";
  update:boolean = false;
  /*method*/
  loadData() {
    this.getPersonWaterCfg();
  }

  del(index) {
    console.log(this.personWaterCfgData[index]._id);
    this.$store.dispatch("DeletePersonWaterCfg",this.personWaterCfgData[index]._id).then(() => {
      this.personWaterCfgData = this.$store.state.personWaterCfg.personWaterCfgData;
    });
  }
  edit(index){
    this.dialogRechargeSectionVisible = true;
    this.update = true;
    this.rechargeMinRange = this.$store.state.personWaterCfg.rechargeMinRangeArrays[index];
    this.winLimit = this.personWaterCfgData[index].winLimit;
    this.loseLimit = this.personWaterCfgData[index].loseLimit;
    this._id = this.personWaterCfgData[index]._id;
  }
  confirmRechargeSection() {
    if (!this.rechargeMinRange || !this.loseLimit || !this.winLimit) {
      this.$message({
        message: "请输入完整数据",
        duration: 1500
      });
      return;
    }
    if(this.update){
      this.$store.dispatch("UpdatePersonWaterCfg",{_id:this._id,rechargeMinRange:this.rechargeMinRange,winLimit:this.winLimit,loseLimit:this.loseLimit}).then(() => {
        this.personWaterCfg = this.$store.state.personWaterCfg;
        if(this.personWaterCfg.code===200){
          this.personWaterCfgData = this.$store.state.personWaterCfg.personWaterCfgData;
          }else if(this.personWaterCfg.code===10000){
          this.$message({message:"不能输入一样的最小充值数",duration: 1500});
        }
     });
     this.dialogRechargeSectionVisible = false;
     this.update = false;
    }else{
      this.$store.dispatch("CreatePersonWaterCfg",{rechargeMinRange:this.rechargeMinRange,winLimit:this.winLimit,loseLimit:this.loseLimit}).then(() => {
       if(this.personWaterCfg.code===200){
          this.personWaterCfgData = this.$store.state.personWaterCfg.personWaterCfgData;
          }else if(this.personWaterCfg.code===10000){
          this.$message({message:"不能输入一样的最小充值数",duration: 1500});
        }
     });
     this.dialogRechargeSectionVisible = false;

    }
  }

  addPersonWaterCfg() {
    this.dialogRechargeSectionVisible = true;
    this.rechargeMinRange = "";
    this.winLimit = "";
    this.loseLimit = "";
    this._id = "";
    this.update = false;
  }

  getPersonWaterCfg() {
    this.$store.dispatch("GetPersonWaterCfg").then(() => {
      if(this.personWaterCfg.code===200){
        this.personWaterCfgData = this.$store.state.personWaterCfg.personWaterCfgData;
      }else if(this.personWaterCfg.code===10000){
        this.$message({message:"不能输入一样的最小充值数",duration: 1500});
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
