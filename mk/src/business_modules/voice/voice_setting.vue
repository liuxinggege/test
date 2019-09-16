<style lang="less">
@import "../../styles/common.less";
#recordingslist audio {
  display: block;
  margin-bottom: 10px;
}
.action_button{
    color:rgb(32,160,255);
    cursor: pointer;
    margin-right: 5px;
}
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-microphone"> 语音广播配置</span>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="addupBroadcast(-1)" style="margin-left:30px;">添加广播站</el-button>
    </p>
    <el-table :data="allList" border >
            <el-table-column prop="alais" label="编号" align="left"></el-table-column>
            <el-table-column prop="name" label="广播站" align="left"></el-table-column>
            <el-table-column prop="position" label="安装位置" align="left"></el-table-column>
            <el-table-column label="当前控制模式" width="150">
              <template scope="scope">
                <span @click="changeMode(scope.row)" class="action_button" style="float: left;margin-left:5px;">{{scope.row.controlmode == 1?'手动':'自动'}}</span>
                <el-button @click="changeMode(scope.row)" icon="el-icon-refresh" size="mini" type="text"style="float: right;margin-right:5px;"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="控制" align="center">
              <template scope="scope">
                <span class="action_button" @click="openfile(scope.row)">播放</span>
                <span class="action_button" @click="playV(scope.row,true)">停止</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template scope="scope">
                <span class="action_button" @click="delBroadcast(scope.row.id)">删除</span>
                <span class="action_button" @click="addupBroadcast(scope.row)">修改</span>
              </template>
            </el-table-column>
    </el-table>
    <!-- <el-tabs v-model="tabname" @tab-click="tabClick">
        <el-tab-pane label="广播站" name="name1">
          <el-table :data="allList" border @selection-change="handleSelectionChange"  @row-click="selectOnes">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column label="广播站" prop="name">
                  <template scope="scope">{{scope.row.name+'/'+scope.row.alais}}</template>
            </el-table-column>
            <el-table-column label="位置" prop="position"></el-table-column>
            <el-table-column label="状态" prop="statusText">
              <template scope="scope">
                <span :style="{color:scope.row.showColor||''}">{{scope.row.statusText}}{{scope.row.now_value}}</span>
              </template>
            </el-table-column>
            <el-table-column label="控制" align="center" width="120">
              <template scope="scope">
                <span class="action_button" @click="openfile(scope.row)">播放</span>
                <span class="action_button" @click="playV(scope.row,true)">停止</span>
              </template>
            </el-table-column>
            <el-table-column label="当前控制模式" width="120">
              <template scope="scope">
                <span @click="changeMode(scope.row)" style="float: left;margin-left:5px;">{{scope.row.controlmode == 1?'手动':'自动'}}</span>
                <el-button @click="changeMode(scope.row)" icon="el-icon-refresh" size="mini" type="text"style="float: right;margin-right:5px;"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="设备管理" name="name2">
          <el-table :data="allList" border >
            <el-table-column prop="alais" label="编号" align="left"></el-table-column>
            <el-table-column prop="name" label="广播站" align="left"></el-table-column>
            <el-table-column prop="position" label="安装位置" align="left"></el-table-column>
            <el-table-column label="当前控制模式" width="120">
              <template scope="scope">
                <span @click="changeMode(scope.row)" style="float: left;margin-left:5px;">{{scope.row.controlmode == 1?'手动':'自动'}}</span>
                <el-button @click="changeMode(scope.row)" icon="el-icon-refresh" size="mini" type="text"style="float: right;margin-right:5px;"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="控制" align="center" width="120">
              <template scope="scope">
                <span class="action_button" @click="openfile(scope.row)">播放</span>
                <span class="action_button" @click="playV(scope.row,true)">停止</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <span class="action_button" @click="delBroadcast(scope.row.id)">删除</span>
                <span class="action_button" @click="addupBroadcast(scope.row)">修改</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
    </el-tabs> -->
      <div v-if="modal1">
        <el-dialog :visible.sync="modal1" width="30%" :title="title" :append-to-body="true" :close-on-click-modal="false">
          <add-voice :formItem="voices" @saveVoice="saveVoice" @backup="backup"></add-voice>
        </el-dialog>
      </div>
      <div v-if="modal2">
        <el-dialog :visible.sync="modal2" width="30%" title="播放广播" :append-to-body="true" :close-on-click-modal="false">
          <el-form :model="form" label-width="100px">
            <el-form-item label="文件编号">
              <el-select v-model="form.sound" filterable allow-create default-first-option placeholder="请选择或者输入文件编号" style="width:100%;">
                <el-option
                  v-for="item in radioFiles"
                  :key="item.k"
                  :label="item.v+'('+item.k +')'"
                  :value="item.k">{{item.v+'('+item.k +')'}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="音量">
              <el-slider v-model="form.volume" :max="30" show-input></el-slider>
            </el-form-item>
          </el-form>
          <div slot="footer">
              <el-button size="small" @click="closeV">取消</el-button>
              <el-button size="small" type="primary" @click="playV(false,false)">播放</el-button>
          </div>
        </el-dialog>
      </div>
</el-card>
</template>
<script>
import api from "src/api";
import store from "src/store";
import _ from "lodash";
import addVoice from "../../business_bar/addVoice.vue";

var recorder, playerAudio;
export default {
  name: "route-index",
  components: {
    // GisMap,
    addVoice
  },
  data() {
    return {
      form: {
        sound: "",
        volume: 15
      },
      nowob: {},
      modal2: false,
      radioFiles: [],
      changePos: false,
      tabname: "name1",
      changedata: {},
      isAdd: false,
      broadcastList: [],
      // allStation:[],
      // allPosition:[],
      multipleSelection: [],
      // formItem: {},
      voices: {},
      modal1: false,
      title: "添加/修改",
      player: false,
      visible: false,
      selectall: true,
      state: store.state,
      action: store.actions,
      allList: [],
      audioChuncks: [],
      isflag: false,
      ruleInline: {
        // positionId:{required: true, message: '不能为空', trigger: 'change' }
      }
    };
  },
  computed: {},
  watch: {
    $route: "fetchData",
    "state.skIndex": {
      handler: function(val) {
        //    this.getDevice()
        this.realStatus();
      },
      deep: true
    },
    "state.updateall": {
      handler: function(val) {
        // this.action.getOwnList()
      },
      deep: true
    },
    // "state.surePass": {
    //   handler: function(val) {
    //     this.tabname = "name2";
    //   },
    //   deep: true
    // }
  },
  methods: {
    changeMode(row) {
      this.$confirm(
        `是否切换为${
          !row.controlmode
            ? "手动控制模式?手动控制模式时,该设备任何联动控制命令将不会触发,只能手动操作!"
            : "自动控制模式?自动控制模式将不能进行手动操作!"
        }`,
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "info" }
      )
        .then(() => {
          row.controlmode = row.controlmode ? 0 : 1;
          this.saveVoice(row);
        })
        .catch(() => {
          this.$message({ type: "warning", message: "操作已取消" });
        });
    },
    openfile(row) {
      this.form = {
        sound: "",
        volume: 15
      };
      this.nowob = row;
      this.modal2 = true;
    },
    closeV() {
      this.modal2 = false;
    },

    playV(row, bool) {
      row = row || this.nowob;
      let msgob = {
        type: this.state['sensorConfig']['voice'],
        id: row.radioId,
        ip: row.ip,
        sound: bool ? 0 : parseInt(this.form.sound),
        volume: bool ? 1 : parseInt(this.form.volume) || 30
      };
      console.log(msgob);
      api.video.operation(msgob).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
      this.modal2 = false;
    },
    selectOnes(row, event, column) {},

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    saveVoice(obj) {
      console.log(obj);
      var me = this;
      delete obj.now_status;
      delete obj.now_value;
      delete obj.showColor;
      delete obj.statusText;
      delete obj.k;
      api.video.addup(obj).then(function(res) {
        console.log(res, "res++");
        if (res.data.status == 0) {
          me.$message.success("操作成功!");
          me.backup();
        } else if (res.data.isuse == 1) {
          me.$message.error(res.data.msg);
        } else {
          me.$message.error(res.data.msg);
          me.backup();
        }
      });
    },
    backup() {
      this.modal1 = false;
      this.getallList();
      this.action.getOwnList();
    },
    cancel() {
      // this.$refs.GisMap.clean()
      this.changePos = false;
    },
    tabClick() {
        console.log(this.tabname)
      if (this.tabname == "name2") {
      }
    },
    otherData() {
      let me = this;
      api.switchs.getStation().then(res => {
        console.log(res.data.data, "分站");
        if (res.data.status == 0) {
          me.allStation = res.data.data;
        }
      });
      api.gas.getAllPosition().then(function(res) {
        if (res.data.status == 0) {
          me.allPosition = res.data.data;
        }
      });
      api.searchs.getallData().then(res => {
        console.log(res, "dddddd");
        me.radioFiles = res.data.radio; //语音播放
      });
      this.getallList();
    },
    getallList() {
      api.video.getRadioList().then(res => {
        if (res.data.status === 0) {
          this.allList = res.data.data.map(item => {
            item.k = item.ip + ":" + item.radioId + ":" + this.state['sensorConfig']['voice'];
            return item;
          });
          this.realStatus();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    realStatus() {
      this.allList = this.allList.map(item => {
        if (this.state.AllhashSensor[item.k]) {
          // item.now_status = this.state.AllhashSensor[item.k].now_status;
          item.now_value = this.state.AllhashSensor[item.k].now_value;
          item.showColor = this.state.AllhashSensor[item.k].showColor;
          item.statusText = this.state.AllhashSensor[item.k].statusText;
        }
        return item;
      });
    },
    addupBroadcast(row) {
      if (row == -1) {
        this.voices = {};
        this.title = "添加广播分站";
      } else {
        console.log(row);
        // _.assign(this.voices,row.ob)
        this.voices = row;
        this.title = "修改广播分站";
      }
      this.modal1 = true;
    },
    delBroadcast(row) {
      console.log(row, "删除");
      let me = this;
      me.$confirm("确认删除该广播站?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.video.delete(row).then(function(res) {
            console.log(res, "接口");
            if (res.data.status == 0) {
              me.action.getOwnList();
              me.getallList();
              me.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          me.$message({
            type: "warning",
            message: "操作已取消"
          });
        });
    },
    // funStart(button) {
    //   if (this.multipleSelection.length) {
    //     console.log("开始");
    //     this.player = true;
    //     recorder.start();
    //   } else {
    //     this.$message.warning("请选择广播站！");
    //   }
    // },
    // funStop(button) {
    //   this.player = false;
    //   recorder.stop();
    //   recorder.getMp3Blob(function(blob) {
    //     var url = URL.createObjectURL(blob);
    //     var div = document.createElement("div");
    //     var au = document.createElement("audio");
    //     var hf = document.createElement("a");
    //     au.controls = true;
    //     au.src = url;
    //     hf.href = url;
    //     hf.download = new Date().toISOString() + ".mp3";
    //     hf.innerHTML = hf.download;
    //     div.appendChild(au);
    //     div.appendChild(hf);
    //     document.getElementById("recordingslist").appendChild(div);
    //   });
    // },
    // toStr(buf) {
    //   return String.fromCharCode.apply(null, new Uint16Array(buf));
    // },
    // recording(data) {
    //   //console.log(new Float32Array(data))
    //   //this.action.websocketsend(new Blob(data,{type:'audio/mp3'}))
    // },
    // testPlayer(buf) {
    //   this.audioChuncks.push(new Float32Array(buf));
    //   if (!this.isflag && this.audioChuncks.length > 2) {
    //     this.myplay();
    //   }
    // },
    // myplay() {
    //   let me = this;
    //   this.isflag = true;
    //   playerAudio.start();
    //   //创建播放音频对象
    //   //                let    myBuffer = audioCtx.createBuffer(1, 16384, audioCtx.sampleRate),
    //   //                       source = audioCtx.createBufferSource(),
    //   //                       recorders = audioCtx.createScriptProcessor(16384, 1, 1);
    //   //                       source.connect(recorders);
    //   //                       recorders.connect(audioCtx.destination);
    //   //                       recorders.onaudioprocess = function(ev){
    //   //                           //播放audioChuncks里面真正的二进制数据
    //   //                           ev.outputBuffer.copyToChannel(me.audioChuncks.shift() || new Float32Array(16384), 0, 0);
    //   //                           if(!me.audioChuncks.length){
    //   //                                  console.log('播放结束？')
    //   //                                  source.disconnect()
    //   //                                  recorders.disconnect()
    //   //                           }else{
    //   //                               console.log('播放中？')
    //   //                           }
    //   //                           console.log(me.audioChuncks)
    //   //                      };
    // }
  },
  mounted() {
    let me = this;
    this.otherData();
    // this.getDevice()
    this.state.isOpenReal = true;
    //this.getAllBroadcast()

    //播放
    /*******************************11-13tan注释******************************* */
    /*
            var MP3Player = function(){
                var player = this,
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
                    myBuffer = audioCtx.createBuffer(1, 16384, audioCtx.sampleRate),
                    source = audioCtx.createBufferSource(),
                    recorders = audioCtx.createScriptProcessor(16384, 1, 1);
                    recorders.onaudioprocess = function(ev){
                           //播放audioChuncks里面真正的二进制数据
                           ev.outputBuffer.copyToChannel(me.audioChuncks.shift() || new Float32Array(16384), 0, 0);
                           if(!me.audioChuncks.length){
                                  console.log('end..')
                                  source.disconnect()
                                  recorders.disconnect()
                                  me.isflag = false
                           }else{
                               console.log('player..')
                           }
                           console.log('录音的音频流',me.audioChuncks)
                    };
                    player.start = function(){
                        if(source && recorders){
                            source.connect(recorders);
                            recorders.connect(audioCtx.destination);
                        }
                    };
                    player.stop = function() {
                        if (source && recorders) {
                             source.disconnect()
                             recorders.disconnect()
                        }
                    };

            }
            playerAudio = new MP3Player()

            //录音
            var MP3Recorder = function(config) {
                var recorder = this;
                config = config || {};
                config.sampleRate = config.sampleRate || 44100;
//                config.bitRate = config.bitRate || 128;
//                config.sampleRate =  44100/6;
                config.bitRate = 8;
//            console.log(navigator.mediaDevices.getUserMedia,'navigator.mediaDevices.getUserMedia')
//            console.log(navigator.getUserMedia,'navigator.getUserMedia')
//                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                if (navigator.mediaDevices.getUserMedia) {
                    var media = navigator.mediaDevices.getUserMedia({ audio: true});
                        media.then(function(stream){
                                   var context = new AudioContext(),
                                    realTimeWorker = new Worker('./static/video/worker-realtime.js'),
                                    microphone = context.createMediaStreamSource(stream),
        //                          processor = context.createScriptProcessor(4096, 1, 1), //bufferSize大小，输入channel数，输出channel数
                                    processor = context.createScriptProcessor(16384, 1, 1), //bufferSize大小，输入channel数，输出channel数
        //                          processor = context.createScriptProcessor(null, 1, 1), //bufferSize大小，输入channel数，输出channel数
                                    mp3ReceiveSuccess,
                                    currentErrorCallback;
                                    config.sampleRate = context.sampleRate;
                                    realTimeWorker.postMessage({
                                        cmd: 'init',
                                        config: {
                                            sampleRate: config.sampleRate,
                                            bitRate: config.bitRate
                                        }
                                    });
        //                          录制中的音频数据流...
                                    processor.onaudioprocess = function(event){
                                            var array = event.inputBuffer.getChannelData(0);
                                           me.testPlayer(array)
                                            //边录音边转换
                                            realTimeWorker.postMessage({
                                                cmd: 'encode',
                                                buf: array
                                            });
                                    };
                                    realTimeWorker.onmessage = function(e) {
                                        switch (e.data.cmd) {
                                            case 'init':
                                                if (config.funOk) {
                                                    config.funOk();
                                                }
                                                break;
                                            case 'recording':
                                                me.recording(e.data.buf)
                                                // me.testPlayer(e.data.buf)
                                                break;
                                            case 'end':
                                                if (mp3ReceiveSuccess) {
                                                    mp3ReceiveSuccess(new Blob(e.data.allBuf, {
                                                        type: 'audio/mp3'
                                                    }));
                                                }
//                                                me.recording(e.data.buf)
                                                break;
                                            case 'error':
                                                if (currentErrorCallback) {
                                                    currentErrorCallback(e.data.error);
                                                }
                                                break;
                                        }
                                    };
                                    recorder.start = function() {
                                        if (processor && microphone) {
                                            microphone.connect(processor);
                                            processor.connect(context.destination);
                                        }
                                    };
                                    recorder.stop = function() {
                                        if (processor && microphone) {
                                            microphone.disconnect();
                                            processor.disconnect();
                                        }
                                    };
                                    recorder.getMp3Blob = function(onSuccess, onError) {
                                        currentErrorCallback = onError;
                                        mp3ReceiveSuccess = onSuccess;
                                        realTimeWorker.postMessage({
                                            cmd: 'finish'
                                        });
                                    };

                        });
                        media.catch(function(error){
                                var msg;
                                switch (error.code || error.name) {
                                    case 'PERMISSION_DENIED':
                                    case 'PermissionDeniedError':
                                        msg = '用户拒绝访问麦客风';
                                        break;
                                    case 'NOT_SUPPORTED_ERROR':
                                    case 'NotSupportedError':
                                        msg = '浏览器不支持麦客风';
                                        break;
                                    case 'MANDATORY_UNSATISFIED_ERROR':
                                    case 'MandatoryUnsatisfiedError':
                                        msg = '找不到麦客风设备';
                                        break;
                                    default:
                                        msg = '无法打开麦克风，异常信息:' + (error.code || error.name);
                                        break;
                                }
                                if (config.funCancel) {
                                    config.funCancel(msg);
                                }
                        });
                } else {
                    if (config.funCancel) {
                        config.funCancel('当前浏览器不支持录音功能');
                    }
                }
            }
            recorder = new MP3Recorder({
                debug: true,
                funOk: function() {
//                    document.getElementById("btnStart").disabled = false;
                },
                funCancel: function(msg) {
                    recorder = null;
                }
            });

            */
  }
};
</script>
