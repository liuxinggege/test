<style lang="less">
.ipparse {
  border: 1px solid #e5e9f2;
  border-radius: 3px;
  font-size: 8px;
}
.legend {
  font-weight: bold;
  font-size: 13px;
}
</style>
<template>
  <el-form
    :model="switchForm"
    :rules="ruleInline"
    label-width="110px"
    ref="switchForm"
    style="text-align: left"
    v-loading="loading"
    :element-loading-text="showText"
  >
    <fieldset class="ipparse" v-if="$route.name==='Dsystem'||$route.name==='drainage-index/sample'">
      <el-form-item label="选择分类">
        <el-select v-model="switchForm.drainageId" size="small">
          <el-option
            v-for="item in menuData"
            :value="item.id + 0"
            :key="item.id"
            :label="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
    </fieldset>
    <fieldset class="ipparse">
      <legend class="legend">基本信息</legend>
      <el-form-item label="分站" prop="station">
        <el-select size="small" v-model="switchForm.station" filterable>
          <el-option
            v-for="item in stationList"
            :value="item.id"
            :key="item.ipaddr"
            :label="item.station_name+ ':'+item.ipaddr"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="传感器ID" prop="sensorId">
            <el-input-number
              size="small"
              v-model="switchForm.sensorId"
              :max="255"
              :min="1"
              style="width: 200px;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button
            size="mini"
            type="primary"
            plain
            style="margin-left:5px;"
            @click="checkinfo"
            v-if="switchForm.sensor_type!=53 && switchForm.sensor_type!=54 && switchForm.sensor_type!=56 && switchForm.sensor_type!=71"
          >读取设备参数</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            style="margin:0 15px;"
            @click="writeIn()"
            v-if="switchForm.sensor_type!=53 && switchForm.sensor_type!=54 && switchForm.sensor_type!=56 && switchForm.sensor_type!=71"
          >写入设备参数</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="sensor_type">
            <el-select
              size="small"
              v-model="switchForm.sensor_type"
              @change="chooseType"
              filterable
            >
              <el-option
                v-for="item in getAllSwitch"
                :value="item.id"
                :key="item.v"
                :label="item.v"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监测物理量名称" prop="device_name">
            <el-input size="small" v-model="switchForm.device_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="X坐标" prop="x_point">
            <el-input size="small" v-model="switchForm.x_point"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Y坐标" prop="y_point">
            <el-input size="small" v-model="switchForm.y_point"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="$route.name==='Dsystem'">
        <el-col :span="12">
          <el-form-item label="X坐标" prop="x3_point">
            <el-input size="small" v-model="switchForm.x3_point"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Y坐标" prop="y3_point">
            <el-input size="small" v-model="switchForm.y3_point"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="$route.name==='watching-index/wind'">
        <el-col :span="12">
          <el-form-item label="X坐标" prop="x2_point">
            <el-input size="small" v-model="switchForm.x2_point"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Y坐标" prop="y2_point">
            <el-input size="small" v-model="switchForm.y2_point"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="安装位置" prop="position">
            <el-select
              size="small"
              v-model="switchForm.position"
              filterable
              allow-create
              default-first-option
              style="width:100%;"
            >
              <el-option
                v-for="item in AllPositionList"
                :key="item.id"
                :label="item.v"
                :value="item.v"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="switchForm.sensor_type==56||switchForm.sensor_type==53">
          <el-form-item label="断电范围">
            <el-input size="small" placeholder="请输入断电范围" v-model="switchForm.power_scope" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置类型" prop="position_type_id">
            <el-select
              size="small"
              v-model="switchForm.position_type_id"
              style="width:100%;"
              filterable
            >
              <el-option
                v-for="item in $store.state.posTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域/设施" prop="area_id">
            <el-select size="small" v-model="switchForm.area_id" style="width:100%;" filterable>
              <el-option
                v-for="item in $store.state.watchAreaList"
                :key="item.id"
                :label="item.areaname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
    <fieldset class="ipparse" v-if="nowType.hasfloor==1||nowType.hasfloor==3">
      <legend class="legend">运行参数</legend>
      <el-form-item label="默认状态" prop="break_display">
        <el-select size="small" v-model="switchForm.break_display">
          <el-option :value="0" :key="0" label="常闭">常闭</el-option>
          <el-option :value="1" :key="1" label="常开">常开</el-option>
        </el-select>
        <span style="margin-left:10px;color:red;font-size:12px;">（默认状态配置必须与真实设备安装一致,否则会造成错误）</span>
      </el-form-item>
    </fieldset>
    <fieldset
      class="ipparse"
      v-if="nowType.hasfloor==0"
      v-loading="loading"
      :element-loading-text="showText"
    >
      <legend class="legend">运行参数</legend>
      <el-row>
        <el-col :span="12">
          <el-form-item label="报警条件设置">
            <el-select size="mini" v-model="alarm_status" clearable>
              <el-option v-for="(item,key) in term" :value="key" :label="item + '时报警'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
    <fieldset class="ipparse" v-if=" nowType.hasfloor == 0">
      <legend class="legend">联动设备</legend>
      <el-button size="small" @click="setLink=true">设置联动设备</el-button>
      <div v-if="setLink">
        <el-dialog
          :visible.sync="setLink"
          width="750px"
          :close-on-click-modal="false"
          :append-to-body="true"
          title="设置关联设备"
        >
          <link-bar :sensorList="sensorList" @savelink="savelink" :areasensorList="[]"></link-bar>
          <div slot="footer"></div>
        </el-dialog>
      </div>
    </fieldset>
    <fieldset class="ipparse" v-if="nowType.hasfloor==1">
      <legend class="legend">馈电仪</legend>
      <el-form-item label="馈电传感器">
        <el-select size="mini" v-model="switchForm.feedId">
          <el-option
            v-for="item in feedList"
            :value="item.id"
            :key="item.id"
            :label="item.alais + '('+item.position+ '-' +item.type+')'"
            :disabled="!(item.station==switchForm.station&&item.feedId==0)"
          ></el-option>
        </el-select>
      </el-form-item>
    </fieldset>
    <el-form-item
      style="text-align:right;"
      v-if="$route.query.type!='scan'&&$route.query.type!='demo'&&$route.query.type!='route-scan'&&$route.query.type!='watching-scan'&&$route.query.type!='voice-scan'"
    >
      <el-button size="small" @click="backup('switchForm')">取消</el-button>
      <el-button
        size="small"
        icon="el-icon-message"
        type="primary"
        @click="handleSubmit('switchForm')"
        :loading="isloding"
      >保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import api from "src/api";
