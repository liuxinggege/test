<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理APP轮播图"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代理APP轮播图</span>
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
        <span style="font-size:12pt; margin:10px 10px 10px 20px">操作人</span>
        <el-input v-model="opt" style="width:120px"></el-input>
        <span style="font-size:12pt; margin:10px 10px 10px 20px">时间</span>
        <el-date-picker v-model="createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 0" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" style="margin:10px 0" type="primary" @click="add">添加</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="dataList" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="del(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="pid" label="项目" width="60" :formatter="pidFormat" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="100" :formatter="typeFormat" align="center"></el-table-column>
        <el-table-column prop="idx" label="权重" width="60" align="center"></el-table-column>
        <el-table-column label="图片" align="center" min-width="200" height="50">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" width="300">
              <img width="300" :src="scope.row.url" alt>
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.url}}</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="redirectUrl" label="跳转地址" min-width="150" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="150" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="opt" label="操作人" width="90" align="center"></el-table-column>
      </el-table>
      <!-- add -->
      <el-dialog :visible.sync="isAdd" width="650px" title="添加轮播图">
        <span style="font-size:12pt; margin:10px 0px 10px 45px">项目</span>
        <el-select v-model="addPid" placeholder="请选择" style="width:100px; margin:10px 20px 10px 20px">
          <el-option v-for="item in addPidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span style="font-size:12pt; margin:10px 0px 10px 10px">类型</span>
        <el-select v-model="addType" placeholder="请选择" style="width:110px; margin:10px 20px 10px 10px">
          <el-option v-for="item in typeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span style="font-size:12pt; margin:10px 0px 10px 10px">权重</span>
        <el-input type="number" style="width:70px; margin:10px 30px 10px 10px;" v-model="idx"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 45px">跳转地址</span>
        <el-input type="text" style="width:300px; margin:10px 30px 10px 10px;" v-model="redirectUrl"></el-input>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 45px">图片</span>
          <el-upload style="text-align:center;margin:10px 30px 10px 20px" ref="upload" list-type="picture-card" :action="url" :on-change="uploadChange" :auto-upload="false" :limit="1" :file-list="fileList">
            <el-button size="small" type="primary">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" plain @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="addConfirm">保存</el-button>
        </div>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Loading } from "element-ui";
import {
  getBanner,
  addBanner,
  delBanner,
  updateAgencyMaterial
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
  page: number;
  count: number;
  createDateStart?: Date;
  createDateEnd?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Agency_appBanner extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.addPidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  dataList: object[] = []; // 表单数据
  ossToken: any = {};
  pidList: any = [];
  form: any = {};
  url: string = "";
  urls: any = [];
  id: string = "";
  maxVideoTime: number = 10; //最大视频时长
  isUploadImg: boolean = true;
  opt: string = "";
  pid: string = "";
  type: string = "";
  searchTypeOpts: any = [
    {
      value: "",
      label: "全部"
    },
    {
      value: "home",
      label: "主页"
    },
    {
      value: "college",
      label: "商学院"
    }
  ];
  isAdd: boolean = false;
  addType: string = "home";
  idx: string = "";
  addPid: string = "A";
  redirectUrl: string = "";
  fileList: any = [];
  addPidList: any = [];
  typeOpts: any = [
    {
      value: "home",
      label: "主页"
    },
    {
      value: "college",
      label: "商学院"
    }
  ];
  isImg: boolean = false;
  imgDataList: any[] = [];
  isUpdate: boolean = false;
  createDate: Date[] = [];
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
  async loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.createDate && this.createDate.length === 2) {
      queryItem.createDateStart = this.createDate[0];
      queryItem.createDateEnd = this.createDate[1];
    }
    if (this.pid) {
      queryItem.pid = this.pid;
    }
    if (this.type) {
      queryItem.type = this.type;
    }
    if (this.opt) {
      queryItem.opt = this.opt;
    }
    let ret = await myAsyncFn(getBanner, queryItem);
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
      text: "拼命上传图片中..."
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
  //del
  del(row) {
    this.$confirm(`此操作将删除该数据, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delBanner, { id: row._id });
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

  async add() {
    this.isAdd = true;
    this.addType = "home";
    this.redirectUrl = "";
    this.idx = "";
    this.addPid = "A";
    this.fileList = [];
  }
  async addConfirm() {
    if (!this.idx) {
      this.$message({
        type: "error",
        message: "权重不能为空！"
      });
    } else if (this.fileList.length === 0) {
      this.$message({
        type: "error",
        message: "请选择文件！"
      });
    } else {
      await this.createOssClient(this.addPid);
      this.$message({
        type: "info",
        message: "正在上传文件....."
      });
      await this.ossUploadFileMany();
      let req: any = {
        pid: this.addPid,
        type: this.addType,
        idx: this.idx,
        redirectUrl: this.redirectUrl,
        url: this.urls[0]
      };
      let ret = await myAsyncFn(addBanner, req);
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
  uploadChange(file, fileList) {
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
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  //操作模块整形
  typeFormat(row) {
    let typeStr = this.typeOpts.filter(e => e.value === row.type);
    return typeStr[0].label;
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
