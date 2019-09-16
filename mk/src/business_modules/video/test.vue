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
<!--        <Card>-->
        	<gis-map :pointData="vData" @getInfo="play" @edit="change" :dragList="dragList" v-if="$store.state.center.length"></gis-map>
<!--	        showData-->
            <div class="video_content widths" v-show="showdivPlugin" style="display: inline-block;position: absolute;left:35%;top:20%;">
            </div>
	         <div class="data-list" v-if="!showData">
                         <Tabs>
                            <TabPane label="视频监控" icon="ios-videocam">
                                    <el-collapse v-model="valuename">
                                      <el-collapse-item v-for="(item,i) in dataList" :title="item.name" :name="i">
                                            <div v-for="(li,index) in item.videoes" style="display:flex;justify-content:space-between;padding:5px;">
                                                 <div class="lichild"><Icon type="android-arrow-dropright-circle"></Icon><span style="margin-left:10px;">{{li.name}}</span></div>
                                                 <div>
                                                     <el-button size="mini" @click="clickLogin(item,li.recorderid)">连接</el-button>
                                                 </div>
                                            </div>
                                      </el-collapse-item>
                                   </el-collapse>
                            </TabPane>
                            <TabPane label="设备管理" icon="ios-gear">
                                 <el-button  icon="plus" size="small" type="primary"  @click="addVideo" style="margin:0 0 10px 10px;">添加</el-button>
                                 <el-collapse  v-model="valuename">
                                      <el-collapse-item :name="index" v-for="(item,index) in dataList" style="padding:5px">
                                            <template slot="title">
                                                      <span class="titles">{{item.name}}</span>
                                                      <el-button type="text" @click.stop="edit(item)" size="mini" style="float:right;margin:10px 5px;">修改</el-button>
                                                      <el-button type="text" @click.stop="delVideo(item.id)" size="mini" style="float:right;margin:10px 5px;">删除</el-button>
                                                      <el-button type="primary" @click.stop="getDvr(item)" size="mini" style="float:right;margin:10px 5px;" v-show="item.videoes.length==0">读取摄像头</el-button>
                                            </template>
							<div v-for="(li,lx) in item.videoes" style="display: flex;justify-content: space-between;padding:5px;">
							    <div class="lichild">
							        <Icon type="ios-videocam"></Icon><span style="margin-left:10px;">{{li.name}}</span></div>
							    <div>
							        <el-button type="text" @click="delVideo(li.id)" size="mini">删除</el-button>
							        <el-button type="text" @click="editDvr(li)" size="mini">修改</el-button>
							    </div>
							</div>
</el-collapse-item>
</el-collapse>
</TabPane>
</Tabs>
<el-button size="small" style="width:30px;height:30px;position: absolute;left:0;top:80%;" @click="isappear">
    <i class="el-icon-caret-right"></i>
</el-button>
</div>
<!-- 折叠菜单栏 -->
        <div class="data-appear" v-if="showData">
            <el-button size="small" style="width:30px;height:30px;position: absolute;left:0;top:80%;" @click="isdisappear">
                <i class="el-icon-caret-left"></i>
            </el-button>
        </div>
<!--        选择回放时间-->
<Modal v-model="modal2" title="请选择回放时间" :mask-closable='false'>
    <el-date-picker v-model="timeValue" type="datetimerange" @change="checkedTime" placeholder="选择回放的时间">
    </el-date-picker>
</Modal>
<!--      NVR  添加和修改-->
<Modal v-model="modal1" :title="title" :mask-closable='false'>
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item prop="name" label="NVR" :rules="rules.camera">
            <el-input v-model="dynamicValidateForm.name" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="position" label="位置" :rules="rules.camera">
            <el-input v-model="dynamicValidateForm.position" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="dip" label="IP" :rules="rules.isIp">
            <el-input v-model="dynamicValidateForm.dip" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="port" label="端口" :rules="rules.port">
            <el-input v-model="dynamicValidateForm.port" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="用户名" :rules="rules.camera">
            <el-input v-model="dynamicValidateForm.username" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :rules="rules.camera">
            <el-input v-model="dynamicValidateForm.password" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;padding-right:20px;">
            <el-button @click="resetForm('dynamicValidateForm')" size="small">取消</el-button>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')" size="small">提交</el-button>
        </el-form-item>
    </el-form>
    <div slot="footer" styles="height:0;"></div>
</Modal>
<!--             摄像头管理-->
<Modal v-model="modal3" title="摄像头管理" @on-ok="" @on-cancel="" :mask-closable='false'>
    <el-form :model="dynams" ref="dynams" label-width="100px" class="demo-dynamic">
        <el-form-item prop="dip" label="IP" :rules="rules.isIp">
            <el-input v-model="dynams.dip" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="摄像头编号" :rules="rules.camera">
            <el-input v-model="dynams.name" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="position" label="位置" :rules="rules.camera">
            <el-input v-model="dynams.position" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;padding-right:20px;">
            <el-button type="primary" @click="modal3=false" size="small">取消</el-button>
            <el-button type="primary" @click="submitAddUp('dynams')" size="small">保存</el-button>
        </el-form-item>
    </el-form>
    <div slot="footer" styles="height:0;"></div>
</Modal>

<Modal v-model="changePos" title="请确定是否改变该视频的位置？" @on-ok="ok" @on-cancel="cancel" :mask-closable='false'>
    <span style="font-size: 14px;padding:5px;" v-if="changedata.name">
		        <p style="margin-bottom: 5px;padding-left:10px">名称:{{changedata.name}}</p>
		        <p style="margin-bottom: 5px;padding-left:10px">原始位置:{{changedata.position}}</p>
	        </span>
