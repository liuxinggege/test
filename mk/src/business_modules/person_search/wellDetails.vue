<style>
</style>
<template>
<el-card>
    <p slot="header" >
        <span class="fa fa-file-text"> {{params[0]}} {{params[2]}} 下井情况</span>
        <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="$router.go(-1)" style="margin-left:50px">返回</el-button>
        <el-button type="primary" icon="el-icon-printer" size="small" @click="exportPrint"  style="margin-left:10px">打印表格</el-button> 
    </p>
    <div id="show" class="show-image mytable">
        <h4 v-show="!showLine">{{params[0]}} {{params[2]}} 下井情况</h4>
        <table style="display: table;border-collapse: separate;border-spacing: 0px;border-color: grey;border: 1px solid #dfe6ec;width:100%;font-size:8px;">
            <thead style="background-color: #eef1f6;">
                <tr style="height: 30px;">				
                    <th v-for='item in thead' style="background-color: #eef1f6;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;font-weight: bold;">{{item.title}}</th>
                    <th v-if="showLine"  style="background-color: #eef1f6;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;font-weight: bold;">活动轨迹</th>
                </tr>			
            </thead>
            <tbody v-for='(item,index) in listPage'>
                <tr v-for='(ob,dindex) in item.list'>
                    <td v-if="dindex == 0" :rowspan="item.list.length" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;">{{item.theDate}}</td>
                    <td v-if="dindex == 0" :rowspan="item.list.length" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;">{{item.card_id}}</td>
                    <td v-if="dindex == 0" :rowspan="item.list.length" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;">{{item.name}}</td>
                    <td style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;">{{ob.intoTime}}</td>
                    <td style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;">{{ob.outTime}}</td>
                    <td style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;">{{ob.times}}</td>
                    <td v-if="showLine" style="cursor: pointer;color: #20A0FF;background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #dfe6ec;border-right: 1px solid #dfe6ec;" @click="toLine(item,ob)">演示</td>
                </tr>
            </tbody>
        </table>
    </div>
</el-card> 
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import moment from 'moment'
    import store from 'src/store'
    export default {
        data() {
            return {
                params:[],
                state:store.state,
                showLine:true,
                month:'',
                name:'',
                listPage:[],
                thead:[
                   {title: '日期',key: 'theDate'},
                   {title: '卡号',key: 'card_id'},
                   {title: '姓名',key: 'name'},
                   {title: '入井时刻',key: 'intoTime'},
                   {title: '出井时刻',key: 'outTime'},
                   {title: '井下工作时长',key: 'times'},
//                   {title: '活动轨迹',rowspan: true},
                ]
            }
        },
        props: {},
        computed: {},
        watch: {},
        created() {   
            this.params = this.$route.params.aname.split('/')
        },
        methods: {
            exportPrint(){
                this.showLine = false
	        	setTimeout(() => {
		  			$('#show').jqprint()
                    setTimeout(() => {
                        this.showLine = true
                    },10)
		  		},10)      
            },
            toLine(item,ob){
                let lienForm = {
                    card_id:item.card_id,
                    intoTime:ob.intoTime,
                    outTime:ob.outTime,
                    name:this.params[0]
                }
            this.$router.push({name:'detailTable',query:lienForm})
        },
        },
        mounted() {
            let me = this
            this.state.Kindex = window.localStorage.getItem('storeIndex')
            this.showLine = true
            api.searchs.getallbycard({rfcard_id:this.params[1],month:this.params[2],worker_id:this.params[3]}).then((res) => {       
                console.log(res,'+++++++')
                me.listPage = res.data.data
            })
        }
    }

</script>
