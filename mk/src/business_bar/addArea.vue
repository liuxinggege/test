<style lang="less">
    .siCheckbox{position: relative; padding:0 10px 0 25px; cursor: pointer;}
    .siCheckbox input{ display: none;}
    .siCheckbox  span{
        display: inline-block;
        position: relative;
        border: 1px solid #1db0fc;
        border-radius: 2px;
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        background-color: #fff;
        z-index: 1;
        transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    }
    .siCheckbox span:after{
        box-sizing: content-box;
        content: "";
        border: 2px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 6px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 4px;
        transition: transform .15s ease-in .05s;
        transform-origin: center;
    }
    .siCheckbox input:checked + span{ border-color: #1db0fc; background: #1db0fc;}
    .siCheckbox input:checked + span:after{ -webkit-transform: scale(1); transform: rotate(45deg) scale(1);}
    .siCheckbox .is-disabled{
        background-color: #edf2fc;
        border-color: #dcdfe6;
        cursor: not-allowed;
    }
</style>
<template>
    <div>
    	<el-form ref="formInline" :model="formInline" :rules="ruleInline" label-width="160px">
            <el-form-item label="区域名称" prop="areaname">
                <el-input v-model="formInline.areaname" size="small" style="width:100%;"></el-input>
            </el-form-item>
            <el-form-item label="区域类型" prop="area_type_id">
                <el-select v-model="formInline.area_type_id" size="small" @change="changeAreatype" style="width:100%;">
                    <el-option v-for="item in areaTypeList" :value="item.area_type_id" :key="item.area_type_id" :label="item.area_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区域说明">
                <el-input v-model="formInline.remark" size="small" style="width:100%;"></el-input>
            </el-form-item>
            <el-form-item label="相邻区域">
                <el-input v-model="formInline.adjoin" size="small" style="width:80%;" disabled></el-input>
                <el-button size="small" @click="openAdjacent" :disabled = '!formInline.id'>设置相邻区域</el-button>
                <div v-if="setAdjacent">
                    <el-dialog
                    width="750px"
                    :visible.sync="setAdjacent"
                    :append-to-body="true"
                    :close-on-click-modal="false"
                    title="相邻区域">
                        <el-row>
                            <el-col :span="6">
                                <p class="list-title">相邻区域</p>
                                <el-table
                                ref="multipleTable"
                                :data="areaList"
                                border
                                height="450"
                                tooltip-effect="dark"
                                @row-click="handleClick">
                                <el-table-column prop="areaname" label="区域名称"></el-table-column>
                                </el-table>
                            </el-col>
                            <el-col :span="18">
                                <p class="list-title">勾选{{neighborarea}}引起{{formInline.areaname}}报警的相邻传感器</p>
                                <el-table
                                ref="sensorTable"
                                :data="sensorList"
                                border
                                height="450"
                                tooltip-effect="dark"
                                @selection-change="handleSelectionSensor">
                                    <el-table-column type="selection"  width="40" ></el-table-column>
                                    <el-table-column prop="type" label="传感器类型">
                                    </el-table-column>
                                    <el-table-column prop="alais" label="别名"></el-table-column>
                                    <el-table-column prop="areaname" label="区域"></el-table-column>
                                    <el-table-column prop="position" label="位置"></el-table-column>
                                    <el-table-column label="位置类型">
                                        <template scope="scope">
                                            <p v-if="scope.row.position_type">{{scope.row.position_type}}</p>
                                            <p v-else>未配置</p>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                            <el-col>
                                <el-button size="small" @click="cancel" style="float:right;margin-top:10px;">取消</el-button>
                                <el-button size="small" @click="sureAdjiacent" type="primary" style="float:right;margin-top:10px;margin-right: 10px">确定</el-button>
                            </el-col>
                        </el-row>
                        <div slot="footer"></div>
                    </el-dialog>
                </div>
            </el-form-item>
        </el-form>
        <!-- 配置传感器列表 -->
        <el-table
            :data="senPosList"
            border
            height="450"
            tooltip-effect="dark"
            v-if="formInline.id">
            <el-table-column label="位置类型列表">
                <template scope="scope">
                    <p v-if="scope.row.attrib_name">{{scope.row.name}}</p>
                    <p v-else><span>{{scope.row.name}}</span><span style="color: red">({{scope.row.text}})</span></p>
                </template>
            </el-table-column>
            <el-table-column label="位置/传感器/别名">
                <template scope="scope">
                    <el-button @click.stop="setSensor(scope.row)" type="text" size="small">
                    <span v-if="scope.row.alais&&scope.row.position&&scope.row.sensor_type&&scope.row.uid">{{scope.row.position+'/'+scope.row.sensor_type+'/'+scope.row.alais+(scope.row.is_area_alarm==1?'(关联区域报警)':'')}}</span>
                    <span v-else>配置传感器</span>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="是否引起本区域报警" width="200" :align="center">
                <template scope="scope">
                    <label class="siCheckbox"><input @click.stop="clickChecked(scope.row)" type="checkbox" :checked="scope.row.is_area_alarm ==1" :disabled="!scope.row.alais&&scope.row.position&&!scope.row.sensor_type&&!scope.row.uid" /><span :class="{'is-disabled':!scope.row.alais&&scope.row.position&&!scope.row.sensor_type&&!scope.row.uid}"></span></label>
                </template>
            </el-table-column>
        </el-table>
        <!-- 配置位置类型传感器 -->
        <div v-if="isArea">
            <el-dialog
                :visible.sync="isArea"
                width="800px"
                :append-to-body="true"
                :close-on-click-modal="false"
                :title="showtext">
                <add-sen :controlForm="SenItem" ref="addSen" @backup="cencel" @saveSensor='saveSensor' :isloding="isloded" :arrList="arrList"></add-sen>
                <div slot="footer"></div>
            </el-dialog>
        </div>
        <el-row :gutter="20" style="margin-top:10px" v-if="$route.name=='Wsub'||$route.name=='areaSetting'">
            <el-col :span="2" :offset="18"><el-button size="small" type="primary" @click="handleSubmit('formInline')" :loading="isloding">保存</el-button></el-col>
            <el-col :span="2" style="margin-left: 10px"><el-button size="small" type="ghost" @click="backup">关闭</el-button></el-col>
        </el-row>
    </div>
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import addSen from './addSen.vue'

export default {
	props: ["formInline","isloding"],
    components: {
        addSen
    },
    data () {
        return {
    	    dataList:[],
            areaList:[],
            sensorList:[],
            areaTypeList:[],
            senPosList:[],
            isArea:false,
            ruleInline: {
  	            areaname: [{required: true, message: '不能为空', trigger: 'blur' }],
                area_type_id: [{ required: true, message: '请选择区域类型！', trigger: 'change' }]
  	        },
            setAdjacent:false,
            s_area_id:0,
            adjoinSensors:[],//选中的相邻区域传感器
            neighborarea:'',
            regions:[],//选中区域的相邻区域
            showtext:'',
            SenItem:{},
            checked:false,
            arrList:{},
            mustList:[]//必配传感器的位置
        }
    },
    watch: {
  		'$route':'fetchData',
  	},
    methods: {
      	fetchData(){

      	},
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.formInline.id){
                        let lists = [],
                            list = [],
                            musts = []
                        //找出有位置类型的传感器
                        lists = this.senPosList.filter(ob=>ob.uid)
                        lists.forEach((oc)=>{
                            if(oc.is_area_alarm==1){
                                list.push({
                                    area_sensor_id:oc.area_sensor_id,
                                    is_area_alarm:1
                                })
                            }else{
                                list.push({
                                    area_sensor_id:oc.area_sensor_id,
                                    is_area_alarm:0
                                })
                            }
                        })
                        //判断必配位置是否选了传感器
                        list.map((oa)=>{
                            let item = this.mustList.find(val=>val.area_sensor_id == oa.area_sensor_id)
                            if(item){
                                musts.push(oa)
                            }
                        })
                        if(musts.length == this.mustList.length){
                            this.formInline['alarmSensors'] = list
                            this.$emit("handleSubmit",this.formInline)
                        }else{
                            this.$message.error('必配项请配置传感器！')
                        }
                    }else{
                        this.$emit("handleSubmit",this.formInline)
                    }
                }else{
                    this.$message.error('操作失败！')
                }
            })
        },
        saveSensor(obj){
            var me = this
            me.isloded = true
            api.routeLine.addAreaSen(obj).then(function(res) {
                if(res.data.status==0){
                    me.$message.success("保存成功")
                    me.getSensorPos()
                    me.isArea = false
                }else{
                    me.$message.error(res.data.msg)
                }
                me.isloded = false
            })
        },
      	backup(){
            this.$refs.formInline.resetFields();
            this.$emit("backup")
      	},
        cancel(){
            this.setAdjacent = false
        },
        cencel(){
            this.isArea = false
        },
        handleSelectionSensor(val){
            this.adjoinSensors = val
        },
        openAdjacent(){
            this.setAdjacent = true
            this.areaList = this.dataList.filter((ob)=> ob.id != this.formInline.id)
            if(this.areaList.length){
                this.handleClick(this.areaList[0])
            }
        },
        handleClick(row){
            this.getSensor(this.formInline,row)
            this.s_area_id = row.id
            this.neighborarea = row.areaname
        },
        sureAdjiacent(){
            let me = this
            if(me.adjoinSensors.length){
                //判断是否本区域和相邻区域都勾选了传感器
                let mArea = me.adjoinSensors.find((val)=>val.area_id == me.formInline.id),
                    sArea = me.adjoinSensors.find((val)=>val.area_id != me.formInline.id);
                if(!mArea){
                    me.$message.error("请选择本区域传感器！")
                }else if(!sArea){
                    me.$message.error("请选择相邻区域传感器！")
                }else{
                    me.adjoinSensors.map((ob)=>{
                        ob['m_area_id'] = me.formInline.id
                        ob['s_area_id'] = me.s_area_id
                    })
                    api.routeLine.getNeighbor({sensors:me.adjoinSensors}).then(function(res) {
                        if (res.data.status === 0) {
                            me.setAdjacent = false
                            me.$message.success('保存成功！')
                            me.$emit("pushCardStr",me.neighborarea)
                            me.getadArea()
                        } else {
                            me.$message.error(res.data.msg)
                        }
                    })
                }
            }else{
                me.$message.error("请选择传感器！")
            }
        },
        // 相邻区域相关传感器
        getSensor(row,arr){
            let me = this,
                data = [],
                row1 = [];
                row1.push(row,arr)
                data = row1.map(i=>i.id)
            api.routeLine.postAdjoin({adjoinAreaIds:data}).then(function(res) {
                if (res.data.status === 0) {
                    me.sensorList = res.data.data
                    //arr 是相邻区域
                    if(me.regions.length){
                        let item = me.regions.find(val=>val.id==arr.id)
                        if(item){
                            setTimeout(()=>{me.toggles1(item.sensors)},1)
                        }
                    }
                } else {
                    me.$message.error(res.data.msg)
                }
            })
        },
        // 勾选中的传感器
        toggles1(rows){
            this.sensorList.forEach(row => {
                for(let i=0;i<rows.length;i++){
                    if(rows[i].id==row.id){
                        this.$refs.sensorTable.toggleRowSelection(row);
                    }
                }
            })
        },
        mustSelect(arr){
            this.mustList = []
            arr.forEach((row)=>{
                if(row.attrib_name==null&&row.name!=null){
                    row['text'] = "必配项"
                    this.mustList.push(row)
                }
            })
            this.senPosList = arr
        },
        getadArea(){
            let me = this
            //相邻区域
            api.gas.getWatchArea().then(function(res) {
                if (res.data.status === 0) {
                    me.dataList = res.data.data
                    me.areaList = me.dataList
                    me.senChecked(me.formInline.id)
                } else {
                    me.$message.error(res.data.msg)
                }
            })
        },
        //本区域的相邻区域
        senChecked(id){
            if(id){
                for(var i=0;i<this.dataList.length;i++){
                    if(this.dataList[i].id == id){
                        this.regions = this.dataList[i].areas
                    }
                }
            }
        },
        getSensorPos(){
            let me = this,
                data = {
                   area_id: me.formInline.id,
                   area_type_id:me.formInline.area_type_id
                }
            //配置传感器表格
            api.routeLine.getPosSensor(data).then(function(res) {
                if (res.data.status === 0) {
                    if(res.data.data1){
                        me.mustSelect(res.data.data1.list)
                    }
                } else {
                    me.$message.error(res.data.msg)
                }
            })
        },
        initArea(){
            let me = this
            // 区域类型
            api.routeLine.getAreatype({type_id:0,area_type_id:0}).then(function(res) {
                if (res.data.status === 0) {
                    me.areaTypeList = res.data.data
                } else {
                    me.$message.error(res.data.msg)
                }
            })
        },
        setSensor(row){
            this.showtext = "配置区域传感器"
            this.SenItem.area_pos = row.name
            this.SenItem.area_pos_id = row.area_pos_id
            this.SenItem.area_id = this.formInline.id
            this.arrList = {
                uid:row.uid,
                alais:row.alais,
                position:row.position,
                type:row.sensor_type
            }
            this.isArea = true
        },
        clickChecked(row){
            if(row.is_area_alarm ==1){
                row.is_area_alarm = 0
            }else{
                row.is_area_alarm =1
            }
        },
        changeAreatype(){
            this.getSensorPos()
        }
    },
    mounted () {
        this.initArea()
        this.getadArea()
        this.fetchData()
        this.getSensorPos()
    }
};
</script>
