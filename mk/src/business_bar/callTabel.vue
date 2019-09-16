<style lang="less">
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
        overflow: hidden;
    }
</style>
<template>
    <div>
        <el-table :data="state.showlist" border style="width: 100%">
            <el-table-column v-for="item in columns" :prop="item.key" :label="item.title"  :width="item.width" :render-header="renderHeader">
                <template scope="scope">
                    <div v-if="scope.row[item.key] instanceof Array">
                        <div v-for="ol in scope.row[item.key]">
                           {{ol}}<br>
                        </div>
                    </div>
                    <span v-else-if="item.nowAera && item.key == 'statusText'" :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level1}">
                        <label v-if="scope.row.area_type_name != '未配置区域类型'">
                            {{scope.row.statusText}}
                        </label>
                        <label v-else>
                            未配置区域类型
                        </label>
                    </span>
                    <span v-else-if="item.now" :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level1}">
                        <label>{{scope.row.statusText}}</label>
                    </span>
                    <span v-else-if="item.value" :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level1}">{{scope.row.now_value}}</span>
                    <span v-else-if="item.key=='messages'">{{scope.row.position}}/{{scope.row.name}}</span>
                    <span v-else-if="item.key=='alarm'&& scope.row.type === 900" :style="{color:scope.row.showColor||''}">{{scope.row.alarm}}</span>
                    <span v-else-if="item.key=='level'&& scope.row.type === 900" :style="{color:scope.row.showColor||''}">{{scope.row.level}}</span>
                    <span v-else-if="item.key=='alarmMap'"  :style="{color:scope.row.showColor||''}">
                        <label v-for="m in scope.row.alarmMap">
                            {{m}}<br/>
                        </label>
                    </span>
                    <span v-else-if="item.key=='measuretime'">
                        <span v-if="scope.row.measuretime">{{scope.row.measuretime}}</span>
                        <el-button type="text" size="mini" v-else @click="setMeasure(scope.row)" style="text-decoration:underline;">暂未处理</el-button>
                    </span>
                    <span v-else>{{scope.row[item.key]!=null||scope.row[item.key]!=undefined ?scope.row[item.key]:'-'}}</span> 
                </template>
            </el-table-column>     
        </el-table>
        <my-pagination></my-pagination>
    </div>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    export default {
        props:{
            callData:Array,
            mark:Number,
            columns:Array,
	    },
        data() {
            return {
                state:store.state,
                action:store.actions,
                switchThead:[],
                sensorThead:[],
            }
        },
        watch: {
            'callData': {
				handler: function(val) { 
                      this.action.setShowList(this.callData)
                      this.setRealTimeValue()
				},
				deep: true
			},
            'state.skIndex': {
				handler: function(val) { 
                    this.setRealTimeValue()  
				},
				deep: true
			},
            'state.listinfo' : {
                  handler: function (newValue, oldValue) {
                    this.action.setShowList(this.callData)
                    this.setRealTimeValue()
                  },
                  deep: true
           },
        },
        methods: { 
            setMeasure(row){
                this.$prompt('请输入处理措施', '措施', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      inputPattern: /\S/,
                      inputErrorMessage: '处理内容不能为空!'
                }).then(({ value }) => {
                    const me = this
                    api.gas.analogmeasure({measure:value,id:row.id}).then((res) => {
                          console.log(res)
                          if(res.data.status == 0){
                                me.$message({
                                    type: 'success',
                                    message: '你的措施是: ' + value
                                });
                                me.$emit('refresh')
                          }else{
                              me.$message.error(res.data.msg);
                          }     
                    })  
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '操作已经取消'
                    });       
                });
            },
            renderHeader(h,{column}){
                 let list = column.label.split('-')
                 return list.map(item => h('div',{class:'table-head',style:{width:'100%',fontSize:'12px'}},item))
           },
           setRealTimeValue(){
                this.state.showlist = this.state.showlist.map((item) => {
                    if(item.type === 16){
                         return this.state.AllhashSensor[item.ipaddr]
                    }else if(item.type === 104){
                         let k = item.ip + ':' + item.type;
                         return this.state.AllhashSensor[k]
                    }else if(item.type === 900){
                         return this.state.AllhashSensor[item.id]
                    }else if(item.type === 72){
                         let k = item.ipaddr + ':' + item.devid + ':' + item.type;
                         return this.state.AllhashSensor[k]
                    }else if(this.state.AllhashSensor[item.sensorkey]){
                         item.now_value = this.state.AllhashSensor[item.sensorkey].now_value
                         item.now_status = this.state.AllhashSensor[item.sensorkey].now_status
                         item.change = this.state.AllhashSensor[item.sensorkey].change
                         item.debug = this.state.AllhashSensor[item.sensorkey].debug
                         item.statusText = this.state.AllhashSensor[item.sensorkey].statusText     
                         item.level = this.state.AllhashSensor[item.sensorkey].level     
                         item.rescale = this.state.AllhashSensor[item.sensorkey].rescale     
                         item.showColor = this.state.AllhashSensor[item.sensorkey].showColor     
                         item.statusChange = this.state.AllhashSensor[item.sensorkey].statusChange     

                    }
                    return item  
                })
         },
        },
    };

</script>