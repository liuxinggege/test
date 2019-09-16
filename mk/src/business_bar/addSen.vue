<style>
</style>
<template>
    <el-form :model="controlForm"  label-width="120px"> 
        <el-form-item label="位置类型">
            <el-input v-model="controlForm.area_pos" clearable size="small"></el-input>
        </el-form-item>   
        <el-form-item label="传感器">
            <el-select  v-model="sensors" value-key="uid" size="small"  filterable clearable style="width: 100%">
                <el-option v-for="item in sensorList" :value="item" :key="item.uid" :label="item.alais+'/'+item.position+'/'+(item.type?item.type:item.sensor_type)"></el-option>
            </el-select> 
        </el-form-item>     
        <el-form-item label="" style="text-align: right;">
            <el-button size="small" icon="el-icon-message" type="primary" @click="submitaddup('controlForm')" :loading="isloding">保存</el-button>
            <el-button size="small" @click="backup">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
	import api from 'src/api'
	import store from 'src/store'
	export default {
        props:["controlForm","isloding","arrList"],
		data() { 
			return {
                sensorList:[],//传感器列表
                sensors:{},
            }
		},
		methods: {
            submitaddup(){              
                let vm = this,
                    data = {}
                if(vm.sensors.id){
                    // 添加传感器
                    data={
                        area_id:vm.controlForm.area_id,
                        area_pos_id:vm.controlForm.area_pos_id,
                        attrib_enable:1,
                        sensor_id:vm.sensors.id?vm.sensors.id:vm.sensors.sensor_id,
                        uid:vm.sensors.uid,
                        sensor_type_id:vm.sensors.pid
                    }
                }else{
                    // 删除传感器
                    data = {
                        area_id:vm.controlForm.area_id,
                        area_pos_id:vm.controlForm.area_pos_id,
                        sensor_id:-1
                    }
                }
                vm.$emit('saveSensor',data)
            },
            backup(){
                this.$emit('backup')
            },
            checkSensor(row){
                if(row.alais&&row.type&&row.uid){
                    this.sensorList.push(row)
                    this.sensors = row
                }
            },
            getAllSen(){
                let me = this
                api.station.getEnable().then((res)=>{
                    if(res.data.status == 0){
                        me.sensorList = [...res.data.data.list2,...res.data.data.list3]
                        me.checkSensor(this.arrList)
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
            }
		},
		mounted() {			
            this.getAllSen()
		},
		
	};
</script>