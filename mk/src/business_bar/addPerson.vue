<style lang="less">
</style>
<template>
  <el-form :model="formItem" label-width="100px" :rules="ruleInline" ref="formItem" inline>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12" >
        <el-form-item label="工号">
          <el-input size="small" v-model="formItem.num"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" >
        <el-form-item label="姓名">
          <el-input size="small" v-model="formItem.name" :disabled="!!formItem.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12" >
        <el-form-item label="卡号" prop="rfcard_id">
          <el-input size="small" v-model="formItem.rfcard_id"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" >
        <el-form-item label="电话号码" prop="phone">
          <el-input size="small" v-model="formItem.phone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12" >
        <el-form-item label="灯牌号">
          <el-input size="small" v-model="formItem.lamp_brand"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" >
        <el-form-item label="身份证号" prop="idnumber">
          <el-input size="small" v-model="formItem.idnumber" :disabled="!!formItem.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12" >
        <el-form-item label="出生年月">
          <el-date-picker
            v-model="startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择出生年月"
            size="small"
            style="width: 165px"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="每月下井次数">
          <el-input size="small" v-model="formItem.num_month"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12">
        <el-form-item label="工种">
          <el-select size="small" v-model="formItem.worktype_id" style="width:165px">
            <el-option v-for="item in typeList" :value="item.id" :key="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职务">
          <el-select
            size="small"
            v-model="formItem.duty"
            style="width:165px"
            filterable
            allow-create
          >
            <el-option v-for="item in dutyList" :key="item.id" :label="item.v" :value="item.v"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12">
        <el-form-item label="工作区域" prop="workplace_id">
          <el-select
            v-model="formItem.workplace_id"
            style="width:165px"
            filterable
            allow-create
            size="small"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.areaname"
              :value="item.id"
            >
              <span style="float: left">{{ item.areaname }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
              >{{ item.emphasis ==1?'':'重点'}}{{item.default_allow ==1?'':'限制'}}区域</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="工作时间" prop="classes_id">
          <el-select
            v-model="formItem.classes_id"
            style="width:165px"
            filterable
            allow-create
            size="small"
          >
            <el-option v-for="item in Schedule" :key="item.id" :label="item.week" :value="item.id">
              <span style="float: left">{{ item.week }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dayrange }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12">
        <el-form-item label="在职状态">
          <el-select size="small" v-model="formItem.isuse" style="width:165px">
            <el-option
              v-for="item in statusList"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" >
        <el-form-item label="门禁卡号">
          <el-input size="small" v-model="formItem.entranceGuardNum"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
      <el-col :span="12" >
        <el-form-item label="性别">
          <el-radio class="radio" v-model="formItem.gender" label="1">男</el-radio>
          <el-radio class="radio" v-model="formItem.gender" label="2">女</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属部门">
          <el-select size="small" v-model="formItem.depart_id" style="width:162px;">
            <el-option
              v-for="item in department"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item style="float:right;">
        <el-button type="ghost" @click="backup" size="small">取消</el-button>
        <el-button
          type="primary"
          @click="sure('formItem')"
          icon="el-icon-message"
          style="margin-right:15px;"
          size="small"
        >保存</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
import api from "src/api";
import store from "src/store";

export default {
  props: ["formItem"],
  data() {
    var checkIDcard = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号，不能为空！"));
      }
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value) === false) {
        callback(new Error("身份证输入不合法"));
      } else {
        callback();
      }
    };
    var checkphone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话号码，不能为空！"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("格式不正确或者号码不对"));
      } else {
        callback();
      }
    };
    var checkcard = (rule, value, callback) => {
      console.log(value);
      if (value === undefined) {
        callback(new Error("请输入卡号，不能为空！"));
      } else {
        api.routeLine
          .validate({ rfcard_id: value, id: this.checkId })
          .then(function(res) {
            console.log(res);
            if (res.data.status == 0) {
              callback();
            } else {
              callback(new Error("卡号已经存在！"));
            }
          });
      }
    };
    return {
      state: store.state,
      action: store.actions,
      typeList: [],
      Schedule: [],
      department: [],
      dutyList: [],
      areaList: [],
      statusList: [
        {
          id: 1,
          name: "在职"
        },
        {
          id: 2,
          name: "离职"
        }
      ],
      ruleInline: {
        phone: [{ validator: checkphone, trigger: "blur" }],
        rfcard_id: [{ validator: checkcard, trigger: "blur" }],
        idnumber: [{ validator: checkIDcard, trigger: "blur" }]
      }
    };
  },
  methods: {
    getWorktype() {
      var vm = this;
      api.routeLine.getWorkType().then(function(res) {
        if (res.data.status == 0) {
          vm.typeList = res.data.data;
        } else {
          vm.$message.error(res.data.msg);
        }
      });
    },
    getDutyAndWorkplace() {
      let me = this;
      api.searchs.getallData().then(res => {
        if (res.data.status == 0) {
          me.dutyList = res.data.duty; //职务
        } else {
          me.$message.error(res.data.msg);
        }
      });
    },
    getdepart() {
      let me = this;
      api.routeLine.getDepartList().then(function(res) {
        if (res.data.status === 0) {
          me.department = res.data.data;
        } else {
          me.$message.error(res.data.msg);
        }
      });
    },
    getSchedule() {
      var vm = this;
      api.routeLine.getSchedule().then(function(res) {
        if (res.data.status == 0) {
          vm.Schedule = res.data.data;
        } else {
          vm.$message.error(res.data.msg);
        }
      });
    },
    getAllarea() {
      let me = this;
      api.routeLine.getAllarea().then(function(res) {
        if (res.data.status === 0) {
          me.areaList = res.data.data;
        } else {
          me.$message.error(res.data.msg);
        }
      });
    },
    backup() {
      this.$emit("backup");
    },
    sure() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          api.routeLine.addstaff(this.formItem).then(res => {
            if (res.data.status === 0) {
              this.action.getCard();
              this.$emit("saveDate");
            }
          });
        }
      });
    },
    setDepart() {
      this.$emit("check");
      this.$router.push({ name: "department" });
    },
    setTime() {
      this.$emit("check");
      this.$router.push({ name: "schedule" });
    },
    setArea() {
      this.$emit("check");
      this.$router.push({ name: "areaSetting" });
    }
  },
  mounted() {
    this.getWorktype();
    this.getdepart();
    this.getSchedule();
    this.getAllarea();
    this.getDutyAndWorkplace();
  }
};
</script>
