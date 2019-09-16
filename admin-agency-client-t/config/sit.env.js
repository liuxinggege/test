'use strict'
const apiList = require('./sit_apiList')
let BASE_API_LIST = JSON.stringify(apiList[process.env.department]);
let BASE_API = '""';
if (apiList[process.env.department]) {
    BASE_API = JSON.stringify(apiList[process.env.department]['A']);
}
module.exports = {
    NODE_ENV: '"production"',
    ENV_CONFIG: '"sit"',
    BASE_API: BASE_API,
    PID: '"' + process.env.PID + '"',
    BASE_API_LIST: BASE_API_LIST,
    DEPART_MENT: '"' + process.env.department + '"',
}
