<style lang="less">
    @import '../../styles/common.less';
    .title{
         text-align: center;
         font-weight: bold;
         color: black;
         font-size: 22px;
         border-bottom:1px solid #DCDFE6;
         padding-bottom:15px;
    }
</style>
<template>
    <el-card>
        <p slot="header">
            <span class="fa fa-calculator"> 累计量</span>
        </p>
        <div v-if="showdata"> 
            <div class="title">当前实时累计量</div>
            <el-form  ref="form" :model="form" :inline="true" label-width="80px" style="margin-top:10px;"> 
                    <el-form-item  label="测点">
                        <el-select size="small" placeholder="所有测点" v-model="oneGD" value-key="uid" filterable clearable @change="changeGd" style="width:300px;">
                        <el-option 
                            v-for="item in sensorList" 
                            :value="item" 
                            :key="item.uid" 
                            :label="item.alais + '/' +item.type+ '/' +item.position">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item  label="位置">
                        <el-select size="small" v-model="sensor_position" @change="choosePosition" placeholder="所有位置" filterable clearable style="width:200px;">
                            <el-option key="" label="所有位置" :value="0"></el-option>
                            <el-option
                                v-for="item in area"
                                :key="item.id"
                                :label="item.v"
                                :value="item.id">
                            </el-option>
                        </el-select> 
                    </el-form-item>
                     <el-form-item  label="" style="margin-left:300px;color:#909399;">
                             <span>时间：{{nowTime()}}</span>
                     </el-form-item>
            </el-form>  
            <el-row>
                <el-col  v-for="item in 2" :span="12" v-if="PageList['list'+item].length"> 
                    <el-table :data="PageList['list'+item]" border :span-method="arraySpanMethod" @row-click='toLine'>
                        <el-table-column prop="alais" label="设备编号" ></el-table-column>
                        <el-table-column label="设备位置" >
                            <template slot-scope="scope">
                                <span>{{scope.row.position?scope.row.position:'未配置位置'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="实时累计">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==1">总累计量</span>
                                <span v-if="scope.row.status==2">今年累计量</span>
                                <span v-if="scope.row.status==3">本月累计量</span>
                                <span v-if="scope.row.status==4">今日累计量</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="flow_work" label="工况混合流量(立方米)" >
                            <template slot-scope="scope">
                                <span>{{scope.row.flow_work.toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="flow_standard" label="标况混合流量(立方米)" >
                            <template slot-scope="scope">
                                <span>{{scope.row.flow_standard.toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="flow_pure" label="标况纯流量(立方米)" >
                            <template slot-scope="scope">
                                <span>{{scope.row.flow_pure.toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div> 
    </el-card>
</template>
<script>
    import store from 'src/store'
    import api from 'src/api'
    export default {
        components: {},
        data() {
            return {
                form:{},
                oneGD:{},
                sensor_position:0,
                ip:"",
                sensorId:'',
                area:[],
                sensorList:[],
                timesOut:'',
                state: store.state,
                action:store.actions,
                showdata:false,
                menuData:[],
                Listlength:2,
                showTableList:[],
                PageList:{
                  list1:[],
                  list2:[],
                },
                
            }   
        },
        computed:{},
        watch:{
            '$route':'fetchData',
        },
        methods: {
            fetchData(){
                this.sensorList = Object.values(this.state.AllhashSensor).filter(item => item.sensor_type ==69);
                this.getAll({ip:this.ip,sensor_position:this.sensor_position,sensorId:this.sensorId,day:this.today()})
            },
            nowTime(){
                return moment().format('YYYY年MM月DD日');
            },
            today(){
                return moment().format('YYYY-MM-DD');
            },
            getAll(row){
                var me = this;
                api.searchs.getCumulant(row).then(function(res) {
                    if (res.data.status === 0) {
                        me.PageList.list1 = [];
                        me.PageList.list2 = [];
                        let result = res.data.data;
                        let alais = '';
                        let num;
                        for(let i=0;i<result.length;i++){
                            if(result[i].alais != alais){
                                alais = result[i].alais;
                                num = num==1?2:1;   
                            }
                            me.PageList['list' + num].push(result[i]);
                        }
                        me.showdata = true;
                    } else {
                        me.$message.error(res.data.msg)
                    }
                })
            },
            // 设备位置
            getArea(){
              var me = this
              api.gas.getAllPosition().then(function(res) {
                  if (res.data.status === 0) {
                      me.area = res.data.data
                  } else {
                      me.$message.error(res.data.msg)
                  }
              })
            },
            choosePosition() { 
                 this.getAll({ip:this.ip,sensor_position:this.sensor_position,sensorId:this.sensorId,day:this.today()})
            },
            changeGd(){
                this.ip = this.oneGD.ipaddr
                this.sensorId = this.oneGD.sensorId
                this.getAll({ip:this.ip,sensor_position:this.sensor_position,sensorId:this.sensorId,day:this.today()})
              },
            // 跳转曲线数据
            toLine(row){
                console.log(row)
                if(row.pid == this.state['sensorConfig']['analog']){
                    this.$router.push({
                        name: 'realtime',
                        params:{
                            aname:row.id,
                        }
                    })
                }else if(row.pid == this.state['sensorConfig']['switch']){
                       this.$router.push({
                                name: 'switch-data',
                                params:row
                       })
                }
            },
            arraySpanMethod({ row, column, rowIndex, columnIndex }){
                if (columnIndex === 0||columnIndex === 1) {
                  if (rowIndex % 4 === 0) {
                    return {
                      rowspan: 4,
                      colspan: 1
                    };
                  } else {
                    return {
                      rowspan: 0,
                      colspan: 0
                    };
                  }
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.fetchData()
                this.getArea()
                this.timesOut = setInterval(()=>{
                  this.getAll({ip:this.ip,sensor_position:this.sensor_position,sensorId:this.sensorId,day:this.today()})
                },1000*60*5)
            })
        },
        destroyed () {
          clearInterval(this.timesOut)
        }
    };
</script>