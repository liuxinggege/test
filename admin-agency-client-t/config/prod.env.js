'use strict'
const apiList = require('./prod_apiList')
let BASE_API_LIST = JSON.stringify(apiList[process.env.department]);
let BASE_API = '""';
if (apiList[process.env.department]) {
    BASE_API = JSON.stringify(apiList[process.env.department]['A']);
}
module.exports = {
    NODE_ENV: '"production"',
    ENV_CONFIG: '"prod"',
    BASE_API: BASE_API,
    PID: '"' + process.env.PID + '"',
    DEPART_MENT: '"' + process.env.department + '"',
    BASE_API_LIST: BASE_API_LIST
}

