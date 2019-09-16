<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <div class="submitBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="欢迎语开关">
            <el-radio v-model="autoHello" :label="1">开启</el-radio>
            <el-radio v-model="autoHello" :label="0">关闭</el-radio>
          </el-form-item>
          <el-form-item label="欢迎语">
            <el-input v-model="welcomeMsg" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveWelcome">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="search.name"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="search.act"></el-input>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select v-model="search.type" placeholder="请选择">
              <el-option label="全部" :value="undefined"></el-option>
              <el-option v-for="(item,index) in payTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="primary" @click="showAdd">新增账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border cell-class-name="tableTd" header-cell-class-name="tableTh" width="100%">
        <el-table-column prop="payId" label="ID" width="210" align="center"></el-table-column>
        <el-table-column prop="type" :formatter="payTypesFormat" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="act" label="账号" width="220" align="center"></el-table-column>
        <el-table-column prop="name" label="账户姓名" align="center"></el-table-column>
        <el-table-column prop="bank" label="开户行" align="center"></el-table-column>
        <el-table-column label="收款码" width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.qrCode" width="100">
          </template>
        </el-table-column>
        <el-table-column prop="feeRate" label="费率" align="center"></el-table-column>
        <el-table-column prop="active" label="账户状态" :formatter="stateFormat" align="center"></el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button @click="modifyLine(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="disabledLine(scope.row)" type="primary" size="small">{{scope.row.active==1?'禁用账户':'启用账户'}}</el-button>
            <el-button @click="deleteLine(scope.row)" type="primary" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </el-card>
    <!-- dialogRecharge -->
    <el-dialog :title="'修改账户：'+dialogId" :visible.sync="dialogRecharge" width="700px">
      <el-form :inline="true">
        <el-form-item label="支付方式" label-width="80px">
          <el-select v-model="editArr.type" placeholder="请选择" style="width:200px;">
            <el-option v-for="(item,index) in payTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEditQr" label="账号" label-width="80px">
          <el-input v-model="editArr.act" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEditQr" label="姓名" label-width="80px">
          <el-input v-model="editArr.name" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="手续费率" label-width="80px">
          <el-input type="number" v-model="editArr.feeRate" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item v-if="editArr.type=='union_pay_act'||editArr.type=='union_pay_qr'" label="开户行" label-width="80px">
          <el-input v-model="editArr.bank" style="width:200px;"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="提醒语1" label-width="80px">
          <el-input type="textarea" v-model="editArr.content1" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="提醒语2" label-width="80px">
          <el-input type="textarea" v-model="editArr.content2" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item v-if="isEditQr" label="上传收款码">
          <div class="uploadBox">
            <div class="btnUpload">
              <input class="upload" type="file" id="file" @change="editIMG($event)" ref="file">
            </div>
            <div class="imgBox" v-if="editImgEdit">
              <vue-cropper ref="cropper2" :img="option.editImg" :outputSize="option.size" @imgMoving="moving" @cropMoving="moving" :autoCrop="true" :autoCropWidth="200" :autoCropHeight="200" :maxImgSize="350" :fixed="true" :centerBox="true" :outputType="option.outputType"></vue-cropper>
            </div>
            <div class="imgBox" v-else>
              <img :src="editArr.qrCode">
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecharge=false">取 消</el-button>
        <el-button type="primary" @click="updateAccount">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <el-dialog title="新增账户" :visible.sync="dialogAdd" width="700px">
      <el-form :inline="true">
        <el-form-item label="支付方式" label-width="80px" required>
          <el-select v-model="addArr.type" placeholder="请选择" style="width:200px;">
            <el-option v-for="(item,index) in payTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isAddQr" label="账号" label-width="80px" required>
          <el-input v-model="addArr.act" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item v-if="!isAddQr" label="姓名" label-width="80px" required>
          <el-input v-model="addArr.name" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="手续费率" label-width="80px">
          <el-input type="number" v-model="addArr.feeRate" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item v-if="addArr.type=='union_pay_act'||addArr.type=='union_pay_qr'" label="开户行" label-width="80px" required>
          <el-input v-model="addArr.bank" style="width:200px;"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="提醒语1" label-width="80px">
          <el-input type="textarea" v-model="addArr.content1" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="提醒语2" label-width="80px">
          <el-input type="textarea" v-model="addArr.content2" style="width:200px;"></el-input>
        </el-form-item>
        <br>
        <el-form-item v-if="isAddQr" label="上传收款码">
          <div class="uploadBox">
            <div class="btnUpload">
              <input class="upload" type="file" id="file" @change="uploadIMG($event)" ref="file">
            </div>
            <div class="imgBox">
              <vue-cropper ref="cropper" :img="option.addImg" :outputSize="option.size" :autoCrop="true" :autoCropWidth="200" :autoCropHeight="200" :maxImgSize="350" :fixed="true" :centerBox="true" :outputType="option.outputType"></vue-cropper>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false;">取 消</el-button>
        <el-button type="primary" @click="addAccount">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPayInfo,
  insertPay,
  modifyPay,
  activePay,
  deletePay,
  getGreet,
  activeGreet,
  getContact
} from "@/api/agent/webSocket";
import mysocket from "@/utils/newSocket";
import { VueCropper } from "vue-cropper";
import { log } from "util";
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      accountType: "",
      accountId: "",
      autoHello: 1,
      welcomeMsg: undefined,
      totalCount: 0,
      count: 10,
      page: 0,
      search: {},
      tableData: [],
      pageData: [],
      contactAcc: [],
      option: {
        addImg: "",
        editImg: "",
        size: 0.6,
        outputType: "png"
      },
      relative: {
        payId: "",
        id: "",
        userName: "",
        active: 1
      },
      payTypeArr: [
        { label: "支付宝账号", value: "ali_pay_act", type: "act" },
        { label: "支付宝扫码", value: "ali_pay_qr", type: "qr" },
        { label: "微信扫码", value: "wx_pay_qr", type: "qr" },
        { label: "银联账号", value: "union_pay_act", type: "act" },
        { label: "信用卡扫码", value: "xy_pay_qr", type: "qr" },
        { label: "花呗扫码", value: "hb_pay_qr", type: "qr" },
        { label: "云闪付扫码", value: "yun_pay_qr", type: "qr" },
        { label: "QQ钱包扫码", value: "qq_pay_qr", type: "qr" },
        { label: "京东扫码", value: "jd_pay_qr", type: "qr" }
      ],
      addArr: {
        feeRate: 0,
        qrCode: ""
      },
      editArr: {
        feeRate: 0,
        qrCode: ""
      },
      editImgEdit: false,
      isAddQr: false,
      isEditQr: false,
      dialogRecharge: false,
      dialogAdd: false,
      dialogId: "",
      dialogContact: false,
      picavalue: "", //新增图片文件
      picavalue2: "" //修改图片文件
    };
  },
  watch: {
    addArr: {
      handler(newValue, oldValue) {
        let item = this.payTypeArr.find(i => i.value == newValue.type);
        if (item && item.type == "qr") {
          this.isAddQr = true;
        } else {
          this.isAddQr = false;
        }
      },
      deep: true
    },
    editArr: {
      handler(newValue, oldValue) {
        let item = this.payTypeArr.find(i => i.value == newValue.type);
        if (item && item.type == "qr") {
          this.isEditQr = true;
        } else {
          this.isEditQr = false;
        }
      },
      deep: true
    }
  },
  async created() {
    this.loadData();
    this.loadWelcome();
    // this.relationLoadData();
  },
  methods: {
     //去重
    unique(arr) {
      var result = []; //去重后返回的结果数组
      var temp = {}; //临时对象
      //将对象数组中每一项的name值作为属性，若temp不拥有此属性时则为temp添加此属性且将其值赋为true，并将这一项push到结果数组中
      for (var i = 0; i < arr.length; i++) {
        var myname = arr[i].accountType;
        if (temp[myname]) {
          //如果temp中已经存在此属性名，则说明遇到重复项
          continue; //不继续执行接下来的代码，跳转至循环开头
        }
        temp[myname] = true; //为temp添加此属性（myname）且将其值赋为true
        result.push(arr[i]); //将这一项复制到结果数组result中去
      }
      this.pageData = result;
    },
    loadWelcome() {
      getGreet().then(res => {
        this.autoHello = res.active;
        this.welcomeMsg = res.greet;
      });
    },
       //请求加载数据
    relationLoadData() {
      let query = {
        page: 0,
        pageCount: 0
      };
      getContact(query)
        .then(res => {
          let typeArr = [];
          typeArr = res.infos;
          this.unique(typeArr);
          //this.totalCount = res.infos.length;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err.err
          });
          return;
        });
    },
    saveWelcome() {
      if (this.autoHello === 1 && !this.welcomeMsg) {
        this.$message.error("开启欢迎语时必须填写欢迎语内容！");
        return;
      }
      let query = {
        active: this.autoHello,
        greet: this.welcomeMsg
      };
      if (this.autoHello === 0) {
        query = {
          active: this.autoHello
        };
      }
      activeGreet(query).then(res => {
        this.$message.success("保存成功！");
      });
    },
    searchData() {
      this.page = 0;
      this.loadData();
    },
    loadData() {
      let queryItem = {
        act: this.search.act,
        name: this.search.name,
        type: this.search.type,
        page: this.page,
        pageCnt: this.count
      };
      this.clean(queryItem);
      getPayInfo(queryItem).then(res => {
        this.tableData = res.pays;
        this.totalCount = res.total;
      });
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
    },
    payTypesFormat(row) {
      let label = "";
      this.payTypeArr.some(element => {
        if (row.type == element.value) {
          label = element.label;
        }
        return element.label == label;
      });
      return label;
    },
    stateFormat(row) {
      if (row.active) {
        return "启用";
      } else {
        return "禁用";
      }
    },
    modifyLine(row) {
      //打开修改弹窗
      this.dialogId = row.payId;
      this.dialogRecharge = true;
      this.editArr = { ...row };
      this.option.editImg = row.qrCode;
      this.editImgEdit = false;
    },
    deleteLine(row) {
      //删除确认
      this.$confirm(`此操作将删除账户"${row.payId}", 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePay({ payId: row.payId })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
              return;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    disabledLine(row) {
      //禁用
      let active;

      if (row.active == 0) {
        active = 1;
      } else {
        active = 0;
      }
      activePay({
        active: active,
        payId: row.payId
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.dialogRecharge = false;
          this.loadData();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err
          });
          return;
        });
    },
    handleSizeChange(e) {
      this.count = e;
      this.loadData();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.loadData();
    },
    rule(dataArr, isQr) {
      if (
        (dataArr.type == "union_pay_act" || dataArr.type == "union_pay_qr") &&
        !dataArr.bank
      ) {
        this.$message({
          type: "error",
          message: "必需填写开户行!"
        });
        return false;
      }
      if (!dataArr.type) {
        this.$message({
          type: "error",
          message: "必需选择支付方式!"
        });
        return false;
      }
      if (dataArr.feeRate >= 1 || dataArr.feeRate < 0) {
        this.$message({
          type: "error",
          message: "手续费率必须为0-1之间的小数!"
        });
        return false;
      }
      if (!dataArr.act && !isQr) {
        this.$message({
          type: "error",
          message: "必需填写账号!"
        });
        return false;
      }
      if (!dataArr.name && !isQr) {
        this.$message({
          type: "error",
          message: "必需填写姓名!"
        });
        return false;
      }
      if (!dataArr.qrCode && isQr) {
        this.$message({
          type: "error",
          message: "必需上传付款码!"
        });
        return false;
      }
      return true;
    },
    getImg2() {
      return new Promise(resolve => {
        this.$refs.cropper2.getCropData(data => {
          this.editArr.qrCode = data;
          resolve();
        });
      });
    },
    async updateAccount() {
      if (this.isEditQr && this.editImgEdit) {
        await this.getImg2();
      }
      //提交修改
      if (!this.rule(this.editArr, this.isEditQr)) {
        return;
      }
      if (!this.editImgEdit) {
        delete this.editArr.qrCode
      }
      this.editArr.feeRate = this.editArr.feeRate.toString();
      console.log(this.editArr);
      modifyPay(this.editArr)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.dialogRecharge = false;
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
    showAdd() {
      this.dialogAdd = true;
      this.option.addImg = "";
    },
    getAddImg() {
      return new Promise(resolve => {
        this.$refs.cropper.getCropData(data => {
          this.addArr.qrCode = data;
          resolve();
        });
      });
    },
    async addAccount() {
      if (this.isAddQr) {
        await this.getAddImg();
      }
      console.log("图片", this.addArr.qrCode);
      //提交新增
      if (!this.rule(this.addArr, this.isAddQr)) {
        return;
      }
      this.dialogAdd = false;
      this.addArr.feeRate = this.addArr.feeRate.toString();
      console.log(this.addArr);
      insertPay(this.addArr).then(res => {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.addArr = {
          feeRate: 0,
          qrCode: ""
        };
        this.loadData();
      });
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
        });
      }
    },
    moving(e) {
      this.editImgEdit = true;
    },
    editIMG(e) {
      let files = e.target.files || e.dataTransfer.files;
      console.log(files);
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
          reader.onloadend = function () {
            let result = this.result;
            let img = new Image();
            img.src = result;
            resolve(result);
            // if (file.size / 1024 < 50) {
            //   //小于50K不用压缩
            //   resolve(result);
            // } else {
            //   img.onload = function() {
            //     let data = self.compress(img);
            //     console.log("********压缩后图片大小********", data.length);
            //     resolve(data);
            //   };
            // }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.pageBox {
  margin: 20px;
  display: flex;
  justify-content: center;
}
.imgBox {
  width: 400px;
  height: 400px;
}
</style>
