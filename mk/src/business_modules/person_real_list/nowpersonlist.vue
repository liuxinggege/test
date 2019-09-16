<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
    	<el-card v-if="showdata" :style="{marginTop:$route.name !== 'watch'?'-16px':'',marginLeft:$route.name !== 'watch'?'-5px':'',marginRight:$route.name !== 'watch'?'-5px':'',marginBottom:$route.name !== 'watch'?'-16px':''}">
            <el-form class="search" :inline="true" ref="filterform" :model="filterform" label-width="70px" v-if="$route.name === 'watch'">
                <el-form-item label="区域">
                    <el-select size="small" v-model="filterform.areaid" style="width:130px" clearable>
                        <el-option :value="-1" :key="-1" label="所有区域"></el-option>
                        <el-option v-for="item in areaList" :value="item.id" :key="item.areaname" :label="item.areaname"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡号">
                    <el-input size="small" v-model="filterform.rfcard_id" style="width:130px" placeholder="请输入卡号" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓名">
	                <el-input size="small" v-model="filterform.name" placeholder="输入员工名"></el-input>
		        </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="find" icon="el-icon-search">筛选</el-button>
                    <el-button size="small" type="primary" @click="lookall" icon="el-icon-search">查看所有</el-button>
                    <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
                    <el-button size="small" type="primary" @click="$router.go(-1)" icon="el-icon-back" v-if="$route.query.id">返回</el-button>
                </el-form-item>
            </el-form>
	        <div id="show" class="show-image mytable" :style="{marginTop:$route.name !== 'watch'?'-30px':'0'}">
                <div style="margin:2px 0;">当前井下人数/当前人员总数：{{state.downholeTotal.personNum?state.downholeTotal.personNum:'0'}}/{{allData.length}}</div>
                <print-info @clickLine="clickLine" :excelColumns="$route.name === 'watch'?thead:thead1" :tableExcelData="!showpage?state.showlist:allData" :printOb="printOb"></print-info>
            </div>
	        <my-pagination></my-pagination>
	        <div v-if="showLine2">
			  	<el-dialog :visible.sync="showLine2" width="930px" :close-on-click-modal="false" :title="headText">
                    <el-button size="mini" type="primary" @click="toLine" style="margin-bottom: 5px;">轨迹回放</el-button>
                    <el-table :data="lineList" border>
		                <el-table-column show-overflow-tooltip label="区域">
		                    <template scope="scope">
                                <span>{{scope.row.areaname?scope.row.areaname:'出入口区域'}}</span>
                                <span v-if="scope.row.areaname">{{'('+scope.row.default_allow ==2?'限制':''}}{{scope.row.emphasis==2?'重点':''+')'}}</span>
                            </template>
		                </el-table-column>
		                <el-table-column show-overflow-tooltip prop="ip" label="分站号"></el-table-column>
						<el-table-column show-overflow-tooltip prop="positionName" label="位置"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="responsetime" label="到达时间"></el-table-column>
			        </el-table>
                    <el-pagination
		                v-show="totalnum>maxPage"
		                @size-change="handleSizeChange"
		                @current-change="handleCurrentChange"
		                :current-page="currentPage"
		                :page-sizes="[15,20,25]"
		                :page-size="maxPage"
		                layout="total, sizes, prev, pager, next, jumper"
		                :total="totalnum"
		                style="margin-bottom: 32px">
                    </el-pagination>
	                <div slot="footer"></div>
			  	</el-dialog>
	        </div>
		</el-card>
    </div>
</template>

<script>
import moment from 'moment'
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'
import printInfo from '../../business_bar/print.vue';


