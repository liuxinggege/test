<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <el-card>
        <p slot="header">
            <span class="fa fa-random"> 风瓦电闭锁</span>
        </p>
        <div v-if="!model">
            <el-button size="small" type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="addup(-1)">新增闭锁控制</el-button>
            <el-table :data="linkList" border>
                <el-table-column prop="name" label="联动名"></el-table-column>
                <el-table-column prop="alarm" label="报警描述"></el-table-column>
                <el-table-column label="操作" width="120">
                      <template scope="scope">
                         <el-button size="mini" type="text" @click="delLink(scope.row)">删除</el-button>
                         <el-button size="mini" type="text" @click="addup(scope.row)">修改</el-button>
                     </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else>
            <el-form ref="formInline" :model="formInline" :rules="ruleInline" :inline="true" label-width="130px">
                <el-row>
                    <el-col :span="15">
                        <fieldset class="ipparse">
                            <legend class="legend">基本信息</legend>
                            <el-form-item label="闭锁名称" prop="name">
                                <el-input size="small" v-model="formInline.name" clearable style="width: 365px;"></el-input>
                            </el-form-item>
                        </fieldset>
                    </el-col>
                    <el-col :span="9">
                        <fieldset class="ipparse">
                            <legend class="legend">报警信息</legend>
                            <el-form-item label="报警信息" prop="alarm">
                                <el-input size="small" v-model="formInline.alarm" type="textarea" :autosize="{minRows: 1}" style="width:500px;"></el-input>
                            </el-form-item>
                        </fieldset>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <fieldset class="ipparse">
                            <legend class="legend">监测设备</legend>
                            <el-row type="flex" justify="space-around">
                                <el-form-item label="掘进面甲烷/A1">
                                    <el-select v-model="a1" filterable clearable value-key="alais" @change="chooseType(1)" size="small" style="width:300px;">
                                        <el-option v-for="item in analog" :value="item" :key="item.alais" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="报警联动控制值">
                                    <el-select class="selectstyle" style="margin-left: 10px" size="small" v-model="formInline.list[0].alarmvalue" filterable  allow-create  default-first-option placeholder="请选择配置参数或者输入值" clearable>
                                        <el-option
                                            v-for="item in analogconditionList1"
                                            :key="item.key"
                                            :disabled="item.value === '-'"
                                            :label="''+item.label+'('+item.value+')'"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="断电值">
                                    <el-select class="selectstyle" size="small" v-model="formInline.list[0].powervalue" filterable  allow-create  default-first-option placeholder="请选择配置参数或者输入值" clearable>
                                        <el-option
                                            v-for="item in analogconditionList1"
                                            :key="item.key"
                                            :disabled="item.value === '-'"
                                            :label="''+item.label+'('+item.value+')'"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex">
                                <el-form-item label="回风流甲烷/A2">
                                    <el-select v-model="a2" clearable filterable value-key="alais" @change="chooseType(2)" size="small" style="width:300px;">
                                        <el-option v-for="item in analog" :value="item" :key="item.alais" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="报警联动控制值">
                                    <el-select class="selectstyle" style="margin-left: 10px" size="small" v-model="formInline.list[1].alarmvalue" filterable  allow-create  default-first-option placeholder="请选择配置参数或者输入值" clearable>
                                        <el-option
                                            v-for="item in analogconditionList2"
                                            :key="item.key"
                                            :disabled="item.value === '-'"
                                            :label="''+item.label+'('+item.value+')'"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="断电值">
                                    <el-select class="selectstyle" size="small" v-model="formInline.list[1].powervalue" filterable  allow-create  default-first-option placeholder="请选择配置参数或者输入值" clearable>
                                        <el-option
                                            v-for="item in analogconditionList2"
                                            :key="item.key"
                                            :disabled="item.value === '-'"
                                            :label="''+item.label+'('+item.value+')'"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex">
                                <el-form-item label="入风流甲烷/A3">
                                    <el-select v-model="a3" clearable filterable value-key="alais" @change="chooseType(3)" size="small"  style="width:300px;">
                                        <el-option v-for="item in analog" :value="item" :key="item.alais" :label="item.alais+'/'+item.type+ '/'+item.position"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="报警联动控制值">
                                    <el-select allow-create  default-first-option class="selectstyle" style="margin-left: 10px" size="small" v-model="formInline.list[2].alarmvalue" filterable   placeholder="请选择配置参数或者输入值" clearable>
                                        <el-option
                                            v-for="item in analogconditionList3"
                                            :key="item.key"
                                            :disabled="item.value === '-'"
                                            :label="''+item.label+'('+item.value+')'"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="断电值">
                                    <el-select allow-create  default-first-option class="selectstyle" size="small" v-model="formInline.list[2].powervalue" filterable  placeholder="请选择配置参数或者输入值" clearable>
                                        <el-option
                                            v-for="item in analogconditionList3"
                                            :key="item.key"
                                            :disabled="item.value === '-'"
                                            :label="''+item.label+'('+item.value+')'"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex">
                                <el-form-item label="通风机开停/D7">
                                    <el-select  v-model="b1" filterable @change="chooseMenu(1)" clearable style="width: 300px;" value-key="alais" size="small">
                                         <el-option v-for="item in switchB" :value="item" :key="item.alais" :label="item.alais+'('+item.position+ '-'+item.type+')'"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="断电值">
                                    <el-select allow-create  default-first-option class="selectstyle" size="small" v-model="formInline.list[3].powervalue" clearable>
                                        <el-option
                                            v-for="(item,key) in switchsReflex1"
                                            :disabled="key>1"
                                            :label="item+'('+key+')'"
                                            :value="key - 0">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex">
                                <el-form-item label="风筒风量开关/D8">
                                    <el-select  v-model="b2" filterable @change="chooseMenu(2)" clearable style="width: 300px;" value-key="alais" size="small">
                                         <el-option v-for="item in switchB" :value="item" :key="item.alais" :label="item.alais+'('+item.position+ '-'+item.type+')'"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="断电值">
                                    <el-select allow-create  default-first-option class="selectstyle" size="small" v-model="formInline.list[4].powervalue" clearable>
                                        <el-option
                                            v-for="(item,key) in switchsReflex2"
                                            :disabled="key>1"
                                            :label="item+'('+key+')'"
                                            :value="key - 0">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                        </fieldset>
                    </el-col>
                    <el-col :span="9">
                        <fieldset class="ipparse">
                            <legend class="legend">被控设备</legend>
                            <el-row>
                                <el-col :span="20">
                                <el-form-item label="掘进巷电源/C1">
                                    <el-cascader  v-model="c1" filterable size="mini" :options="switchs" @change="setAction(1)" clearable style="width:365px;">
                                    </el-cascader>
                                </el-form-item>
                                </el-col>
                                <el-col :span="20">
                                <el-form-item label="风机1/C2">
                                    <el-cascader  v-model="c2" filterable size="mini" :options="switchs" @change="setAction(2)" clearable style="width:365px;">
                                    </el-cascader>
                                </el-form-item>
                                </el-col>
                                <el-col :span="20">
                                <el-form-item label="供风区域电源/C3">
                                    <el-cascader  v-model="c3" filterable size="mini" :options="switchs" @change="setAction(3)" clearable style="width:365px;">
                                    </el-cascader>
                                </el-form-item>
                                </el-col>
                                <el-col :span="20">
                                <el-form-item label="被串掘进巷电源/C4">
                                    <el-cascader  v-model="c4" filterable size="mini" :options="switchs" @change="setAction(4)" clearable style="width:365px;">
                                    </el-cascader>
                                </el-form-item>
                                </el-col>
                                <el-col :span="20">
                                <el-form-item label="声光报警器/C5">
                                    <el-cascader  v-model="c5" filterable size="mini" :options="sgswitchs" @change="setAction(5)" clearable style="width:365px;">
                                    </el-cascader>
                                </el-form-item>
                                </el-col>
                                <el-col :span="20">
                                <el-form-item label="风机2/C6">
                                    <el-cascader  v-model="c6" filterable size="mini" :options="switchs" @change="setAction(6)" clearable style="width:365px;">
                                    </el-cascader>
                                </el-form-item>
                                </el-col>
                            </el-row>
                        </fieldset>
                    </el-col>
                </el-row>
                <el-row style="text-align: center;margin: 20px 0;">
                <el-form-item >
                    <el-button size="small" type="primary" icon="el-icon-message" @click="save('formInline')" style="margin-left:10px">保存配置</el-button>
                    <el-button size="small" @click="handleReset('formInline')" style="margin-left: 8px">取消</el-button>
                </el-form-item>
                </el-row>
            </el-form>
       </div>
    </el-card>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    export default {
        components: {
        },
        data() {
            return {
                test1:false,
                state:store.state,
                linkList:[],//联动列表
                formInline:{
                    name:'',
                    alarm:'',
                    areaId:0,
                    list:[
                    {serialnumber:'A1',uid:null,alarmvalue:0,powervalue:0,},
                    {serialnumber:'A2',uid:null,alarmvalue:0,powervalue:0,},
                    {serialnumber:'A3',uid:null,alarmvalue:0,powervalue:0,},
                    {serialnumber:'B1',uid:null,alarmvalue:0,powervalue:0,},
                    {serialnumber:'B2',uid:null,alarmvalue:0,powervalue:0,},
                    {serialnumber:'C1',uid:null,alarmvalue:0,powervalue:1,},
                    {serialnumber:'C2',uid:null,alarmvalue:0,powervalue:1,},
                    {serialnumber:'C3',uid:null,alarmvalue:0,powervalue:1,},
                    {serialnumber:'C4',uid:null,alarmvalue:0,powervalue:1,},
                    {serialnumber:'C5',uid:null,alarmvalue:0,powervalue:0,},
                    {serialnumber:'C6',uid:null,alarmvalue:0,powervalue:1,}]
                },
                analog:[],//A3列表
                switchList:[],//开关量设备列表
                switchB:[],//D7、D8列表
                area:[],
                switchs:[],//C1、C2、C3、C4、C6列表
                sgswitchs:[],//C5列表
                model:false,
                a1:{},
                a2:{},
                a3:{},
                b1:{},
                b2:{},
                c1:[],
                c2:[],
                c3:[],
                c4:[],
                c5:[],
                c6:[],
                analogconditionList1:[],
                analogconditionList2:[],
                analogconditionList3:[],
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
                switchsReflex1:{},
                switchsReflex2:{},
                ruleInline:{
                    name: {required: true, message: '不能为空', trigger: 'blur' },
                    alarm: {required: true, message: '不能为空', trigger: 'blur' },
                }
            }
        },
        watch: {
            '$route': 'fetchData',
        },
        methods: {
            addup(row){
                console.log(row)
                if(row == -1){//新增闭锁控制
                    this.a1={},
                    this.a2={},
                    this.a3={},
                    this.b1={},
                    this.b2={},
                    this.c1=[],
                    this.c2=[],
                    this.c3=[],
                    this.c4=[],
                    this.c5=[],
                    this.c6=[],
                    this.formInline = {
                        name:'',
                        alarm:'',
                        areaId:0,
                        list:[
                        {serialnumber:'A1',uid:null,alarmvalue:0,powervalue:0,},
                        {serialnumber:'A2',uid:null,alarmvalue:0,powervalue:0,},
                        {serialnumber:'A3',uid:null,alarmvalue:0,powervalue:0,},
                        {serialnumber:'B1',uid:null,alarmvalue:0,powervalue:0,},
                        {serialnumber:'B2',uid:null,alarmvalue:0,powervalue:0,},
                        {serialnumber:'C1',uid:null,alarmvalue:0,powervalue:1,},
                        {serialnumber:'C2',uid:null,alarmvalue:0,powervalue:1,},
                        {serialnumber:'C3',uid:null,alarmvalue:0,powervalue:1,},
                        {serialnumber:'C4',uid:null,alarmvalue:0,powervalue:1,},
                        {serialnumber:'C5',uid:null,alarmvalue:0,powervalue:0,},
                        {serialnumber:'C6',uid:null,alarmvalue:0,powervalue:1,}]}
                }else{//修改闭锁控制
                    this.formInline = row
                    _.forEach(row.list,(ob)=>{
                        if(ob.serialnumber == "A1"){
                            this.analog.forEach((obj)=>{
                                if(obj.uid == ob.uid){
                                    this.a1 = obj
                                    this.chooseType(1);
                                    this.analogconditionList1.forEach((item)=>{
                                        item.value = obj[item.key]
                                    })
                                }
                            })
                        }else if(ob.serialnumber == "A2"){
                            this.analog.map((obj)=>{
                                if(obj.uid == ob.uid){
                                    this.a2 = obj
                                    this.chooseType(2);
                                    this.analogconditionList2.forEach(item => {
                                        item.value = obj[item.key]
                                    })
                                }
                            })
                        }else if(ob.serialnumber == "A3"){
                            this.analog.map((obj)=>{
                                if(obj.uid == ob.uid){
                                    this.a3 = obj
                                    this.chooseType(3);
                                    this.analogconditionList3.forEach(item => {
                                        item.value = obj[item.key]
                                    })
                                }
                            })
                        }else if(ob.serialnumber == "B1"){
                            this.switchList.map((oc)=>{
                                if(oc.uid == ob.uid){
                                    this.b1 = oc
                                    this.switchsReflex1 = eval('(' + oc.type0x +')');
                                }
                            })
                        }else if(ob.serialnumber == "B2"){
                            this.switchList.map((oc)=>{
                                if(oc.uid == ob.uid){
                                    this.b2 = oc
                                    this.switchsReflex2 = eval('(' + oc.type0x +')');
                                }
                            })
                        }else if(ob.serialnumber == "C1"){
                            this.c1 = [ob.uid,ob.powervalue]
                        }else if(ob.serialnumber == "C2"){
                            this.c2 = [ob.uid,ob.powervalue]
                        }else if(ob.serialnumber == "C3"){
                            this.c3 = [ob.uid,ob.powervalue]
                        }else if(ob.serialnumber == "C4"){
                            this.c4 = [ob.uid,ob.powervalue]
                        }else if(ob.serialnumber == "C5"){
                            this.c5 = [ob.uid,ob.powervalue]
                        }else{
                            this.c6 = [ob.uid,ob.powervalue]
                        }
                    })
                }
                this.model = true
            },
            // 删除闭锁控制
            delLink(row){
                var me = this
                me.$confirm('是否删除该闭锁控制', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    api.analyze.delWindList(row.id).then((res) => {
                        if(res.data.status == 0){
                             me.$message({
                                type: 'success',
                                message: '操作成功，已经删除!'
                            })
                            me.getAll()
                        }else{
                            me.$message({
                                type: 'warning',
                                message: res.data.msg
                            });
                        }
                    })
                }).catch(() => {
                    me.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });
                });
            },
            // 保存闭锁控制
            save(name){
                this.$refs[name].validate(valid=>{
                    _.forEach(this.formInline.list,(ob)=>{
                        if(ob.uid == 'undefined'){
                           ob.uid = ''
                        }
                        if(ob.uid == ''){
                            ob.powervalue = 0
                            ob.alarmvalue = 0
                        }
                        if(ob.powervalue == undefined){
                           ob.powervalue = 0
                        }
                    })
                    var vm = this
                    api.analyze.postWindwatt(vm.formInline).then((res)=>{
                        if(res.data.status == 0){
                            vm.getAll()
                            vm.$message.success('保存成功！')
                            vm.model = false
                        }else{
                            vm.$message.error(res.data.msg)
                        }
                    })
                })
            },
            handleReset(){
                this.getAll()
                this.model = false
            },
            chooseType(row){
                let obj = {};
                if(row == 1){
                    obj = this.a1;
                }else if(row == 2){
                    obj = this.a2;
                }else{
                    obj = this.a3;
                }
                let list;
                let hasfloor = obj.hasfloor || 0;
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
                let analogconditionlist  = list.map(item => {
                        let value = obj[item.key] === 999999 ||obj[item.key] === -999999 || !obj[item.key]?'-':obj[item.key];
                        return {
                            label:item.label,
                            key:item.key,
                            value
                        }
                })
                if(row == 1){
                    this.analogconditionList1 = analogconditionlist;
                }else if(row == 2){
                    this.analogconditionList2 = analogconditionlist;
                }else{
                    this.analogconditionList3 = analogconditionlist;
                }
                this.formInline.list[row - 1].uid = obj.uid;
            },
            chooseMenu(row){
                if(row == 1){
                    this.switchsReflex1 = eval('(' + this.b1.type0x +')');
                    this.formInline.list[3].uid = this.b1.uid
                }else{
                    this.switchsReflex2 = eval('(' + this.b2.type0x +')');
                    this.formInline.list[4].uid = this.b2.uid
                }
            },
            setAction(row){
                switch(row){
                    case 1:
                    this.formInline.list[5].uid = this.c1[0]
                    this.formInline.list[5].powervalue = this.c1[1] || 1
                    break;
                    case 2:
                    this.formInline.list[6].uid = this.c2[0]
                    this.formInline.list[6].powervalue = this.c2[1]|| 1
                    break;
                    case 3:
                    this.formInline.list[7].uid = this.c3[0]
                    this.formInline.list[7].powervalue = this.c3[1]|| 1
                    break;
                    case 4:
                    this.formInline.list[8].uid = this.c4[0]
                    this.formInline.list[8].powervalue = this.c4[1]|| 1
                    break;
                    case 5:
                    this.formInline.list[9].uid = this.c5[0]
                    this.formInline.list[9].powervalue = this.c5[1]
                    break;
                    default:
                    this.formInline.list[10].uid = this.c6[0]
                    this.formInline.list[10].powervalue = this.c6[1]|| 1
                }
            },
            getAll(){
                var me = this
                me.sgswitchs = []
                me.switchs = []
                api.station.getOwnList({}).then((res) => {
                    console.log(res)
                    me.analog = res.data.data.list3.filter((ob)=>{
                        if(ob.sensor_type == 32||ob.sensor_type == 33||ob.sensor_type == 34||ob.sensor_type == 80){
                            return ob
                        }
                    })
                    me.switchList = res.data.data.list2
                    me.switchList.filter(item => {
                        if(item.sensor_type == 56 || item.sensor_type == 53){
                            item.value = item.uid
                            item.label = item.alais + '/' +item.type+'/'+item.position;
                            me.switchs.push(item)
                        }
                        if(item.sensor_type == 71){
                                item.value = item.uid
                                item.label = item.alais + '/' +item.type+'/'+item.position;
                                item.children = [{value:'0',label:'关闭'},{value:'1',label:'一级报警'},{value:'2',label:'二级报警'},{value:'3',label:'三级报警'},{value:'4',label:'四级报警'}]
                                me.sgswitchs.push(item)
                                me.switchs.push(item)
                        }
                    })
                    me.switchB = me.switchList.filter(oc => {
                        if(oc.sensor_type == 50||oc.sensor_type == 51||oc.sensor_type == 52){
                            return oc
                        }
                    })
                })
                api.gas.getWatchArea().then(function(res) {
                    if (res.data.status === 0) {
                        me.area = res.data.data
                    } else {
                        me.$message.error(res.data.msg)
                    }
                })
                api.analyze.getWindList().then((res)=>{
                    if(res.data.status == 0){
                        me.linkList = res.data.data
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
            },
        },
        mounted() {
            this.getAll()
        },
    };
</script>
