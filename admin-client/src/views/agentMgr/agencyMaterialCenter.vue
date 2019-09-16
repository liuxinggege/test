<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="素材中心"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">素材中心</span>
      </el-col>
      <!--工具条-->
      <div>
        <span style="font-size:12pt; margin:10px 10px 10px 0px">项目</span>
        <el-select v-model="pid" placeholder="请选择" style="width:100px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span style="font-size:12pt; margin:10px 10px 10px 20px">类型</span>
        <el-select v-model="type" placeholder="请选择" style="width:110px;">
          <el-option v-for="item in searchTypeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span style="font-size:12pt; margin:10px 10px 10px 20px">是否开启</span>
        <el-select v-model="active" placeholder="请选择" style="width:100px;">
          <el-option v-for="item in activeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span style="font-size:12pt; margin:10px 10px 10px 20px">操作人</span>
        <el-input v-model="opt" style="width:120px"></el-input>
        <span style="font-size:12pt; margin:10px 10px 10px 20px">发布时间</span>
        <el-date-picker v-model="releaseDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:0 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <br>
        <span style="font-size:12pt; margin:10px 10px 10px 0px">创建时间</span>
        <el-date-picker v-model="createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin-right:10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" style="margin:10px 10px" type="primary" @click="add">添加</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="dataList" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="del(scope.row)">删除</el-button>
            <el-button type="text" @click="update(scope.row)">修改</el-button>
            <el-button v-if="scope.row.img.length" type="text" @click="showImg(scope.row)">图片</el-button>
            <el-button v-if="scope.row.video" type="text" @click="showVideo(scope.row)">视频</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="pid" label="项目" width="60" :formatter="pidFormat" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="100" :formatter="typeFormat" align="center"></el-table-column>
        <el-table-column prop="active" label="状态" width="60" :formatter="activeFormat" align="center"></el-table-column>
        <el-table-column label="内容" align="left" min-width="200" height="50">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" width="700">
              <p>内容: {{ scope.row.text }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.text.slice(0,30)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="imgCount" label="图片下载次数" width="80" align="center"></el-table-column>
        <el-table-column prop="videoCount" label="视频下载次数" width="80" align="center"></el-table-column>
        <el-table-column prop="textCount" label="内容复制次数" width="80" align="center"></el-table-column>
        <el-table-column prop="releaseDate" label="发布时间" width="150" align="center" :formatter="releaseDateFormat"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="150" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="修改时间" width="150" :formatter="updateDateFormat" align="center"></el-table-column>
        <el-table-column prop="opt" label="操作人" width="90" align="center"></el-table-column>
      </el-table>
      <!-- add -->
      <el-dialog :visible.sync="isAdd" width="650px" title="添加素材">
        <span style="font-size:12pt; margin:10px 0px 10px 45px">项目</span>
        <el-select v-model="addPid" placeholder="请选择" style="width:100px; margin:10px 30px 10px 20px">
          <el-option v-for="item in addPidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span style="font-size:12pt; margin:10px 0px 10px 10px">类型</span>
        <el-select v-model="addType" placeholder="请选择" style="width:110px; margin:10px 30px 10px 20px">
          <el-option v-for="item in typeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-checkbox type="text" style="width:100px; font-size:12pt; margin:0px 0px 0px 10px" class="checkbox" id="matchIp" label="是否启用" border v-model="addActive"></el-checkbox>
        <br>
        <span style="font-size:12pt; margin:10px 10px 10px 45px">发布时间</span>
        <el-date-picker v-model="addReleaseDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
        <span style="color:red">(若不选择发布时间，即为即时发布。)</span>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 45px">内容</span>
        <el-input type="textarea" style="width:400px; margin:10px 30px 10px 20px;vertical-align:middle;" rows="6" v-model="addText"></el-input>
        <div style="margin:10px 0px">
          <span style="font-size:12pt; margin:10px 20px 10px 45px">文件类型</span>
          <el-radio-group v-model="isUploadImg" @change="changeClick">
            <el-radio :label="true">图片</el-radio>
            <el-radio :label="false">视频</el-radio>
          </el-radio-group>
        </div>
        <div v-if="isUploadImg">
          <span style="font-size:12pt; margin:10px 0px 10px 45px">图片</span>
          <el-upload style="text-align:center;margin:10px 30px 10px 20px" ref="upload" list-type="picture-card" :action="url" :on-change="uploadChange" :auto-upload="false" multiple :limit="9" :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </div>
        <div v-else>
          <span style="font-size:12pt; margin:10px 0px 10px 45px">视频</span>
          <el-upload style="text-align:center;margin:10px 30px 10px 20px" ref="upload" list-type="text" :action="url" :on-change="uploadChange" :auto-upload="false" :limit="1" :file-list="fileList">
            <el-button size="small" type="primary">选择视频</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
          </el-upload>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="success" plain @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="addConfirm">保存</el-button>
        </div>
      </el-dialog>
      <!-- update -->
      <el-dialog :visible.sync="isUpdate" width="650px" title="修改素材">
        <el-checkbox type="text" style="width:100px; font-size:12pt; margin:0px 0px 10px 100px" class="checkbox" id="matchIp" label="是否启用" border v-model="addActive"></el-checkbox>
        <br>
        <span style="font-size:12pt; margin:10px 15px 10px 15px">发布时间</span>
        <el-date-picker v-model="addReleaseDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
        <span style="color:red">(若不选择发布时间，即为即时发布。)</span>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 45px">内容</span>
        <el-input type="textarea" rows="5" style="width:450px; margin:10px 30px 10px 20px;vertical-align:middle;" v-model="addText"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" plain @click="cancelUpdate">取 消</el-button>
          <el-button type="primary" @click="updateConfirm">保存</el-button>
        </div>
      </el-dialog>
      <!-- showImg -->
      <el-dialog :visible.sync="isImg" width="800px" title="图片">
        <div class="showImg">
          <img v-for="item in imgDataList" :key="item.sort" :src="item.thumbnail" alt>
        </div>
      </el-dialog>
      <!-- showVideo -->
      <el-dialog :visible.sync="isVideo" width="800px" title="视频">
        <div class="showImg">
          <video controls height="50%" width="50%" :src="videoData" alt></video>
        </div>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
    <video v-show="false" id="videoTime" @canplaythrough="getVideoTime"></video>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Loading } from "element-ui";
