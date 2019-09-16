<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <div>
        <el-col class="toolbar1" style="margin-bottom: 20px">
          <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="FAQ">
          </el-popover>
          <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
          <span class="title">FAQ</span>
          <span style="position:absolute; right:0; top:1">
            <el-button type="primary" style="margin:0 10px" icon="el-icon-search" @click="getFaq"> 读取
            </el-button>
            <el-button type="primary" style="margin:0 10px" @click="updateFaq"> 保存
            </el-button>
            <el-button type="primary" style="margin:0 100px 10px 0" icon="el-icon-edit" @click="addFaq"> 添加
            </el-button>
          </span>
        </el-col>
        <el-table :data="faqArr" border highlight-current-row style="width: 100%;margin: 20px 0">
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type='text' icon='el-icon-delete' @click="del(scope.$index)"></el-button>
              <el-button type='text' icon='el-icon-edit' @click="edit(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="问题" align="left" height=50>
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" width="300">
                <p>问题: {{ scope.row.question }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="big">{{ scope.row.question.slice(0,70)+"......" }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="回答" align="left" height=50>
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" width="300">
                <p>回答: {{ scope.row.answer }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.answer.slice(0,70)+"......" }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加小画面 -->
        <el-dialog :visible.sync="addFaqFg" width=700px>
          <div>
            <h3>问题</h3>
            <el-input type='textarea' :autosize='{ minRows:2, maxRows: 10}' style='width:600px; margin:5px' v-model='tmp_question' placeholder='请输入内容'> </el-input>
          </div>
          <div>
            <h3>回答</h3>
            <el-input type='textarea' :autosize='{ minRows:8, maxRows: 10}' style='width:600px; margin:5px' v-model='tmp_answer' placeholder='请输入内容'> </el-input>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveAddFaq"> 确定
          </el-button>
        </el-dialog>
        <!-- 编辑小画面 -->
        <el-dialog :visible.sync="editFaqFg" width=700px>
          <div>
            <h3>问题</h3>
            <el-input type='textarea' :autosize='{ minRows:2, maxRows: 10}' style='width:600px; margin:5px' v-model='tmp_question' placeholder='请输入内容'> </el-input>
          </div>
          <div>
            <h3>回答</h3>
            <el-input type='textarea' :autosize='{ minRows:8, maxRows: 10}' style='width:600px; margin:5px' v-model='tmp_answer' placeholder='请输入内容'> </el-input>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveEditFaq"> 确定
          </el-button>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { FaqState } from "../../store/stateInterface";
import { FaqArr } from "../../store/modules/gameSetting/faq";
import { myDispatch } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Faq extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  faq: FaqState = this.$store.state.faq; //整个marqueState
  faqArr: FaqArr[] = []; //表单数据
  editFaqFg: boolean = false;
  addFaqFg: boolean = false;
  index = 0;
  // 零时数据
  tmp_question = "";
  tmp_answer = "";

  /*method*/
  loadData() {
    myDispatch(this.$store, "GetFaq", {}, true).then(() => {
      this.faqArr = this.faq.faqArr;
    });
  }
  getFaq() {
    this.loadData();
  }
  updateFaq() {
    myDispatch(this.$store, "UpdateFaq", {
      faqs: this.faqArr
    })
      .then(() => {
        if (this.faq.code === 200) {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.loadData();
          return;
        } else {
          this.$message({
            type: "error",
            message: "保存失败!"
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err
        });
        return;
      });
  }
  //添加
  addFaq() {
    if (this.faqArr.length >= 30) {
      this.$message({
        type: "warning",
        message: "公告最多30条!"
      });
    }
    this.tmp_question = "";
    this.tmp_answer = "";
    this.addFaqFg = true;
  }
  //添加保存
  saveAddFaq() {
    if (!this.tmp_question || !this.tmp_answer) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    let tmp = {
      question: this.tmp_question,
      answer: this.tmp_answer
    };
    this.$store.commit("ADD_FAQ", tmp);
    this.addFaqFg = false;
  }
  //编辑
  edit(row, index) {
    this.index = index;
    this.tmp_question = row.question;
    this.tmp_answer = row.answer;
    this.editFaqFg = true;
  }
  //编辑保存
  saveEditFaq() {
    if (!this.tmp_question || !this.tmp_answer) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    let tmp = {
      question: this.tmp_question,
      answer: this.tmp_answer
    };
    this.$store.commit("EDIT_FAQ", { index: this.index, tmp });
    this.editFaqFg = false;
  }
  //删除
  del(index) {
    this.$store.commit("DEL_FAQ", index);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-marquee {
    margin-top: 25px;
    position: relative;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
th {
  text-align: center !important;
}
</style>
