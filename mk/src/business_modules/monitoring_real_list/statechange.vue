<style lang="less">
    
</style>
<template>
  <el-card>
    <p slot="header" >
        <span class="fa fa-exchange"> 开关量状态变动</span>
    </p>
    <el-table :data="state.showlist" border :render-header="renderHeader">
         <el-table-column v-for="item in columns" :prop="item.key" :label="item.title"  :render-header="renderHeader">
            <template scope="scope">
                <div v-if="scope.row[item.key] instanceof Array">
                    <div v-for="ol in scope.row[item.key]">
                        {{ol}}<br>
                    </div>
                </div>
                <div v-else>{{scope.row[item.key]!=null||scope.row[item.key]!=undefined ?scope.row[item.key]:'-'}}</div> 
            </template>
        </el-table-column> 
    </el-table>
    <my-pagination></my-pagination>
  </el-card>
</template>
<script>
    import api from 'src/api'
    import store from 'src/store'
    export default {
        data() {
            return {
                state:store.state,
                action:store.actions,
                columns:[
                    {title:'地点/名称/类型',key:'position'},
                    {title:'报警/断电状态',key:'alarmstatus'},
                    {title:'状态变动及时刻',key:'chageTime'},
                    {title:'报警/断电及时刻',key:'alarmStarttime'},
                    {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                ],
                list:[],
                rdata:{
                    uid:''
                },
                switchList:[],
                sqlday:'',
                inTervalId:''
                
            }
        },
        mounted() {
            this.switchList = Object.values(this.state.AllhashSensor).filter(item => item.pid === 25);
            this.sqlday = moment().format('YYYY-MM-DD');
            this.getAll();
            //自动刷新
            this.inTervalId = setInterval(() => {
                this.sqlday = moment().format('YYYY-MM-DD');
                this.getAll(); 
            },10000)
        },
        beforeDestroy: function (){
				 console.log("beforeDestroy");
				 window.clearInterval(this.inTervalId);
	    },
        methods: {
            hanleLookAll(){
                this.rdata.uid = '';
                this.getAll();
            },
            getAll(){
                const me = this;
                api.gas.getStateChange(me.rdata,me.sqlday).then((res) => {
                    console.log(res,'result')
                    if(res.data.status === 0){
                        me.list = res.data.data;
                        me.action.setShowList(me.list)
                    }else{
                        me.$message(res.data.msg)
                    }
                })
            },
            renderHeader(h,{column}){
                 let list = column.label.split('-')
                 return list.map(item => h('p',{class:'table-head',style:{width:'100%',fontSize:'14px'}},item))
           },
        },
        watch: {
            'state.listinfo' : {
                  handler: function (newValue, oldValue) {
                    this.action.setShowList(this.list)
                  },
                  deep: true
           },
        },
        computed: {},
        props:{}
    };

</script>