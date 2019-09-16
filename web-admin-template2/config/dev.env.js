'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   ENV_CONFIG: '"dev"',
//   BASE_API: '"http://admin.in.wind.com:6060"',
//   BASE_API_LIST: {
//     A: '"http://admin.in.wind.com:6060"',
//     B: '"http://admin.in.wind.com:6060"',
//     C: '"http://admin.in.wind.com:6060"',
//   }
// })

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"https://ydwk.alvinsstore.com"',
  BASE_API_LIST: {
    A: '"https://ydwk.alvinsstore.com"',
    B: '"https://ydwk.alvinsstore.com"',
    C: '"https://ydwk.alvinsstore.com"',
  }
})
