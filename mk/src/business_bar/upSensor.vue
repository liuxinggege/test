<style lang="less">
    .ipparse {
        padding: 8px;
        margin: 8px;
        border: 1px solid #E5E9F2;
        border-radius: 3px;
        font-size: 8px;
    }
    .legend{
        font-weight: bold;
        font-size: 13px;
    }
</style>
<template>
 <div style="max-height:650px;overflow-y: auto;">
    <el-form :model="sensorForm" label-width="150px" :rules="ruleInline" ref="sensorForm" style="text-align:left;"  v-loading="loading" :element-loading-text="showText">
    	<fieldset class="ipparse" v-if="$route.name==='Dsystem'||$route.name==='drainage-index/sample'">
            <el-row>
                <el-col ::span="12">
                    <el-form-item label="选择分类" style="margin-left: -40px">
                        <el-select v-model="sensorForm.drainageId" size="small">
                            <el-option v-for="item in menuData" :value="item.id + 0" :key="item.id" :label="item.type" :disabled="sensorForm.sensor_type==69"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>  
        </fieldset>
        <fieldset class="ipparse">
            <legend class="legend">基本信息</legend>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="分站" prop="station">
                        <el-select v-model="sensorForm.station" size="small" filterable>
                            <el-option v-for="item in stationList" :value="item.id" :key="item.ipaddr" :label="item.station_name + ':' + item.ipaddr">{{item.station_name}}:{{item.ipaddr}}</el-option>
                        </el-select>
                    </el-form-item>  
                </el-col>
                <el-col :span="12">
                    <el-form-item label="传感器ID" prop="sensorId">
                        <el-input-number v-model="sensorForm.sensorId" :max="255" :min="1" size="small"></el-input-number>
                    </el-form-item>   
                </el-col>    
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="设备类型" prop="sensor_type">
                        <el-select v-model="sensorForm.sensor_type"  size="small" @change="chooseType" :disabled="!!sensorForm.id" filterable>
                            <el-option v-for="item in AllTypeList" :value="item.id" :key="item.v" :label="item.v"></el-option>
                        </el-select> 
                    </el-form-item>
                </el-col>
                <el-col :span="6">    
                    <el-form-item label="单位：" prop="sensorUnit">
                        <span v-if="sensorForm.sensor_type!=69">{{sensorForm.sensorUnit}}</span>
                        <span v-else></span>
                    </el-form-item>
                </el-col>
            </el-row> 
            <el-row type="flex" v-if="$route.name!='Dsystem'&&$route.name!='watching-index/wind'">
             	<el-col :span="12">
             		<el-form-item label="X坐标"  prop="x_point">
				        <el-input  v-model="sensorForm.x_point" size="small"></el-input>
					</el-form-item>
             	</el-col>
             	<el-col :span="12">
             		<el-form-item label="Y坐标" prop="y_point">
					    <el-input  v-model="sensorForm.y_point" size="small"></el-input>
				    </el-form-item>
             	</el-col>
             </el-row>
             <el-row type="flex" v-if="$route.name==='Dsystem'">
             	<el-col :span="12">
             		<el-form-item label="X坐标"  prop="x3_point">
						<el-input  v-model="sensorForm.x3_point" size="small"></el-input>
					</el-form-item>
             	</el-col>
             	<el-col :span="12">
             		<el-form-item label="Y坐标" prop="y3_point">
					 <el-input  v-model="sensorForm.y3_point" size="small"></el-input>
				</el-form-item>
             	</el-col>
             </el-row>
             <el-row type="flex" v-if="$route.name==='watching-index/wind'">
             	<el-col :span="12">
             		<el-form-item label="X坐标"  prop="x2_point">
						<el-input  v-model="sensorForm.x2_point" size="small"></el-input>
					</el-form-item>
             	</el-col>
             	<el-col :span="12">
             		<el-form-item label="Y坐标" prop="y2_point">
				        <el-input  v-model="sensorForm.y2_point" size="small"></el-input>
				    </el-form-item>
             	</el-col>
             </el-row>
             <el-row type="flex">
             	<el-col :span="24">
                   <el-form-item label="安装位置" prop="position">
                        <el-select size="small" v-model="sensorForm.position" filterable allow-create  default-first-option style="width:100%;">
                           <el-option
                            v-for="item in AllPositionList"
                            :key="item.id"
                            :label="item.v"
                            :value="item.v">{{item.v}}
                          </el-option>
                        </el-select> 
                    </el-form-item>   
                </el-col>
             </el-row>
             <el-row type="flex">
                  <el-col :span="12">
                	<el-form-item label="位置类型" prop="position_type_id" v-if="sensorForm.sensor_type != 69">
                		<el-select size="small" v-model="sensorForm.position_type_id" @change="getalarmInfo" style="width:100%;" clearable filterable>
                            <el-option
                                v-for="item in $store.state.posTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">{{item.name}}
                            </el-option>
                      </el-select>
                	</el-form-item>
                </el-col>
                <el-col :span="12">
                	<el-form-item label="区域/设施" prop="area_id" v-if="sensorForm.sensor_type != 69">
                		<el-select size="small" v-model="sensorForm.area_id" style="width:100%;" clearable filterable>
                            <el-option
                                v-for="item in $store.state.watchAreaList"
                                :key="item.id"
                                :label="item.areaname"
                                :value="item.id">{{item.areaname}}
                            </el-option>
                      </el-select>
                	</el-form-item>
                </el-col>
             </el-row>
             <el-row type="flex" v-if="sensorForm.sensor_type == 48">
              <el-col :span="12">
                   <el-form-item label="常态（正向风）" prop="direction">
                        <el-select size="small" v-model="sensorForm.direction" style="width:100%;">
                            <el-option
                                v-for="item in dirList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">{{item.label}}
                            </el-option>
                        </el-select> 
                    </el-form-item>   
                </el-col>
             </el-row>
        </fieldset>
        <fieldset class="ipparse" v-if="showGd5 && sensorForm.sensor_type">
             <legend class="legend">
                 标校期与值变化
             </legend>  
                 <el-row v-if="showGd5" type="flex" justify="space-between" class="code-el-row-bg" :gutter="24">
                    <el-col :span="12">                                       
                        <el-form-item label="上次标校日期">
                            <el-date-picker type="date" v-model="sensorForm.calibration" value-format="yyyy-MM-dd" style="width:100%;" size="small"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标校周期(天)">
                            <el-input-number v-model="sensorForm.period" :min="0" :max="365" size="small"></el-input-number>
                        </el-form-item>
                    </el-col>
               </el-row>
               <el-row type="flex" justify="space-between" class="code-el-row-bg" :gutter="24">
                   <el-col :span="12">
                        <el-form-item label="值突变幅度">
                            <el-input v-model="sensorForm.fluctuation_range" style="width:100%;" size="small"></el-input>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="12">
                        <el-form-item label="值突变时间(秒)">
                            <el-input-number v-model="sensorForm.middle_rang"  :min="0"  size="small"></el-input-number>
                        </el-form-item>
                    </el-col>  
              </el-row>
              <el-row type="flex" justify="space-between" class="code-el-row-bg" :gutter="24">
                   <el-col :span="12">
                        <el-form-item label="值持续升高幅度">
                            <el-input v-model="sensorForm.continuous_change" style="width:100%;" size="small"></el-input>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="12">
                        <el-form-item label="值持续升高时间(秒)">
                            <el-input-number v-model="sensorForm.change_time" :min="0" size="small"></el-input-number>
                        </el-form-item>
                    </el-col>  
              </el-row>
        </fieldset> 
       <fieldset class="ipparse" v-if="showGd5 && sensorForm.sensor_type" v-loading="loading" :element-loading-text="showText">
            <legend class="legend">
              运行参数
                <span style="padding:0 10px;" v-if="$route.query.type!='scan'&&$route.query.type!='route-scan'&&$route.query.type!='watching-scan'&&$route.query.type!='voice-scan'">
                    <el-button size="mini" type="primary" plain  @click="checkinfo">读取设备运行参数</el-button>
                    <el-button size="mini" type="primary" plain  @click="writeIn()">写入设备运行参数</el-button>
                    <el-button size="mini" type="primary" plain  @click="handleLink">设置联动设备</el-button> 
                </span> 
            </legend>   
            <alarm-level-bar  ref="alarmlevelbar" :alarmInfo="alarmInfo" :alarmLevel="alarmLevel" :hasfloor="hasfloor"></alarm-level-bar>  
            <div v-if="setLink">
                <el-dialog  :visible.sync="setLink"  width="800px" title="设置关联设备" :append-to-body="true" :close-on-click-modal="false">
                   <link-bar :sensorList="sensorList" @savelink="savelink" :areasensorList="sensorForm.areasensorList||[]"></link-bar>     
                </el-dialog>
            </div>    
        </fieldset>
        <!-- 瓦斯抽放  -->
        <fieldset class="ipparse" v-if="!showGd5">
            <legend class="legend">关联设备</legend> 
                <el-col :span="12">
                    <el-form-item label="一氧化碳设备">
                        <el-select clearable v-model="sensorForm.coId" filterable size="small">
                            <el-option v-for="item in coData" :value="item.id" :label="item.alais + item.type + '(' + item.position + ')'"></el-option>
                        </el-select>
                    </el-form-item>  
                </el-col>
                <el-col :span="12">
                        <el-form-item label="甲烷设备">
                            <el-select clearable v-model="sensorForm.methaneId" filterable size="small">
                                <el-option v-for="item in chData" :value="item.id" :label="item.alais + item.type + '(' + item.position + ')'"></el-option>
                            </el-select>
                        </el-form-item>  
                </el-col>
        </fieldset>                                                                      
        <el-form-item style="text-align:right;" v-if="$route.query.type!='scan'&&$route.query.type!='demo'&&$route.query.type!='route-scan'&&$route.query.type!='watching-scan'&&$route.query.type!='voice-scan'">
        	  <el-button  @click="backup('sensorForm')" size="small">取消</el-button>
              <el-button type="primary" @click="handleSubmit('sensorForm')" :loading="isloding" icon="el-icon-message" style="margin-right:15px;" size="small">保存</el-button>
        </el-form-item>      
	</el-form>
 </div>
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import linkBar from './linkBar.vue'
import alarmLevelBar from './alarmLevelBar.vue'
export default {
    components: {
        linkBar,
        alarmLevelBar
    },
    props: ["formItem","isanalog","isloding"],
    data () {
        const isNull = (rule, value, callback) => {
            if (!value) {
                callback(new Error('不能为空！'));
            }else{
                callback()
            }
        }; 
        const validateNumber = (rule, value, callback) => {
            var re=/^-?\d+(\.{1}\d+)?$/;
            if (value === '') {
                callback(new Error('不能为空！'));
            }
            else if(!re.test(value)){ 
                callback(new Error('请输入数字！')); 
            }else{
                callback()
            }
        };
    	return { 
            state: store.state,
            action:store.actions,
            sensorForm:{},
            startTimes:0,
            showText:'',
            loading:false,
            timeout:'',
            sensorList:[],
            posTypeList:[],
            AllTypeList:[],
            setLink:false,
            ruleInline: {
                    position:{validator:isNull, trigger: 'change' },    
                    station: {validator:isNull, trigger: 'change' },   
                    sensor_type: {validator:isNull, trigger: 'change' },   
                    sensorId:{validator:validateNumber, trigger: 'change'},
                    x_point: {validator:validateNumber, trigger: 'blur'},
                    y_point: {validator:validateNumber, trigger: 'blur'},
                    x2_point:{validator:validateNumber, trigger: 'blur'},
                    y2_point:{validator:validateNumber, trigger: 'blur'},
                    x3_point:{validator:validateNumber, trigger: 'blur'},
                    y3_point:{validator:validateNumber, trigger: 'blur'}
            },
            hasfloor:0,
            //    分级报警
            alarmLevel:{
                upper_level1:'',  
                upper_level2:'',  
                upper_level3:'',  
                upper_level4:'',  
                floor_level1:'',  
                floor_level2:'',  
                floor_level3:'',  
                floor_level4:'',
                upgrade1:10,
                upgrade2:10,
                upgrade3:10,
                floor_repower:'',
                limit_repower:'',
                limit_power:'',
                limit_alarm:'',
                floor_power:'',
                floor_alarm:''
            },
            alarmInfo:'',
            showGd5:true,
            menus:[],
            menuProps:{
                value:'id',
                label:'type',
                children:'children'
            },
            menuData:[],
            coData:[],
            chData:[],
            dirList:[{
                value: 1,
                label: '正数'
            }, {
                value: -1,
                label: '负数'
            }]
    	}
    },
    computed: {        	
        AllPositionList(){
            return this.$store.state.AllPositionList;
        },
        stationList(){
            return this.$store.state.AllStation;
        }
    },
    created(){
        this.$store.dispatch("getFacilityMsg");
        this.$store.dispatch("getStation");
        this.$store.dispatch("getAllArea");
        if(this.formItem.id){
            api.gas.getOneSensor(this.formItem.id).then(res => {
                if(res.data.status == 0){
                    this.sensorForm = res.data.data;
                    this.init();  
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        }else{
            this.sensorForm = this.formItem;
            this.init();
        }  
    },
    methods: { 
        init(){
            if(this.sensorForm.id&&this.sensorForm.sensor_type!=69&&this.sensorForm.position_type_id){
                this.getalarmInfo(this.sensorForm.position_type_id);
            }
            this.getAllType();
            this.getCh();
            this.getCo();
            this.fefreshMenu();
            this.action.initLevelValue(this.sensorForm,this.alarmLevel);   
            this.sensorList = this.sensorForm.sensorList && this.sensorForm.sensorList.length ? this.sensorForm.sensorList : [];
        },
       //保存提交
        handleSubmit(name) { 
            this.$refs[name].validate((valid) => {
                if (valid) {     
                    this.writeIn(() => {      								    
                        if(!this.sensorForm.drainageId){  //  不是瓦斯抽放模块
                            let result = this.$refs.alarmlevelbar.getAlarmLevel();
                            if(typeof result === 'string'){
                                return this.$message.error('保存失败！' + result)
                            }else if(typeof result === 'object'){
                                for(let key in result){
                                    this.sensorForm[key] = result[key];
                                }
                            }
                            this.sensorForm.sensorList = this.sensorList
                        }
                        if(this.sensorForm.methaneId == ''){
                            this.sensorForm.methaneId = 0
                        }
                        if(this.sensorForm.coId == ''){
                            this.sensorForm.coId = 0
                        }
                        this.deletefield();
                        this.sensorForm.hasfloor = this.hasfloor;
                        this.$emit("saveUpdate",this.sensorForm,this.isanalog)  
                    })
                }else{
                    this.$message.error('保存失败！');
                }
            })   
        },
        //取消关闭
        backup(name){
            clearTimeout(this.timeout);
            this.$refs[name].resetFields();
            this.$emit("backup") 
        },
        //值范围设定提示
        getalarmInfo(val){
            let item = this.$store.state.posTypeList.find(m => val === m.id);
            if(item){
                this.alarmInfo = `${item.name}：${item.valueText}`;
            }else{
                this.alarmInfo = '';
            }   
        },
        //选择设备类型
        chooseType(id){
            if(id==69){
                this.showGd5 = false;
                this.sensorForm.drainageId = 20;
            }else{
                this.showGd5 = true 
                for(let ob of this.AllTypeList){
                    if(ob.id===id){
                        this.sensorForm.sensorUnit = ob.k;
                        this.hasfloor = ob.hasfloor;
                        break;
                    }
                }
                }
        },
        // 获取所有设备类型
        getAllType(){
            api.gas.getAllType().then(res => {
                this.AllTypeList = res.data.data;
                if(this.sensorForm.sensor_type){
                    this.chooseType(this.sensorForm.sensor_type)
                }
            })
        },
        //验证配置联动前是否配置了断电门限
        handleLink(){
            let result = this.$refs.alarmlevelbar.isSetCutValue();
            if(!result){
                return this.$message({message:'设置联动控制设备必须先配置断电门限和复电门限!' ,type: 'warning'});
            }
            this.setLink = true;
        },
        //保存联动控制修改
        savelink(row){
            if(row){
                this.sensorList = row
            }
            this.setLink = false
        },
        //写入
        writeIn(callback){
            if(callback && 69 == this.sensorForm.sensor_type){
                return callback();
            }
            let result = this.$refs.alarmlevelbar.getAlarmLevel();
            if(typeof result === 'string'){
                return this.$message.error('操作失败,' + result);
            }else if(typeof result === 'object'){
                for(let key in result){
                    this.sensorForm[key] = result[key];
                }
            }
            this.deletefield();
            let me = this;
            let ipaddr;   
            if(me.sensorForm.id){
                ipaddr = me.sensorForm.ipaddr;
            }else{
                var m = me.stationList.find(item => item.id == me.sensorForm.station);
                ipaddr = m?m.ipaddr:null;
            }
            var data = {
                sensorId:me.sensorForm.sensorId,
                sensor_type:me.sensorForm.sensor_type,
                ipaddr
            }
            me.loading = true;
            me.showText = '同步写入设备中...';
            me.startTimes = Date.now() + 10 * 1000;  
            api.gas.synSensor(this.sensorForm)
                .then((res)=>{
                    if(res.data.status==0){
                        api.switchs.getstatusImport2(data)
                            .then(getWrite)
                            .catch(err => {
                                me.loading = false;
                                me.$message.error("操作失败,服务器异常！");
                                callback && me.writeFailed(callback);
                            })
                    }else{
                        me.loading = false;
                        me.$message.error("操作失败," + res.data.msg) ;     
                        callback && me.writeFailed(callback);
                    }
                })
                .catch(err => {
                    me.loading = false;
                    me.$message.error("操作失败,服务器异常！");
                    callback && me.writeFailed(callback);
                })
            var getWrite = function(res){   
                if(Date.now() > me.startTimes){  //超时
                    me.loading = false;
                    me.startTimes = null ;
                    me.$message.warning("操作失败,同步写入设备超时！");
                    callback && me.writeFailed(callback);
                    return;
                }
                if(res.data.status==1){
                    me.loading = false;
                    me.startTimes = null;
                    me.$message.warning("操作失败," + res.data.msg);
                    callback && me.writeFailed(callback);
                    return;
                }
                if(res.data.status==0){
                    me.loading = false;
                    me.startTimes = null;
                    if(callback){
                        callback();
                        return;
                    }
                    me.$message.success("同步写入设备成功!");
                    return;
                }
                me.timeout = setTimeout(function () { 
                    api.switchs.getstatusImport2(data)
                        .then(getWrite)
                        .catch(err => {
                            me.loading = false;
                            me.$message.error("操作失败,服务器异常！");
                            callback && me.writeFailed(callback);
                        })
                }, 500)
            }
        },
        writeFailed(callback){
           this.$confirm("设备参数写入失败，是否强制保存到数据库。强制保存后可能会被系统自动同步为设备上的运行参数?", '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'info'})
            .then(() => {
                callback();
            }).catch(() => {
                this.$message({type: 'warning',message: '操作已取消'});
            });
        },
        //读取参数
        checkinfo(){
            var vm = this
            var ipaddr;   
            if(vm.sensorForm.id){
                ipaddr = vm.sensorForm.ipaddr;
            }else{
                var m = vm.stationList.find(item => item.id == vm.sensorForm.station);
                ipaddr = m?m.ipaddr:null;
            }
            var data = {
                sensorId:vm.sensorForm.sensorId,
                sensor_type:vm.sensorForm.sensor_type,
                ipaddr,
            }
            if(!data.ipaddr || !data.sensor_type){
                return  vm.$message.error("读取失败,分站或设备类型不存在!");
            }
            vm.loading = true;
            vm.showText = '读取中...';
            vm.startTimes = Date.now() + 10 * 1000;
            api.switchs.gettype(data)
                .then(function(res){
                    if(res.data.status==0){
                        api.switchs.getstatusImport(data)
                            .then(func)
                            .catch(err => {
                                me.loading = false;
                                me.$message.error("读取失败，服务器异常！");
                            })    
                    }else{
                        vm.loading = false;
                        vm.startTimes = null;
                        vm.$message.error('读取失败，'+ res.data.msg); 
                    }
                })
                .catch(err => {
                    vm.loading = false;
                    vm.$message.error("读取失败，服务器异常！");
                })
            var func = function (res) {
                if(Date.now() > vm.startTimes){ //超时
                    vm.loading = false;
                    vm.startTimes = null;
                    vm.$message.warning('读取超时！');
                    return;
                }
                if(!res.data.status){ //读取成功
                    vm.sensorForm.period = res.data.data.period;//标校周期
                    vm.action.initLevelValue(res.data.data,vm.alarmLevel);
                    vm.loading = false;
                    vm.startTimes = null;
                    vm.$message.success('读取成功！');
                    return;
                }
                if(res.data.status==1){
                    vm.loading = false;
                    vm.startTimes = null;
                    vm.$message.warning("读取失败，" + res.data.msg);
                    return;
                }
                setTimeout(() => {
                    api.switchs.getstatusImport(data)
                        .then(func)
                        .catch(err => {
                            me.loading = false;
                            me.$message.error("读取失败，服务器异常！");
                        }) 
                },500);
            }      
        },
        deletefield (){
            delete this.sensorForm._index
            delete this.sensorForm._rowKey
            delete this.sensorForm.valueText
            delete this.sensorForm.k
            delete this.sensorForm.now_status
            delete this.sensorForm.statusText
            delete this.sensorForm.now_value
            delete this.sensorForm.type0x
            delete this.sensorForm.debug
            delete this.sensorForm.feedstatusText
            delete this.sensorForm.feedbackText
            delete this.sensorForm.is_cutText
            delete this.sensorForm.max
            delete this.sensorForm.changing
            delete this.sensorForm.rescale
            delete this.sensorForm.level
            delete this.sensorForm.showColor
            delete this.sensorForm.boss
            delete this.sensorForm.key
            delete this.sensorForm.reverting
            delete this.sensorForm.__gohashid
            delete this.sensorForm.devid
            delete this.sensorForm.filltime
            delete this.sensorForm.co
            delete this.sensorForm.temperature
            delete this.sensorForm.pressure
            delete this.sensorForm.wasi
            delete this.sensorForm.flow_work
            delete this.sensorForm.total_flow_work
            delete this.sensorForm.flow_standard
            delete this.sensorForm.total_flow_standard
            delete this.sensorForm.flow_pure
            delete this.sensorForm.total_flow_pure
            delete this.sensorForm.alarm_drop
            delete this.sensorForm.alarm_status
            delete this.sensorForm.keywords
            delete this.sensorForm.avg
        },
        fefreshMenu(){
                var vm = this
                api.searchs.dataDrain().then((res)=>{
                    if(res.data.status===0){
          	            if(res.data.data&&res.data.data.length){
                            vm.menuData = res.data.data
                        }
                    }else{
                        vm.$message.error(res.data.msg)
                    }
                }) 
        },
        getCo(){
            var vm = this
            api.searchs.getAllcosensor().then((res)=>{
                if(res.data.status===0){
                        vm.coData = res.data.data.map(item => {
                                item.position = item.position?item.position:"未配置位置";
                                return item
                            })
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        getCh(){
            var vm = this
            api.searchs.getAllmethanesensor().then((res)=>{
                if(res.data.status===0){
                        vm.chData = res.data.data.map(item => {
                                item.position = item.position?item.position:"未配置位置";
                                return item
                            })
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        }
   },
};
</script>