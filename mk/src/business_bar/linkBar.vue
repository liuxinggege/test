<style lang="less">
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
        font-size: 14px;
        overflow: hidden;
    }
</style>
<template>
  <div>
      <p class="list-title">请勾选断电报警时需要联动控制的设备</p>
      <el-table ref="multipleTable" :data="all"  border @selection-change="handleSelectionChange" height="450" style="width:100%;">
           <el-table-column label="设备编号" prop="alais" width="90"></el-table-column>
           <el-table-column label="设备类型" prop="type" width="170"></el-table-column>
           <el-table-column label="位置/区域">
               <template scope="scope">
                   {{scope.row.position}}/{{scope.row.areaname||'-'}}
               </template>
           </el-table-column>
           <el-table-column label="执行动作" width="150">
               <template scope="scope">
                  <span v-if="scope.row.sensor_type === state.sensorConfig.voice">播放</span>
                  <span v-else-if="scope.row.sensor_type === state.sensorConfig.cardReader">呼叫</span>
                  <span v-else-if="scope.row.sensor_type === 71">报警</span>
                  <div v-else>
                      <span>控制</span>
                      <!-- 2019-3-28 后端分析需求后，这里只有控制没有恢复控制，所有这里的切换功能注释了-->
                        <!-- <span @click="change(scope.row.uid,scope.$index)" style="float: left;">{{scope.row.general==1?'控制':'恢复控制'}}</span>
                        <el-button size="mini" type="text" style="float: right;" @click="change(scope.row.uid,scope.$index)" icon="el-icon-refresh"></el-button> -->
                  </div>
               </template>
           </el-table-column>
          <el-table-column label="选择" type="selection" width="55"></el-table-column>
      </el-table>
      <el-form style="margin-top: 10px;">
        <el-form-item label="语音广播文件">
           <el-select  v-model="file"  placeholder="请选择或者输入广播文件编号" filterable allow-create  default-first-option  style="width: 300px;" size="small">
                <el-option
                    v-for="item in radioFiles"
                    :key="item.k"
                    :label="item.v + '('+ item.k +')'"
                    :value="item.k">
                    {{item.v + '('+ item.k +')'}}
                </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right;padding:0 10px 10px 10px;">
              <el-button size="small" @click="backup(-1)">关闭</el-button>
              <el-tooltip class="item" effect="dark" content="只有保存设备配置才会真正的更改联动设备的配置" placement="top">
                  <el-button size="small" type="primary" @click="backup(1)">确定</el-button>
              </el-tooltip>
      </div>
  </div>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    export default {
        components: {},
        props:{
            sensorList:Array,
            areasensorList:Array
      },
        data() {
            return {
                state:store.state,
                all:[],
                file:'',
                multipleSelection:[],
                radioFiles:[],
            }
        },
        watch: {},
        mounted() { 
            let  me = this,
                list =[];
            api.searchs.getallData().then((res) => {
                if(res.data.status == 0){
                  me.radioFiles = res.data.radio//语音播放
                }else{
                  me.$message.error(res.data.msg)
                }
            })
            list = Object.values(me.state.AllhashSensor).filter(item => {
                if(item.sensor_type===71||item.pid===this.state.sensorConfig.voice||item.typeid === this.state.sensorConfig.cardReader){
                    if(item.pid===this.state.sensorConfig.voice){
                        item.sensor_type = item.pid;
                        item.ipaddr = item.ip; 
                        item.sensorId = item.radioId; 
                        item.type = '语音广播分站';
                    }else if(item.typeid===this.state.sensorConfig.cardReader){
                        item.sensor_type = item.typeid;
                        item.ipaddr = item.subname; 
                        item.sensorId = item.cid; 
                    }
                    item.general = 1;
                    return true
                }else if(item.sensor_type===53||item.sensor_type===56){
                    let ob = me.areasensorList.find(m => m.uid == item.uid);
                    if(ob){
                       return false
                    }
                    item.general = 1;
                    return true 
                }
            }) 
            list = list.sort((m1,m2)=> m1.sensor_type - m2.sensor_type);
            me.all = JSON.parse(JSON.stringify(list));
            if(me.sensorList.length){
                setTimeout(()=>{ me.toggles(me.sensorList,1) },0)
            }
        },
        methods: { 
            toggles(rows,type){    
                this.all.forEach(row => {
                    for(let i=0;i<rows.length;i++){
                        if(rows[i].uid===row.uid){
                            if(type==1){
                                row.general = rows[i].action
                                if(row.pid===this.state.sensorConfig.voice){
                                   this.file = rows[i].action
                                }
                            }else if(type==2){
                                row.general = rows[i].general
                            }
                            this.$refs.multipleTable.toggleRowSelection(row);
                        }
                    }   
                })
            },
            change(uid,index){
                  let list = []
                  this.all[index].general = this.all[index].general==1?0:1
                  if(this.multipleSelection.length){
                      for(let item of this.multipleSelection){
                          if(uid===item.uid){
                              item = this.all[index]
                              break;
                          }
                      }
                      list = this.multipleSelection
                  }
                  this.all=[...this.all]  
                  if(list.length){
                     setTimeout(()=>{ this.toggles(list,2) },0)
                  }
            },
            backup(row){
                if(row==-1){
                    this.$emit('savelink')
                }else{
                    this.$emit('savelink',this.multipleSelection.map(item => { 
                        if(item.pid===this.state.sensorConfig.voice){
                           item.general = this.file  
                        }else if(item.pid===53 ||item.pid===56){//2019-3-28 后端分析需求后，这里只有控制没有恢复控制,所有这里写死传1
                             item.general = 1;
                        }
                        return {
                            uid:item.uid,
                            sensor_type:item.sensor_type,
                            action:item.general,
                            ip:item.ipaddr,
                            sensorId:item.sensorId,
                        }
                    }))
                }
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
           },
        },
    };

</script>