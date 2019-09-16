<style>
</style>

<template>
<el-form :model="alarmLevel" label-width="150px">
    <div style="color: red;padding:5px 0 5px 50px;">
        <div>{{alarmInfo}}</div>
        <span>上限分级报警值范围：分级报警必须是逐渐递增，上限断电值大于上限一级报警，并且上限复电值小于上限一级报警。</span><br/>
        <span>下限分级报警值范围：分级报警必须是逐渐递减，下限断电值小于下限一级报警，并且下限复电值大于下限一级报警。</span>
    </div>
    <el-row>
        <el-col :span="8">
            <el-form-item label="上限断电值：" v-if="hasfloor !== 2">
                <el-input size="small" v-model="alarmLevel.limit_power"></el-input>
            </el-form-item>
        </el-col>
         <el-col :span="8">
            <el-form-item label="下限断电值：" v-if="hasfloor === 1 || hasfloor === 2">
                <el-input size="small" v-model="alarmLevel.floor_power"></el-input>
            </el-form-item>
        </el-col> 
    </el-row>
    <el-row>
        <el-col :span="8"  v-if="hasfloor !== 2">
            <el-form-item label="上限报警（一级）：">
                <el-input size="small" v-model="alarmLevel.upper_level1" ></el-input> 
            </el-form-item>
            <el-form-item label="上限二级报警：">
                <el-input size="small" v-model="alarmLevel.upper_level2" ></el-input>
            </el-form-item>
            <el-form-item label="上限三级报警：">
                <el-input size="small" v-model="alarmLevel.upper_level3" ></el-input>
            </el-form-item>
            <el-form-item label="上限四级报警：">
                <el-input size="small" v-model="alarmLevel.upper_level4" ></el-input>
            </el-form-item> 
            <el-form-item label="上限复电值：">
                <el-input size="small" v-model="alarmLevel.limit_repower" ></el-input>
            </el-form-item> 
        </el-col>
        <el-col :span="8" v-if="hasfloor === 1 || hasfloor === 2">
            <el-form-item label="下限报警（一级）：">
                <el-input size="small" v-model="alarmLevel.floor_level1" ></el-input> 
            </el-form-item>
            <el-form-item label="下限二级报警：">
                <el-input size="small" v-model="alarmLevel.floor_level2" ></el-input>
            </el-form-item>
            <el-form-item label="下限三级报警：">
                <el-input size="small" v-model="alarmLevel.floor_level3" ></el-input>
            </el-form-item>
            <el-form-item label="下限四级报警：">
                 <el-input size="small" v-model="alarmLevel.floor_level4" ></el-input>
            </el-form-item>  
            <el-form-item label="下限复电值：" >
                <el-input size="small" v-model="alarmLevel.floor_repower" ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="时长(分钟)：">
                <el-input size="small" placeholder="升级时间" disabled></el-input>
            </el-form-item>
            <el-form-item label="时长(分钟)：">
                <el-input size="small" v-model="alarmLevel.upgrade1"  placeholder="升级时间"></el-input>
            </el-form-item>
            <el-form-item label="时长(分钟)：">
                <el-input size="small" v-model="alarmLevel.upgrade2"  placeholder="升级时间"></el-input>
            </el-form-item>
            <el-form-item label="时长(分钟)：">
                <el-input size="small" v-model="alarmLevel.upgrade3"  placeholder="升级时间"></el-input>
            </el-form-item>
        </el-col>
    </el-row>
</el-form>
</template>

<script>
export default {
        data () {
            return {
            };
        },
        props: {
             alarmLevel:Object,
             hasfloor:Number,
             alarmInfo:String
        },
        methods: {
            isSetCutValue(){
                if(this.alarmLevel.limit_power && this.alarmLevel.limit_repower){
                    return true
                }else if(this.alarmLevel.floor_power && this.alarmLevel.floor_repower){
                    return true
                }
                return false
            },
            getAlarmLevel(){
                //收集表单内容
                    let {
                        upper_level1,
                        upper_level2,
                        upper_level3,
                        upper_level4,
                        floor_level1,
                        floor_level2,
                        floor_level3,
                        floor_level4,
                        upgrade1,
                        upgrade2,
                        upgrade3,
                        floor_repower,
                        limit_repower,
                        limit_power,
                        limit_alarm,
                        floor_power,
                        floor_alarm
                    } =  this.alarmLevel;
                    //自动填值
                    limit_power = Number(limit_power) || 999999;
                    upper_level1 = Number(upper_level1) || limit_power;
                    upper_level2 = Number(upper_level2) || upper_level1;
                    upper_level3 = Number(upper_level3) || upper_level2;
                    upper_level4 = Number(upper_level4) || upper_level3;
                    limit_alarm = upper_level1;  
                    limit_repower = Number(limit_repower) || -999999; 
                    floor_power =  Number(floor_power) || -999999;
                    floor_level1 = Number(floor_level1) || floor_power;
                    floor_level2 = Number(floor_level2) || floor_level1;
                    floor_level3 = Number(floor_level3) || floor_level2;
                    floor_level4 = Number(floor_level4) || floor_level3;
                    floor_alarm = floor_level1;  
                    floor_repower = Number(floor_repower) || 999999; 
                    //验证数据格式与内容
                    if(limit_power != 999999 && limit_repower === -999999){
                        return `您设置了上限断电值，但是没有设置上限复电值！`    
                    }
                    if(floor_power != -999999 && floor_repower === 999999){
                        return `您设置了下限断电值，但是没有设置下限复电值！`  
                    }
                    if(limit_repower >= upper_level1){
                        return `上限复电值必须小于上限断电值和上限一级报警值！`
                    }
                    if(floor_repower <= floor_level1){
                        return `下限复电值必须大于下限断电值和下限一级报警值！`
                    }
                    if(!(limit_power >= upper_level1 && upper_level1 >= upper_level2 && upper_level2 >= upper_level3 && upper_level3 >= upper_level4)){
                        return `上限门限配置错误，必须满足：断电 ≥ 报警(一级) ≥ 二级 ≥ 三级 ≥ 四级，且复电 < 报警。`
                    }
                    if(!(floor_level4 >= floor_level3 && floor_level3 >= floor_level2 && floor_level2 >= floor_level1 && floor_level1 >= floor_power)){
                        return `下限门限配置错误，必须满足：断电 ≤ 报警(一级) ≤ 二级 ≤ 三级 ≤ 四级，且复电 > 报警。`
                    }
                    if(floor_level4 >= upper_level4){
                        return `下限值和下限分级报警值范围不能超过上限值和上限分级报警范围！`
                    }
                    //通过验证返回结果
                    return {
                        upper_level1,
                        upper_level2,
                        upper_level3,
                        upper_level4,
                        floor_level1,
                        floor_level2,
                        floor_level3,
                        floor_level4,
                        floor_repower,
                        limit_repower,
                        limit_power,
                        limit_alarm,
                        floor_power,
                        floor_alarm,
                        upgrade1,
                        upgrade2,
                        upgrade3,
                    }
            }
        }
}

</script>
