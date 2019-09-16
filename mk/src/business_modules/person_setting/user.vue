<template>
  <el-card>
    <p slot="header">
      <span class="fa fa-user">人员管理</span>
    </p>
    <div v-if="detailsearch">
      <div>
        <el-row>
          <el-form :inline="true" :model="searchdetail">
            <el-form-item label="工种" v-if="!showcard">
              <el-select
                v-model="searchdetail.worktype_id"
                clearable
                placeholder="员工类型"
                size="small"
              >
                <el-option
                  v-for="item in typeList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="员工名" v-if="!showcard">
              <el-input v-model="searchdetail.name" placeholder="输入员工名" size="small"></el-input>
            </el-form-item>
            <el-form-item label="卡号">
              <el-input
                v-model="formInline.card_id"
                @keyup.native="getCardNum($event)"
                placeholder="请输入卡号关键字"
                size="small"
              ></el-input>
              <div
                v-if="userList.length!=0"
                class="select_box"
                style="width:185px;position: absolute;z-index: 555;cursor: pointer;"
              >
                <el-table :data="userList" border @row-click="selects" max-height="220">
                  <el-table-column v-for="item in columns1" :prop="item.key" :label="item.title"></el-table-column>
                </el-table>
              </div>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">查询</el-button>
              <el-button
                type="warning"
                @click="reset0"
                icon="el-icon-warning"
                v-if="showcard"
                size="small"
              >强制出井</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </div>
    <el-row>
      <div class="pull-right" style="margin-bottom: 5px;">
        <el-button type="primary" icon="el-icon-search" @click="opensearch(1)" size="small">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="opensearch(-1)" size="small">卡片管理</el-button>
        <el-button type="info" icon="el-icon-plus" @click="addSure(-1)" size="small">新增员工</el-button>
        <el-button type="warning" icon="el-icon-edit" @click="addSure(0)" size="small">批量编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="batchdel" size="small">批量删除</el-button>
      </div>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tree
          :data="departlist"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="[-2]"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="20" :offset="0">
        <el-table
          :data="state.showlist"
          stripe
          border
          style="width: 100%"
          v-if="showdata"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="rfcard_id" label="卡号" width="75"></el-table-column>
          <el-table-column prop="lamp_brand" label="灯牌号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column label="性别">
            <template scope="scope">
              <span>{{genderList[scope.row.gender-1]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="工作区域">
            <template scope="scope">
              <span v-if="scope.row.workplace!=' '">{{scope.row.workplace}}</span>
              <span v-else>未配置工作区域</span>
            </template>
          </el-table-column>
          <el-table-column label="工作时间">
            <template scope="scope">
              <span v-if="scope.row.dayrange!=' '">{{scope.row.dayrange}}</span>
              <span v-else>未配置工作时间</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="电话" show-overflow-tooltip></el-table-column>
          <el-table-column label="部门">
            <template scope="scope">
              <span v-if="scope.row.departname!=' '">{{scope.row.departname}}</span>
              <span v-else>未配置部门</span>
            </template>
          </el-table-column>
          <el-table-column label="工种">
            <template scope="scope">
              <span v-if="scope.row.worktypename!=' '">{{scope.row.worktypename}}</span>
              <span v-else>未配置工种</span>
            </template>
          </el-table-column>
          <el-table-column label="门禁卡号">
            <template scope="scope">
              <span v-if="scope.row.entranceGuardNum">{{scope.row.entranceGuardNum}}</span>
              <span v-else>未配置门禁卡号</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template scope="scope">
              <el-button
                @click="sureDelete([scope.row.id],[scope.row.posta])"
                type="text"
                size="small"
              >删除</el-button>
              <el-button @click="addSure(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <my-pagination></my-pagination>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      title="新增/编辑员工"
      width="650px"
    >
      <el-form :model="formItem" label-width="100px" :rules="ruleInline" ref="formItem" inline>
        <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
          <el-col :span="12" v-show="showedit">
            <el-form-item label="工号">
              <el-input size="small" v-model="formItem.num" v-show="showop"></el-input>
              <el-input size="small" v-model="formItem.num" v-show="!showop" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showedit">
            <el-form-item label="姓名">
              <el-input size="small" v-model="formItem.name" :disabled="!!formItem.id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
          <el-col :span="12" v-show="showedit">
            <el-form-item label="卡号" prop="rfcard_id">
              <el-input size="small" v-model="formItem.rfcard_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showedit">
            <el-form-item label="电话号码" prop="phone">
              <el-input size="small" v-model="formItem.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
          <el-col :span="12" v-show="showedit">
            <el-form-item label="灯牌号">
              <el-input size="small" v-model="formItem.lamp_brand"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showedit">
            <el-form-item label="身份证号" prop="idnumber">
              <el-input size="small" v-model="formItem.idnumber" :disabled="!!formItem.id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
          <el-col :span="12" v-show="showedit">
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
                <el-option
                  v-for="item in typeList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                ></el-option>
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
                <el-option
                  v-for="item in Schedule"
                  :key="item.id"
                  :label="item.week"
                  :value="item.id"
                >
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
          <el-col :span="12" v-show="showedit">
            <el-form-item label="门禁卡号">
              <el-input size="small" v-model="formItem.entranceGuardNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="code-row-bg" style="padding-top:15px;">
          <el-col :span="12" v-show="showedit">
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
            <el-button type="ghost" @click="cancel" size="small">取消</el-button>
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
      <div slot="footer"></div>
    </el-dialog>
  </el-card>
</template>

<script>
import api from "src/api";
import store from "src/store";
import _ from "lodash";

export default {
  name: "role",
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
      if (value === undefined) {
        callback(new Error("请输入卡号，不能为空！"));
      } else {
        api.routeLine
          .validate({ rfcard_id: value, id: this.checkId })
          .then(function(res) {
            if (res.data.status == 0) {
              callback();
            } else {
              callback(new Error("卡号已经存在！"));
            }
          });
      }
    };
    return {
      department: [],
      startTime: "",
      showcard: false,
      formInline: {},
      dutyList: [],
      detailsearch: false,
      showedit: true,
      showop: true,
      showdata: false,
      batchLength: true,
      action: store.actions,
      store: {},
      columns1: [
        {
          width: 100,
          title: "姓名",
          key: "name"
        },
        {
          width: 100,
          title: "卡号",
          key: "rfcard_id"
        }
      ],
      formItem: {
        entranceGuardNum: "",
        num: "",
        name: "",
        rfcard_id: "",
        phone: "",
        lamp_brand: "",
        workplace_id: "",
        gender: "",
        depart_id: "",
        isuse: 1,
        worktype_id: "",
        num_month: "",
        duty: "",
        birthday: "",
        classes_id: 1
      },
      casop: {
        label: "name",
        value: "id",
        children: "list"
      },
      genderList: ["男", "女"],
      searchdetail: {
        worktype_id: "",
        rfcard_id: "",
        name: ""
      },
      dep: [],
      areaList: [],
      checkId: "",
      Schedule: [],
      selectedOptions: [],
      typeList: [],
      watchdep: 0,
      watchstatus: "",
      stafflist: [],
      multipleSelection: [],
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
      defaultProps: {
        children: "list",
        label: "name"
      },
      departlist: [],
      choosed: "",
      state: store.state,
      stafftypelist: [],
      dialogFormVisible: false,
      userList: [],
      ruleInline: {
        phone: [{ validator: checkphone, trigger: "blur" }],
        rfcard_id: [{ validator: checkcard, trigger: "blur" }],
        idnumber: [{ validator: checkIDcard, trigger: "blur" }]
      }
    };
  },
  watch: {
    "state.listinfo": {
      handler: function(newValue, oldValue) {
        this.action.setShowList(this.stafflist);
      },
      deep: true
    },
    "state.updateall": {
      handler: function(val) {
        this.searchstuff({ depart_id: 0, isuse: 1 });
      },
      deep: false
    }
  },
  methods: {
    cancel() {
      this.dialogFormVisible = false;
      this.startTime = "";
    },
    getWorktype() {
      var vm = this;
      api.routeLine.getWorkType().then(function(res) {
        vm.typeList = res.data.data;
      });
    },
    reset0() {
      this.$confirm(
        "该操作会强制该井下员工卡号" +
          this.formInline.card_id +
          "(" +
          this.choosed +
          ")出井,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          api.routeLine
            .clearRedis({
              id: this.formInline.card_id
            })
            .then(res => {
              if (res.data.status === 0) {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    getDepartment() {
      let vm = this;
      api.routeLine.getDepartment().then(res => {
        vm.searchdetail.depart_id = 0;
        vm.dep = res.data.data;
        let wlist = _.cloneDeep(vm.dep);
        wlist.unshift({ id: 0, name: "所有员工", status: 1 });
        vm.departlist = [
          {
            id: -2,
            name: "在职员工",
            list: wlist,
            status: 1
          },
          {
            name: "离职员工",
            status: 2
          }
        ];
        this.searchstuff({ depart_id: 0, isuse: 1 });
      });
    },
    searchstuff(item) {
      if (!item.depart_id) {
        this.watchdep = "";
      }
      item.rfcard_id = this.formInline.card_id;
      api.routeLine.getstaff(item).then(res => {
        if (res.data.status === 0) {
          if (res.data.data.length) {
            this.showdata = true;
            this.stafflist = res.data.data;
            this.action.setShowList(this.stafflist);
          } else {
            this.state.showlist = [];
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    batchdel() {
      this.sureDelete(
        _.map(this.multipleSelection, "id"),
        _.map(this.multipleSelection, "posta")
      );
    },
    sureDelete(idlist, card) {
      this.$confirm("请确认员工是否已经离职?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var vm = this;
          if (vm.watchstatus !== 2) {
            api.routeLine
              .delstaff({
                ids: idlist,
                rfcard_ids: card
              })
              .then(
                res => {
                  if (res.data.status === 0) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.action.getCard();
                    this.store.idlist = "";
                    this.searchstuff({ depart_id: vm.watchdep });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.data.msg
                    });
                  }
                },
                () => {}
              );
          } else if (vm.watchstatus === 2) {
            api.routeLine
              .delstaff({
                ids: idlist,
                rfcard_ids: card
              })
              .then(
                res => {
                  if (res.data.status === 0) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.action.getCard();
                    this.searchstuff({ status: 2 });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.data.msg
                    });
                  }
                },
                () => {}
              );
          }
        })
        .catch(() => {
          this.store.idlist = "";
        });
    },
    addSure(row) {
      if (row == -1) {
        this.showedit = true;
        this.showop = true;
        this.formItem = {};
      } else if (row == 0) {
        this.showedit = false;
        this.formItem = {};
        this.formItem.ids = _.map(this.multipleSelection, "id");
      } else {
        this.showedit = true;
        this.showop = false;
        _.assign(this.formItem, row);
        this.formItem.gender = row.gender + "";
        this.formItem.ids = [];
        this.checkId = row.id;
        this.startTime = row.birthday;
        this.formItem.ids.push(row.id);
      }
      this.dialogFormVisible = true;
    },
    onSubmit() {
      this.searchstuff(this.searchdetail);
    },
    handleNodeClick(data) {
      var vm = this;
      if (data.id) {
        vm.watchdep = data.id;
        vm.searchstuff({ depart_id: vm.watchdep, isuse: 1 });
      } else {
        vm.searchstuff({ isuse: data.status });
        vm.watchstatus = data.status;
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length) {
        this.batchLength = false;
      } else {
        this.batchLength = true;
      }
    },
    opensearch(index) {
      if (index == -1) {
        this.showcard = true;
      } else {
        this.showcard = false;
      }
      this.detailsearch = !this.detailsearch;
    },
    sure() {
      this.formItem.birthday = this.startTime;
      if (this.showedit) {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            api.routeLine.addstaff(this.formItem).then(res => {
              if (res.data.status === 0) {
                this.$message({
                  type: "success",
                  message: "提交成功!"
                });
                if (this.watchstatus == 2 && !this.watchdep) {
                  this.searchstuff({ isuse: 2 });
                } else {
                  this.searchstuff({ depart_id: this.watchdep, isuse: 1 });
                }
                this.dialogFormVisible = false;
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            });
          } else {
            this.$message.error("信息不完善!");
          }
        });
      } else {
        api.routeLine.addstaff(this.formItem).then(res => {
          if (res.data.status === 0) {
            this.$message({
              type: "success",
              message: "提交成功!"
            });
            this.searchstuff({ depart_id: this.watchdep });
            this.dialogFormVisible = false;
          }
        });
      }
    },
    getCardNum(ev) {
      let me = this;
      if (ev.keyCode == 38 || ev.keyCode == 40) return;
      if (!/^[0-9]+$/.test(me.formInline.card_id)) {
        me.userList = [];
        return;
      }
      api.routeLine
        .getstaff({ rfcard_id: me.formInline.card_id })
        .then(function(res) {
          if (res.data.status == 0) {
            me.userList = res.data.data;
          } else {
            me.$message.error(res.data.msg);
          }
        });
    },
    selects(row) {
      let me = this;
      me.nowUser = row;
      me.formInline.card_id = row.rfcard_id;
      me.choosed = row.name;
      me.userList = [];
    },
    closeTable() {
      this.userList = [];
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
    getdepart() {
      let me = this;
      api.routeLine.getDepartList().then(function(res) {
        if (res.data.status === 0) me.department = res.data.data;
      });
    }
  },
  mounted() {
    this.getWorktype();
    this.getDepartment();
    this.getdepart();
    this.getSchedule();
    this.getAllarea();
    this.getDutyAndWorkplace();
  }
};
</script>