</Modal>
</div>
</template>
<script type="text/javascript">

</script>
<script>
    import videoTag from './video.vue';
    import api from 'src/api'
    import GisMap from "../watching/video_graph.vue"
    import store from 'src/store'

    export default {
        name: 'route-index',
        components: {
            videoTag,
            GisMap
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



            return {
                szIP: '',
                isedit:true,
                changePos: false,
                showdivPlugin: true,
                tableData: [],
                nAnalogChannel: 0, //通道
                iChannelID: 1, //通道ID
                columnsList: [],
                type: 1,
                state:store.state,
                table1: {
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
                },
                options: [{
                        value: 1,
                        label: '1x1'
                    },
                    {
                        value: 2,
                        label: '2x2'

                    },
                    {
                        value: 3,
                        label: '3x3'
                    },
                    {
                        value: 4,
                        label: '4x4'
                    },
                ],
                timeValue: [new Date(), new Date()], //回放时间
                valuename: [],
                isplayer: false,
                isAddupDvr: true,
                showIp: true,
                dynamicValidateForm: {},
                dynams: {
                    dip: "",
                    position: "",
                    name: "",
                },
                showLog:false,
                title: '',
                modal1: false,
                modal2: false,
                modal3: false,
                showData: false,
                setting: true,
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
        	'state.showinfo':{
        		handler: function(val, oldVal) {
        			console.log(val)
        		},
        		deep:true
        	}
        },
        computed: {
            dataList() {
                return this.$store.state.videoList;
            },
            List() { //console.log(this.$store.state.routeList)
                var list = []
                return list;
            },
            vData() {
                console.log(this.$store.state.vData)
                return this.$store.state.vData;
            },
            dragList(){
	        	var list = []
	        	return list;
	        }
        },
        methods: {
            test() {

            },
            //关闭视频
            closeVideo(){
                this.clickLogout()
                this.showdivPlugin = false
            },
            //设置摄像头经纬度
            change(val) {
                console.log(val)
                var vm = this
                vm.changePos = true
                _.forEach(vm.$store.state.vData, function(item) {
                    console.log(item.id, parseInt(val[0].targetId))
                    if (parseInt(val[0].targetId) === item.id) {
                        _.assign(vm.changedata, item.ob)
                        vm.changedata.n_point = val[0].lng
                        vm.changedata.e_point = val[0].lat
                    }
                })
                console.log(vm.changedata)
            },

            ok() {
                var vm = this
                api.video.updatevideo(vm.changedata).then(function(res) {
                    if (res.data.status === 0) {
                        vm.showListFn()
                        vm.$message.success('操作成功!')
                    }else{
                        vm.$message.error("修改失败！")
                    }
                })
            },
            cancel() {
                this.changePos = false
            },
            //修改摄像头通道
            editDvr(row) {
                this.dynams = JSON.parse(JSON.stringify(row))
                this.modal3 = true
            },
            //提交修改
            submitAddUp(formName) {
                let me = this
                me.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.video.updatevideo(me.dynams).then(function(res) {
                            if(res.data.status === 0){
                                me.modal3 = false
                                me.showListFn()
                                me.$message.success('操作成功!')
                            }else{
                               me.$message.error("修改失败！")
                            }
                        })
                    } else {
                        return false;
                    }
                });
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
                        console.log(res,"删除")
                        if (res.data.status === 0) {
                            me.showListFn()
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

            //       添加
            addVideo() {
                this.dynamicValidateForm = {}
                //添加
                this.isedit = true
                this.title = "添加"
                this.modal1 = true
            },
          //        修改
            edit(row) {
                this.dynamicValidateForm = JSON.parse(JSON.stringify(row))
                this.title = "修改"
                this.modal1 = true
                this.isedit = false
            },
        //NVR修改和添加提交
            submitForm(formName) {
                let me = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.video.addUpVideo(this.dynamicValidateForm).then(function(res) {
                                if (res.data.status === 0) {
                                    if(res.data.isuse){
                                         me.$message.error(res.data.msg)
                                    }else{
                                        me.showListFn()
                                        me.modal1 = false
                                        me.$message.success('操作成功!')
                                        me.$store.dispatch("getVideoList")
                                    }
                                } else {
                                        me.$message.error("操作失败！")
                                }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.modal1 = false
                this.$refs[formName].resetFields();
            },


            //回放
            checkedTime(vl) {},

            //地图上播放
            play(data) {
                if (this.szIP !== null) {
                    this.clickLogout()
                }
                this.showdivPlugin = true
                this.clickLogin(data.data.obj, data.data.recorderid)
            },
            clickLogin(ob,id){
              console.log(ob,id)
            },
              //刷新table
            showListFn() {
                this.$store.dispatch("getVideoList")
            },
            isappear(){
                this.showData = true
            },
            isdisappear(){
                this.showData = false
            }
        },
        mounted() {
        	this.state.Kindex = window.localStorage.getItem('storeIndex')
        	document.title = '视频监控'
            let me = this
            //me.initvideo()
            me.showListFn()
            function initArr (){
               let newarr = [];
               let timeId = setInterval(function(){
                  if(me.dataList.length){
                    for(let i=0;i<me.dataList.length;i++){
                        newarr.push(i)
                    }
                    clearInterval(timeId)
                    me.valuename = newarr
                    me.showData = true
                  }
               },10)
           }
           initArr ();
            me.showData = true
            me.showdivPlugin = false
        }
    };

</script>
