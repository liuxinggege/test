<style lang="less">
   @import '../styles/common.less';
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
    <el-form :model="formItem" label-width="100px" :rules="ruleInline" ref="formItem">
        <fieldset class="ipparse">
            <legend class="legend">基本信息</legend>
            <el-form-item label="选择分类" v-if="$route.name!='watching-index/wind'">
                <el-select v-model="formItem.drainageId" size="small">
                    <el-option v-for="item in menuData" :value="item.id + 0" :key="item.id" :label="item.type" :disabled="formItem.sensor_type==69"></el-option>
                </el-select>
            </el-form-item>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="分站" prop="station">
                        <el-select v-model="formItem.station" size="small">
                            <el-option v-for="item in stationList" :value="item.id" :key="item.ipaddr" :label="item.station_name + ':' +item.ipaddr"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="传感器ID" prop="sensorId">
                        <el-input-number v-model="formItem.sensorId" :max="255" :min="1" size="small"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" v-if="$route.name!='Dsystem'&&$route.name!='watching-index/wind'">
                <el-col :span="12">
                    <el-form-item label="X坐标"  prop="x_point">
                        <el-input size="small" v-model="formItem.x_point" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Y坐标" prop="y_point">
                        <el-input size="small" v-model="formItem.y_point" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" v-if="$route.name==='Dsystem'">
                <el-col :span="12">
                    <el-form-item label="X坐标"  prop="x3_point">
                        <el-input size="small" v-model="formItem.x3_point" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Y坐标" prop="y3_point">
                        <el-input size="small" v-model="formItem.y3_point" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" v-if="$route.name==='watching-index/wind'">
                <el-col :span="12">
                    <el-form-item label="X坐标"  prop="x2_point">
                        <el-input size="small" v-model="formItem.x2_point" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Y坐标" prop="y2_point">
                       <el-input size="small" v-model="formItem.y2_point" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="设备类型" prop="sensor_type">
                        <el-select size="small" v-model="formItem.sensor_type" @change="chooseType" :disabled="!!formItem.id">
                            <el-option v-for="item in AllTypeList" :value="item.id" :key="item.id" :label="item.v"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="formItem.sensor_type!=69">
                    <el-form-item label="单位：" prop="sensorUnit">
                        <span v-if="formItem.sensor_type!=69">{{formItem.sensorUnit}}</span>
                        <span v-else></span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="安装位置" prop="position">
                <el-select size="mini" v-model="formItem.position"  default-first-option filterable allow-create style="width:100%;">
                    <el-option
                        v-for="item in AllPositionList"
                        :key="item.id"
                        :label="item.v"
                        :value="item.v">
                    </el-option>
                </el-select>
            </el-form-item>
        </fieldset>
        <fieldset class="ipparse">
            <legend class="legend">关联设备</legend>
            <el-col :span="12">
                <el-form-item label="一氧化碳设备" >
                    <el-select clearable v-model="formItem.coId" size="small">
                        <el-option v-for="item in coData" :value="item.id + 0" :label="item.alais + item.type + '(' + item.position + ')'"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="甲烷设备" >
                    <el-select clearable v-model="formItem.methaneId" size="small">
                        <el-option v-for="item in chData" :value="item.id + 0" :label="item.alais + item.type + '(' + item.position + ')'"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </fieldset>
        <el-form-item style="text-align:right;">
            <el-button size="small" @click="backup('formItem')">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit('formItem')" :loading="isloding" icon="el-icon-message" style="margin-right:15px;">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import api from 'src/api'
import store from 'src/store'

export default {
    props: ["formItem","isloding",'gas'],
    watch:{
        'AllTypeList': {
            handler: function(val) {
                if(this.formItem.id&&this.formItem.sensor_type) {
                  this.chooseType(this.formItem.sensor_type)}
            },
            deep: true
        }
    },
    data () {
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
                state:store.state,
                action:store.actions,
                name:"",
                loading:false,
                menuData:[],
                coData:[],
                chData:[],
                ruleInline:{
                    station:{required: true, message: '不能为空', trigger: 'change' },
                    position:{required: true, message: '不能为空', trigger: 'change' },
                    x_point:{validator:validateNumber, trigger: 'blur'},
                    y_point:{validator:validateNumber, trigger: 'blur'},
                    x2_point:{validator:validateNumber, trigger: 'blur'},
                    y2_point:{validator:validateNumber, trigger: 'blur'},
                    x3_point:{validator:validateNumber, trigger: 'blur'},
                    y3_point:{validator:validateNumber, trigger: 'blur'}
                },
        }
    },
    methods: {
        //选择设备类型
        chooseType(id){
            if(id==69){
                this.formItem.drainageId = 20
            }else{
                for(let ob of this.AllTypeList){
                    if(ob.id===id){
                        this.formItem.sensorUnit = ob.k
                        break;
                    }
                }
            }
        },
        //设置报警等级
        backup(name){
            this.$refs[name].resetFields();
            this.$emit("backup")
        },
        // 修改
        handleSubmit(name) {
            if(this.formItem.methaneId == ''){
                this.formItem.methaneId = 0
            }
            if(this.formItem.coId == ''){
                this.formItem.coId = 0
            }
            this.$emit("saveUpdate",this.formItem)
        },
        // 获取分类
        fefreshMenu(){
            var vm = this
            api.searchs.dataDrain().then((res)=>{
                if(res.data.status===0){
                    vm.menuData = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        // 获得一氧化碳设备
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
        // 获得甲烷设备
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
        },
    },
    mounted () {
        this.fefreshMenu()
        this.getCh()
        this.getCo()
        this.$store.dispatch("getFacilityMsg");
        this.$store.dispatch("getStation");
    },
    computed: {
        AllTypeList() {
            return this.$store.state.AllTypeList;
        },
        AllPositionList(){
            return this.$store.state.AllPositionList;
        },
        stationList(){
            return this.$store.state.AllStation;
        },
    },
};
</script>
