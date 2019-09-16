<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="课程素材管理"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">课程素材管理</span>
      </el-col>
      <div class="box">
        <span style="font-size:12pt; margin:10px 10px 10px 0px">项目</span>
        <el-select v-model="pid" placeholder="请选择" style="width:100px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>课程标题</span>
        <el-input style="width:200px;margin:0 20px 0 10px" v-model="title"></el-input>
        <span>板块</span>
        <el-select v-model="applicationLocation" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in typeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
        <el-button type="primary" @click="add" style="margin:0px 0px 10px 10px">添加素材</el-button>
      </div>
      <!--列表-->
      <el-table :data="dataList" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column label="操作" width="100" align="center" fixed>
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.$index, scope.row)">修改</el-button>
            <el-button type="text" @click="del(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="查看" width="120" align="center" fixed>
          <template slot-scope="scope">
            <el-button v-if="scope.row.videoPath" type="text" @click="openVideo(scope.row.videoPath)">视频</el-button>
            <el-button v-if="scope.row.audioPath" type="text" @click="openAudio(scope.row.audioPath)">音频</el-button>
            <el-button v-if="scope.row.content.length" type="text" @click="openContent(scope.row.content)">长图</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="pid" label="项目" width="80" :formatter="pidFormat" align="center" fixed/>
        <el-table-column prop="title" label="标题" width="200" align="center" fixed/>
        <el-table-column prop="active" label="状态" width="60" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state" style="color:green">启用</span>
            <span v-else style="color:red">停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="权重" width="60" align="center"/>
        <el-table-column prop="applicationLocation" label="展示板块" width="250" align="center" :formatter="typeFormat"/>
        <el-table-column label="展示图片" align="center" width="300" height="50">
          <template slot-scope="scope">
            <img width="150" :src="scope.row.showImgPath" alt>
          </template>
        </el-table-column>
        <el-table-column label="列表图片" align="center" width="300" height="50">
          <template slot-scope="scope">
            <img width="150" :src="scope.row.smallImgPath" alt>
          </template>
        </el-table-column>
        <el-table-column label="课题简介" align="left" width="300" height="50">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.briefIntroduction" trigger="hover" placement="top" width="700">
              <p>简介内容: {{ scope.row.briefIntroduction }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.briefIntroduction.slice(0,20)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上传时间" width="150" align="center" :formatter="sumDatedFormatter"/>
        <el-table-column prop="viewTimes" label="浏览次数" min-width="100" align="center"/>
        <el-table-column prop="viewTimesReal" label="真实浏览次数" min-width="100" align="center"/>
        <el-table-column prop="likes" label="点赞次数" min-width="100" align="center"/>
        <el-table-column prop="likesReal" label="真实点赞次数" min-width="100" align="center"/>
        <el-table-column prop="opt" label="操作人" min-width="100" align="center"/>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
      <!-- 添加 -->
      <el-dialog :visible.sync="addDialog" @close="close" width="700px" title="添加">
        <el-form :inline="true" class="small-space" label-position="left" label-width="80px" style="width: 700px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select v-model="addPid" placeholder="请选择" style="width:100px">
              <el-option v-for="item in addPidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="课题名称">
            <el-input style="width:400px;" v-model="curTitle"></el-input>
          </el-form-item>
          <el-form-item label="列表图片">
            <el-upload style="width:400px;" ref="uploadSmallImg" class="upload-demo" list-type="picture-card" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFuncSmallImg" :before-upload="beforeAvatarUploadImg" :on-progress="onProgress" :limit="1">
              <el-button size="small" type="primary">选择上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
            <el-button v-if="smallImgPath" size="small" type="success" @click="openImg(smallImgPath)">查看</el-button>
          </el-form-item>
          <br>
          <el-form-item label="展示图片">
            <el-upload style="width:400px;" ref="uploadShowImg" class="upload-demo" list-type="picture-card" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFuncShowImg" :before-upload="beforeAvatarUploadImg" :on-progress="onProgress" :limit="1">
              <el-button size="small" type="primary">选择上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
            <el-button v-if="showImgPath" size="small" type="success" @click="openImg(smallImgPath)">查看</el-button>
          </el-form-item>
          <br>
          <el-form-item label="上传文件">
            <el-upload style="width:400px;" ref="upload" class="upload-demo" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :on-progress="onProgress" :limit="1">
              <el-button size="small" type="primary">选择上传文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传mp4、mp3文件</div>
            </el-upload>
            <el-button v-if="videoUrl" size="small" type="success" @click="openVideo(videoUrl)">查看</el-button>
            <el-button v-if="audioUrl" size="small" type="success" @click="openAudio(audioUrl)">查看</el-button>
          </el-form-item>
          <br>
          <el-form-item label="课题简介">
            <el-input v-model="briefIntroduction" style="width:400px;" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="内容长图">
            <el-upload style="width:400px;" ref="uploadContentImg" class="upload-demo" list-type="picture-card" :on-change="uploadChange" :auto-upload="false" :action="api" :on-progress="onProgress">
              <el-button size="small" type="primary">选择上传图片</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件
                <span style="color:red">(选择完文件后请点击上传)</span>
              </div>
            </el-upload>
            <el-button size="small" type="success" @click="ossUploadFileMany">上传</el-button>
            <el-button v-if="curContent.length!==0" size="small" type="success" @click="openContent(curContent)">查看</el-button>
          </el-form-item>
          <el-form-item label="应用位置">
            <el-checkbox-group size="mini" v-model="typeList" style="width:450px;">
              <el-checkbox label="recommend">推荐</el-checkbox>
              <el-checkbox label="gettingStarted">新手入门</el-checkbox>
              <el-checkbox label="walkthrough">游戏秘籍</el-checkbox>
              <el-checkbox label="noviceClassroom">小白课堂</el-checkbox>
              <br>
              <el-checkbox label="extensionCollege">推广学院</el-checkbox>
              <el-checkbox label="teamManage">团队管理</el-checkbox>
              <el-checkbox label="community">社群营销</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="浏览次数">
            <el-input type="number" style="width:120px" v-model="playTimes"></el-input>
          </el-form-item>
          <el-form-item label="点赞次数">
            <el-input type="number" style="width:120px" v-model="likeTimes"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="状态">
            <el-radio-group v-model="curActive">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <el-form-item label="权重">
            <el-input type="number" style="width:120px" v-model="sort"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 300px" @click="cancelStages">取 消</el-button>
        <el-button type="primary" @click="confirmStages">保 存</el-button>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog :visible.sync="editDialog" @close="close" width="700px" title="修改">
        <el-form :inline="true" class="small-space" label-position="left" label-width="80px" style="width: 700px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select disabled v-model="addPid" placeholder="请选择" style="width:100px">
              <el-option v-for="item in addPidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="课题名称">
            <el-input style="width:400px;" v-model="curTitle"></el-input>
          </el-form-item>
          <el-form-item label="列表图片">
            <el-upload style="width:400px;" ref="uploadSmallImg" class="upload-demo" list-type="picture-card" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFuncSmallImg" :before-upload="beforeAvatarUploadImg" :on-progress="onProgress" :limit="1">
              <el-button size="small" type="primary">选择上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
            <el-button v-if="smallImgPath" size="small" type="success" @click="openImg(smallImgPath)">查看</el-button>
          </el-form-item>
          <br>
          <el-form-item label="展示图片">
            <el-upload style="width:400px;" ref="uploadShowImg" class="upload-demo" list-type="picture-card" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFuncShowImg" :before-upload="beforeAvatarUploadImg" :on-progress="onProgress" :limit="1">
              <el-button size="small" type="primary">选择上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
            <el-button v-if="showImgPath" size="small" type="success" @click="openImg(showImgPath)">查看</el-button>
          </el-form-item>
          <br>
          <el-form-item label="上传文件">
            <el-upload style="width:400px;" ref="upload" class="upload-demo" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :on-progress="onProgress" :limit="1">
              <el-button size="small" type="primary">选择上传文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传mp4、mp3文件</div>
            </el-upload>
            <el-button v-if="videoUrl" size="small" type="success" @click="openVideo(videoUrl)">查看</el-button>
            <el-button v-if="audioUrl" size="small" type="success" @click="openAudio(audioUrl)">查看</el-button>
          </el-form-item>
          <br>
          <el-form-item label="课题简介">
            <el-input v-model="briefIntroduction" style="width:400px;" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="内容长图">
            <el-upload style="width:400px;" ref="uploadContentImg" class="upload-demo" list-type="picture-card" :on-change="uploadChange" :auto-upload="false" :action="api" :on-progress="onProgress">
              <el-button size="small" type="primary">选择上传图片</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件
                <span style="color:red">(选择完文件后请点击上传)</span>
              </div>
            </el-upload>
            <el-button size="small" type="success" @click="ossUploadFileMany">上传</el-button>
            <el-button v-if="curContent.length!==0" size="small" type="success" @click="openContent(curContent)">查看</el-button>
          </el-form-item>
          <el-form-item label="应用位置">
            <el-checkbox-group size="mini" v-model="typeList" style="width:450px;">
              <el-checkbox label="recommend">推荐</el-checkbox>
              <el-checkbox label="gettingStarted">新手入门</el-checkbox>
              <el-checkbox label="walkthrough">游戏秘籍</el-checkbox>
              <el-checkbox label="noviceClassroom">小白课堂</el-checkbox>
              <br>
              <el-checkbox label="extensionCollege">推广学院</el-checkbox>
              <el-checkbox label="teamManage">团队管理</el-checkbox>
              <el-checkbox label="community">社群营销</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="浏览次数">
            <el-input type="number" style="width:120px" v-model="playTimes"></el-input>
          </el-form-item>
          <el-form-item label="点赞次数">
            <el-input type="number" style="width:120px" v-model="likeTimes"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="状态">
            <el-radio-group v-model="curActive">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <el-form-item label="权重">
            <el-input type="number" style="width:120px" v-model="sort"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 300px" @click="cancelUpdateStages">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateStages">保 存</el-button>
      </el-dialog>
      <!-- showContentImg -->
      <el-dialog :visible.sync="showContentImg" width="400px" title="图片">
        <div class="showImg">
          <img v-for="item in imgUrls" width="90%" height="90%" :key="item.sort" :src="item" alt>
        </div>
      </el-dialog>
      <!-- showImg -->
      <el-dialog :visible.sync="showImg" width="400px" title="图片">
        <div class="showImg">
          <img width="90%" height="90%" :src="imgUrl" alt>
        </div>
      </el-dialog>
      <!-- showVideo -->
      <el-dialog :visible.sync="showVideo" width="600px" title="视频" @close="closePlayVideo">
        <div class="showImg">
          <video id="video" controls height="90%" width="90%" :src="videoUrl" alt></video>
        </div>
      </el-dialog>
      <!-- showAudio -->
      <el-dialog :visible.sync="showAudio" width="400px" title="音频" @close="closePlayAudio">
        <div class="showImg">
          <audio id="audio" controls width="90%" :src="audioUrl" alt></audio>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
declare var require: any;
declare var process: any;
import Vue from "vue";
import Component from "vue-class-component";
import { Loading } from "element-ui";
import {
  getCoursematerial,
  addCoursematerial,
  updateCoursematerial,
  delCoursematerial
} from "../../api/admin/agentMgr/agentMgr";
import { myAsyncFn } from "../../utils/index";
import { getOssToken } from "../../api/admin/ossApi/ossApi";
import oss from "../../utils/oss.js";
var OSS = require("ali-oss");
const TokenGenerator = require("uuid-token-generator");

interface QueryItem {
  title?: string;
  pid?: string;
  page?: number;
  count?: number;
  home?: any;
  applicationLocation?: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Coursematerial extends Vue {
  dataList: any = [];
  totalCount: number = 0;
  page: number = 1; //当前页
  count: number = 10;
  ossToken: any = {};
  fileList: any = [];
  pidList: any = [];
  addPidList: any = [];
  pid: string = "";
  addPid: string = "A";
  url: string = "";
  api: string = "";
  imgUrl: string = "";
  typeList: any = [];
  title: string = "";
  applicationLocation: string = "";
  playTimes: string = "";
  likeTimes: string = "";
  sort: string = "";
  addDialog: boolean = false;
  editDialog: boolean = false;
  showImg: boolean = false;
  showContentImg: boolean = false;
  showVideo: boolean = false;
  showAudio: boolean = false;
  isVideo: boolean = false;
  videoUrl: string = "";
  audioUrl: string = "";
  imgUrls: string[] = [];
  curTitle: string = "";
  showImgPath: string = ""; //展示图
  smallImgPath: string = ""; //展示小图
  briefIntroduction: string = "";
  curActive: boolean = true;
  curContent: string[] = [];
  id: string = "";
  typeOpts = [
    { value: "", label: "全部" },
    { value: "recommend", label: "推荐" },
    { value: "gettingStarted", label: "新手入门" },
    { value: "walkthrough", label: "游戏秘籍" },
    { value: "noviceClassroom", label: "小白课堂" },
    { value: "extensionCollege", label: "推广学院" },
    { value: "teamManage", label: "团队管理" },
    { value: "community", label: "社群营销" }
  ];
  //生命周期钩子函数
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.addPidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }

  //初始化数据
  async loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getCoursematerial, queryItem);
    if (ret.code === 200) {
      this.dataList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    }
  }
  // 上传oss
  fnUploadRequest(option) {
    oss.ossUploadFile(option, "agency/agencyAppCoursematerial/", this.addPid);
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
    await this.createOssClient(this.addPid);
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
      let fileName = "agentMgr/agencyAppCoursematerial/" + uuid + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
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
    this.curContent = [...urlArr];
    loadingInstance.close();
    const ref: any = this.$refs["uploadContentImg"];
    ref.clearFiles();
    this.$message({
      type: "success",
      message: "上传成功！"
    });
  }
  uploadChange(file, fileList) {
    const extension1 = file.raw.type === "image/jpeg";
    const extension2 = file.raw.type === "image/png";
    let ref: any = this.$refs["uploadContentImg"];
    if (!extension1 && !extension2) {
      this.$message({
        message: "上传文件只能是 jpg、png 格式!",
        type: "warning"
      });
      ref.clearFiles();
      this.fileList = [];
      return;
    }
    this.fileList = fileList;
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  openVideo(url) {
    this.videoUrl = url;
    this.showVideo = true;
  }
  openAudio(url) {
    this.audioUrl = url;
    this.showAudio = true;
  }
  openContent(urls) {
    this.imgUrls = urls;
    this.showContentImg = true;
  }
  openImg(url) {
    this.imgUrl = url;
    this.showImg = true;
  }
  del(index, row) {
    this.$confirm("此操作将删除这条素材, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delCoursematerial, { _id: row._id });
        if (ret.code === 200) {
          this.$message({ type: "success", message: "删除成功" });
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
  }
  getQueryItem() {
    let tmp: QueryItem = {};
    if (this.title) {
      tmp.title = this.title;
    }
    if (this.applicationLocation) {
      tmp.applicationLocation = this.applicationLocation;
    }
    if (this.pid) {
      tmp.pid = this.pid;
    }
    return tmp;
  }
  closePlayVideo() {
    let video: any = document.getElementById("video");
    video.load();
  }
  closePlayAudio() {
    let audio: any = document.getElementById("audio");
    audio.load();
  }
  close() {
    this.addDialog = false;
    this.editDialog = false;
  }
  add() {
    this.curTitle = "";
    this.typeList = [];
    this.addPid = "A";
    this.sort = "";
    this.playTimes = "";
    this.likeTimes = "";
    this.briefIntroduction = "";
    this.showImgPath = "";
    this.smallImgPath = "";
    this.curContent = [];
    this.audioUrl = "";
    this.videoUrl = "";
    this.curActive = true;
    this.addDialog = true;
  }
  async confirmStages() {
    if (
      !this.curTitle ||
      !this.playTimes ||
      !this.likeTimes ||
      !this.smallImgPath ||
      !this.sort
    ) {
      this.$message({
        type: "warning",
        message: "标题、列表图片、点赞次数、观看次数、权重为必填项！"
      });
      return;
    }
    if (this.typeList.length === 0) {
      this.$message({
        type: "warning",
        message: "应用位置至少选择一项！"
      });
      return;
    }
    if (!this.videoUrl && !this.audioUrl && this.curContent.length === 0) {
      this.$message({
        type: "warning",
        message: "视频、音频、长图至少上传一种！"
      });
      return;
    }
    let item: any = {
      applicationLocation: this.typeList,
      title: this.curTitle,
      viewTimes: this.playTimes,
      likes: this.likeTimes,
      pid: this.addPid,
      smallImgPath: this.smallImgPath,
      state: this.curActive,
      sort: this.sort
    };
    if (this.curContent.length > 0) {
      item.content = this.curContent;
    }
    if (this.videoUrl) {
      item.videoPath = this.videoUrl;
    }
    if (this.audioUrl) {
      item.audioPath = this.audioUrl;
    }
    if (this.briefIntroduction) {
      item.briefIntroduction = this.briefIntroduction;
    }
    if (this.showImgPath) {
      item.showImgPath = this.showImgPath;
    }
    let ret = await myAsyncFn(addCoursematerial, item);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "添加成功！"
      });
      this.loadData();
      this.addDialog = false;
    }
  }
  edit(index, row) {
    this.id = row._id;
    this.curTitle = row.title;
    this.showImgPath = row.showImgPath || "";
    this.curActive = row.state;
    this.smallImgPath = row.smallImgPath;
    this.typeList = row.applicationLocation;
    this.curContent = row.content || [];
    this.playTimes = row.viewTimes;
    this.likeTimes = row.likes;
    this.briefIntroduction = row.briefIntroduction || "";
    this.videoUrl = row.videoPath || "";
    this.audioUrl = row.audioPath || "";
    this.sort = row.sort;
    this.addPid = row.pid;
    this.editDialog = true;
  }
  async confirmUpdateStages() {
    if (
      !this.curTitle ||
      !this.playTimes ||
      !this.likeTimes ||
      !this.smallImgPath ||
      !this.sort
    ) {
      this.$message({
        type: "warning",
        message: "标题、列表图片、点赞次数、观看次数、权重为必填项！"
      });
      return;
    }
    if (this.typeList.length === 0) {
      this.$message({
        type: "warning",
        message: "应用位置至少选择一项！"
      });
      return;
    }
    if (!this.videoUrl && !this.audioUrl && this.curContent.length === 0) {
      this.$message({
        type: "warning",
        message: "视频、音频、长图至少上传一种！"
      });
      return;
    }
    let item: any = {
      _id: this.id,
      applicationLocation: this.typeList,
      title: this.curTitle,
      viewTimes: this.playTimes,
      likes: this.likeTimes,
      pid: this.addPid,
      smallImgPath: this.smallImgPath,
      state: this.curActive,
      sort: this.sort
    };
    if (this.curContent.length > 0) {
      item.content = this.curContent;
    }
    if (this.videoUrl) {
      item.videoPath = this.videoUrl;
    }
    if (this.audioUrl) {
      item.audioPath = this.audioUrl;
    }
    if (this.briefIntroduction) {
      item.briefIntroduction = this.briefIntroduction;
    }
    if (this.showImgPath) {
      item.showImgPath = this.showImgPath;
    }
    let ret = await myAsyncFn(updateCoursematerial, item);
    if (ret.code === 200) {
      this.loadData();
      this.$message({
        type: "success",
        message: "修改成功！"
      });
      this.editDialog = false;
    }
  }
  cancelStages() {
    this.addDialog = false;
  }
  cancelUpdateStages() {
    this.editDialog = false;
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

  sumDatedFormatter(row, index) {
    if (row.createDate) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  typeFormat(row, index) {
    let typeStr: string = "";
    for (let item of row.applicationLocation) {
      this.typeOpts.forEach(e => {
        if (e.value === item) {
          typeStr += e.label + "、";
        }
      });
    }
    return typeStr;
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
  beforeAvatarUpload(file) {
    if (file.type !== "video/mp4" && file.type !== "audio/mp3") {
      this.$message({
        showClose: true,
        type: "error",
        message: "只能上传mp4、mp3格式!"
      });
      return false;
    }
    this.isVideo = file.type === "video/mp4" ? true : false;
  }
  beforeAvatarUploadImg(file) {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      this.$message({
        showClose: true,
        type: "error",
        message: "只能上传jpg、png格式!"
      });
      return false;
    }
  }
  onProgress(e) {}
  updateError(info) {
    this.$message({ message: "上传失败", type: "error" });
  }
  errorFunc(info) {
    this.$message({ message: "上传失败", type: "error" });
  }
  successFunc(url) {
    if (this.isVideo) {
      this.audioUrl = "";
      this.videoUrl = url;
    } else {
      this.videoUrl = "";
      this.audioUrl = url;
    }
    const ref: any = this.$refs["upload"];
    ref.clearFiles();
    this.$message({ message: "上传成功", type: "success" });
  }
  successFuncSmallImg(url) {
    this.smallImgPath = url;
    this.$message({ message: "上传成功", type: "success" });
    const ref: any = this.$refs["uploadSmallImg"];
    ref.clearFiles();
  }
  successFuncShowImg(url) {
    this.showImgPath = url;
    this.$message({ message: "上传成功", type: "success" });
    const ref: any = this.$refs["uploadShowImg"];
    ref.clearFiles();
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
</style>
