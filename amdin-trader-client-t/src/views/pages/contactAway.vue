<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="转账记录"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">联系方式</span>
      </el-col>
      <el-button type="primary" style="margin-bottom:20px;" @click="add" :disabled="!!pageData.length">新增联系方式</el-button>
      <el-table :data="pageData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" border align="center">
        <el-table-column prop="accountType" label="联系方式" min-width="210" align="center"></el-table-column>
        <el-table-column prop="accountId" label="联系账号" min-width="100" align="center"></el-table-column>
        <el-table-column prop="agentName" label="账号昵称" min-width="100" align="center"></el-table-column>
        <el-table-column prop="qrCode" label="二维码名片" min-width="100" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.qrCode" :src="scope.row.qrCode" style="width:100px;height:100px" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination align="right" @size-change="handleSizeChange" @current-change="handleCurrentChange" @next-click="next" @prev-click="prev" :current-page.sync="page" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination> -->
    </el-card>
    <el-dialog title="新增联系方式" :visible.sync="addDialogVisibles" width="500px" :before-close="addHandleClose">
      <div>
        <el-form :inline="true">
          <el-form-item label="联系方式" label-width="80px">
            <el-select v-model="accountType" placeholder="请选择" style="width:200px;">
              <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <label style="margin-left:20px;width:80px">账号</label>
        <el-input v-model="accountId" style="width:150px; margin:5px 20px 20px 29px" placeholder="请输入内容"></el-input>
        <br />
        <label style="margin-left:10px;width:80px">账户昵称</label>
        <el-input v-model="agentName" style="width:150px; margin:5px 20px 20px 12px" placeholder="请输入内容"></el-input>
        <br />
        <el-form>
          <el-form-item label="上传二维码">
            <div class="uploadBox">
              <div class="btnUpload">
                <input class="upload" type="file" id="file" @change="uploadIMG($event)" ref="file" />
              </div>
              <div class="imgBox" v-if="qrCode">
                <vue-cropper ref="cropper" :img="qrCode" :outputSize="option.size" :autoCrop="true" :autoCropWidth="300" :autoCropHeight="300" :maxImgSize="350" :fixed="true" :centerBox="true" :outputType="option.outputType"></vue-cropper>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改联系方式 -->
    <el-dialog title="修改联系方式" :visible.sync="editDialogVisibles" width="500px" :before-close="editHandleClose">
      <div>
        <el-form :inline="true">
          <el-form-item label="联系方式" label-width="80px">
            <el-select v-model="modifyContacts.accountType" placeholder="请选择" style="width:200px;">
              <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <label style="margin-left:20px;width:80px">账号</label>
        <el-input v-model="modifyContacts.accountId" style="width:150px; margin:5px 20px 20px 29px" placeholder="请输入内容"></el-input>
        <br />
        <label style="margin-left:10px;width:80px">账户昵称</label>
        <el-input v-model="modifyContacts.agentName" style="width:150px; margin:5px 20px 20px 12px" placeholder="请输入内容"></el-input>
        <br />
        <el-form>
          <el-form-item label="上传二维码">
            <div class="uploadBox">
              <div class="btnUpload">
                <input class="upload" type="file" id="file" @change="editIMG($event)" ref="file" />
              </div>
              <div class="imgBox" v-if="modifyContacts.qrCode">
                <vue-cropper ref="cropper2" :img="modifyContacts.qrCode" :outputSize="option.size" @imgMoving="moving" @cropMoving="moving" :autoCrop="true" :autoCropWidth="300" :autoCropHeight="300" :maxImgSize="350" :fixed="true" :centerBox="true" :outputType="option.outputType"></vue-cropper>
              </div>
              <!-- <div class="imgBox" v-else>
                <img :src="modifyContacts.qrCode">
              </div>-->
            </div>
          </el-form-item>
        </el-form>
        <!--  -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script >
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";
import {
  insertContact,
  modifyPay,
  getPayInfo,
  getContact,
  deleteContact,
  modifyContactType
} from "@/api/agent/webSocket";
import { VueCropper } from "vue-cropper";

