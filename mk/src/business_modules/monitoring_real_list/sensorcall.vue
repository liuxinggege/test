<style lang="less">
/*    @import '../../styles/common.less';*/

</style>
<template>
<el-card>
    <p slot="header" >
        <span class="fa fa-recycle"> {{static.title}}</span>
        <el-radio-group v-model="formInline.mark" @change="changeType" style="margin-left:50px;">
            <el-radio :label="1">模拟量</el-radio>
            <el-radio :label="2">开关量</el-radio>
        </el-radio-group>
    </p>
    <el-form ref="formInline" :model="formInline" inline label-position="right" >
            <el-form-item label="选择测点">
                <el-select
                    v-model="ids"
                    multiple
                    collapse-tags
                    filterable
                    @visible-change="choosePrints"
                    @change="changechoose"
                    style="width: 200px;"
                    size="small">
                    <el-option
                        v-for="item in static.sensorlist"
                        :key="item.id"
                        :label="item.alais"
                        :value="item.id">
                        {{item.alais+'/'+item.type+'/'+item.position}}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区域">
                <el-select v-model="formInline.areaId"  @visible-change="chooseArea" style="width: 150px;" size="small" filterable>
                    <el-option v-for="item in arealist" :key="item.areaname" :label="item.areaname" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="位置">
                <el-select v-model="formInline.positionId"  @visible-change="choosePosition" style="width: 150px;" size="small" filterable>
                    <el-option v-for="item in positionlist" :key="item.v" :label="item.v" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-button size="small" type="primary" @click="searchAll" style="margin-left:10px" icon="el-icon-search">查看所有{{formInline.mark==1?'模拟量':'开关量'}}</el-button>
                <el-button size="small" type="primary" @click="$router.go(-1)" style="margin-left:10px" icon="el-icon-arrow-left">返回</el-button>
            </el-form-item>
    </el-form>
    <call-tabel :columns="formInline.mark==1?sensorCallHead:switchCallHead" :mark="formInline.mark" :callData="dataList" @refresh="getData"></call-tabel>
</el-card>
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import moment from 'moment'
    import store from 'src/store'
    import callTabel from "../../business_bar/callTabel.vue"

    export default {
     components: {
            callTabel,
     },
     data() {
        return {
            rdata:{},
            state:store.state,
            action: store.actions,
            static:{
                title:'模拟量调用',
                sensorlist:[],
            },
            ids:[],
            formInline:{
                mark:1
            },
            dataList:[],
            analog:[],
            switchList:[],
            arealist:[],
            positionlist:[],
            showData:false,
            sensorCallHead:[],
            switchCallHead:[],
        }
    },
     watch: {},
     created() {},
     mounted() {
     	this.getAll()
        this.getInfo()
        if(this.$route.query.type==1){
        	this.formInline.mark = 1
        }else if(this.$route.query.type==2){
        	this.formInline.mark = 2
        }else{
        	this.formInline.mark = 1
        }
    },
    methods: {
        searchAll(){
            this.formInline.positionId = ''
            this.formInline.areaId = ''
            this.ids = []
            this.rdata = {mark:this.formInline.mark}
            this.getData()
        },
        changechoose(val){
                    this.formInline.positionId = ''
                    this.formInline.areaId = ''
                    this.rdata = {
                        mark:this.formInline.mark,
                    }
                    if(this.rdata.mark==1) this.rdata.sensorids = this.ids
                    if(this.rdata.mark==2) this.rdata.switchids = this.ids
                    this.getData()
        },
        choosePrints(val){
            if(!val&&this.ids.length){
                    this.formInline.positionId = ''
                    this.formInline.areaId = ''
                    this.rdata = {
                        mark:this.formInline.mark,
                    }
                    if(this.rdata.mark==1) this.rdata.sensorids = this.ids
                    if(this.rdata.mark==2) this.rdata.switchids = this.ids
                    this.getData()
            }
        },
        chooseArea(val){
            if(!val && this.formInline.areaId){
                this.formInline.positionId = ''
                this.ids = []
                this.rdata = {
                    mark:this.formInline.mark,
                    areaId:this.formInline.areaId
                }
                this.getData()
            }
        },
        choosePosition(val){
             if(!val && this.formInline.positionId){
                this.formInline.areaId = ''
                this.ids = []
                this.rdata = {
                    mark:this.formInline.mark,
                    positionId:this.formInline.positionId
                }
                this.getData()
             }
        },
        changeType(val){
        	console.log(val==1)
        	this.ids = this.$route.query.id?[parseInt(this.$route.query.id)]:[]
            if(val == 1){
               this.static.title= '模拟量调用'
               this.static.sensorlist = this.analog
               this.rdata.sensorids = this.ids
            }else if(val==2){
               this.static.title= '开关量调用'
               this.static.sensorlist = this.switchList
               this.rdata.switchids = this.ids
            }
            this.rdata.mark = this.formInline.mark
            this.rdata.positionId = this.formInline.positionId || ''
            this.rdata.areaId = this.formInline.areaId || ''
            this.getData()
        },
        getData(){
            let me = this
            me.showData = false
            api.gas.getAnalogCall(me.rdata).then(function(res){
                console.log(res,'result')
                me.dataList = res.data.data
                me.showData = true
            })
        },
       getInfo(){
        		var vm = this
                 api.user.editorGetAll().then((res) => {
                 	    console.log(res)
                        res.data.data.forEach(item => {
                            if(item.type=='sensorCall'){
                                vm.sensorCallHead = item.list
                            }else if(item.type=='switchCall'){
                                vm.switchCallHead = item.list
                            }
                        })
        		})
                api.gas.getAllPosition().then(function(res){
                    if (res.data.status === 0) {
                        vm.positionlist = res.data.data
                    }else {
                        vm.$message.error(res.data.msg)
                    }
                })
                 api.gas.getWatchArea().then(function(res) {
                    if (res.data.status === 0) {
                        vm.arealist = res.data.data
                    }else {
                        vm.$message.error(res.data.msg)
                    }
                })
        },
        getAll(){
            const me = this
            api.station.getOwnList({}).then((res) => {
            	console.log(res)
                me.analog = res.data.data.list3
                me.switchList = res.data.data.list2
                if(!me.$route.query.type){
                   me.changeType(1)
                }else{
                	me.changeType(me.$route.query.type)
                }
            })
        },
    },
};

</script>
