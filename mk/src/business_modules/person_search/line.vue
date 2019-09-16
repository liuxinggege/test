<style lang="less">
    @import '../../styles/common.less';
    .imitate_card{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border: 1px solid #ebeef5;
        transition: .3s;
    }
    .card_header{
        padding: 10px 20px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
    }
    .card_body{
        padding: 10px;
    }
    .select_box {
        border: 5px solid #D3DCE6;
        width:185px;
        position: absolute;
        z-index: 555;
        cursor: pointer;
    }
</style>
<template>
    <div class="imitate_card">
        <div class="card_header">
                <i class="el-icon-date"></i>
                <span>活动轨迹查询</span>
        </div>
        <div class="card_body">
    	    <el-form ref="formInline" :model="formInline"  label-width="70px" :inline="true">
    				<el-form-item label="卡号" prop="card_id">
    					<el-input v-model="formInline.card_id" @keyup.native="getCardNum($event)" placeholder="请输入卡号关键字" size="small"></el-input>
    					<div v-if="userList.length!=0" class="select_box">
                            <el-table :data="userList" border @row-click="selects">
                                <el-table-column v-for="item in columns1" :prop="item.key" :label="item.title"></el-table-column>
                            </el-table>
    					</div>
    				</el-form-item>
    				<el-form-item label="人员">
                         <el-input v-model="choosed"  disabled size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                    	<el-button @click="getRoute(1,state.listinfo.numperPage)" icon="el-icon-search" type="primary" size="small">查询活动轨迹</el-button>
                    </el-form-item>
            </el-form>
            <el-table :data="state.showlist" v-if="showop" style="width: 100%" @row-click="checkTrack">
                <el-table-column label="卡号" prop="card_id"></el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        <div>{{choosed}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="进井时间" prop="intoTime"></el-table-column>
                <el-table-column label="出井时间" prop="outTime"></el-table-column>
            </el-table>
            <my-pagination></my-pagination>
        </div>
    </div>
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'
import moment from 'moment'

export default {
    name: 'route-index',
    data () {
    	return {
    		positionData:[],
    		state:store.state,
    		action:store.actions,
    		showop:false,
    		formInline:{
    			card_id:''
    		},
    		choosed:'',
    		userList:[],
    		columns1: [
    		  {
                 width: 100,
                 title: '姓名',
                 key: 'name'
              }, {
                 width: 100,
                 title: '卡号',
                 key: 'rfcard_id'
             }],
    	}
    },
    watch: {
      'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.positionData)
		      },
		      deep: true
		}
    },
    methods: {
    	 getCardNum(ev) {
                let me = this
                if (ev.keyCode == 38 || ev.keyCode == 40) return;
                if (!/^[0-9]+$/.test(me.formInline.card_id)) {
                    me.userList = []
                    return
                }
                api.routeLine.getstaff({
                    rfcard_id: me.formInline.card_id
                }).then(function(res) {
                	console.log(res)
                    me.userList = res.data.data
                })
        },
    	selects(row) {
                let me = this
                me.formInline.card_id = row.rfcard_id
                me.choosed = row.name
                window.localStorage.setItem('user', row.name);
                me.userList = []
                me.getRoute()
        },
        getRoute(page,rows){
        	let vm = this
	    	 	vm.formInline.cur_page = page || (vm.state.listinfo.currentPage)
	            vm.formInline.page_rows = rows || (vm.state.listinfo.numperPage)
	    		api.routeLine.getLine(vm.formInline).then(function(res){
	    			if(res.data.status==0){
	    				vm.showop = true
	    				vm.positionData = res.data.data
	    				vm.action.setShowList(vm.positionData)
	    			}else{
	    				vm.$message.error(res.data.msg)
	    			}
	    		})
        },
        checkTrack(row){
        	var rdata = {
        		card_id:row.card_id,
        		intoTime:row.intoTime,
        		outTime:row.outTime,
        		special:1
            }
        	this.$router.push({name:'detailTable',query:rdata})
        }
    },
    mounted () {
    	if(this.$route.query.id){
	    	  this.formInline.card_id = this.$route.query.id
	    	  this.choosed = window.localStorage.getItem('user')
	    	  this.getRoute(1,this.state.listinfo.numperPage)
    	}
    }
};
</script>