// @Component 修饰符注明了此类为一个 Vue 组件
export default {
  components: {
    VueCropper
  },
  data: function() {
    return {
      typeList: [{ label: "微信" }, { label: "支付宝" }, { label: "QQ" }],
      accountId: "",
      avatar: "",
      accountType: "",
      agentName: "",
      fileList: [],
      page: 1,
      count: 10,
      pageData: [],
      totalCount: 0,
      total: this.$store.state.transferLog.total,
      from: "",
      dateTime: [],
      transferedTime: [],
      addDialogVisibles: false,
      editDialogVisibles: false,
      search: {},
      api: "",
      qrCode: "",
      modifyContacts: {
        accountType: "",
        accountId: "",
        agentName: "",
        qrCode: ""
      },
      editImgEdit: true,
      addArr: {
        feeRate: 0,
        qrCode: ""
      },
      editArr: {
        feeRate: 0,
        qrCode: ""
      },
      option: {
        addImg: "",
        editImg: "",
        size: 0.6,
        outputType: "png"
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    //判断图片文件名
    isDel() {},
    //图片上传
    uploadFiles(file) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file.file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          _this.qrCode = imgResult;
          resolve(imgResult);
        };
      });
    },
    //图片上传1
    uploadFiles1(file) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file.file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          _this.modifyContacts.qrCode = imgResult;
          resolve(imgResult);
        };
      });
    },

    //请求加载数据
    loadData() {
      // let queryItem = {
      //   page: this.page,
      //   pageCount: this.count
      // };
      getContact()
        .then(res => {
          if (res.info) {
            this.pageData = [res.info];
          }
          //this.totalCount = res.totalCnt;
        })
        .catch(err => {
          // this.$message({
          //   type: "error",
          //   message: err.err
          // });
          return;
        });
    },

    addHandleClose() {
      this.addDialogVisibles = false;
    },
    editHandleClose() {
      this.editDialogVisibles = false;
    },
    // prev() {
    //   this.page = this.page - 1;
    //   if (this.page < 1) {
    //     this.page = 1;
    //   }
    //   this.loadData();
    // },
    // next() {
    //   if (this.page > this.totalCount / this.count) {
    //     this.page = Math.ceil(this.totalCount / this.count);
    //   }
    //   this.loadData();
    // },
    add() {
      if (this.$refs.file) {
        this.$refs.file.value = "";
      }
      this.qrCode = "1";
      this.accountType = "";
      this.accountId = "";
      this.agentName = "";
      this.addDialogVisibles = true;
      this.qrCode = "";
    },
    //编辑修改复制
    editRow(val) {
      if (this.$refs.file) {
        this.$refs.file.value = "";
      }
      this.modifyContacts.qrCode = "1";
      this.editDialogVisibles = true;
      this.accountType = val.accountType || "";
      this.accountId = val.accountId || "";
      this.agentName = val.agentName || "";
      this.modifyContacts.accountType = val.accountType || "";
      this.modifyContacts.agentName = val.agentName || "";
      this.modifyContacts.accountId = val.accountId || "";
      this.modifyContacts.qrCode = val.qrCode || "";
    },
    //删除
    deleteRow(val) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // let query = {
          //   accountId: val.accountId,
          //   accountType: val.accountType,
          //   agentName: val.agentName
          // };
          deleteContact()
            .then(res => {
              this.pageData = [];
              this.loadData();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.err
              });
              return;
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    confirmAdd() {
     
      if (!this.accountType) {
        this.$message.error("联系方式不能为空");
        return;
      }
      if (!this.accountId) {
        this.$message.error("账号不能为空");
        return;
      }
      if (!this.agentName) {
        this.$message.error("用户昵称不能为空");
        return;
      }
       this.addDialogVisibles = false;
      let queryItem = {
        accountType: this.accountType,
        accountId: this.accountId,
        agentName: this.agentName,
        qrCode: this.qrCode
      };
      insertContact(queryItem)
        .then(res => {
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.dialogRecharge = false;
          this.accountType = "";
          this.accountId = "";
          this.agentName = "";
          this.qrCode = "";
          this.loadData();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err.err
          });
          return;
        });
    },
    //编辑修改上传
    confirmEdit() {
      if (!this.modifyContacts.accountType) {
        this.$message.error("联系方式不能为空");
        return;
      }
      if (!this.modifyContacts.accountId) {
        this.$message.error("账号不能为空");
        return;
      }
      if (!this.modifyContacts.agentName) {
        this.$message.error("用户昵称不能为空");
        return;
      }
      // let query = {
      //   accountType: this.accountType,
      //   accountId: this.accountId,
      //   agentName: this.agentName,
      //   modifyContact: this.modifyContacts
      // };
      let query = this.modifyContacts;
      modifyContactType(query)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.dialogRecharge = false;
          this.accountType = "";
          this.accountId = "";
          this.agentName = "";
          this.qrCode = "";
          this.loadData();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err.err
          });
          return;
        });
      this.editDialogVisibles = false;
    },
    handleRemove(file, fileList) {},
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // handleSizeChange(val) {
    //   this.page = 1;
    //   this.count = val;
    //   this.loadData();
    // },
    // handleCurrentChange(val) {
    //   this.page = val;
    //   this.loadData();
    // },
    statusFormat(row) {
      if (row.status) {
        if (row.status >= 8192) {
          //16进制的2000的10进制值，(大于2000就表示审核通过)
          return "审核通过";
        }
        return "审核失败";
      }
      return "没有状态";
    },
    // ///
    editIMG(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picavalue2 = files[0];
      let size = this.picavalue2.size / 1024;
      if (size > 2000) {
        this.$message({
          message: "图片过大不支持上传",
          type: "warning"
        });
      } else {
        this.imgPreview(this.picavalue2).then(res => {
          this.option.editImg = res;
          this.modifyContacts.qrCode = res;
          this.editImgEdit = true;
        });
      }
    },
    //获取图片
    imgPreview(file, callback) {
      return new Promise((resolve, reject) => {
        let self = this;
        //判断支不支持FileReader
        if (!file || !window.FileReader) return;
        if (/^image/.test(file.type)) {
          //创建一个reader
          let reader = new FileReader();
          //将图片转成base64格式
          reader.readAsDataURL(file);
          //读取成功后的回调
          reader.onloadend = function() {
            let result = this.result;
            let img = new Image();
            img.src = result;
            resolve(result);
          };
        }
      });
    },
    // 压缩图片
    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      return ndata;
    },
    uploadIMG(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picavalue = files[0];
      console.log(this.picavalue.size / 1024);
      if (this.picavalue.size / 1024 > 2000) {
        this.$message({
          message: "图片过大不支持上传",
          type: "warning"
        });
      } else {
        this.imgPreview(this.picavalue).then(res => {
          this.option.addImg = res;
          this.qrCode = res;
          console.log(this.qrCode);
        });
      }
    },
    moving(e) {
      this.editImgEdit = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  background-color: #fff;
  min-height: 100vh;
  margin-top: -50px;
  padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
  .imgBox {
    width: 300px;
    height: 300px;
  }
}
</style>
