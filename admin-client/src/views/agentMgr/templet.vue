<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="推广二维码"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">推广二维码</span>
      </el-col>
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目" @change="change" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
      </el-select>
      <span>模版类型</span>
      <el-select v-model="promType" placeholder="请选择" @change="changePromType" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in pormTypeOpts" :key="item.value" :label="item.lable" :value="item.value"></el-option>
      </el-select>
      <span>模板ID</span>
      <el-input v-model="templeyID" style="width:120px; margin:20px 10px"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple  :limit="3" 
        :on-success="updateSuccess" :on-error="updateError">
          <el-button  type="primary">点击上传新模板图片</el-button>
      </el-upload>-->
      <!-- <el-upload ref="upload" class="upload-demo" :file-list="fileList" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :limit="1">
        <el-button size="small" type="primary">点击上传新的模板图片</el-button>
      </el-upload>-->
      <div class="uploadImg">
        <el-upload ref="upload" class="upload-demo" :file-list="fileList" :auto-upload="false" :action="api" :on-change="changeUpload" :limit="imgLength">
          <el-button size="small" type="primary">选择模板图片</el-button>
          <div slot="tip" class="el-upload__tip">
            如果选择地推模版，第一张图为正面图，第二张为背面图片
            <span style="color:red">(有二维码的为正面)</span>
          </div>
        </el-upload>
        <el-button size="small" style="margin-left:10px;height:32px;" type="success" @click="ossUploadFileMany">上传</el-button>
      </div>
      <!--         
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 0px">我的推广地址:</span>
        <span style="font-size:12pt; margin:10px 0px 10px 10px">{{imgUrl}}</span>
      <el-button style=" margin:10px 0px 10px 100px"  class="btn" type="text"  :data-clipboard-text="imgUrl">复制推广地址</el-button>-->
      <el-table :data="templet.templetData" border max-height="700" highlight-current-row style="width: 100%;font-size:10pt">
        <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="promType" label="模版类型" min-width="80" align="center" :formatter="promFormat"></el-table-column>
        <el-table-column prop="tmplId" label="模板ID" min-width="100" align="center"></el-table-column>
        <el-table-column label="模板图片" min-width="600" align="center">
          <template slot-scope="scope">
            <!-- <img style="width:204px; height:336px" :src="scope.row.imageUrl">
            <span class="title">右键图片存储为。保存原图</span>-->
            <!-- <el-button type="text" @click.native.prevent="lookBigPic(scope.$index, scope.row)">查看大图</el-button> -->
            <div v-if="scope.row.backImgUrl">
              <img style="width:270px; height:135px" :src="scope.row.imageUrl">
              <img style="width:270px; height:135px" :src="scope.row.backImgUrl">
              <span class="title">右键图片存储为。保存原图</span>
            </div>
            <div v-else>
              <img style="width:163px; height:269px" :src="scope.row.imageUrl">
              <span class="title">右键图片存储为。保存原图</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="下载" width="200" align="center">
			    	<template slot-scope="scope">
              <a :href="scope.row.image" :download="scope.row.tmplId">点击下载</a>
			    		<el-button type="text" @click.native.prevent="dowloadPic(scope.$index, scope.row)">下载</el-button>
			    	</template>
        </el-table-column>-->
        <el-table-column label="操作" min-width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteTemplet(scope.$index, scope.row)">删除</el-button>
            <!-- <el-button  type="text" @click="deletAgent(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="templet.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>


<script lang='ts'>
declare var require: any;
declare var process: any;
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch, myAsyncFn } from "../../utils/index";
import { TempletState } from "../../store/stateInterface";
import { BigNumber } from "bignumber.js";
import { addTemplet } from "../../api/admin/agentMgr/agentMgr";
import Clipboard from "clipboard";
import oss from "../../utils/oss.js";
import { Upload, Loading } from "element-ui";
import { getOssToken } from "../../api/admin/ossApi/ossApi";
const TokenGenerator = require("uuid-token-generator");
var OSS = require("ali-oss");

