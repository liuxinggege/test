<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
        <p slot="header">
            <span class="fa fa-list"> 实时读卡器列表</span>
        </p>
        <el-row>
	        <el-col :span="4">
	    	    <el-tree :data="treeMenu" :props="defaultProps" @node-click="chooseMenu" :default-expand-all="true" :highlight-current="true" :render-content="renderContent"></el-tree>
		    </el-col>
		       <el-col :span="20">
                <el-table :data="carddata" border>
                    <el-table-column prop="addr" label="名称"></el-table-column>
                    <el-table-column prop="subname" label="网关"></el-table-column>
                    <el-table-column prop="cid" label="设备ID" sortable></el-table-column>
                    <el-table-column label="出入口">
                        <template scope="scope">
                            <el-tag size="mini" :type="scope.row.ctype ==1 ? 'danger' : 'success'" close-transition>{{scope.row.ctype ==1?'是':'否'}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="门禁口">
                        <template scope="scope">
                            <el-tag size="mini" :type="scope.row.is_exit ==1 ? 'danger' : 'success'" close-transition>{{scope.row.is_exit ==1?'是':'否'}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="position" label="安装位置"></el-table-column>
                    <el-table-column label="状态">
                        <template scope="scope">
                            <div :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level}">
                                <span>{{scope.row.statusText}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="值">
                        <template scope="scope">
                            <div :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level}">
                                <span>{{scope.row.now_value}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
		    </el-col>
	    </el-row>
    </el-card>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import _ from 'lodash'

    export default {
        data() {
            return {
                store:{},
                treeMenu:[],
                carddata: [],
                state: store.state,
                action: store.actions,
                id: '',
                allData:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        watch: {
            '$route': "fetchData",
            'state.connecTotal':'fetchData',
            'state.skIndex':'refresh'
        },
        methods: {
            fetchData(){
                this.carddata = []
                for(let k in this.state.AllhashSensor){
                    let item = this.state.AllhashSensor[k]
                    if(item.typeid == this.state['sensorConfig']['cardReader']){
                        console.log(item)
                        this.carddata.push({
                            k:item.k,
                            addr:item.addr,
                            subname:item.subname,
                            cid:item.cid,
                            ctype:item.ctype,
                            is_exit:item.is_exit,
                            position:item.position,
                            showColor:item.showColor,
                            now_value:item.now_value,
                            statusText:item.statusText
                        })
                    }
                }
                this.refresh()
            },
            refresh(){
                this.carddata.forEach(item=>{
                    if(this.state.AllhashSensor[item.k]){
                        item.now_value = this.state.AllhashSensor[item.k].now_value;
                        item.showColor = this.state.AllhashSensor[item.k].showColor;
                        item.statusText = this.state.AllhashSensor[item.k].statusText;
                    }
                    
                })
            },
            chooseMenu(row){
            	var vm = this,
                    k = "";
                vm.carddata = [];
            	if(row.id){
	            	_.forEach(vm.allData, function (item) {
	            		if(item.id==row.id){
                            _.forEach(item.cardreders,(val)=>{
                               k = val.subname + ':' + val.cid + ':' + val.typeid;
                               vm.state.AllhashSensor[k] && vm.carddata.push(vm.state.AllhashSensor[k])
                            })
	            		}
	            	})
            	}else{
            		vm.fetchData()
            	}
            },
            getCard(){
            	var vm = this
            	api.station.getCard().then(function(res) {
                    vm.treeMenu = []
                    let slist = []
                    if(res.data.status==0){
                    	vm.allData = res.data.data
                    	_.forEach(res.data.data,function(ob) {
                    	    slist.push({
	                    		label:ob.station_name+'('+ob.cardreders.length+')',
	                    		id:ob.id
	                    	})
                       })
                    	vm.treeMenu.push({
		                      	label:'分站'+'('+res.data.data.length+')',
		                      	children:slist
                          })
                    }
                })
            },
        },
        mounted() {
            this.getCard()
            this.fetchData()
        },
    };

</script>
