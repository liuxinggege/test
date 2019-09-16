'use strict'
import {
  myAsyncFn,
  dateFormat,
} from '../utils'
import {
  getOssToken
} from '../api/admin/ossApi/ossApi'
var OSS = require('ali-oss')
const TokenGenerator = require('uuid-token-generator');
export default {
  /**
   * 创建oss客户端对象
   * @returns {*}
   */
  async createOssClient(pid) {
    let req = pid ? {
      pid: pid
    } : {};
    let ret = await myAsyncFn(getOssToken, req)
    if (ret.code === 200) {
      return new Promise((resolve, reject) => {
        let client = new OSS({
          region: ret.msg.region,
          accessKeyId: ret.msg.token.credentials.AccessKeyId,
          accessKeySecret: ret.msg.token.credentials.AccessKeySecret,
          stsToken: ret.msg.token.credentials.SecurityToken,
          endpoint: ret.msg.endpoint,
          bucket: ret.msg.bucket,
          secure: true,
          cname: true
        })
        resolve(client)
      })
    }
  },
  /**
   * 文件上传
   * @param option 
   * @param pid 
   * @param OssPutPath 
   */
  ossUploadFile(option, OssPutPath, pid = '') {
    let file = option.file
    const self = this
    return new Promise((resolve, reject) => {
      let uuid = new TokenGenerator(256, TokenGenerator.BASE62).generate()
      let extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
      let fileName = OssPutPath + uuid + extensionName // 文件名字（相对于根目录的路径 + 文件名）
      // 执行上传
      self.createOssClient(pid).then(client => {
        // 异步上传,返回数据
        resolve({
          fileName: file.name,
          fileUrl: fileName
        })
        // 上传处理
        // 分片上传文件
        client.multipartUpload(fileName, file, {
          progress: function (p) {
            let e = {}
            e.percent = Math.floor(p * 100)
            // console.log('Progress: ' + p)
            option.onProgress(e)
          }
        }).then((val) => {
          let url = ""
          if (val.res.statusCode === 200) {
            if (file.size > 100 * 1024) {
              url = val.res.requestUrls[0].split("?")[0]
            } else {
              url = val.res.requestUrls[0]
            }
            option.onSuccess(url)
          } else {
            option.onError('上传失败')
          }
        }, err => {
          option.onError('上传失败')
          reject(err)
        })
      })
    })
  }
}
