<style lang="less">
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-comments-o"> 煤矿简介</span> 
    </p>
    <div style="border-bottom:1px solid #DCDFE6;padding-bottom:15px;">
        <el-button size="small" type="primary" @click="$router.push({path: '/home',query:{type:'scan'}})" icon="el-icon-menu">首页</el-button>
        <el-button size="small" type="primary" @click="$router.go(-1)" icon="el-icon-arrow-left" >返回</el-button>
        <el-button size="small" type="primary" @click="fetchData" icon="el-icon-refresh">刷新或撤销修改</el-button>
        <el-button size="small" type="primary" @click="update" icon="el-icon-message" >保存</el-button>
        <span style="font-size:10px;color:#909399;">(如果修改了煤矿简介内容,需要点击保存,才会真正的更新修改)</span>
    </div>
    <el-form ref="form" :model="form" label-width="300px" style="padding:0 40px;margin-top:30px;">
        <el-row type="flex">
            <el-col :span="12">
                <el-form-item label="煤矿编码">
                    <el-input  size="small" v-model="form.minenumber" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工作班次数量">
                    <el-input  size="small" v-model="form.workCount" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="分公司名称">
                        <el-input  size="small" v-model="form.companyName" placeholder="不超过5个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="煤矿全称">
                        <el-input  size="small" v-model="form.coalmineAllName" placeholder="不超过30个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>

        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="煤矿简称">
                        <el-input  size="small" v-model="form.coalmineName" placeholder="不超过5个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="经济类型">
                        <el-input  size="small" v-model="form.economicType" placeholder="按照国家标准,不超过20个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="隶属关系">
                        <el-input  size="small" v-model="form.membership" placeholder="不超过50个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="矿长姓名">
                        <el-input  size="small" v-model="form.managerName" placeholder="不超过10个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="详细地址">
                        <el-input  size="small" v-model="form.adderss" placeholder="不超过50个汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="核定生产能力(万吨)">
                        <el-input  size="small" v-model="form.vouchProductionCapacity" placeholder="不超过5位十进制数字长度，单位：万吨"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="实际生产能力(万吨)">
                        <el-input  size="small" v-model="form.realityPracticalCapacity" placeholder="不超过5位十进制数字长度，单位：万吨"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="核定下井人数(人)">
                        <el-input  size="small" v-model="form.downWellCount"  placeholder="不超过5位十进制数字长度，单位：人"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="核定每班下井时间(小时)">
                        <el-input  size="small" v-model="form.downWellTime"  placeholder="不超过2位十进制数字长度，单位：小时"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="矿联系电话">
                        <el-input  size="small" v-model="form.mineContactNo"  placeholder="不超过20个数字/符号长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="井田面积(平方公里)">
                        <el-input size="small"  v-model="form.mineArea" placeholder="含小数位不超过8位十进制数字长度，单位：平方公里"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可采矿层">
                        <el-input size="small"  v-model="form.minableStratum" placeholder="不超过10个数字/符号长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="采矿许可证编号">
                        <el-input size="small"  v-model="form.coalmineNo" placeholder="不超过30个十进制数字/汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="安全生产许可证编号">
                        <el-input size="small"  v-model="form.mineLicenseNo" placeholder="不超过30个十进制数字/汉字长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="煤炭/煤矿生产许可证编号">
                        <el-input size="small"  v-model="form.coalmineLicenseNo" placeholder="不超过30个十进制数字/汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="矿长安全生产许可资格证编号"> 
                        <el-input size="small"  v-model="form.certificateLicenseNo" placeholder="不超过30个十进制数字/汉字长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="矿长资格证编号">
                        <el-input size="small"  v-model="form.certificateNo" placeholder="不超过30个十进制数字/汉字长度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工商执照编号">
                        <el-input size="small"  v-model="form.businessLicenseNo" placeholder="不超过30个十进制数字/汉字长度"></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="矿井瓦斯等级">
                        <el-input size="small"  v-model="form.mineGasGrade"  placeholder="填写“高瓦斯”或“低瓦斯”或“煤（岩）与瓦斯突出"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="绝对瓦斯涌出量(立方米/分钟)">
                        <el-input size="small"  v-model="form.absoluteGasEmission" placeholder="不超过5个十进制数字长度，单位：立方米/分钟" ></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="相对瓦斯涌出量(立方米/吨)">
                        <el-input size="small"  v-model="form.relativeGasEmission"  placeholder="不超过5个十进制数字长度，单位：立方米/吨" ></el-input> 
                    </el-form-item>
                </el-col>
                    <el-col :span="12">
                    <el-form-item label="主用服务器IP地址">
                        <el-input size="small"  v-model="form.masterServerIP"  placeholder="不超过15个十进制数字/符号长度" ></el-input> 
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="备用服务器IP地址">
                        <el-input size="small"  v-model="form.alternateServerIP" placeholder="不超过15个十进制数字/符号长度" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备用IP地址">
                        <el-input size="small"  v-model="form.alternateIP" placeholder="不超过15个十进制数字/符号长度" ></el-input> 
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="主井口X坐标">
                        <el-input size="small"  v-model="form.wellHeadX" placeholder="不超过20个十进制数字长度" ></el-input> 
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="主井口Y坐标">
                        <el-input size="small"  v-model="form.wellHeadY" placeholder="不超过20个十进制数字长度" ></el-input>
                    </el-form-item>
                </el-col>
        </el-row>
        <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="备注">
                        <el-input size="small" type="textarea" v-model="form.remark"  placeholder="不超过 50 个汉字长度" ></el-input>
                    </el-form-item>
                </el-col>
        </el-row> 
        <el-form-item label="" style="text-align: center;">
                <el-button size="small" type="primary" @click="fetchData"  icon="el-icon-refresh">刷新或撤销修改</el-button>
                <el-button size="small" type="primary" icon="el-icon-message" @click="update">保存</el-button>
                <span style="font-size:10px;color:#909399;">(如果修改了煤矿简介内容,需要点击保存,才会真正的更新修改)</span>
        </el-form-item>            
    </el-form>
</el-card>
</template>

<script>
    import store from 'src/store'
    import api from 'src/api'
    export default {
        components: {},
        data() {
            return {
                state:store.state,
                form:{},
                rdata:{
                    id: 41,
                    k: "MineData",
                    v:"{}"
                }
            }
        },
        watch: {
            '$route': 'fetchData'
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            fetchData(){
                api.setting.getminedata().then(res => {
                    console.log(res)
                    if(res.data.status === 0){
                        this.rdata = res.data.data;
                        this.form = eval("(" + res.data.data.v + ")");
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            update(){
                 let rdata = {
                     id:this.rdata.id,
                     k:this.rdata.k,
                     v:JSON.stringify(this.form)
                 };
                  console.log(rdata)
                 api.setting.updateminedata(rdata).then(res => {
                    if(res.data.status==0){
                        this.$message.success(res.data.msg);
                        api.setting.addMinedataFile();//修改煤矿简介后生成文件
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
        }

     
    };

</script>
