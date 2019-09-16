<style lang="less">
    #mainContent .el-table .cell{
        padding-left: 3px !important;
    }
     #mainContent .el-table td, 
     #mainContent .el-table th{
         padding: 3px 0;
     }
      #mainContent .el-table  .el-table__empty-block{
         min-height: 0;
      }
</style>
<template>
    <el-card>
        <p slot="header">
            <span class="fa fa-retweet"> 巡检测试</span>
            <el-radio-group v-model="rows" style="margin-left:150px;">
                <el-radio :label="4">4列</el-radio>
                <el-radio :label="6">6列</el-radio>
                <el-radio :label="8">8列</el-radio>
            </el-radio-group>
            <span style="margin-left:50px;cursor: pointer;color:#20A0FF;" @click="handleAction"><i class="el-icon-edit"></i> 同步巡检参数</span>
            <span style="margin-left:50px;">当前测试设备总共：{{count}}台</span>
	    </p>
        <el-row id="mainContent">
            <el-col v-for="rowsIndex in rows" :span="24/rows">
                <el-table :data="allTestSensor['list' + rowsIndex]" border stripe>
                    <el-table-column v-for="item in columns" :prop="item.key" :label="item.title" :show-overflow-tooltip="true">
						<template scope="scope">
                            <span :style="{color:scope.row.showColor}">{{scope.row[item.key]}}</span>
						</template>
					</el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div v-if="model">
		    <el-dialog :visible.sync="model" :close-on-click-modal="false" title="巡检参数" width="450px">  
                <el-form  ref="form" :model="form"  label-width="150px">
                    <el-form-item  label="启动时间">
                        <el-time-picker 
                            v-model="form.start_time" 
                            :clearable="false" 
                            type="date"
                            placeholder="开始时间" 
                            size="small"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss">
                            </el-time-picker>
                    </el-form-item>
                    <el-form-item  label="超限间隔(秒)">
                            <el-input-number v-model="form.time_rang"  :min="1"  size="small"></el-input-number>
                    </el-form-item>
                </el-form>  
                <div slot="footer">
                    <el-button size="small" @click="model = false">取消</el-button>
                    <el-button size="small" type="primary" @click="save(false)">结束</el-button>
                    <el-button size="small" type="primary" @click="save(true)">开始</el-button>
                </div>    
            </el-dialog> 
        </div>         
  </el-card>
</template>

<script>
    import store from 'src/store'
    export default {
    data() {
        return {
            name:"inspectiontest",
            state: store.state,
            action:store.actions,
            model:false,
            rows:6,//分几列显示
            count:0,
            form:{
                start_time:moment().format('HH:mm:ss'),
                time_rang:60
            },
            allTestSensor:{
                list1:[],
                list2:[],
                list3:[],
                list4:[],
                list5:[],
                list6:[],
                list7:[],
                list8:[]
            },
            columns: [
                {title: '编号',key: 'alais',width:80},
                {title: '值',key: 'now_value',}
            ],
            timeId:''
        }
    },
    watch: {
         '$route': 'fetchData',
         'rows': 'fetchData',
         'state.connecTotal':'fetchData',
         'state.skIndex':'refresh'
    },
    created() {
        this.fetchData();    
    },
    mounted() { 
    },
    methods: {
        handleAction(){
            this.model = true;
            this.form = {
                start_time:moment().add(20,'s').format('HH:mm:ss'),
                time_rang:60
            };

        },
        save(bool){
             let rdata;
             if(bool){
                rdata = {
                    cmd:"inspectiontest",
                    time_rang:this.form.time_rang,
                    start_time:moment().format('YYYY-MM-DD') + ' ' + this.form.start_time
                };
             }else{
                 rdata = {
                     cmd:"inspectionstop"
                 }
             } 
             try{
                  this.action.websocketsend(JSON.stringify(rdata))
                  this.$message.success(bool?'开始动命令已下发':'结束命令已下发');
                  this.model = false;
             }catch(err){
                  this.$message.error('命令下发失败,请稍后再试！');
                  console.log(err)
             }
        },
        fetchData(){
            this.allTestSensor = {
                list1:[],
                list2:[],
                list3:[],
                list4:[],
                list5:[],
                list6:[],
                list7:[],
                list8:[]
            };
            let index = 0;
            let alarmCount = 0;
            for(let k in this.state.AllhashSensor){
                let item = this.state.AllhashSensor[k];
                if(item.sensor_type == 34){
                        let list = "list" + (index%this.rows + 1);
                        this.allTestSensor[list].push({
                            k:item.k,
                            showColor:item.showColor,
                            alais:item.alais,  
                            now_value:item.now_value
                        });
                        index++;   
                }
            }
            this.count = index;
            this.refresh();
        },
        refresh(){
           for(let i = 1;i <= 8;i++){
               if(this.allTestSensor['list' + i] && this.allTestSensor['list' + i].length){
                    // this.allTestSensor['list' + i] = this.allTestSensor['list' + i].map(item => this.state.AllhashSensor[item.k]);
                    this.allTestSensor['list' + i].forEach(item => {
                        item.now_value = this.state.AllhashSensor[item.k].now_value;
                        item.showColor = this.state.AllhashSensor[item.k].showColor;
                    })
               }
           }
        },
    }
   };

</script>