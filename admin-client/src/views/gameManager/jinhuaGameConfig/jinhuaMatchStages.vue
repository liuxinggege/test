<template>
    <el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="金花匹配房场次">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>金花匹配房场次</b>
		</span>		
		<!--列表-->
        <el-table :data="matchStages.matchStagesData" border highlight-current-row style="width: 100%;margin: 20px 0">
            <el-table-column label="激活" width="65" fixed align="center" >
                <template slot-scope="scope"><el-checkbox v-model="scope.row.active" disabled></el-checkbox></template>
            </el-table-column>
            <el-table-column prop="robotActive" :formatter="robotActiveFormat" label="机器人开关" width="65" align="center" ></el-table-column>
             <!-- 水池配置 -->
            <el-table-column label="水池配置" align="center">
                <el-table-column label="水位线区间" min-width="85" align="center">
                    <template slot-scope="scope">
                    <el-button type="text" @click="handleRobotWinRate(scope.$index, scope.row)"><i class="el-icon-search"></i></el-button>
                    </template>
                </el-table-column>                
                <el-table-column prop="poolValue" label="当前系统输赢" min-width="200" align="center"></el-table-column>
            </el-table-column>
            <!-- 机器人配置 -->
            <el-table-column label="机器人配置" align="center">
              <!-- 机器人最小房间数 -->
              <el-table-column min-width="200px" label="机器人最小房间数" align="center">
                <template slot-scope="scope">
                  <template v-if="minRobotRoomCountEditFlag[scope.$index]">
                    <el-input style="width:60px" class="edit-input"  v-model="scope.row.minRobotRoomCount"></el-input>
                    <el-button 
                      size="mini" 
                      class='close-btn'  icon="el-icon-close" type="warning" @click="cancelEditRobotRoomCount(scope.$index)"></el-button>
                  </template>
                  <el-input v-else style="width:60px" disabled class="edit-input" size="mini" v-model="scope.row.minRobotRoomCount"></el-input>
                  <el-button v-if="minRobotRoomCountEditFlag[scope.$index]" type="success" class='close-btn'
                      size="mini"
                      @click="saveRobotRoomCount(scope.$index, scope.row)"  icon="el-icon-circle-check-outline"></el-button>
                  <el-button v-else type="primary" 
                      @click='editRobotRoomCount(scope.$index)' 
                      size="mini"
                       icon="el-icon-edit">
                  </el-button>
                </template>
              </el-table-column>  
               <!-- 活跃桌 -->
              <el-table-column label="活跃桌" width="200" align="center">
                 <template slot-scope="scope">            
                  <template v-if="minRoomCountEditFlag[scope.$index]">
                    <el-input style="width:60px" class="edit-input"  v-model="scope.row.minRoomCount"></el-input>
                    <el-button size="mini" class='close-btn'  icon="el-icon-close" type="warning" @click="cancelEditRoomCount(scope.$index)"></el-button>
                  </template>
                  <el-input v-else style="width:60px" disabled class="edit-input"  v-model="scope.row.minRoomCount"></el-input>
                  <el-button v-if="minRoomCountEditFlag[scope.$index]"  size="mini" type="success" class='close-btn'
                      @click="saveRoomCount(scope.$index, scope.row)"  icon="el-icon-circle-check-outline"></el-button>
                  <el-button v-else type="primary" 
                        size="mini"
                        @click='editRoomCount(scope.$index)' 
                        icon="el-icon-edit">
                  </el-button>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="name" label="场次名" width="110" fixed align="center" ></el-table-column>
            <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
            <el-table-column prop="idx" label="idx" width="60" align="center"></el-table-column>
            <el-table-column prop="color" label="颜色" width="65" align="center"></el-table-column>
            <el-table-column prop="bets" label="底分" width="65" align="center"></el-table-column>
            <el-table-column prop="minMoney" label="进房最小携带金币" width="100" align="center"></el-table-column>
            <el-table-column prop="maxMoney" label="进房最大携带金币" width="100" align="center"></el-table-column>
            <el-table-column prop="robotMaxMoney" label="机器人最大金币" width="100" align="center"></el-table-column>
            <el-table-column prop="robotMinMoney" label="机器人最小金币" width="100" align="center"></el-table-column>
            <el-table-column prop="allInMaxMoney" label="全押上限" width="100" align="center"></el-table-column>    
            
            <!-- 修改整体数据 -->
            <el-table-column label="操作" min-width="70" align="center" fixed="right">
                <template slot-scope="scope"><el-button type="text" @click="edit(scope.$index, scope.row)">操作</el-button></template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogJinhuaMatchStagesVisible"  title="金花">
            <div>               
                <el-checkbox type='text' style="margin:20px 13px" class="checkbox" label="激活" border
                  v-model="JinhuaMatchStages.active">
                </el-checkbox>
            </div>
            <el-checkbox type='text' style="margin:20px 13px" class="checkbox" label="机器人开关" border
              v-model="JinhuaMatchStages.robotActive">
            </el-checkbox>           
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">idx</span>
                <el-input v-model="JinhuaMatchStages.idx" style="width:90px; margin:0 10px"></el-input>
                <span style="font-size:15px;">颜色</span>
                <el-input v-model="JinhuaMatchStages.color" style="width:90px; margin:0 10px"></el-input>
                <span style="font-size:15px;">底分</span>
                <el-input v-model="JinhuaMatchStages.bets" style="width:90px; margin:0 10px"></el-input>
               
            </div>           
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">进房最大携带金币</span>
                <el-input v-model="JinhuaMatchStages.maxMoney" style="width:120px;margin:0 50px 0 10px"></el-input>
                <span style="font-size:15px;">进房最小携带金币</span>
                <el-input v-model="JinhuaMatchStages.minMoney" style="width:120px;margin:0 50px 0 10px"></el-input>
                <span style="font-size:15px;">机器人最大金币数</span>
                <el-input v-model="JinhuaMatchStages.robotMaxMoney" style="width:120px;margin:0 50px 0 10px"></el-input>
            </div> 
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">全押上限</span>
                <el-input v-model="JinhuaMatchStages.allInMaxMoney" style="width:120px; margin:0 10px"></el-input>
                <span style="font-size:15px;">机器人最小金币数</span>
                <el-input v-model="JinhuaMatchStages.robotMinMoney" style="width:120px; margin:0 50px 0 10px"></el-input>
                <el-button type="primary" @click="confirmStages" style="margin:0 0 0 400px">确认</el-button>
            </div> 
        </el-dialog>
        <!-- 水位线区间视图 -->
         <!-- 水池配置，水位线区间 -->
        <el-dialog :visible.sync="dialogRobotWinRateVisible" width=800px title="金花水位线" @open="open" @close="close">
          <Jinhua-RobotWinRate 
            v-bind:robotWinRateData="robotWinRate" 
            :poolLine="poolLine" 
            :gid="gid"
            :yid="yid"
            v-on:newPoolLine 
            :change="newPoolLine_change"
            >            
          </Jinhua-RobotWinRate>            
        </el-dialog>       
	</el-card>
    
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { JinhuaMatchStagesState } from "../../../store/stateInterface"; //state Interface
import { waterRange } from "../../../utils/gameManager"; //工具函数
import RobotWinRate from "../component/robotWinRate.vue";
import { myDispatch } from "../../../utils/index.js"
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "Jinhua-RobotWinRate": RobotWinRate
  }
})
export default class JinhuaMatchStages extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  gid="JH"
  matchStages: JinhuaMatchStagesState = this.$store.state.jinhuaMatchStages; //表单数据
  dialogRobotWinRateVisible: boolean = false; //整个水位线视图状态
  dialogJinhuaMatchStagesVisible: boolean = false; //全部编辑视图状态
  JinhuaMatchStages = {//全部编辑内容
    id: "0",
    active: false,
    robotActive:false,
    idx: 0,
    color:0,
    bets: "0",
    maxMoney: "0",
    minMoney: "0",
    name: "0",
    robotMaxMoney: "0",
    robotMinMoney: "0",
    allInMaxMoney: "0",
  }
  robotWinRate: object[] = [];//水位线区间
  poolLine: string = "0";//水位线
  yid:string = "0"
  index = 0;
  minRobotRoomCountEditFlag:boolean[] = [];//机器人最小房间数
  minRoomCountEditFlag:boolean[] = [];//活跃桌数
  minRobotRoomCount:number[] = []
  minRoomCount:number[] = []
  /*method*/
  newPoolLine_change(value) {
    this.poolLine = value;
  }
  loadData() {
    myDispatch(this.$store, "GetJinhuaMatchStages", {}, true)
    // this.$store.dispatch("GetJinhuaMatchStages")
      .then(()=>{
        this.minRobotRoomCountEditFlag = this.matchStages.minRobotRoomCountEditFlag //编辑状态数组
        this.minRoomCountEditFlag = this.matchStages.minRoomCountEditFlag
        this.matchStages.matchStagesData.forEach((item,index)=> {
          this.minRobotRoomCount[index] = item.minRobotRoomCount
          this.minRoomCount[index] = item.minRoomCount        
        })
      })
  }
  getJhMatRule() {
    this.loadData();    
  }
  robotActiveFormat(row){
      if(row.robotActive===false){
        return "关"
      }
      if(row.robotActive===true){
        return "开"
      }
    }
  //开启水位线视图
  handleRobotWinRate(index, row) {
    this.index = index;
    this.yid = row.id
    this.dialogRobotWinRateVisible = true;
    this.robotWinRate = this.matchStages.matchStagesData[
      index || this.index
    ].robotWinRate;
    this.poolLine = this.matchStages.matchStagesData[
      index || this.index
    ].poolLine;
    this.waterRange();  
  }

  open(){//暂定
    // this.$store.dispatch("GetPoolLineAndConfigByGid",{gid:this.gid, yid:this.yid})
  }
  close(){
    this.loadData(); 
  }

  //辅助函数
  waterRange() {
    this.robotWinRate = waterRange(this.robotWinRate);
  }

  //表格内编辑--取消
   cancelEditRobotRoomCount(index) {
      this.matchStages.matchStagesData[index].minRobotRoomCount = this.minRobotRoomCount[index]
      this.minRobotRoomCountEditFlag.splice(index,1,!this.minRobotRoomCountEditFlag[index])
      this.$message({
        message: '取消编辑',
        type: 'warning'
      })
    }
   cancelEditRoomCount(index) {
      this.matchStages.matchStagesData[index].minRoomCount = this.minRoomCount[index]
      this.minRoomCountEditFlag.splice(index,1,!this.minRoomCountEditFlag[index])
      this.$message({
        message: '取消编辑',
        type: 'warning'
      })
    }

   //表格内编辑--编辑
    editRobotRoomCount(index){
      this.minRobotRoomCountEditFlag.splice(index,1,!this.minRobotRoomCountEditFlag[index])      
    }
    editRoomCount(index, value){
      this.minRoomCountEditFlag.splice(index,1,!this.minRoomCountEditFlag[index])      
    }

   //表格内保存
    saveRobotRoomCount(index, row){
      myDispatch(this.$store, "UpdateWaterConfigByGid",{gid:this.gid, yid:row.id, minRobotRoomCount:row.minRobotRoomCount})
      // this.$store
      //   .dispatch("UpdateWaterConfigByGid",{gid:this.gid, yid:row.id, minRobotRoomCount:row.minRobotRoomCount})
        .then(()=>{
            if (this.$store.state.waterPoolAndConfig.code === 200) {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.loadData()
                this.minRobotRoomCountEditFlag.splice(index,1,!this.minRobotRoomCountEditFlag[index])   
                return;
              } else {
                this.$message({
                  type: "error",
                  message: "保存失败!"
                });
                return;
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
              return;
            });  
    }

    saveRoomCount(index, row){
        myDispatch(this.$store, "UpdateWaterConfigByGid",{gid:this.gid, yid:row.id, minRoomCount:row.minRoomCount})
      // this.$store
      //   .dispatch("UpdateWaterConfigByGid",{gid:this.gid, yid:row.id, minRoomCount:row.minRoomCount})
        .then(()=>{
            if (this.$store.state.waterPoolAndConfig.code === 200) {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                }); 
                this.loadData()     
                this.minRoomCountEditFlag.splice(index,1,!this.minRoomCountEditFlag[index])   
                return;
              } else {
                this.$message({
                  type: "error",
                  message: "保存失败!"
                });
                return;
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
              return;
            });  
    }

   //全部编辑
    edit(index, row) {
      this.dialogJinhuaMatchStagesVisible = true;
      this.JinhuaMatchStages.id = row.id
      this.JinhuaMatchStages.active = row.active
      this.JinhuaMatchStages.idx = row.idx
      this.JinhuaMatchStages.color = row.color
      this.JinhuaMatchStages.name = row.name
      this.JinhuaMatchStages.bets = row.bets
      this.JinhuaMatchStages.minMoney = row.minMoney
      this.JinhuaMatchStages.maxMoney = row.maxMoney
      this.JinhuaMatchStages.robotMaxMoney = row.robotMaxMoney
      this.JinhuaMatchStages.robotMinMoney = row.robotMinMoney
      this.JinhuaMatchStages.allInMaxMoney = row.allInMaxMoney
      this.JinhuaMatchStages.robotActive=row.robotActive
    }
    confirmStages(){
      this.$confirm("是否确认保存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        myDispatch(this.$store, "UpdateJinhuaMatchStages",this.JinhuaMatchStages)
        // this.$store.dispatch("UpdateJinhuaMatchStages",this.JinhuaMatchStages)
        .then(() => {
        if (this.matchStages.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogJinhuaMatchStagesVisible = false;
          this.loadData()
          return;
        } else {
          this.$message({
            type: "error",
            message: "保存失败!"
          });
          return;
        }
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: err
        });
        return;
      });
      })
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 15px;
  border: 1px solid #dfe6ec;
  position: relative;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 10px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.edit-input {
  padding-right: 0px;
}
.close-btn {
  margin:0 3px
}
</style>
