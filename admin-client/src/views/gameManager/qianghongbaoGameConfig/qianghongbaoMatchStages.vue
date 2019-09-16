<template>
    <el-card class="dashboard-second">
		<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="抢红包匹配房场次">
		</el-popover>
		<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
		<span class="title">
			<b>抢红包匹配房场次</b>
		</span>		
		<!--列表-->
        <el-table :data="matchStages.matchStagesData" border highlight-current-row style="width: 100%;margin: 20px 0">
            <el-table-column label="激活" width="65" >
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
                    <el-button class='close-btn'  icon="el-icon-close" size="mini" type="warning" @click="cancelEditRobotRoomCount(scope.$index)"></el-button>
                  </template>
                  <el-input v-else style="width:60px" disabled class="edit-input"  v-model="scope.row.minRobotRoomCount"></el-input>
                  <el-button v-if="minRobotRoomCountEditFlag[scope.$index]" size="mini" type="success" class='close-btn'
                      @click="saveRobotRoomCount(scope.$index,scope.row)"  icon="el-icon-circle-check-outline"></el-button>
                  <el-button v-else type="primary" 
                        size="mini"
                        @click='editRobotRoomCount(scope.$index)' 
                        icon="el-icon-edit">
                  </el-button>
                </template>
              </el-table-column>  
               <!-- 活跃桌 -->
              <el-table-column label="活跃桌" width="200" align="center">
                 <template slot-scope="scope">            
                  <template v-if="minRoomCountEditFlag[scope.$index]">
                    <el-input style="width:60px" class="edit-input"  v-model="scope.row.minRoomCount"></el-input>
                    <el-button class='close-btn'  icon="el-icon-close" size="mini" type="warning" @click="cancelEditRoomCount(scope.$index)"></el-button>
                  </template>
                  <el-input v-else style="width:60px" disabled class="edit-input"  v-model="scope.row.minRoomCount"></el-input>
                  <el-button v-if="minRoomCountEditFlag[scope.$index]" size="mini" type="success" class='close-btn'
                      @click="saveRoomCount(scope.$index,scope.row)" icon="el-icon-circle-check-outline"></el-button>
                  <el-button v-else type="primary" 
                        size="mini"
                        @click='editRoomCount(scope.$index)' 
                        icon="el-icon-edit">
                  </el-button>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="name" label="场次名" width="110" align="center" ></el-table-column>
            <el-table-column prop="id" label="房间ID" width="50" align="center"></el-table-column>
            <el-table-column prop="idx" label="idx" width="60" align="center"></el-table-column>
            <el-table-column prop="color" label="颜色" width="65" align="center"></el-table-column>
            <el-table-column prop="bets" label="赌注" width="65" align="center"></el-table-column>
            <el-table-column prop="minMoney" label="进房最小携带金币" width="100" align="center"></el-table-column>
            <el-table-column prop="maxMoney" label="进房最大携带金币" width="100" align="center"></el-table-column>
            <el-table-column prop="robotMaxMoney" label="机器人最大金币" width="100" align="center"></el-table-column>
            <el-table-column prop="robotMinMoney" label="机器人最小金币" width="100" align="center"></el-table-column>
            <el-table-column prop="allowGrabMinMoney" label="允许抢红包最小金额" width="100" align="center"></el-table-column>
            <el-table-column prop="allowGrabMaxMoney" label="允许抢红包最大金额" width="100" align="center"></el-table-column>
            <el-table-column prop="hongbaoCnt" label="红包个数" width="100" align="center"></el-table-column>
            <el-table-column label="包红包列表" width="120" align="center">
              <template slot-scope="scope">{{scope.row.moneyList.join('，')}}</template>
            </el-table-column>
           
             
            <!-- 修改整体数据 -->
            <el-table-column label="操作" min-width="70" align="center" fixed="right">
                <template slot-scope="scope"><el-button type="text" @click="edit(scope.$index, scope.row)">操作</el-button></template>
            </el-table-column>
        </el-table>
        <!-- 水位区间 -->
        <el-dialog :visible.sync="dialogRobotWinRateVisible" width=800px title="抢红包水位线" @open="open" @close="close">
          <Qianghongbao-RobotWinRate 
            v-bind:robotWinRateData="robotWinRate" 
            :poolLine="poolLine" 
            :gid="gid"
            :yid="yid"
            v-on:newPoolLine 
            :change="newPoolLine_change"
            >            
          </Qianghongbao-RobotWinRate>            
        </el-dialog> 
        <el-dialog :visible.sync="dialogQianghongbaoMatchStagesVisible"  title="抢红包">
            <div>               
                <el-checkbox type='text' style="margin:20px 13px" class="checkbox" label="激活" border
                  v-model="QianghongbaoMatchStages.active">
                </el-checkbox>
                <el-checkbox type='text' style="margin:20px 13px" class="checkbox" label="机器人开关" border
                  v-model="QianghongbaoMatchStages.robotActive">
                </el-checkbox>
            </div>           
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">场次名</span>
                <el-input v-model="QianghongbaoMatchStages.name" style="width:90px; margin:0 20px"></el-input>
                <span style="font-size:15px;">房间ID</span>
                <el-input v-model="QianghongbaoMatchStages.id" style="width:90px; margin:0 20px"></el-input>
                <span style="font-size:15px;">idx</span>
                <el-input v-model="QianghongbaoMatchStages.idx" style="width:90px; margin:0 20px"></el-input>
            </div>
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">颜色</span>
                <el-input v-model="QianghongbaoMatchStages.color" style="width:90px; margin:0 20px"></el-input>
                <span style="font-size:15px;">赌注</span>
                <el-input v-model="QianghongbaoMatchStages.bets" style="width:90px; margin:0 20px"></el-input>
            </div>            
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">进房最小携带金币</span>
                <el-input v-model="QianghongbaoMatchStages.minMoney" style="width:120px;margin:0 50px 0 10px"></el-input>
                <span style="font-size:15px;">进房最大携带金币</span>
                <el-input v-model="QianghongbaoMatchStages.maxMoney" style="width:90px; margin:0 10px"></el-input>
            </div> 
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">机器人最大金币数</span>
                <el-input v-model="QianghongbaoMatchStages.robotMaxMoney" style="width:120px;margin:0 50px 0 10px"></el-input>
                <span style="font-size:15px;">机器人最小金币数</span>
                <el-input v-model="QianghongbaoMatchStages.robotMinMoney" style="width:90px ; margin:0 10px"></el-input>
            </div> 
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">允许抢红包最小金额</span>
                <el-input v-model="QianghongbaoMatchStages.allowGrabMinMoney" style="width:120px;margin:0 50px 0 10px"></el-input>
                <span style="font-size:15px;">允许抢红包最大金额</span>
                <el-input v-model="QianghongbaoMatchStages.allowGrabMaxMoney" style="width:90px ; margin:0 10px"></el-input>
            </div>
            <div style="margin:0 13px 20px">
                <span style="font-size:15px;">红包个数</span>
                <el-input v-model="QianghongbaoMatchStages.hongbaoCnt" style="width:90px;margin:0 50px 0 10px"></el-input>
                <span style="font-size:15px;">包红包列表(英文逗号,隔开)</span>
                <el-input v-model="QianghongbaoMatchStages.moneyList" style="width:120px ; margin:0 10px"></el-input>
            </div>
            <div style="margin:0 13px 20px">
                <el-button type="primary" @click="confirmStages" style="margin:0 0 0 400px">确认</el-button>
            </div> 
        </el-dialog> 
    </el-card>
    
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { QianghongbaoMatchStagesState } from "../../../store/stateInterface";
import { waterRange } from "../../../utils/gameManager"; //工具函数
import RobotWinRate from "../component/robotWinRate.vue";
import { myDispatch } from "../../../utils/index.js"
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "Qianghongbao-RobotWinRate": RobotWinRate
  }
})
export default class QianghongbaoMatchStages extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  gid = "QHB"
  /*inital data*/
  matchStages: QianghongbaoMatchStagesState = this.$store.state.qianghongbaoMatchStages; //表单数据
  dialogQianghongbaoMatchStagesVisible: boolean = false; // 操作页面
  dialogRobotWinRateVisible: boolean = false; // 水池编辑页面
  dialogMinRoomCountVisible: boolean = false; // 活跃桌页面

  robotWinRate: object[] = [];//水位线区间
  poolLine: string = "0";//水位线
  yid:string = "0"
  index = 0;
  minRobotRoomCountEditFlag:boolean[] = [];//机器人最小房间数
  minRoomCountEditFlag:boolean[] = [];//活跃桌数
  minRobotRoomCount:number[] = []
  minRoomCount:number[] = []
 


  QianghongbaoMatchStages = {//全部编辑内容
     active:false,
     robotActive:false,
     bets:"0",
     color:0,
     id:"0",
     idx:0,
     maxMoney:"0",
     minMoney:"0",
     name:"",
     robotMaxMoney:"0",
     robotMinMoney:"0",
     allowGrabMinMoney:"0",
     allowGrabMaxMoney:"0",
     hongbaoCnt:0,
     moneyList:[]
  }
  /*method*/
  loadData() {
     myDispatch(this.$store, "GetQianghongbaoMatchStages", {}, true)
    // this.$store.dispatch("GetQianghongbaoMatchStages")
     .then(()=>{
      this.minRobotRoomCountEditFlag = this.matchStages.minRobotRoomCountEditFlag //编辑状态数组
      this.minRoomCountEditFlag = this.matchStages.minRoomCountEditFlag
      this.matchStages.matchStagesData.forEach((item,index)=> {
        this.minRobotRoomCount[index] = item.minRobotRoomCount
        this.minRoomCount[index] = item.minRoomCount
      })
    });
  }
  getBYMatRule() {
    this.loadData();
  }
  
  newPoolLine_change(value) {
    this.poolLine = value;
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

  open(){
    
  }
  close(){
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
  //辅助函数
  waterRange() {
    this.robotWinRate = waterRange(this.robotWinRate);
  }


    // 编辑 机器人房间数
    editRobotRoomCount(index){
        this.minRobotRoomCountEditFlag.splice(index,1,!this.minRobotRoomCountEditFlag[index])
    }
    
    // 取消 编辑机器人房间数
    cancelEditRobotRoomCount(index){
        this.matchStages.matchStagesData[index].minRobotRoomCount = this.minRobotRoomCount[index]
        this.minRobotRoomCountEditFlag.splice(index,1,!this.minRobotRoomCountEditFlag[index])
        this.$message({
            message: '取消编辑',
            type: 'warning'
         })
    }
    // 保存 机器人房间数
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
    // 编辑 活跃桌
    editRoomCount(index){
        this.minRoomCountEditFlag.splice(index,1,!this.minRoomCountEditFlag[index])   
    }
    // 取消 编辑活跃桌
    cancelEditRoomCount(index){
        this.matchStages.matchStagesData[index].minRoomCount = this.minRoomCount[index]
        this.minRoomCountEditFlag.splice(index,1,!this.minRoomCountEditFlag[index])
        this.$message({
            message: '取消编辑',
            type: 'warning'
         })
    }
    // 保存 活跃桌
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
        this.dialogQianghongbaoMatchStagesVisible = true;
        this.QianghongbaoMatchStages.active = row.active
        this.QianghongbaoMatchStages.bets = row.bets
        this.QianghongbaoMatchStages.color = row.color
        this.QianghongbaoMatchStages.id = row.id
        this.QianghongbaoMatchStages.idx = row.idx
        this.QianghongbaoMatchStages.maxMoney = row.maxMoney
        this.QianghongbaoMatchStages.minMoney = row.minMoney
        this.QianghongbaoMatchStages.name = row.name
        this.QianghongbaoMatchStages.robotMaxMoney = row.robotMaxMoney
        this.QianghongbaoMatchStages.robotMinMoney = row.robotMinMoney
        this.QianghongbaoMatchStages.allowGrabMinMoney = row.allowGrabMinMoney
        this.QianghongbaoMatchStages.allowGrabMaxMoney = row.allowGrabMaxMoney
        this.QianghongbaoMatchStages.hongbaoCnt = row.hongbaoCnt
        this.QianghongbaoMatchStages.moneyList = row.moneyList.join(',')
        this.QianghongbaoMatchStages.robotActive=row.robotActive
    }

    confirmStages(){
      this.$confirm("是否确认保存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let query:any={...this.QianghongbaoMatchStages};
        query.hongbaoCnt=parseInt(query.hongbaoCnt as any)
        query.moneyList=query.moneyList.split(",");
        query.moneyList.forEach((item,index) => {
          query.moneyList[index]=parseInt(query.moneyList[index])
        });
        myDispatch(this.$store, "UpdateQianghongbaoMatchStages",query)
        // this.$store.dispatch("UpdateQianghongbaoMatchStages",this.QianghongbaoMatchStages)
        .then(() => {
        if (this.matchStages.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogQianghongbaoMatchStagesVisible = false;
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
</style>