import {
  getAgencyMaterial,
  addAgencyMaterial,
  delAgencyMaterial,
  updateAgencyMaterial,
  getMaterialType
} from "../../api/admin/agentMgr/agentMgr";
import { myAsyncFn } from "../../utils/index.js";
import { getOssToken } from "../../api/admin/ossApi/ossApi";
var OSS = require("ali-oss");
const TokenGenerator = require("uuid-token-generator");
//newLog
interface QueryItem {
  type?: string;
  pid?: string;
  opt?: string;
  active?: any;
  page: number;
  count: number;
  createDateStart?: Date;
  createDateEnd?: Date;
  releaseDateStart?: Date;
  releaseDateEnd?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class MaterialCenter extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.addPidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadType(); //初始化模版类型
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  dataList: object[] = []; // 表单数据
  ossToken: any = {};
  pidList: any = [];
  url: string = "";
  urls: any = [];
  id: string = "";
  maxVideoTime: number = 15; //最大视频时长
  isUploadImg: boolean = true;
  opt: string = "";
  pid: string = "";
  type: string = "";
  active: any = "";
  searchTypeOpts: any = [];
  activeOpts: any = [
    {
      value: "",
      label: "全部"
    },
    {
      value: true,
      label: "开启"
    },
    {
      value: false,
      label: "关闭"
    }
  ];
  isAdd: boolean = false;
  addType: string = "";
  addText: string = "";
  addPid: string = "A";
  addActive: boolean = true;
  addReleaseDate: any = "";
  fileList: any = [];
  addPidList: any = [];
  typeOpts: any = [];
  isImg: boolean = false;
  imgDataList: any[] = [];
  isUpdate: boolean = false;
  createDate: Date[] = [];
  releaseDate: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  isVideo: boolean = false;
  videoData: string = "";
  /*method*/
  search() {
    this.page = 1;
    this.loadData();
  }
  async loadType() {
    let ret = await myAsyncFn(getMaterialType, {}, true);
    if (ret.code === 200) {
      this.typeOpts = ret.msg;
      this.searchTypeOpts = [{ label: "全部", value: "" }, ...ret.msg];
    }
  }
  async loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count,
      pid: this.pid
    };
    if (this.createDate && this.createDate.length === 2) {
      queryItem.createDateStart = this.createDate[0];
      queryItem.createDateEnd = this.createDate[1];
    }
    if (this.releaseDate && this.releaseDate.length === 2) {
      queryItem.releaseDateStart = this.releaseDate[0];
      queryItem.releaseDateEnd = this.releaseDate[1];
    }
    queryItem.type = this.type;
    queryItem.active = this.active;
    if (this.active === "") {
      queryItem.active = undefined;
    }
    if (this.opt) {
      queryItem.opt = this.opt;
    }
    let ret = await myAsyncFn(getAgencyMaterial, queryItem, true);
    if (ret.code === 200) {
      this.dataList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    }
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
      text: "拼命上传中..."
    });
    for (let item of this.fileList) {
      let uuid = new TokenGenerator(256, TokenGenerator.BASE62).generate();
      let extensionName = item.name.substr(item.name.indexOf(".")); // 文件扩展名
      let fileName = "agentMgr/agencyMaterialCenter/" + uuid + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
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
    this.urls = [...urlArr];
    loadingInstance.close();
  }
  changeClick() {
    this.fileList = [];
  }
  showImg(row) {
    this.imgDataList = row.img;
    this.isImg = true;
  }
  showVideo(row) {
    this.videoData = row.video;
    this.isVideo = true;
  }
  //del
  del(row) {
    this.$confirm(`此操作将删除该数据, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delAgencyMaterial, { id: row._id });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功！"
          });
          this.page = 1;
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  //update
  update(row) {
    this.isUpdate = true;
    this.addActive = row.active;
    this.addText = row.text;
    this.id = row._id;
    this.addReleaseDate = this.releaseDateFormat(row);
  }
  async updateConfirm() {
    if (!this.addText) {
      this.$message({
        type: "error",
        message: "内容不能为空！"
      });
    }
    let req: any = {
      id: this.id,
      active: this.addActive,
      text: this.addText
    };
    if (this.addReleaseDate) {
      req.releaseDate = this.addReleaseDate;
    }
    let ret = await myAsyncFn(updateAgencyMaterial, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "修改成功！"
      });
      this.isUpdate = false;
      this.loadData();
    }
  }
  cancelUpdate() {
    this.isUpdate = false;
  }

  handleExceed(files, fileList) {
    this.$message.warning(
      `当前限制选择 9 个文件，本次选择了 ${
        files.length
      } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    );
  }
  add() {
    this.fileList = [];
    this.addActive = true;
    this.addType = this.typeOpts[0].value;
    this.isUploadImg = true;
    this.addText = "";
    this.addPid = "A";
    this.addReleaseDate = "";
    this.isAdd = true;
  }
  async addConfirm() {
    if (!this.addText) {
      this.$message({
        type: "error",
        message: "内容不能为空！"
      });
    } else {
      await this.createOssClient(this.addPid);
      await this.ossUploadFileMany();
      if (this.urls.length) {
      }
      let req: any = {
        pid: this.addPid,
        type: this.addType,
        text: this.addText,
        active: this.addActive,
        url: this.urls,
        isVideo: !this.isUploadImg
      };
      if (this.addReleaseDate) {
        req.releaseDate = this.addReleaseDate;
      }
      let ret = await myAsyncFn(addAgencyMaterial, req);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "添加成功！"
        });
        this.loadData();
        this.isAdd = false;
      }
    }
  }
  getVideoTime(ele) {
    const ref: any = this.$refs["upload"];
    if (ele.target.duration >= this.maxVideoTime) {
      this.$message({
        message: `上传文件时长不超过${this.maxVideoTime}秒!`,
        type: "warning"
      });
      ref.clearFiles();
      this.fileList = [];
    }
  }
  uploadChange(file, fileList) {
    const extension = file.raw.type === "image/jpeg";
    const extension2 = file.raw.type === "image/png";
    const extension3 = file.raw.type === "video/mp4";
    const isLt2M = file.size / 1024 / 1024 <= 1;
    const ref: any = this.$refs["upload"];
    if (this.isUploadImg && !extension && !extension2) {
      this.$message({
        message: "上传文件只能是 jpg、png 格式!",
        type: "warning"
      });
      ref.clearFiles();
      return;
    }
    if (!this.isUploadImg && !extension3) {
      this.$message({
        message: "上传文件只能是 mp4 格式!",
        type: "warning"
      });
      ref.clearFiles();
      return;
    }
    if (!this.isUploadImg && extension3) {
      document.getElementById("videoTime")["src"] = file.url;
    }
    this.fileList = fileList;
  }
  cancelAdd() {
    this.isAdd = false;
  }
  //日期整形
  timeFormat(row, column) {
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  updateDateFormat(row, column) {
    let date = new Date(row.updateDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  releaseDateFormat(row) {
    if (!row.releaseDate) {
      return "";
    }
    let date = new Date(row.releaseDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  //操作模块整形
  typeFormat(row) {
    if (row.type) {
      let typeStr = this.typeOpts.filter(e => e.value === row.type);
      return typeStr[0].label;
    }
  }
  activeFormat(row) {
    return row.active ? "开启" : "关闭";
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
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
.showImg {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
