<style lang="less">
    @import '../../styles/common.less';
    .video_content {
        /*        margin-right: 300px;*/
        background-color: white;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .3);
    }

    .plugin {
        width: 150px;
    }

    .widths {
        width: 500px;
    }

    .ivu-tabs {
        background-color: white;
    }
    .data-appear{
        position: absolute;
        margin:0;
        top:0px;
        right:1px;
        height: 100%;
        width:31px;
        background-color: white;
        box-shadow: 0 1px 6px rgba(0,0,0,.3);
        opacity: 0.75;
        /*overflow-y: scroll;*/
    }
</style>
<template>
    <div>
        <gis-map ref="GisMap" @edit="change" @checkArea="checkArea" :undragList="undragList" :dragList="dragList" @check="check"  v-if="$store.state.center.length"></gis-map>
        <div class="data-list" v-if="!showData">
            <el-tabs v-model="tabname" @tab-click="tabClick">
                <el-tab-pane name="name1">
                    <span slot="label"><i class="fa fa-video-camera"></i> 视频监控</span>
                    <el-table :data="vData" border>
                        <el-table-column label="监控" >
                            <template scope="scope">
                                <i class="fa fa-video-camera"></i>&nbsp;&nbsp;<span>{{scope.row.videoname}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="预览">
                            <template scope="scope">
                                <el-button @click="playVideo(scope.row.id)" type="text" plain size="small">预览</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="name2">
                    <span slot="label"><i class="fa fa-cog"></i> 设备管理</span>
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="addUpVideo(-1)" style="margin:0 0 10px 10px;">添加</el-button>
                    <el-table :data="vData" border>
                        <el-table-column label="监控" prop="videoname"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button @click="delVideo(scope.row.id)" type="text" size="small">删除</el-button>
                                <el-button @click="addUpVideo(scope.row)" type="text" size="small">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-button size="small" type="primary" class="cssbtn" @click="handleshowData(true)">
                <i class="el-icon-caret-right"></i>
            </el-button>
     </div>
      <!-- 折叠菜单栏  -->
    <div class="data-appear" v-else>
        <el-button size="small" type="primary" class="cssbtn" @click="handleshowData(false)">
            <i class="el-icon-caret-left"></i>
        </el-button>
    </div>
    <div v-if="addUpModal">
        <el-dialog :visible.sync="addUpModal" :close-on-click-modal="false" :title="title2">
            <el-form ref="videoForm" :model="videoForm" label-width="80px" :rules="ruleInline">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备名" prop="videoname">
                            <el-input size="small" v-model="videoForm.videoname" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="位置" prop="position">
                            <el-select size="small" v-model="videoForm.position" filterable allow-create>
                                <el-option
                                    v-for="item in allPosition"
                                    :key="item.id"
                                    :label="item.v"
                                    :value="item.v">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备类型" prop="isnvr">
                            <el-select v-model="videoForm.isnvr" placeholder="请选择监控类型" size="small" @change="chooseSensorType">
                                <el-option :value="1" :key="1" :label="NVR主机"></el-option>
                                <el-option :value="2" :key="2" :label="摄像机"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                    </el-col>
                </el-row>
                <el-row v-if="isnvrtype">
                    <el-col :span="12">
                        <el-form-item label="登录方式" prop="logintype">
                            <el-select v-model="videoForm.logintype" placeholder="请选择登录方式" size="small" @change="chooseLoginType">
                                <el-option :value="1" :key="1" :label="NVR主机"></el-option>
                                <el-option :value="2" :key="2" :label="摄像机"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通道号" prop="accnum">
                           <el-input-number :min="1" v-model="videoForm.accnum"  size="small" :disabled="isnvrlogin"></el-input-number>
                       </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="IP" prop="ip">
                    <el-input v-model="videoForm.ip" size="small"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port" >
                    <el-input v-model="videoForm.port" size="small"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="videoForm.username" size="small"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" >
                    <el-input v-model="videoForm.password" size="small"></el-input>
                </el-form-item>
                <el-form-item style="text-align:right;">
                    <el-button size="small" @click="resetForm('videoForm')">取消</el-button>
                    <el-button size="small" type="primary" icon="el-icon-message" @click="submitAddUp('videoForm')" style="margin-right:15px;">保存</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" style="height:0;"></div>
        </el-dialog>
    </div>
    <div v-if="showVideo">
        <el-dialog :visible.sync="showVideo" :title="detailInfo">
            <plugin-bar ref='pluginBar'></plugin-bar>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    <div v-if="changePos">
        <el-dialog :visible.sync="changePos" title="请确定是否改变该视频的位置？">
            <span style="font-size: 14px;padding:5px;" v-if="changedata.videoname">
                <p style="margin-bottom: 5px;padding-left:10px">名称:{{changedata.videoname}}</p>
                <p style="margin-bottom: 5px;padding-left:10px">原始位置:{{changedata.position}}</p>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>

<script>
    import videoTag from './../video/video.vue';
    import api from 'src/api'
    import GisMap from "./topo.vue"
    import store from 'src/store'
    import pluginBar from "../../business_bar/pluginBar.vue"

    export default {
        name: 'route-index',
        components: {
            videoTag,
            GisMap,
            pluginBar

        },
        data() {
            const isIp = (rule, value, callback) => {
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!value) {
                    return callback(new Error('IP不能为空'));
                } else if (reg.test(value)) {
                    return callback();
                }
                callback(new Error('不符合IP格式'));
            };
            const validateNumber = (rule, value, callback) => {
                    var re=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
                    if (!value) {
                            callback(new Error('不能为空！'));
                        }
                    else if(!re.test(value)){
                      callback(new Error('请输入数字！'));
                    }else{
                     callback()
                   }
           };
           const isNull = (rule, value, callback) => {
     		    if (!value) {
                    callback(new Error('不能为空！'));
                }else{
			    	callback()
			    }
        	};


            return {
                isnvrtype:false,
                isnvrlogin:true,
                allPosition:[],
                videoForm:{},
                addUpModal:false,
                showVideo:false,
                title2:'添加',
                detailInfo:'',
                ruleInline: {
                    position:{ required: true, message: '不能为空！', trigger: 'change' },
                    isnvr:{validator:isNull, trigger: 'change' },
                    logintype:{validator:isNull, trigger: 'change' },
                    videoname:{required: true, message: '不能为空', trigger: 'blur' },
                    username:{required: true, message: '不能为空', trigger: 'blur' },
                    password:{required: true, message: '不能为空', trigger: 'blur' },
                    ip: {validator: isIp,trigger: 'blur'},
                    port: {validator: validateNumber,trigger: 'blur'},
                },
                tabname:"name1",
                szIP: '',
                changePos: false,
                state: store.state,
                action: store.actions,
                showData: true,
                changedata: {},
                rules: {
                    position: {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    },
                    camera: {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    },
                    isIp: {
                        validator: isIp,
                        trigger: 'blur'
                    },
                     port: {
                       validator: validateNumber,
                        trigger: 'blur'
                    },
                },
            }
        },
        watch: {
            // 'state.surePass': {
            //     handler: function(val) {
            //         this.tabname="name2"
            //     },
            //     deep: true
            // },
        },
        computed: {
            vData() {
                var arr = [...this.$store.state.vData]
                return arr
            },
            undragList(){
	            let arr = [...this.$store.state.undragList]
	            return arr
	        },
            dragList(){
                var list = []
                return list;
            }
        },
        methods: {
            handleshowData(bool){
				this.showData = bool;
				window.localStorage.setItem('showData',bool);
			},
            //预览
            playVideo(id){
                let me = this
                api.video.playVideo(id).then(function(res) {
                    if(res.data.status==0){
                        me.$refs.pluginBar.changeUrl(res.data.video)
                    }else{
                    	me.$message.error(res.data.msg)
                    }
                })
            },
            //添加修改
            addUpVideo(row){
                if(row == -1){
                    this.title2 = '添加'
                    this.videoForm = {}
                }else{
                    this.title2 = '修改'
                    this.videoForm = row
                }
                  this.isnvrtype = this.videoForm.isnvr == 2?true:false
                  this.isnvrlogin = this.videoForm.logintype == 2?true:false
                  this.addUpModal = true
            },
            chooseSensorType(type){
                if(type===1){
                     this.isnvrtype = false
                     this.videoForm.logintype = 2
                     this.videoForm.accnum = 1
                }else{
                     this.isnvrtype = true
                     this.videoForm.logintype = ''
                     this.videoForm.accnum = 1
                }
            },
            chooseLoginType(type){
                if(type===1){
                    this.isnvrlogin =false
                    this.$message('请输入通道号！');
                }else{
                    this.isnvrlogin = true
                    this.videoForm.accnum = 1

                }
            },
            //提交
            submitAddUp(formName) {
                let me = this
                me.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.video.addUpVideo(me.videoForm).then(function(res) {
                            if(res.data.status==0){
                                me.addUpModal = false
                                me.getAllVideo()
                                me.$message.success('操作成功！')
                            }else{
                               me.$message.error('操作失败！')
                            }
                        })
                    } else {
                        me.$message.error('操作失败！')
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.addUpModal = false
                this.$refs[formName].resetFields();
            },
            //        删除
            delVideo(id) {
                    let me = this
                    me.$confirm('确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        api.video.deletevideo(id).then(function(res) {
                            if (res.data.status === 0) {
                                me.getAllVideo()
                            } else {
                                me.$message.error(res.data.msg)
                            }
                        })
                    }).catch(() => {
                        me.$message({
                            type: 'warning',
                            message: '已取消删除'
                        });
                    });
            },

            //设置摄像头经纬度
            change(val) {
                if(val.ob==''){
	                this.changePos = true
	               	var vm = this
	                vm.changedata = {}
	                _.assign(vm.changedata,val.data)
	                vm.changedata.n_point = val.n_point
	                vm.changedata.e_point = val.e_point
                }
                else if(val.ob&&val.isDevice&&val.ob.type!=16){
		        	this.state.controlModel = true
	        	    _.assign(this.state.controlForm,val.ob)
		        }
		        else if(val.ob&&val.isDevice&&val.ob.type==16){
		        	this.state.addModal = true
	        	    _.assign(this.state.addForm,val.ob)
		        }else{
                	this.title2 = '修改'
                	this.addUpModal = true
                	_.assign(this.videoForm,val.ob)
                }
            },
            check(val){
            	this.showVideo = true
            	this.playVideo(val.id)
            	this.detailInfo = val.videoname
            },
            ok() {
                var vm = this
                api.video.addUpVideo(vm.changedata).then(function(res) {
                    if (res.data.status === 0) {
                        vm.getAllVideo()
                        vm.$message.success('操作成功!')
                        vm.$refs.GisMap.clean()
                    }else{
                        vm.$message.error("修改失败")
                    }
                })
            },
            checkArea(data){
	        	this.state.addArea = true
	        	_.assign(this.state.areadata,data.ob)
	        },
            cancel() {
                this.changePos = false
                this.$refs.GisMap.clean()
            },
              //刷新table
            showListFn() {
                this.$store.dispatch("getVideoList")
            },
            tabClick(){
                if(this.tabname=="name2"){
	            }
            },
            //其他数据
            getOhterData(){
                api.gas.getAllPosition().then(res => {
                    if(res.data.status == 0){
                        this.allPosition = res.data.data;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //获取所有 刷新
            getAllVideo(){
                let me = this
                api.video.getAllVideo().then(function(res) {
                     if(res.data.status == 0){
                          me.$store.commit("getAllVideoList",res.data.data)
//                          me.showData = true
                     }else{
                         me.$message.error(res.data.msg)
                     }
                });
            }
        },
        mounted() {
          this.showData = JSON.parse(window.localStorage.getItem('showData'))
          this.getOhterData()
          this.getAllVideo()
          this.$store.dispatch("getAllArea");
        }
    };
</script>
