var path = require('path');
/**
 * 修改:
 *    开发环境的服务器地址、
 *    接口代理前缀
 */
// var ip = '192.168.0.230:8080'; 
// var ip = '192.168.0.231:8080'; 
// var ip = '192.168.0.234:8080';
// var ip = '192.168.0.151:8090';
var ip = '192.168.0.153:8090';
// var ip = '192.168.0.160:8889';
// var ip = '192.168.0.160:8888';
// var ip = '192.168.0.201:8080';


var agency = '/coalmine';
var address = 'http://' + ip ;
var wsAddress = 'ws://' + ip + agency + '/websocket';

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    host:'0.0.0.0',
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: false,
    proxyTable: {
        '/coalmine': {
          	target: address,
            changeOrigin: true,
            pathRewrite: {
              '^/coalmine': agency,
            }
        }
    },
    interface:{
      address:'"'+ address + '"',
      wsAddress:'"'+ wsAddress + '"'
    }
  }
}
