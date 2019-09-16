<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-hand-o-up"> 手动控制</span>        
    </p>
	<el-table :data="blackoutList" border v-loading="loading" element-loading-text="请稍候,命令执行中..." >
        <el-table-column prop="alais" label="设备编号" width="110"></el-table-column>
        <el-table-column prop="ipaddr" label="分站" width="120"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="position" label="安装位置"></el-table-column>
        <el-table-column  label="断电范围">
                <template scope="scope">
                    {{scope.row.power_scope?scope.row.power_scope:'-'}}
                </template>
        </el-table-column>
        <el-table-column label="状态"  width="120" >
            <template scope="scope">
                <span :style="{fontWeight:'bold',color:scope.row.showColor}">
                        {{scope.row.statusText}}
                </span>
            </template>
        </el-table-column>
        <el-table-column prop="" label="当前值">
            <template scope="scope">
                <span :style="{fontWeight:'bold',color:scope.row.showColor}">
                        {{scope.row.now_value}}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="600" align="start">
                <template scope="scope">
                    <div v-if="scope.row.sensor_type==71" style="text-align: left;">
                        <el-button size="mini" :disabled="!scope.row.controlmode" @click="handle(scope.row,0)">关闭</el-button>
                        <el-button size="mini" :disabled="!scope.row.controlmode" @click="handle(scope.row,1)">一级报警</el-button>
                        <el-button size="mini" :disabled="!scope.row.controlmode" @click="handle(scope.row,2)">二级报警</el-button>
                        <el-button size="mini" :disabled="!scope.row.controlmode" @click="handle(scope.row,3)">三级报警</el-button>
                        <el-button size="mini" :disabled="!scope.row.controlmode" @click="handle(scope.row,4)">四级报警</el-button>
                        <el-button size="mini" :disabled="!scope.row.controlmode" @click="handle(scope.row,5)">默认报警</el-button>
                    </div>
                    <div v-else style="text-align: left;">
                        <el-button size="mini" :disabled="!scope.row.controlmode || scope.row.isrecovercontrol===1" @click="handle(scope.row,0)">恢复</el-button>
                        <el-button size="mini" :disabled="!scope.row.controlmode || scope.row.iscontrol===1" @click="handle(scope.row,1)">控制</el-button>
                        <span v-if="scope.row.controlexplain" style="color:red;">&nbsp;&nbsp;{{scope.row.controlexplain}}</span>
                    </div>
                </template>
        </el-table-column>
        <el-table-column label="当前控制模式">
            <template scope="scope">
                <span @click="change(scope.row)" style="float: left;margin-left:5px;">{{scope.row.controlmode == 1?'手动':'自动'}}</span>
                <el-button @click="change(scope.row)" icon="el-icon-refresh"  size="mini" type="text" style="float: right;margin-right:5px;" ></el-button>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>
<script>
import store from 'src/store'
import api from 'src/api'
export default {
    components:{},
    data () {
        return {
            state:store.state,
            blackoutList:[],
            loading:false
        }
    },
    computed: {

    },
    watch: {
            '$route': 'fetchData',
            'state.skIndex': {
				handler: function(val) {
                        this.setReal()
				},
				deep: false
			},
    },
    methods: {
        change(row){
             this.$confirm(`是否切换为${!row.controlmode?'手动控制模式?手动控制模式时,该设备任何联动控制命令将不会触发,只能手动操作!':'自动控制模式?自动控制模式将不能进行手动操作!'}`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'info'})
                .then(() => {
                    let rdata = {
                        id:row.id,
                        uid:row.uid,
                        controlmode:row.controlmode ? 0 : 1,
                        sensor_type:row.sensor_type,
                        sensorId:row.sensorId,
                        ipaddr:row.ipaddr
                    };
                    api.station.updatecm(rdata).then(res => {
                        if(res.data.status==0){
                            this.$message.success('操作成功!');
                            this.getAll();
                        }else{
                            this.$message.warning("操作失败!");
                        }
                    })
                }).catch(() => {
                         this.$message({type: 'warning',message: '操作已取消'});
                });

        },
    	handle(row,ob){
            this.loading = true
            var rdata={
    			ipaddr:row.ipaddr,
    			sensorId:row.sensorId,
    			sensor_type:row.sensor_type,
                action:ob,
                alais:row.alais
    		}
    		api.gas.handle(rdata).then((res) => {
    			console.log(res)
    			if(res.data.status==0){
    				this.$message.success('操作成功!');
    			}else{
                    this.$message.warning(res.data.msg);
                }
                this.loading = false
    		})
    	},
        getAll(){
               const me = this
               api.station.getcontrolequipment().then((res) => {
                    if(res.data.status == 0) {
                        me.blackoutList = res.data.data;
                        me.blackoutList.forEach(item => {
                             item.k = item.ipaddr + ':' + item.sensorId + ':' + item.sensor_type;
                             item.controlmode = item.controlmode ? 1 : 0;
                        })
                        me.setReal();
                    }
                })
        },
        setReal(){
              this.blackoutList.forEach(item => {
                    item.showColor = this.state.AllhashSensor[item.k].showColor;
                    item.statusText = this.state.AllhashSensor[item.k].statusText;
                    item.now_value = this.state.AllhashSensor[item.k].now_value;
              })
               this.blackoutList =  [...this.blackoutList]
        }
    },
    mounted () {
        this.getAll();
    }
}
</script>