interface QueryItem {
  pid: string;
  agencyId?: string;
  act?: string;
  name?: string;
  taxRateStart?: string;
  taxRateEnd?: string;
  channel?: string;
  page?: number;
  count?: number;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Templet extends Vue {
  templeyID: string = "";
  page: number = 1;
  count: number = 10;
  ossToken: any = {};
  api: string = "";
  pidList: any[] = [];
  fileList: any[] = [];
  pid: string = "A";
  imgLength: number = 1;
  promType: string = "web";
  pormTypeOpts: any = [
    { lable: "普通", value: "web" },
    { lable: "地推", value: "ground" }
  ];
  templet: TempletState = this.$store.state.templet; //表单数据
  imgUrl: string =
    "http://static.fengzhongpao.com/images/a5/b1/tg_a5b1472e45844774b428a1b42f79edcb.png";
  //生命周期钩子函数
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();

    let clipboard = new Clipboard(".btn");
    clipboard.on("success", function(e) {
      // console.log(e);
    });
    clipboard.on("error", function(e) {
      // console.log(e);
    });
  }
  async createOssClient(pid) {
    let req = pid
      ? {
          pid: pid
        }
      : {};
    let ret = await myAsyncFn(getOssToken, req);
    if (ret.code === 200) {
      this.ossToken = ret.msg;
    }
  }
  async ossUploadFileMany() {
    let loadingInstance;
    if (this.fileList.length === 0) {
      this.$message({
        type: "error",
        message: "请选择图片！"
      });
      return;
    }
    await this.createOssClient(this.pid);
    let urlArr: any = [];
    const client = new OSS({
      region: this.ossToken.region,
      accessKeyId: this.ossToken.token.credentials.AccessKeyId,
      accessKeySecret: this.ossToken.token.credentials.AccessKeySecret,
      stsToken: this.ossToken.token.credentials.SecurityToken,
      endpoint: this.ossToken.endpoint,
      bucket: this.ossToken.bucket,
      secure: true,
      cname: true
    });
    loadingInstance = Loading.service({
      fullscreen: true,
      text: "拼命上传图片中..."
    });
    for (let i = 0; i < this.fileList.length; i++) {
      let item = this.fileList[i];
      let uuid = new TokenGenerator(256, TokenGenerator.BASE62).generate();
      let extensionName = item.name.substr(item.name.indexOf(".")); // 文件扩展名
      let fileName = "agentMgr/templet/" + uuid + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
      let ret = await client.put(fileName, item.raw, {});
      if (ret.res.statusCode === 200) {
        urlArr.push(ret.url);
      } else {
        this.$message({
          type: "error",
          message: "上传失败！"
        });
        return;
      }
    }
    // for (let item of this.fileList) {
    //   let uuid = new TokenGenerator(256, TokenGenerator.BASE62).generate();
    //   let extensionName = item.name.substr(item.name.indexOf(".")); // 文件扩展名
    //   let fileName = "agentMgr/templet/" + uuid + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
    //   let ret = await client.put(fileName, item.raw, {});
    //   if (ret.res.statusCode === 200) {
    //     urlArr.push(ret.url);
    //   } else {
    //     this.$message({
    //       type: "error",
    //       message: "上传失败！"
    //     });
    //     return;
    //   }
    // }
    loadingInstance.close();
    let req: any = {
      pid: this.pid,
      promType: this.promType,
      imageUrl: urlArr[0]
    };
    if (this.promType === "ground" && urlArr.length === 2) {
      req.backImgUrl = urlArr[1];
    }
    let ret = await myAsyncFn(addTemplet, req);
    if (ret.code === 200) {
      this.$message({
        message: "上传成功",
        type: "success"
      });
      const ref: any = this.$refs["upload"];
      ref.clearFiles();
      this.fileList = [];
      this.loadData();
    }
  }
  changePromType(promType) {
    this.imgLength = this.promType === "web" ? 1 : 2;
  }
  changeUpload(file, fileList) {
    const extension = file.raw.type === "image/jpeg";
    const extension2 = file.raw.type === "image/png";
    const ref: any = this.$refs["upload"];
    if (!extension && !extension2) {
      this.$message({
        message: "上传文件只能是 jpg、png 格式!",
        type: "warning"
      });
      ref.clearFiles();
      return;
    }
    this.fileList = fileList;
  }
  fnUploadRequest(option) {
    oss.ossUploadFile(option, "agency/tmpl/", this.pid);
  }
  change(pid) {
    this.pid = pid;
  }

  refresh() {
    this.loadData();
  }

  beforeDestroy() {}

  getQueryItem() {
    let temp: any = {
      pid: this.pid,
      promType: this.promType
    };
    if (this.templeyID.trim()) {
      temp.tmplId = parseInt(this.templeyID);
    }
    return temp;
  }

  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetTemplet", queryItem, true).then(() => {});
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }

  beforeAvatarUpload(file) {
    if (file.size > 1 * 1024 * 1024) {
      this.$message({
        showClose: true,
        type: "error",
        message: "大小太大!"
      });
      return false;
    }
  }

  dowloadPic(index, row) {}

  deleteTemplet(index, row) {
    let tempData: any = {
      pid: row.pid,
      tmplId: row.tmplId
    };
    this.$confirm("是否确认提交", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeleteTemplet", tempData, true).then(() => {
          if (this.templet.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功!"
            });
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "删除失败!"
          });
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  updateError() {
    this.$message({
      message: "上传失败",
      type: "success"
    });
  }

  lookBigPic(index, row) {
    // console.log("row.image", row.image);
    window.open(row.image);
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }

  addClick() {}

  errorFunc() {
    this.$message({
      message: "上传失败",
      type: "error"
    });
  }

  async successFunc(url) {
    let req = {
      imageUrl: url,
      pid: this.pid
    };
    let ret = await myAsyncFn(addTemplet, req);
    if (ret.code === 200) {
      this.$message({
        message: "上传成功",
        type: "success"
      });
      const ref: any = this.$refs["upload"];
      ref.clearFiles();
      this.loadData();
    }
  }
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  promFormat(row, column) {
    let name = "";
    this.pormTypeOpts.forEach(element => {
      if (element.value === row.promType) {
        name = element.lable;
      }
    });
    return name;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
.uploadImg {
  display: flex;
  margin-bottom: 10px;
}
</style>