export default {
    name: 'role',
    components: {
    	printInfo
    },
    data () {
    	return {
          printOb:{
              showLine:true,
              thead:'人员跟踪',
              tbody:'活动轨迹'
          },
            thead:[
                 {title: '当前区域',key: 'areaname',isArea:true},
                 {title: '卡号',key: 'rfcard_id'},
                 {title: '电池电量',key: 'battary',battary:true},
                 {title: '姓名',key: 'name'},
                 {title: '人员状态',key: 'status',isStatus:true},
                 {title: '门禁状态',key: 'doorStatus'},
                 {title: '部门',key: 'departname'},
                 {title: '当前位置',key: 'areaname'},
                 {title: '入井时刻',key: 'intime'},
                 {title: '进入分站识别区域时刻',key: 'reachtime'},
                 {title: '下井工作时长',key: 'staytime'},
                 {title: '出井时刻',key: 'out_time'},
                 {title: '来源地',key: 'devname'},
            ],
            thead1:[
                {title: '卡号',key: 'rfcard_id'},
                {title: '电池电量',key: 'battary',battary:true},
                {title: '姓名',key: 'name'},
                {title: '人员状态',key: 'status',isStatus:true},
                {title: '门禁状态',key: 'doorStatus'},
                {title: '部门',key: 'departname'},
                {title: '入井时刻',key: 'intime'},
                {title: '进入分站识别区域时刻',key: 'reachtime'},
                {title: '下井工作时长',key: 'staytime'},
            ],
            areaList:[],
    		showop:true,
    		showdata:false,
            nowarea:{},
            searchform:{},
    		currentPage: 1,
            maxPage: 15,
            totalnum: 0,
    		action:store.actions,
    		showpage:false,
    		state:store.state,
    		userData:[],
            allData:[],
    		showLine2:false,
    		headText:'',
            lineList:[],
    		showTableList:[],
            filterform:{
                areaid:-1,
                rfcard_id:'',
                name:''
            },
    	}
    },
    watch: {
    	'$route': 'fetchData',
    	 'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.userData)
		      },
		      deep: true
		    }
    },
    methods: {
        clickLine(ob){
            if(this.$route.name === 'watch'){
               this.getLine(ob)
            }else{
            	if(ob.intime=='-'){
            		ob.intime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            	}
                this.$router.push({name:'detailTable',query:{
                    name:ob.name,
                    card_id:ob.rfcard_id,
                    intoTime:ob.intime,
                    outTime:ob.reachtime
                }})
            }
        },
        lookall(){
            this.filterform = {
                areaid:-1,
                rfcard_id:'',
                name:''
            },
            this.userData = this.allData
            this.action.setShowList(this.allData)
        },
        find(){
                this.userData = this.allData
                if(this.filterform.areaid != -1 && this.filterform.areaid != ''){
                     this.userData = this.userData.filter(item => item.areaid == this.filterform.areaid)
                }
                if(this.filterform.name){
                      this.userData = this.userData.filter(item => new RegExp(this.filterform.name).test(item.name))
                }
                if(this.filterform.rfcard_id){
                    this.userData = this.userData.filter(item => new RegExp(this.filterform.rfcard_id).test(item.rfcard_id))
                }
              this.action.setShowList(this.userData)
        },
    	getData(id,sid){
    		var vm = this
    		api.routeLine.getNowRoute({devid:id+'',substation_id:sid+''}).then(function(res){
    			if(res.data.status==0&&res.data.data.length){
                   var list = []
                   vm.allData = _.remove(res.data.data, function(n) {
					   return n.areaname != "休息区"
				   })
                   list = _.remove(res.data.data, function(n) {
					   return n.areaname == "休息区"
				   })
                  vm.allData = vm.allData.concat(list)
                  vm.find()
                  vm.showdata = true
                  vm.$emit('check',1)
    			}else if(res.data.status==0&&!res.data.data.length){
    				vm.$emit('check')
    			}
    			else{
    				vm.userData = []
    				vm.action.setShowList(vm.userData)
    				//vm.$message.error('没有数据!')
    			}
    		})
    	},
        toLine(){
            let lienForm = {
                card_id:this.nowarea.rfcard_id,
                intoTime:moment(new Date()).add(-1,'days').format('YYYY-MM-DD HH:mm:ss'),
                outTime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                name:this.nowarea.name
            }
            this.$router.push({name:'detailTable',query:lienForm})
        },
        getTime(){
            return moment(new Date(), 'YYYY/MM/DD').format('YYYY-MM-DD')
        },
    	getLine(row){
    		var vm = this
            vm.nowarea = row
    		vm.headText = row.name+' 当天轨迹列表'
    		api.routeLine.get2dayRoute(vm.getTime(),{rfcard_id:row.rfcard_id}).then(function(res){
    			if(res.data.status==0&&res.data.data.length){
    				vm.showLine2 = true
    				vm.showTableList = res.data.data
    				vm.totalnum = vm.showTableList.length
    				vm.switchover()
    			}else{
    				vm.Linelist = []
    				vm.$message.error('没有数据!')
    			}
    		})
    	},
    	handleSizeChange(val) {
                this.maxPage = val
                this.switchover()
        },
        handleCurrentChange(val) {
                this.currentPage = val
                this.switchover()
        },
        switchover(){
                  this.lineList = this.showTableList.slice(((this.currentPage -1) * this.maxPage), (this.currentPage * this.maxPage))
        },
       exportPrint(){
                this.printOb.showLine = false
            	this.showpage = true
	        	setTimeout(() => {
		  			$('#show').jqprint()
		  			this.showpage = false
                    setTimeout(() => {
                        this.printOb.showLine = true
                    },50)
		  		},50)
        },
        setArea(){
            const me = this
            api.routeLine.getAllarea().then(function(res) {
                    if (res.data.status === 0) {
                         res.data.data.forEach((item) => {
                             if(item.is_exit==1){
                                 item.id = '0'
                             }
                         })
                        me.areaList = res.data.data
                    }else{
                        me.$message.error(res.data.msg)
                    }
           })
        },
    },
    mounted(){
    	  this.state.listinfo.numperPage = 20
          let parmId = this.$route.query.id
          if(parmId){
              this.filterform.areaid = parseInt(parmId)
          }else{
               this.filterform.areaid = -1
          }
          this.setArea()
          this.showpage = false
          if(this.$route.name === 'watch') {
               this.getData(0,0)
               this.showop = true
               this.state.listinfo.numperPage = 20
               let intervalId = setInterval(() => {
                    if(this.$route.name === 'watch'){
                        this.getData(0,0)
                    }else{
                        clearInterval(intervalId)
                    }
              },1000 * 15)
          }
          else{
          	this.state.listinfo.numperPage = 10
          	this.showop = false
          }
    }
};
</script>
