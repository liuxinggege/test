<style>
.list-title {
    background-color: #e9eaec;
    padding: 10px 0;
    font-weight: 600;
    text-indent: 15px;
    overflow: hidden;
}
.set_card_box{
    position: absolute;
    top: 32px;
    left: 0;
    z-index: 1000;
    width: 600px;
}
.action_button{
    color:rgb(32,160,255);
    cursor: pointer;
    margin-right: 5px;
}
</style>
<template>
  <el-form ref="formInline" :model="formInline" :rules="ruleInline" label-width="110px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="区域名称" prop="areaname">
          <el-input v-model="formInline.areaname" size="mini" style="width:100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="区域说明" prop="remark">
          <el-input v-model="formInline.remark" size="mini" style="width:100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="允许时长(分钟)" prop="max_time">
          <el-input-number :min="0" v-model="formInline.max_time" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最大人数" prop="max_allow">
          <el-input-number :min="0" v-model="formInline.max_allow" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="重点区域" prop="emphasis">
          <el-select v-model="formInline.emphasis" size="mini" placeholder="请选择是否为重点区域">
            <el-option :value="1" key="1" label="否">否</el-option>
            <el-option :value="2" key="2" label="是">是</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="限制区域">
          <el-select
            @change="changeAstrict"
            v-model="formInline.default_allow"
            size="mini"
            placeholder="请选择是否为限制区域">
            <el-option :value="1" key="1" label="否">否</el-option>
            <el-option :value="2" key="2" label="是">是</el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="roll">
      <el-input v-model="cardStr" size="mini" style="width:200px;" disabled></el-input>
      <el-button size="mini" @click=" setCardBox= true ">设置{{roll}}</el-button>
      <el-checkbox style="margin-left:30px;" v-model="checked">出入口</el-checkbox>
      <div v-if="setCardBox" class="set_card_box">
        <el-tabs type="border-card">
          <el-tab-pane :label="roll">
            <el-table :data="formInline.workers"  height="300" border stripe>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="rfcard_id" label="卡号"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <span class="action_button" @click="delOnlyCard(scope.row)">移除</span>
                        </template>
                    </el-table-column>
            </el-table>
            <el-button @click="setCardBox=false" style="float:right;margin-top:10px;">确定</el-button>
            <el-button v-if="formInline.workers.length" @click="delAllCard" style="float:right;margin:10px 20px 0 0;">全部移除</el-button>
          </el-tab-pane>
          <el-tab-pane label="添加">
            <el-form ref="formquery" :model="formquery">
              <el-row type="flex" justify="space-between" class="code-row-bg">
                <el-col :span="7">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="formquery.name" size="mini" style="width:100px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="部门" prop="depart_id">
                    <el-select v-model="formquery.depart_id" size="mini" style="width:100px;">
                      <el-option
                        v-for="item in getDepartList"
                        :value="item.id"
                        :key="item.name"
                        :label="item.name"
                      >{{item.name}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="工种" prop="worktype_id">
                    <el-select v-model="formquery.worktype_id" size="mini" style="width:100px;">
                      <el-option
                        v-for="item in allWorkType"
                        :value="item.id"
                        :key="item.name"
                        :label="item.name"
                      >{{item.name}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button size="mini" @click="finduser">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="findUserList"  height="300" border stripe>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="rfcard_id" label="卡号"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <span class="action_button" @click="addOnlyCard(scope.row)">添加</span>
                        </template>
                    </el-table-column>
            </el-table>
            <el-button @click="setCardBox=false" style="float:right;margin-top:10px;">确定</el-button>
            <el-button v-if="findUserList.length" @click="addAllCard" style="float:right;margin:10px 20px 0 0">全部添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form-item>
    <p class="list-title">区域组成</p>
    <el-table ref="multipleTable" :data="tableData3" border height="240" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="addr" label="读卡器地址"></el-table-column>
      <el-table-column prop="subname" label="网关IP"></el-table-column>
      <el-table-column prop="position" label="读卡器名称"></el-table-column>
    </el-table>
    <el-form-item style="text-align:right;margin-top:10px;"  v-if="$route.name != 'home_index'">
      <el-button size="mini" type="ghost" @click="handleSubmit('formInline')">保存</el-button>
      <el-button size="mini" type="ghost" @click="$emit('backup')">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import api from 'src/api';
export default {
  props: {
    formInline: Object
  },
  data() {
    const isNull = (rule, value, callback) => {
        if (!value) {
            callback(new Error('不能为空！'));
        } else {
            callback()
        }
    };
    return {
      checked: false,
      setCardBox: false,
      roll: "白名单",
      cardStr: "",
      formquery: {}, //收索员工请求form
      getDepartList: [], //所有部门
      allWorkType: [], //所有工种
      findUserList: [], //收索员工卡号
      multipleTable: [],
      surplusCard: [], //所有未被划分的读卡器
      tableData3:[],
      ruleInline: {
        remark: { required: true, message: "不能为空", trigger: "change" },
        areaname: { required: true, message: "不能为空", trigger: "change" },
        is_exit: { validator: isNull, trigger: "change" },
        emphasis: { validator: isNull, trigger: "change" }
      }
    };
  },
  created() {
    this.getList();
    if(this.formInline.id){
          this.checked = this.formInline.is_exit == 1;
          this.changeAstrict(this.formInline.default_allow)
          this.getUndivideCard(this.formInline.cardreders)
          this.cardStr = this.getCardStr(this.formInline.workers)
    }else{
        this.checked = false;
        this.changeAstrict(this.formInline.default_allow);
        this.getUndivideCard();
        this.cardStr='';
    }
  },
  mounted() {},
  methods: {
    getList(){
        api.routeLine.getDepartList().then(res => {
          if (res.data.status === 0) {
            this.getDepartList = res.data.data;
          }
        });
        api.routeLine.getWorkType().then(res => {
          if (res.data.status === 0) {
            this.allWorkType = res.data.data;
          }
        });
    },
    changeAstrict(val) {
      if (val == 1) this.roll = "黑名单";
      if (val == 2) this.roll = "白名单";
    },
    //按条件获取员工信息
    finduser() {
      this.findUserList = [];
      api.routeLine.getstaff(this.formquery).then(res => {
        if (res.data.status === 0 && res.data.data.length > 0)
          this.findUserList = res.data.data;
      });
      this.formquery = {};
    },
    //单个移除
    delOnlyCard(row) {
      for (let i = 0; i < this.formInline.workers.length; i++) {
        if (this.formInline.workers[i].id == row.id) {
          this.formInline.workers.splice(i, 1);
          break;
        }
      }
      this.cardStr = this.getCardStr(this.formInline.workers);
    },
    //全部移除
    delAllCard() {
      this.$confirm("是否全部移除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.formInline.workers = [];
          this.cardStr = this.getCardStr(this.formInline.workers);
          this.$message({
            type: "success",
            message: "操作成功，已经全部移除!"
          });
        })
        .catch(() => {
          this.$message({ type: "warning", message: "操作已取消" });
        });
    },
    //单个添加特殊卡片
    addOnlyCard(row) {
      let flag = false;
      for (let i = 0; i < this.findUserList.length; i++) {
        if (this.findUserList[i].id == row.id) {
          this.findUserList.splice(i, 1);
          break;
        }
      }
      for (let item of this.formInline.workers) {
        if (item.id == row.id) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.formInline.workers.push(row);
      }
      this.cardStr = this.getCardStr(this.formInline.workers);
      this.$message({ type: "success", message: "添加成功" });
    },
    //批量添加
    addAllCard() {
      if (!this.findUserList.length) {
        return;
      }
      this.formInline.workers = this.cardDeWeight(
        this.formInline.workers.concat(this.findUserList)
      );
      this.findUserList = [];
      this.cardStr = this.getCardStr(this.formInline.workers);
      this.$message({ type: "success", message: "添加成功" });
    },
    //去重
    cardDeWeight(data) {
      let newArr = [];
      for (let i = 0; i < data.length; i++) {
        let flag = this.isOwn(newArr, data[i].id);
        if (!flag) {
          newArr.push(data[i]);
        }
      }
      return newArr;
    },
    isOwn(arr, id) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return true;
        }
      }
    },
    getCardStr(arr) {
      return arr
        .map(item => {
          return item.rfcard_id;
        })
        .join(",");
    },
    // 获取所有未被划分区域的读卡器
    getUndivideCard(rows) {
      this.surplusCard = [];
      api.routeLine.getUndivideCard().then(res => {
        console.log(res)
        if (res.data.status === 0) {
          this.surplusCard = res.data.data;
          if (!rows) {
            this.tableData3 = res.data.data;
          } else {
            this.tableData3 = rows.concat(res.data.data);
            setTimeout(() => {
              this.toggles(rows);
            }, 1);
          }
        }
      });
    },
    toggles(rows) {
      this.tableData3.forEach(row => {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].id === row.id) {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    //            保存
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          delete this.formInline._rowKey;
          delete this.formInline._index;
          this.formInline.cardreders = this.multipleTable;
          this.formInline.workers.forEach(ob => {
            delete ob._rowKey;
            delete ob._index;
          });
          this.checked
            ? (this.formInline.is_exit = 1)
            : (this.formInline.is_exit = 0);
          api.routeLine.addupArea(this.formInline).then(res => {
            if (res.data.status === 0) {
                // this.initArea();
                // this.dialog1 = false;
                this.$emit('backup')       
            }
          });
        } else {
          this.$message.error("操作失败！");
        }
      });
    }
  }
};
</script>