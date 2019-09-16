<style lang="less">
</style>
<template>
     <div>
        <el-form ref="formReflex" :model="formReflex" :rules="ruleValidate"  label-width="130px">
            <el-form-item label="情景模式">
                <el-select  v-model="formReflex.scene" :disabled="!!formReflex.id" @change="changeScene" style="width:100%;" size="small">
                    <el-option :value="1" :label="sceneObj['1']">{{sceneObj['1']}}</el-option>
                    <el-option :value="2" :label="sceneObj['2']">{{sceneObj['2']}}</el-option>
                    <el-option :value="3" :label="sceneObj['3']">{{sceneObj['3']}}</el-option>
                </el-select>
            </el-form-item>
        <!--情景1-->
         <template v-if="formReflex.scene==1">
                <el-form-item label="进风巷甲烷传感器">
                    <el-select v-model="obj" style="width:100%;"  clearable value-key="alais" @change="chooseType" size="small" filterable>
                        <el-option v-for="item in gasSensor" :value="item" :key="item.alais" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="回风巷甲烷传感器">
                    <el-select  v-model="dev2" size="small" style="width:100%;" @change="setDev2alais" filterable>
                        <el-option  :disabled="item.id==obj.id" v-for="item in gasSensor" :value="item.alais" :key="item.id" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                    </el-select>
                </el-form-item>
         </template>
        <!--情景2-->
         <template v-if="formReflex.scene==2">
                <el-form-item label="风向监测">
                    <el-select v-model="obj" style="width:100%;"  clearable value-key="alais" @change="chooseType" size="small" filterable>
                        <el-option v-for="item in windSensorList" :value="item" :key="item.alais" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="T3甲烷传感器">
                   <el-select v-model="dev2Id" style="width:100%;" @change="setDev2" size="small" filterable>
                        <el-option v-for="item in gasSensor" :value="item.id" :key="item.id" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                    </el-select>
                </el-form-item>
         </template>

        <!--情景3-->
         <template v-if="formReflex.scene==3">
                <el-form-item label="通风机开停设备">
                    <el-select v-model="obj" style="width:100%;"  clearable value-key="alais" @change="chooseType" size="small" filterable>
                        <el-option v-for="item in outageSensor" :value="item" :key="item.alais" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="风筒传感器">
                    <el-select  v-model="dev2" size="small" style="width:100%;" @change="setDev2alais" filterable>
                        <el-option  :disabled="item.id==obj.id" v-for="item in hairDryer" :value="item.alais" :key="item.id" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                    </el-select>
                </el-form-item>  
         </template>     
         </el-form>
         <div style="text-align: right;">
             <el-button  @click="$emit('closere')" size="small">取消</el-button>
             <el-button type="primary" @click="save" size="small">保存</el-button>
         </div>
     </div>
</template>
<script>
    import api from 'src/api'
    export default {
        props:{
           formReflex:Object,
           parameter:Number,
           sceneObj:Object
        },
        data() {
            return {
                dev2:'',
                dev2Id:'',
                parametertype:'',
                obj:{},//监测的传感器
                sensorList:[],//所有设备
                windSensorList:[],//风向类传感器
                gasSensor:[],//甲烷类传感器
                outageSensor:[],//设备开停传感器
                hairDryer:[],//风筒传感器
                ruleValidate:{},
                switchsReflex:{} 
            }
        },
        mounted() {
            this.getAll()
            if(this.formReflex.comparisonType){
                 this.parametertype = this.formReflex.comparisonType
            }else{
                this.parametertype = this.parameter
            }
        },
        methods: {
            changeScene(val){
                if(!this.formReflex.id){
                     delete this.formReflex.value
                     this.dev2 = ''
                     this.dev2Id = ''
                     this.formReflex.dev2Id=''
                     this.obj = {}
                }
                
                if(val == 1){
                    this.formReflex.lgcOperator = '>'
                }else if(val == 2){
                    this.formReflex.lgcOperator = '_R =='
                    this.formReflex.value = 1
                }else if(val == 3){
                    this.formReflex.lgcOperator = '!='
                }
            },
//            设置dev2
            //情景2
            setDev2(id){
                 let ob = this.gasSensor.filter(item =>  id == item.id)
                 if(ob.length){
                     this.formReflex.dev2Id = ob[0].id
                     this.dev2Id = ob[0].id
                     this.formReflex.dev2 = ob[0].alais;
                     this.formReflex.uid2 = ob[0].uid;
                 }
            },
            //情景1,3
            setDev2alais(alais){
                 this.dev2 = alais
                 this.formReflex.dev2 = alais
                 for(let item of this.sensorList){
                     if(item.alais == alais){
                         this.formReflex.uid2 = item.uid
                     }
                 }
            },
             //选择监测传感器设备
            chooseType(obj){
//                this.formReflex.type = 1
                this.obj = obj
            },       
            //保存
            save(){
                this.formReflex.comparisonType = this.parametertype
                this.formReflex.sole = 0
                this.formReflex.lgcDevid = this.obj.id
                this.formReflex.dev = this.obj.alais
                this.formReflex.uid = this.obj.uid
                this.formReflex.dsp = this.obj.position +'一' +this.obj.type + this.obj.alais +'（' +this.obj.sensorId+'）'
                
                if(!this.formReflex.id){
                    if(this.formReflex.uniquely){
                        this.formReflex.newActionFlag = false
                    }else{
                        this.formReflex.uniquely = new Date().getTime() + ~~Math.random()*1000
                        this.formReflex.newActionFlag = true
                    }
                }
                console.log(this.formReflex)
                this.$emit('saveUpdata',this.formReflex)
            },
            getAll(){
                const me = this
                 api.station.getOwnList({}).then((res) => {
                     me.sensorList = [...res.data.data.list2,...res.data.data.list3]
                     res.data.data.list2.forEach(item => {
//                        设备开通传感器list
                         if(item.sensor_type == 51){
                             me.outageSensor.push(item)
                         }
//                         风筒传感器list
                         if(item.sensor_type == 50){
                             me.hairDryer.push(item)
                         }
                     })
                     
                     res.data.data.list3.forEach(item => {
                          
                         switch(item.sensor_type){
//                            风速风向传感器
//                              case 47: 
//                                 me.windSensorList.push(item)
//                                 break;
                              case 48: 
                                 me.windSensorList.push(item)
                                 break;
                              case 32: 
                                 me.gasSensor.push(item)
                                 break;
                              case 33: 
                                 me.gasSensor.push(item)
                                 break;
                              case 34: 
                                 me.gasSensor.push(item)
                                 break;
                              case 35: 
                                 me.gasSensor.push(item)
                                 break;
                              case 80: 
                                 me.gasSensor.push(item)
                                 break;
                             default:
                                 break;
                         }  
                     })
                     //修改时 展示的设备 dev
                     if(me.formReflex.dev){
                         me.sensorList.forEach((item) => {
                             if(item.alais == me.formReflex.dev){
                                    me.obj = item
                                    me.chooseType(item)

                                 if(me.formReflex.scene==2){
                                    me.setDev2(me.formReflex.dev2Id) 
                                 }else{
                                    me.setDev2alais(me.formReflex.dev2) 
                                 }

                             }
                         })
                     }
                     
                 })
            },
        },
       
        computed: {

        },
    };
</script>