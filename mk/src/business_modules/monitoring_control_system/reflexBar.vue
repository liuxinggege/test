<style lang="less">
</style>
<template>
<div>
    <div v-if="updateSensor">
        <el-dialog :visible.sync="updateSensor" width="800px" title="修改设备配置" :modal-append-to-body="false" :close-on-click-modal="false">
            <up-sensor  :formItem="obj" @saveUpdate="saveUpdate" @backup="backup"></up-sensor>
        </el-dialog>
    </div>
    <el-form  label-width="110px">
            <el-form-item label="监测传感器">
                    <el-select v-model="obj" filterable clearable value-key="alais" @change="chooseType" size="small" style="width:365px;"  :disabled="!(!formReflex.id&&!formReflex.uniquely)">
                        <el-option 
                            v-for="item in sensorList" 
                            :value="item" 
                            :key="item.alais" 
                            :label="item.alais+'/'+item.type+'/'+item.position">{{item.alais+'/'+item.type+'/'+item.position}}
                        </el-option>
                    </el-select>
                    <el-button size="small"  icon="el-icon-setting" @click="updateSensor = true"  v-if="obj.id&&obj.pid===state['sensorConfig']['analog']">修改传感器配置</el-button>
            </el-form-item>
            <template v-if="obj.alais">
                <el-form-item label="设备通讯状态">
                    <el-checkbox v-model="single" label="设备通讯中断时报警" border size="small"></el-checkbox>
                </el-form-item>
                <el-form-item label="数据异常">
                    <el-checkbox-group v-model="checkedCities">
                        <el-checkbox v-for="item in cities" :label="item.name" :key="item.name" :disabled="item.ctl === 0">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <template v-if="obj.pid===state['sensorConfig']['analog']">
                    <el-form-item label="监测值变化">
                        <el-radio-group v-model="value_change">
                            <el-radio :label="4">不检测</el-radio>
                            <el-radio :label="0">未变化</el-radio>
                            <el-radio :label="1">变化</el-radio>
                            <el-radio :label="2" :disabled="!obj.fluctuation_range||!obj.middle_rang">
                                <span>突变</span>
                                <span v-if="obj.fluctuation_range&&obj.middle_rang">&nbsp;({{obj.fluctuation_range + obj.sensorUnit + '/'+obj.middle_rang}}秒)</span>
                                <span v-else>(未配置)</span>
                                </el-radio>
                            <el-radio :label="3" :disabled="!obj.continuous_change||!obj.change_time">
                                <span>持续升高</span>
                                <span v-if="obj.continuous_change&&obj.change_time">&nbsp;({{obj.continuous_change + obj.sensorUnit + '/'+obj.change_time}}秒)</span>
                                <span v-else>(未配置)</span>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="监测值方向">
                        <el-radio-group v-model="reverting">
                            <el-radio :label="2">不检测</el-radio>
                            <el-radio :label="0">值同向时报警</el-radio>
                            <el-radio :label="1">值反向时报警</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="监测值">
                        <el-select  v-model="valueForm.lgcOperator" style="width:120px;" placeholder="请选择比较条件" clearable size="small">
                            <el-option 
                                v-for="(item,index) in lgcOperatorList" 
                                :label="item.label"
                                :key="index"
                                :value="item.value">{{item.label}}
                            </el-option>
                        </el-select>
                        <span>值：</span>
                        <el-select v-model="valueForm.value" placeholder="请选择监测值" clearable style="width:220px;" size="small">
                            <el-option
                                v-for="item in analogconditionList"
                                :key="item.key"
                                :disabled="item.value==='-'"
                                :label="''+item.label+'('+item.value+')'"
                                :value="item.value">{{''+item.label+'('+item.value+')'}}
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="报警解除">
                        <el-select  v-model="valueForm.lgcOperator2" style="width:120px;" placeholder="请选择比较条件" clearable size="small">
                            <el-option
                                v-for="(item,index) in lgcOperatorList"
                                :value="item.value+''"
                                :label="item.label"
                                :key="index"
                                :disabled="item.value==='-'">{{item.label}}
                            </el-option>
                        </el-select>
                        <span>值：</span>
                        <el-select v-model="valueForm.value2"   placeholder="请选择解除值" clearable style="width:220px;" size="small">
                            <el-option
                                v-for="(item,index) in analogconditionList"
                                :disabled="item.value==='-'"
                                :key="index"
                                :label="'' + item.label + '(' + item.value + ')'"
                                :value="item.value">{{'' + item.label + '(' + item.value + ')'}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else-if="obj.pid==state['sensorConfig']['switch']">
                    <el-form-item label="监测值">
                        <el-select v-model="valueForm.value"  clearable size="small">
                            <el-option 
                                v-for="(item,key) in switchsReflex" 
                                :value="key" 
                                :label="'等于：' + item+'('+key+')'">{{'等于：' + item+'('+key+')'}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
        </template>
    </el-form>
    <div style="text-align: right;">
        <el-button size="small"  @click="$emit('closere')" >取消</el-button>
        <el-button size="small" type="primary" @click="save" :disabled="!obj.alais" style="margin-right:20px">保存</el-button>
    </div>
    
</div>
</template>
<script>
    import api from 'src/api';
    import store from 'src/store'
    import upSensor from "./../../business_bar/upSensor.vue";
    export default {
        components: {
            upSensor
        },
        props:{
           formReflex:Object,
           parameter:Number,
           cities:Array
        },
        data() {
            return {
                valueForm:{
                    lgcOperator:'',
                    value:'',
                    lgcOperator2:'',
                    value2:'',
                },
                state:store.state,
                checkedCities:['欠压','故障','调校','开机','标校'],
                parametertype:'',
                updateSensor:false,
                single:false,
                value_change:4,
                reverting:2,
                obj:{},//监测的传感器
                sensorList:[],//所有监测设备
                analogconditionList:[],
                analogcondition:{
                    limit:[
                        {label:'上限断电',key:'limit_power',value:0},
                        {label:'上限复电',key:'limit_repower',value:0},
                        {label:'上限一级报警',key:'upper_level1',value:0},
                        {label:'上限二级报警',key:'upper_level2',value:0},
                        {label:'上限三级报警',key:'upper_level3',value:0},
                        {label:'上限四级报警',key:'upper_level4',value:0}
                    ],
                    floor:[
                        {label:'下限断电',key:'floor_power',value:0},
                        {label:'下限复电',key:'floor_repower',value:0},
                        {label:'下限一级报警',key:'floor_level1',value:0},
                        {label:'下限二级报警',key:'floor_level2',value:0},
                        {label:'下限三级报警',key:'floor_level3',value:0},
                        {label:'下限四级报警',key:'floor_level4',value:0}
                    ],
                    all:[
                        {label:'上限断电',key:'limit_power',value:0},
                        {label:'上限复电',key:'limit_repower',value:0},
                        {label:'上限一级报警',key:'upper_level1',value:0},
                        {label:'上限二级报警',key:'upper_level2',value:0},
                        {label:'上限三级报警',key:'upper_level3',value:0},
                        {label:'上限四级报警',key:'upper_level4',value:0},
                        {label:'下限断电',key:'floor_power',value:0},
                        {label:'下限复电',key:'floor_repower',value:0},
                        {label:'下限一级报警',key:'floor_level1',value:0},
                        {label:'下限二级报警',key:'floor_level2',value:0},
                        {label:'下限三级报警',key:'floor_level3',value:0},
                        {label:'下限四级报警',key:'floor_level4',value:0}
                    ]
                },
                switchsReflex:{},
                lgcOperatorList:[
                     {label:'大于',value:'>'},
                     {label:'大于等于',value:'>='},
                     {label:'小于',value:'<'},
                     {label:'小于等于',value:'<='},
                 ],
            }
        },
        watch: {},
        computed: {},
        mounted() {
            console.log("this.formReflex:",this.formReflex);
            //通讯中断 初始化
            if(this.formReflex.lgcOperator3&&this.formReflex.value3){ 
                this.single = true;
            }else{
                this.single = false;
            }
            //异常数据 初始化
            let jsonArr = this.formReflex.debugList?this.formReflex.debugList:"[]";
            let debugArr = JSON.parse(jsonArr);
            this.checkedCities = [];
            if(debugArr.length){
                     this.cities.forEach(item => {
                     let debug = debugArr.find(num =>item.ctl === 1 && num === item.debug );
                     if(undefined != debug){
                        this.checkedCities.push(item.name);
                     }
                })
            }
            //值变化 初始化
            if(this.formReflex.value_change==0||this.formReflex.value_change==1||this.formReflex.value_change==2||this.formReflex.value_change==3){
                 this.value_change =  this.formReflex.value_change
            }else{
                 this.value_change = 4
            }
            //值反向 初始化
            if(this.formReflex.reverting==0||this.formReflex.reverting==1){ 
                 this.reverting =  this.formReflex.reverting
            }else{
                 this.reverting = 2
            } 
            //值比较 初始化
            for(let key in this.valueForm){ 
                if(undefined == this.formReflex[key]){
                    this.valueForm[key] = '';
                }else{
                    this.valueForm[key] = this.formReflex[key];
                }
            }  
            //保留字段
            if(this.formReflex.comparisonType){ 
                 this.parametertype = this.formReflex.comparisonType
            }else{
                this.parametertype = this.parameter
            }
            this.getAll();
        },
        methods: {
            getAll(){
                let arr = [53,54,56,69,71]; //只能是模拟量和开关量并且是逻辑量也不能是gd设备
                this.sensorList = []; 
                for(let key in this.state.AllhashSensor){
                    let item = this.state.AllhashSensor[key];
                    if((item.pid == this.state['sensorConfig']['analog']||item.pid == this.state['sensorConfig']['switch']) && !arr.includes(item.sensor_type)){
                        this.sensorList.push(item);
                    }
                }
                if(this.formReflex.dev||(this.obj.uid && this.obj.pid == this.state['sensorConfig']['analog'])){
                    this.sensorList.forEach((item) => {
                        if(item.uid == this.formReflex.uid || item.uid == this.obj.uid ){
                            this.chooseType(item);
                        }
                    })
                }
            },
            //选择监测传感器设备
            chooseType(val){
                this.obj = val;
                if(this.obj.pid==this.state['sensorConfig']['switch']){
                    //设置开关量用于显示字段文字
                    this.formReflex.switchValueText = '';
                    this.switchsReflex = eval('(' + this.obj.type0x +')');
                    for(let key in this.switchsReflex){
                        this.formReflex.switchValueText += this.switchsReflex[key] + '-';
                    }  
                    if(this.formReflex.newAdd){//是否为新添加设备
                        this.valueForm.lgcOperator2 = '';
                        this.valueForm.value = '';
                        this.valueForm.value2 = '';  
                    }else{
                        this.valueForm.value += '';
                    }
                     this.valueForm.lgcOperator = '==';
                }else if(this.obj.pid === this.state['sensorConfig']['analog']){
                    let hasfloor = val.hasfloor || 0;
                    let list ;
                    switch(hasfloor){
                        case 0:
                         list = this.analogcondition.limit;
                        break;
                        case 1:
                         list = this.analogcondition.all;
                        break;
                        case 2:
                         list = this.analogcondition.floor;
                        break;
                    }
                    this.analogconditionList = list.map(item => {
                        let value = this.obj[item.key] === 999999 ||this.obj[item.key] === -999999 || !this.obj[item.key]?'-':this.obj[item.key];
                        if(item.key == "upper_level1"){//以前前端后端都用的limit_alarm字段没改，现在前端用的upper_level1
                            value =  this.obj["limit_alarm"] === 999999 ||this.obj["limit_alarm"] === -999999 || !this.obj["limit_alarm"]?'-':this.obj["limit_alarm"];
                        }
                        return {
                            label:item.label,
                            key:item.key,
                            value
                        }
                    })
                    this.valueForm.value  = this.valueForm.value ||'';
                    this.valueForm.value2 = this.valueForm.value2||'';
                    if(this.formReflex.newAdd){
                          this.valueForm.value = '';
                          this.valueForm.value2 = '';
                          this.valueForm.lgcOperator = '';
                          this.valueForm.lgcOperator2 = '';
                    }
                    delete this.formReflex.switchValueText;
                }
            },  
            saveUpdate(obj){ //修改模拟量设备配置
                api.gas.addGas(obj).then(res => {
                    if (res.data.status === 0) {
                        if (res.data.isuse === 1) {
                            this.$message.error(res.data.msg)
                        } else if (res.data.success === 1) {
                            this.$message.error(res.data.msg)
                        } else {
                           this.$message({message: '操作成功！',type: 'success'});
                           this.getAll();
                           this.backup();
                        }
                    } else {
                        this.$message.error(res.data.msg)
                    }
               })
            },
            backup(){
                this.updateSensor = false;
            },  
            //保存
            save(){
                 let {lgcOperator,lgcOperator2,value,value2} = this.valueForm;
                //  验证
                 if(this.obj.pid === this.state['sensorConfig']['analog']){
                        if(value === '' && value2 === '' && lgcOperator===''&& lgcOperator2===''&& !this.single  && this.value_change == 4 && this.reverting==2 && !this.checkedCities.length ){
                                return this.$message.error('您至少选择一个配置项!')
                        }
                        if((lgcOperator&&lgcOperator2&&value !== '' &&value2 !== '')||(!lgcOperator&&!lgcOperator2&&!value&&!value2)){
                                console.log('监测值验证通过!')
                               //值变化
                                this.formReflex.value_change = this.value_change
                                //值反向
                                this.formReflex.reverting = this.reverting
                                 this.formReflex.type = 100;

                        }else{
                               return this.$message.error('请完善监测值和报警解除!')
                        }
                }else if(this.obj.pid === this.state['sensorConfig']['switch']){
                         if(value === '' && !this.single  && !this.checkedCities.length){
                               return this.$message.error('您至少选择一个配置项!')
                         }else{
                                if(value === ''||value == undefined){
                                    this.formReflex.lgcOperator = '';
                                }else{
                                    this.formReflex.lgcOperator = '==';
                                }
                                this.value_change = 4;
                                this.reverting = 2;
                                this.formReflex.type = 25;
                                this.formReflex.value_change = 4;
                                this.formReflex.reverting = 2;
                                delete this.formReflex.lgcOperator2;
                                delete this.formReflex.value2;
                         }
                }
                //异常数据
                 let debugArr = [];
                 if(this.checkedCities.length){
                      this.cities.forEach(item => {
                          let label = this.checkedCities.find(name => name === item.name);
                          if(label){
                              debugArr.push(item.debug)
                          }
                      })
                 }
                 this.formReflex.debugList = JSON.stringify(debugArr);
                //通讯中断是否报警
                if(this.single){
                    this.formReflex.lgcOperator3 = '_S==';
                    this.formReflex.value3 = 5;
                }else{
                   this.formReflex.lgcOperator3 = '';
                   this.formReflex.value3 = 0;
                }
                //是否为新加逻辑
                if(!this.formReflex.id){
                    if(this.formReflex.uniquely){
                        this.formReflex.newActionFlag = false
                    }else{
                        this.formReflex.uniquely = Date.now() + ~~Math.random() * 1000;
                        this.formReflex.newActionFlag = true;
                    }
                }
                //值
                for(let key in this.valueForm){
                    if('' === this.valueForm[key] || undefined == this.valueForm[key]){
                        delete this.formReflex[key];
                    }else{
                        this.formReflex[key] = this.valueForm[key];
                    }
                }
                this.formReflex.comparisonType = this.parametertype;//保留字段
                this.formReflex.sole = 0;
                this.formReflex.lgcDevid = this.obj.id;
                this.formReflex.dev = this.obj.alais;
                this.formReflex.uid = this.obj.uid;
                this.formReflex.dsp = `${this.obj.alais}/${this.obj.position}/${this.obj.type}`;
                delete this.formReflex.newAdd;
                this.$emit('saveUpdata',this.formReflex)
            }
        }
    };
</script>