import store from "src/store";
import linkBar from "./linkBar.vue";
export default {
  components: {
    linkBar
  },
  props: ["addSwitchForm", "isloding"],
  data() {
    const validateNumber = (rule, value, callback) => {
      var re = /^-?\d+(\.{1}\d+)?$/;
      if (value === "") {
        callback(new Error("不能为空！"));
      } else if (!re.test(value)) {
        callback(new Error("请输入数字！"));
      } else {
        callback();
      }
    };
    const isNull = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不能为空！"));
      } else {
        callback();
      }
    };
    return {
      setLink: false,
      sensorList: [],
      switchForm: {},
      action: store.actions,
      state: store.state,
      showText: "",
      term: {},
      alarm_status: "",
      nowType: {},
      loading: false,
      feedList: [],
      menuData: [],
      startTimes: 0,
      ruleInline: {
        station: { required: true, message: "不能为空", trigger: "change" },
        position: { required: true, message: "不能为空", trigger: "change" },
        break_display: {
          required: true,
          message: "不能为空",
          trigger: "change"
        },
        sensor_type: { validator: isNull, trigger: "change" },
        sensorId: { validator: validateNumber, trigger: "change" },
        x_point: { validator: validateNumber, trigger: "blur" },
        y_point: { validator: validateNumber, trigger: "blur" },
        x2_point: { validator: validateNumber, trigger: "blur" },
        y2_point: { validator: validateNumber, trigger: "blur" },
        x3_point: { validator: validateNumber, trigger: "blur" },
        y3_point: { validator: validateNumber, trigger: "blur" }
      }
    };
  },
  computed: {
    AllPositionList() {
      return this.$store.state.positionList;
    },
    getAllSwitch() {
      return this.$store.state.AllSwitch;
    },
    stationList() {
      return this.$store.state.AllStation;
    }
  },
  watch: {
    getAllSwitch: {
      handler: function(val) {
        if (this.switchForm.sensor_type) {
          this.chooseType(this.switchForm.sensor_type);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch("getAllArea");
    this.$store.dispatch("getPosType");
    if (this.addSwitchForm.id) {
      api.switchs.getOneSwitch(this.addSwitchForm.id).then(res => {
        if (res.data.status == 0) {
          this.switchForm = res.data.data;
          this.init();
        }
      });
    } else {
      this.switchForm = this.addSwitchForm;
      this.init();
    }
  },
  methods: {
    init() {
      if (this.switchForm.sensorList && this.switchForm.sensorList.length) {
        this.sensorList = this.switchForm.sensorList;
      } else {
        this.sensorList = [];
      }
      this.alarm_status = this.switchForm.alarm_status + "";
      // if (this.switchForm.alarm_status === 0) {
      //   this.alarm_status = "0";
      // } else if (this.switchForm.alarm_status === 1) {
      //   this.alarm_status = "1";
      // } else {
      //   this.alarm_status = "";
      // }
      this.fefreshMenu();
      this.getAllData();
    },
    savelink(row) {
      if (row) {
        this.sensorList = row;
      }
      this.setLink = false;
    },
    writeIn(callback) {
      this.deletefield();

      this.switchForm.alarm_status = parseInt(this.alarm_status);
      if(isNaN(this.switchForm.alarm_status)){
        this.switchForm.alarm_status = null
      }
      // if (this.alarm_status === "0") {
      //   this.switchForm.alarm_status = 0;
      // } else if (this.alarm_status === "1") {
      //   this.switchForm.alarm_status = 1;
      // } else {
      //   this.switchForm.alarm_status = null;
      // }
      for (let item of this.stationList) {
        if (this.switchForm.station == item.id) {
          this.switchForm.ipaddr = item.ipaddr;
          break;
        }
      }
      if(this.sensorList.length){
        this.switchForm.power_status = 1;
      }else{
        this.switchForm.power_status = 0;
      }
      let me = this;
      me.loading = true;
      me.showText = "同步写入设备中...";
      me.startTimes = Date.now() + 10 * 1000; //计时
      api.gas.synSwitchSensor(me.switchForm)
        .then(res => {
          if (res.data.status == 0) {
            api.switchs.getstatusImport2(me.switchForm)
              .then(getWrite)
              .catch(err => {
                me.$message.error("操作失败,服务器异常！");
                me.loading = false;
                 callback && me.writeFailed(callback);
              });
          } else {
            me.$message.error("操作失败" + res.data.msg);
            me.loading = false;
             callback && me.writeFailed(callback);
          }
        })
        .catch(err => {
          me.$message.error("操作失败,服务器异常！");
          me.loading = false;
        });
      var getWrite = function(res) {
        if (Date.now() > me.startTimes) {
          //超时
          me.loading = false;
          me.startTimes = null;
          me.$message.warning("操作失败,同步写入设备超时！");
           callback && me.writeFailed(callback);
          return;
        }
        if (res.data.status == 1) {
          me.loading = false;
          me.startTimes = null;
          me.$message.warning("操作失败," + res.data.msg);
           callback && me.writeFailed(callback);
          return;
        }
        if (res.data.status == 0) {
          me.loading = false;
          me.startTimes = null;
          me.$message.success("同步写入设备成功！");
          if (callback) {
            // 写入成功后保存数据库
            callback();
            return;
          } else {
            api.switchs.addSwitch(me.switchForm).then(res => {
              if (res.data.id) {
                me.switchForm.id = res.data.id;
              }
              if (res.data.status === 0) {
                if (res.data.isuse === 1) {
                  me.$message.error(res.data.msg);
                } else if (res.data.success === 1) {
                  me.$message.error(res.data.msg);
                } else {
                  me.action.generate();
                  return;
                }
              } else {
                me.$message.error(res.data.msg);
              }
            });
            return;
          }
        }
        me.timeout = setTimeout(function() {
          api.switchs.getstatusImport2(me.switchForm)
            .then(getWrite)
            .catch(err => {
              me.$message.error("操作失败,服务器异常！");
               callback && me.writeFailed(callback);
            });
        }, 500);
      };
    },
    writeFailed(callback){
        this.$confirm("设备参数写入失败，是否强制保存到数据库。强制保存后可能会被系统自动同步为设备上的运行参数?", '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'info'})
        .then(() => {
            callback();
        }).catch(() => {
            this.$message({type: 'warning',message: '操作已取消'});
        });
    },
    chooseType(id) {
      for (let item of this.getAllSwitch) {
        if (item.id === id) {
          this.nowType = item;
          this.term = item.k;
          break;
        }
      }
    },
    deletefield() {
      delete this.switchForm.is_cutText;
      delete this.switchForm._index;
      delete this.switchForm._rowKey;
      delete this.switchForm.valueText;
      delete this.switchForm.k;
      delete this.switchForm.type0x;
      delete this.switchForm.type;
      delete this.switchForm.debug;
      delete this.switchForm.feedstatusText;
      delete this.switchForm.feedbackText;
      delete this.switchForm.now_value;
      delete this.switchForm.now_status;
      delete this.switchForm.showColor;
      delete this.switchForm.statusText;
      delete this.switchForm.boss;
      delete this.switchForm.key;
      delete this.switchForm.statusChange;
      delete this.switchForm.__gohashid;
      delete this.switchForm.statusChange; //最近一次状态变动及时刻
      delete this.switchForm.action_value;
    },
    handleSubmit(name) {
      this.switchForm.alarm_status = parseInt(this.alarm_status);
      if(isNaN(this.switchForm.alarm_status)){
        this.switchForm.alarm_status = null
      }
      // if (this.alarm_status === "0") {
      //   this.switchForm.alarm_status = 0;
      // } else if (this.alarm_status === "1") {
      //   this.switchForm.alarm_status = 1;
      // } else {
      //   this.switchForm.alarm_status = null;
      // }
      this.$refs[name].validate(valid => {
        if (valid) {
          if(this.switchForm.sensor_type==53||this.switchForm.sensor_type==54||this.switchForm.sensor_type==56||this.switchForm.sensor_type==71){
            this.saveupdate();//控制类开关量
          }else{
            this.writeIn(this.saveupdate);//逻辑开关量保存前先写入
          }     
        } else {
          this.$message.error("操作失败！");
        }
      });
    },
    saveupdate(){
      this.deletefield();
      if(this.sensorList.length){
        this.switchForm.power_status = 1;
      }else{
        this.switchForm.power_status = 0;
      }
      this.switchForm.sensorList = this.sensorList;
      this.$emit("saveUpdate", this.switchForm, false);
      this.$store.dispatch("getPosition");
    },
    backup(switchForm) {
      this.$refs.switchForm.resetFields();
      this.$emit("backup");
    },
    checkinfo() {
      var vm = this;
      var data = {
        sensorId: vm.switchForm.sensorId,
        sensor_type: vm.switchForm.sensor_type
      };
      for (let item of vm.stationList) {
        if (vm.switchForm.station == item.id) {
          data.ipaddr = item.ipaddr;
          break;
        }
      }
      vm.loading = true;
      vm.showText = "同步设备读取中...";
      vm.startTimes = new Date().getTime() + 10 * 1000; //计时
      if (data.ipaddr != "" && data.typeId != "") {
        //读取第一次请求
        api.switchs.gettype(data).then(
          function(res) {
            if (res.data.status == 0) {
              api.switchs.getstatusImport(data).then(func);
            } else {
              vm.loading = false;
              vm.$message({
                message: "同步读取设备错误！",
                type: "warning"
              });
              vm.startTimes = null;
            }
          },
          bad => {
            vm.$message.error("同步读取设备失败!");
          }
        );
        //等待拿读取结果
        var func = function(res) {
          if (Date.now() > vm.startTimes) {
            //超时不再请求
            vm.loading = false;
            vm.$message({
              message: "同步读取设备超时！",
              type: "warning"
            });
            vm.startTimes = null;
            return;
          }
          if (res.data.status == 0) {
            vm.loading = false;
            if (res.data.status == 0) {
              vm.alarm_status = res.data.data.alarm_status + "";
              // if (res.data.data.alarm_status === 0) {
              //   vm.alarm_status = "0";
              // } else if (res.data.data.alarm_status === 1) {
              //   vm.alarm_status = "1";
              // } else {
              //   vm.alarm_status = "";
              // }
              vm.switchForm.term = res.data.data.is_power;
            }
            vm.$message({
              message: "同步读取设备成功！",
              type: "success"
            });
            vm.startTimes = null;
            return;
          }
          if (res.data.status == 1) {
            vm.loading = false;
            vm.$message({
              message: res.data.msg,
              type: "warning"
            });
            vm.startTimes = null;
            return;
          }
          vm.timeout = setTimeout(function() {
            api.switchs.getstatusImport(data).then(func);
          }, 500);
        };
      } else {
        vm.$message.error("ip地址或设备类型不能为空");
      }
    },
    getAllData() {
      this.$store.dispatch("getPosition");
      this.$store.dispatch("getAllSwitch");
      this.$store.dispatch("getStation");
      const me = this;
      // 馈电传感器 和断电器 断馈电仪
      api.switchs.getSwitchList(0).then(res => {
        if (res.data.status == 0) {
          res.data.data.forEach(item => {
            if (item.sensor_type == 54) {
              me.feedList.push(item);
            }
          });
        }
      });
    },
    fefreshMenu() {
      var vm = this;
      api.searchs.dataDrain().then(res => {
        if (res.data.status === 0) {
          if (res.data.data && res.data.data.length) {
            vm.menuData = res.data.data;
          }
        } else {
          vm.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>