<style>
    .ipparse {
        padding: 10px;
        margin: 10px;
        border: 1px solid #babdc3;
        border-radius: 3px;
        font-size: 8px;
    }
    .legend {
        font-weight: bold;
        font-size: 14px;
        color: #0082E6;
    }
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
<el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="90px">
    <fieldset class="ipparse">
        <legend class="legend">基本信息</legend>
        <el-row>
           <el-col :span="8">
                <el-form-item label="联动名" prop="name">
                    <el-input v-model="formValidate.name"></el-input>
                </el-form-item>
           </el-col>
           <el-col :span="16">
                <el-form-item label="报警内容" prop="alarm">
                    <el-input v-model="formValidate.alarm"></el-input>
                </el-form-item>
           </el-col>
      </el-row>
    </fieldset>
    <fieldset class="ipparse">
        <legend class="legend">逻辑监测设备</legend>
              <el-form-item label="监测条件">
                 <el-table :data="monitorList" border>
                   <template v-if="!formValidate.isControl">
                        <el-table-column prop="dsp" label="监测设备"></el-table-column>
                        <el-table-column  label="通讯中断">
                           <template scope="scope">
                               <el-tag :type="scope.row.lgcOperator3 ? 'danger' : 'success'" close-transition>{{scope.row.lgcOperator3?'是':'否'}}</el-tag>
                           </template>
                       </el-table-column>
                       <el-table-column  label="数据异常">
                           <template scope="scope">
                               <template v-if="scope.row.debugList.length>2">
                                   {{
                                       JSON.parse(scope.row.debugList).map(m => {
                                           return cities.find(o => o.debug === m).name;
                                       }).join('/')
                                   }}
                               </template>
                               <template v-else>-</template>
                           </template>
                       </el-table-column>
                       <el-table-column  label="值变化">
                           <template scope="scope">
                               <span v-if="scope.row.value_change==3">持续升高</span>
                               <span v-else-if="scope.row.value_change==2">突变</span>
                               <span v-else-if="scope.row.value_change==1">变化</span>
                               <span v-else-if="scope.row.value_change==0">未变化</span>
                               <span v-else>-</span>
                           </template>
                       </el-table-column>
                       <el-table-column  label="值方向">
                           <template scope="scope">
                               <span v-if="scope.row.reverting==0">同向</span>
                               <span v-else-if="scope.row.reverting==1">反向</span>
                               <span v-else>-</span>
                           </template>
                       </el-table-column>
                       <el-table-column  label="报警条件">
                            <template scope="scope">
                                <div v-if="scope.row.lgcOperator">
                                    <template v-if="scope.row.type == state['sensorConfig']['analog']">
                                        <span v-if="scope.row.lgcOperator=='>'">值大于{{scope.row.value}}</span>
                                        <span v-else-if="scope.row.lgcOperator=='>='">值大于等于{{scope.row.value}}</span>
                                        <span v-else-if="scope.row.lgcOperator=='<='">值小于等于{{scope.row.value}}</span>
                                        <span v-else-if="scope.row.lgcOperator=='<'">值小于{{scope.row.value}}</span>
                                    </template>
                                    <template v-if="scope.row.type == state['sensorConfig']['switch']">
                                        <span v-if="null != scope.row.value">状态等于{{scope.row.switchValueText.split('-')[scope.row.value]}}</span>
                                        <span v-else>-</span>
                                    </template>
                                </div>
                                <div v-else>-</div>
                            </template>
                     </el-table-column>
                    <el-table-column  label="解除条件">
                       <template scope="scope">
                           <div v-if="scope.row.lgcOperator">
                                <template v-if="scope.row.type == state['sensorConfig']['analog']">
                                     <span v-if="scope.row.lgcOperator2=='>'">值大于{{scope.row.value2}}</span>
                                     <span v-else-if="scope.row.lgcOperator2=='>='">值大于等于{{scope.row.value2}}</span>
                                     <span v-else-if="scope.row.lgcOperator2=='<='">值小于等于{{scope.row.value2}}</span>
                                     <span v-else-if="scope.row.lgcOperator2=='<'">值小于{{scope.row.value2}}</span>
                                </template>
                                <template v-if="scope.row.type == state['sensorConfig']['switch']">
                                    <span v-if="null != scope.row.value">状态不等于{{scope.row.switchValueText.split('-')[scope.row.value]}}</span>
                                    <span v-else>-</span>
                                </template>
                           </div>
                           <div v-else>-</div>
                       </template>
                   </el-table-column>
                </template>
                <template v-else>
                    <el-table-column prop="scene" label="情景详情">
                        <template scope="scope">
                            {{sceneObj[scope.row.scene]}}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                            <el-button type="text"  icon="el-icon-delete" @click="delDomain(scope.row,scope.$index)">移除</el-button>
                            <el-button type="text" icon="el-icon-edit" @click="addUpDomain(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
             </el-table>
            <div v-if="isEdit">
              <el-dialog 
              :title=" !formValidate.isControl?'添加/修改监测条件':'设置/修改情景模式' " 
              :visible.sync="isEdit" width="800px"   :modal-append-to-body="false" :close-on-click-modal="false">
                        <reflex-bar
                            v-if="!formValidate.isControl"
                            @saveUpdata="saveUpdata"
                            :formReflex='formReflex'
                            :parameter="logicDetection"
                            :cities="cities"
                            @closere="isEdit=false">
                        </reflex-bar>
                        <scene
                            v-else
                            :sceneObj="sceneObj"
                            @saveUpdata="saveUpdata"
                            :formReflex='formReflex'
                            :parameter="logicDetection"
                            @closere="isEdit=false">
                        </scene>
              </el-dialog>
            </div>
            <template>
                 <el-button
                 v-if="!formValidate.isControl"
                @click="addUpDomain(-1)"
                size="small"
                style="margin:10px;"
                icon="el-icon-plus"
                type="primary">添加逻辑监测条件</el-button>
                <el-button
                v-else
                @click="addUpDomain(-1,true)"
                size="small"
                style="margin:10px;"
                icon="el-icon-setting"
                type="primary">设置逻辑监测</el-button>
            </template>

        </el-form-item>
        <el-form-item label="报警条件" v-if="monitorList.length&&!formValidate.isControl" style="width: 30%;"  prop="leastNum">
              <el-select  v-model="formValidate.leastNum" placeholder="请选择联动组条件达到多少条时联动报警" filterable>
                  <el-option  
                  v-for="item in monitorList.length" 
                  :value="item" :key="'满足'+ item + '条时报警'"
                  :label="'满足' + item + '条时整个联动报警'">满足{{item}}条时整个联动报警
                  </el-option>
              </el-select>
        </el-form-item>
  </fieldset>
  <div v-if="!formValidate.isControl">
    <span style="margin:0 10px 0 15px;">逻辑报警是否控制关联设备</span>
        <el-switch
          v-model="isOn">
        </el-switch>
       <span style="font-size:10px;color:#909399;">
           （打开：可以设置控制设备，监测条件满足时，系统会控制预置的设备，并且系统会提示联动报警。关闭：监测条件满足时，系统只会提示联动报警）
       </span>
  </div>
  <fieldset class="ipparse" v-if="isOn">
     <legend class="legend">联动控制设备</legend>
       <el-form-item label="控制设备">
         <el-table :data="actionList" border >
            <el-table-column label="设备编号">
                <template scope="scope">
                    <span v-if="scope.row.dsp">{{scope.row.dsp.split('/')[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template scope="scope">
                    <span v-if="scope.row.dsp">{{scope.row.dsp.split('/')[3]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="位置/区域">
                <template scope="scope">
                    <span v-if="scope.row.dsp">{{scope.row.dsp.split('/')[1]}}/{{scope.row.dsp.split('/')[2]}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="执行动作">
                <template scope="scope">
                    <span v-if="scope.row.devType!=71">{{scope.row.param==1?'控制':'恢复控制'}}</span>
                    <span v-else>
                        <label v-if="scope.row.param==0">关闭报警</label>
                        <label v-if="scope.row.param==1">打开一级报警</label>
                        <label v-if="scope.row.param==2">打开二级报警</label>
                        <label v-if="scope.row.param==3">打开三级报警</label>
                        <label v-if="scope.row.param==4">打开四级报警</label>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                        <el-button type="text"  icon="el-icon-delete" @click="delAction(scope.row,scope.$index)">移除</el-button>
                        <el-button type="text"  icon="el-icon-edit" @click="addupAction(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button size="small" icon="el-icon-plus" @click="addupAction(-1)" style="margin: 10px;" type="primary">添加控制设备</el-button>
        <div v-if="isAddAction">
             <el-dialog title="添加/修改控制设备" :visible.sync="isAddAction":modal-append-to-body="false" :close-on-click-modal="false">
                <el-cascader
                    v-model="isaction"
                    :options="switchs"
                    filterable 
                    @change="setAction"
                    expand-trigger="hover"
                    style="width: 500px;">
                 </el-cascader>
                <div style="text-align: right;padding-top: 10px;">
                    <el-button size="small" @click="isAddAction = false">取消</el-button>
                     <el-button size="small" @click="saveAction" type="primary">保存</el-button>
                </div>
             </el-dialog>
        </div>
        </el-form-item>
        <el-row>
            <p class="list-title">请勾选需要控制的读卡器和广播</p>
            <el-col :span="12" v-if="cardsList.length">
                <el-form-item label="人员呼叫">
                   <el-table
                        ref="multipleTable"
                        :data="cardsList"
                        border
                        height="250"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="addr" label="读卡器编号"></el-table-column>
                        <el-table-column prop="areaname" label="区域"></el-table-column>
                        <el-table-column prop="position" label="安装位置"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="broadcast.length">
                <el-form-item label="设置广播">
                   <el-table
                        ref="multipleTable2"
                        :data="broadcast"
                        border
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange2">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="name" label="广播站"></el-table-column>
                        <el-table-column prop="areaname" label="区域"></el-table-column>
                        <el-table-column prop="position" label="安装位置"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="语音文件">
                    <el-select  v-model="formValidate.filePath" style="width:300px;" placeholder="请选择或者输入广播文件编号" filterable allow-create  default-first-option>
                        <el-option
                            v-for="item in radioFiles"
                            :key="item.k"
                            :label="item.v + '('+ item.k +')'"
                            :value="item.k">
                            {{item.v + '('+ item.k +')'}}
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
    </fieldset>
    <el-form-item style="text-align: center;margin:20px 0;">
        <el-button size="small" @click="handleReset('formValidate')" style="margin-right: 8px;">返回</el-button>
        <el-button size="small" type="primary" @click="handleSubmit('formValidate')" icon="el-icon-message">提交保存</el-button>
    </el-form-item>
</el-form>
</template>
<script>
    import store from 'src/store'
    import reflexBar from './reflexBar.vue'
    import scene from './scene.vue'
    import api from 'src/api'
    export default {
        props:{
            formValidate:Object,
            logicDetection:Number,
        },
        components: {
            reflexBar,
            scene,
        },
        data() {
            const isNull = (rule, value, callback) => {
     		    if (!value) {
                    callback(new Error('不能为空！'));
                }else{
			    	callback()
			    }
        	};
            return {
                state: store.state,
                isOn:false,
                isEdit:false, //添加修改逻辑组
                isAddAction:false,//添加修改控制组
                formReflex:{},//逻辑组表单
                monitorList:[],//联动组
                formAction:{},//控制组表单
                actionList:[],//控制组
                isaction:[], //控制设备与执行动作
                switchs: [],//所有控制设备
                cardsList:[],//所有读卡器
                broadcast: [],//所有卡片
                radioFiles:[],//所有广播文件
                multipleSelection: [],//勾选中的读卡器
                multipleSelection2: [],//勾选中的广播
                cities:[],//数据类型config
                sceneObj:{
                    '1':'情景一：当进风巷瓦斯浓度高于回风巷瓦斯浓度。',
                    '2':'情景二：当打开风机风向转换，瓦斯浓度没有发生变化。',
                    '3':'情景三：风机停，但风筒开。'
                },
                ruleValidate: {
                     name: {required: true, message: '联动名不能为空!', trigger: 'blur' },
                     alarm: {required: true, message: '报警内容不能为空!', trigger: 'blur' },
                     leastNum:{validator:isNull, trigger: 'change' },
                }  
            }
        },
        computed: {},
        watch: {},
        mounted(){
             this.getAll();
             this.getConfig();
        },
        methods: {
            getConfig(){
                api.setting.getConfig().then(res => {
                    if(res.data.status == 0){
                        this.cities = JSON.parse(res.data.data.v);
                        // console.log(this.cities,'confing')
                    }else{
                        this.$message.error(res.data.msg);
                    }        
                })
            },
            //添加修改联动组
           addUpDomain(row,bool){
                if(row == -1){
                    if(bool&&this.monitorList[0]){
                        this.formReflex = this.monitorList[0]
                    }else{
                        this.formReflex = {newAdd:true}
                    }
                }else{
                    this.formReflex = row
                    this.formReflex.newAdd = false
                }
                this.isEdit = true
            },
            //添加联动组
            saveUpdata(ob){
                if(ob.id||!ob.newActionFlag){
                        this.monitorList = this.monitorList.map(item => {
                            if((ob.id&&item.id == ob.id)||(!ob.id && item.uniquely==ob.uniquely)){
                                return ob
                            }else{
                                return item
                            }
                        })
                        this.formValidate.listLgc = this.formValidate.listLgc.map(item => {
                             if((ob.id && item.id == ob.id)||(!ob.id && item.uniquely==ob.uniquely)){
                                return ob
                            }else{
                                return item
                            }
                        })
                }else{
                       this.monitorList.push(ob)
                       this.formValidate.listLgc.push(ob)
                }
                this.isEdit = false
            },
            saveAction(){
                if(this.formAction.id||!this.formAction.newActionFlag){
                     this.actionList =  this.actionList.map(item => {
                        if((this.formAction.id&&item.id == this.formAction.id)||(!this.formAction.id && item.uniquely == this.formAction.uniquely)){
                            return this.formAction
                        }else{
                            return item
                        }
                    })
                    this.formValidate.listCutOut =  this.formValidate.listCutOut.map(item => {
                        if((this.formAction.id&&item.id == this.formAction.id)||(!this.formAction.id && item.uniquely==this.formAction.uniquely)){
                            return this.formAction
                        }else{
                            return item
                        }
                    })
                }else{
                    this.actionList.push(this.formAction)
                    this.formValidate.listCutOut.push(this.formAction)
                }
                this.isAddAction = false
            },
            //删除
            delDomain(row,index){
                this.$confirm('是否移除该逻辑监测组', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.monitorList.splice(index,1)
                    if(row.id){
                        this.formValidate.listLgc.forEach(item => {
                           if(item.id == row.id) item.sole = 1
                        })
                    }else{
                        this.formValidate.listLgc = this.formValidate.listLgc.filter(item => item.uniquely != row.uniquely)

                    }
                    this.$message({
                        type: 'success',
                        message: '操作成功，已经删除!'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });
                });
            },
             addupAction(row){
                 console.log(row);
                 if(row == -1){
                     this.formAction = {}
                     this.isaction = []
                 }else{
                     this.formAction = row
                     this.isaction = [row.actDevid,row.param];
                 }
                 this.isAddAction = true
             },
            setAction(list){
                let id = ~~list[0];
                let action = list[1];
                let sensorItem = this.switchs.find(m => id === m.id);
                this.isaction = [id,action];
                this.formAction.sole = 0;
                this.formAction.param = action;
                this.formAction.actDevid = id;
                this.formAction.dev = sensorItem.alais;
                this.formAction.uid = sensorItem.uid;
                this.formAction.dsp = sensorItem.label;
                this.formAction.ip = sensorItem.ipaddr;
                this.formAction.sensorId = sensorItem.sensorId;
                this.formAction.devType = sensorItem.sensor_type;
                if(!this.formAction.id){
                    if(this.formAction.uniquely){
                        this.formAction.newActionFlag = false
                    }else{
                        this.formAction.newActionFlag = true
                        this.formAction.uniquely = Date.now();

                    }
                }
            },
            delAction(row,index){
                this.$confirm('是否移除该设备控制', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.actionList.splice(index,1)
                    if(row.id){
                        this.formValidate.listCutOut.forEach(item => {
                            if(item.id == row.id) item.sole = 1
                        })
                    }else{
                        this.formValidate.listCutOut = this.formValidate.listCutOut.filter(item => item.uniquely != row.uniquely )
                    }
                    this.$message({
                        type: 'success',
                        message: '操作成功，已经删除!'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });
                });
            },
             handleSubmit(name) {
               this.$refs[name].validate(valid=>{
                   if (valid) {
                        if(!this.monitorList.length){
                            return this.$message.error('逻辑监测内容不能为空！')
                        }
                        this.formValidate.listLgc.forEach(item => {
                            delete item.uniquely
                            delete item.newActionFlag
                            delete item.newAdd
                        })
                        this.formValidate.pid=0
                        this.formValidate.isUse=1
                        if(this.formValidate.isControl){
                            // 情景模式 和不控制的
                                this.formValidate.listCardReader = []
                                this.formValidate.listRadio = []
                                this.formValidate.listCutOut = []
                                this.formValidate.leastNum = 1
                        }else{
                            //联动控制和 需要控制的
                                this.formValidate.listCutOut.forEach(item => {
                                    delete item.uniquely
                                    delete item.newActionFlag
                                    delete item.newAdd
                                })
                                this.formValidate.listCardReader = this.multipleSelection.map(item => {
                                    return {
                                        actDevid:item.id,
                                        dev:item.alais,
                                        ip:item.subname,
                                        sensorId:item.cid,
                                        uid:item.uid,
                                    }
                                })
                                this.formValidate.listRadio = this.multipleSelection2.map(item => {
                                    return {
                                        actDevid:item.id,
                                        uid:item.uid,
                                        dev:item.alais,
                                        ip:item.ip,
                                        sensorId:item.radioId,
                                        dsp:item.position + '--'+item.name,
                                    }
                                })
                    }
                    console.log(this.formValidate)
                    //保存
                    api.analyze.addupLinkGroup(this.formValidate).then(res => {
                        if(res.data.status == 0){
                            this.$emit('backup');
                            this.$message.success('保存成功！')
                        }else{
                             this.$message.error(res.data.msg); 
                        } 
                    })
                }else{
	                this.$message.error('操作失败！')
	            }
	          })
            },
            handleReset(rest) {
                this.$emit('backup')
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSelectionChange2(val){
                this.multipleSelection2 = val;
            },
            initData(){
                if(this.formValidate.id && (this.formValidate.listCardReader.length||this.formValidate.listRadio.length||this.formValidate.listCutOut.length)){
                    this.isOn = true;
                }
                if(this.formValidate.id){ // 有id修改 需要初始化赋值表单
                    this.monitorList = JSON.parse(JSON.stringify(this.formValidate.listLgc));
                    this.actionList = JSON.parse(JSON.stringify(this.formValidate.listCutOut));
                    if(this.formValidate.listCardReader.length){
                        setTimeout(() => {
                            this.getSelectionList(1);
                        },10)
                    }
                    if(this.formValidate.listRadio.length){
                        setTimeout(() => {
                            this.getSelectionList(2);
                        },10)
                    }
                }else{
                    this.formValidate.listLgc = [];
                    this.formValidate.listCutOut = [];
                }
            },
            getSelectionList(val){
                if(val==1){
                     this.formValidate.listCardReader.forEach(oob => {
                           this.cardsList.forEach(item => {
                                if(item.id == oob.actDevid){
                                     this.$refs.multipleTable.toggleRowSelection(item)
                                }
                           })
                     })
                }else if(val ==2){
                    this.formValidate.listRadio.forEach(oob => {
                           this.broadcast.forEach(item => {
                                if(item.id == oob.actDevid){
                                     this.$refs.multipleTable2.toggleRowSelection(item)
                                }
                           })
                     })
                }
            },
            getAll() { 
                api.searchs.getallData().then((res) => {
                    if(res.data.status == 0){
                        this.radioFiles = res.data.radio // 语音播放
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
                api.station.getOwnList({}).then((res) => {   
                    if(res.data.status == 0){
                        res.data.data.list2.forEach(item => { //断电器
                            if(item.sensor_type === 53 || item.sensor_type === 56){
                                item.value = item.id;
                                item.label = item.alais + '/'+item.position+ '/' + (item.areaname || '未配置区域' ) + '/' + item.type;
                                item.children = [
                                    // {value:'0',label:'恢复控制'},//2019-3-28 后端分析需求后，这里只有控制没有恢复控制，所有这里的恢复控制选项注释了
                                    {value:'1',label:'控制'}];
                                this.switchs.push(item);
                            }
                            if(item.sensor_type == 71){
                                item.value = item.id
                                item.label = item.alais + '/'+item.position+ '/'  +(item.areaname || '未配置区域' ) + '/' + item.type;
                                item.children = [{value:'0',label:'关闭'},{value:'1',label:'一级报警'},{value:'2',label:'二级报警'},{value:'3',label:'三级报警'},{value:'4',label:'四级报警'}]
                                this.switchs.push(item)
                            }
                        })
                        this.cardsList = res.data.data.list1;//读卡器
                        this.broadcast = res.data.data.list4;  //广播
                        this.initData();
                    }else{
                        this.$message.error(res.data.msg); 
                    }   
                })
            }
        },

    }

</script>
