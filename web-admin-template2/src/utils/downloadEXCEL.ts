/*
 *导出EXCEL函数
 */
// [{
//     title,    名字
//     field,    “game.xx”
//     type: "Date"
// }]

import { secToString } from './index'

import { export_json_to_excel } from '../vendor/Export2Excel'
import { formUtil } from './formatUtils'

//获取注册天数
const handle_getCreateDateCycle = (rowData, field) => {
  let cellValue = rowData[field]
  let date1 = new Date(rowData['createDate']) //开始时间
  let date2 = new Date() //结束时间
  let date3 = date2.getTime() - date1.getTime() //时间差的毫秒数
  //计算出相差天数
  return Math.floor(date3 / (24 * 3600 * 1000))
}

const bjLocale = {
  hour12: false,
  timeZone: 'Asia/Shanghai'
}
function handle_Date(rowData, field) {
  // if (1) {
  //     return new Date(cellValue).toLocaleString();
  // }
  let cellValue = rowData[field]
  if (!cellValue) {
    return
  }
  let t = new Date(new Date(cellValue).getTime() + 28800000)
  return `${t.getUTCFullYear()}-${t.getUTCMonth() +
    1}-${t.getUTCDate()} ${t.getUTCHours()}:${t.getUTCMinutes()}:${t.getUTCSeconds()}`
}

function handle_serverType(rowData, field) {
  let cellValue = rowData[field]
  switch (cellValue) {
    case 'admin':
      return '主后台'
    case 'channel':
      return '渠道后台'
    case 'agent':
      return '商人后台'
    case 'agency':
      return '代理后台'
  }
  return ''
}
function handle_MoneyChangeType(rowData, field) {
  let cellValue = rowData[field]
  switch (cellValue) {
    case 0:
      return '转账'
    case 1:
      return '银行'
    case 2:
      return '充值'
    case 3:
      return '兑换'
    case 4:
      return '兑换失败'
    case 5:
      return '游戏输赢'
    case 6:
      return '师父'
    case 7:
      return '彩金'
    case 8:
      return '上下分'
    case 9:
      return '新人领奖'
    case 10:
      return '追分'
    case 11:
      return '绑定领奖'
    case 12:
      return '世界杯下注'
    case 13:
      return '世界杯结算'
  }
  return ''
}

function handle_GameTime(rowData, field) {
  let cellValue = rowData[field]
  if (!cellValue) {
    return
  }
  return secToString(cellValue)
}

function handle_OnlineChargeState(rowData, field) {
  let cellValue = rowData[field]
  if (!cellValue) {
    return
  }
  switch (cellValue) {
    case 'ordered':
      return '下订单成功'
    case 'ordering':
      return '开始下订单'
    case 'paid':
      return '支付成功'
  }
  return ''
}
function handle_RecordType(rowData, field) {
  let cellValue = rowData[field]
  if (cellValue) {
    switch (cellValue) {
      case 'artificial':
        return '手动添加'
      case 'system':
        return '系统结算'
      case 'apply':
        return '拒绝'
      case 'refused':
        return '退款'
      case 'applyFail':
        return '提现失败'
      case 'transferFail':
        return '转账失败'
      case 'refund':
        return '退款'
      case 'master':
        return '师徒结算'
      case 'wcg':
        return '世界杯'
      case 'transferIn':
        return '转入'
      case 'transferOut':
        return '转出'
      case 'activity':
        return '活动'
      case '其他':
        return '其他'
    }
  }
  return ''
}

function handle_AgencyType(rowData, field) {
  let cellValue = rowData[field]
  if (!cellValue) {
    return
  }
  switch (cellValue) {
    case 'business':
      return '商人代理'
    case 'general':
      return '全民代理'
  }
  return ''
}
function handle_ChannelType(rowData, field) {
  let cellValue = rowData[field]
  if (cellValue === '') {
    return '官方'
  } else {
    return cellValue
  }
}
function handle_PidType(rowData, field) {
  let cellValue = rowData[field]
  let pidList = JSON.parse(<string>sessionStorage.getItem('pid'))
  let name = ''
  if (cellValue) {
    pidList.forEach(element => {
      if (element.pid === cellValue) {
        name = element.name
      }
    })
  }
  return name
}
function handle_CommentTypee(rowData, field) {
  let cellValue = rowData[field]
  if (cellValue !== undefined) {
    return cellValue ? '满意' : '不满意'
  }
}
function handle_BooleanTypee(rowData, field) {
  let cellValue = rowData[field]
  return cellValue
}
function handle_Money(rowData, field) {
  let cellValue = rowData[field]
  return formUtil.moneyFormat(cellValue)
}
function handle_RechargeQuestionType(rowData, field) {
  let cellValue = rowData[field]
  let typeConst = {
    vip: 'vip充值',
    ali: '支付宝',
    aliFixs: '固定支付宝',
    aliPer: '个人支付宝',
    wx: '微信',
    union: '银联',
    qq: 'QQ钱包',
    jd: '京东',
    card: '点卡支付'
  }
  if (cellValue) {
    return typeConst[cellValue]
  }
  return ''
}
function handle_RechargeQuestionState(rowData, field) {
  let cellValue = rowData[field]
  let stateConst = {
    await: '待处理',
    processing: '处理中',
    success: '完成',
    fail: '失败'
  }
  if (cellValue) {
    return stateConst[cellValue]
  }
  return ''
}
function handle_SettleType(rowData, field) {
  let cellValue = rowData[field]
  if (cellValue) {
    if (cellValue === 'unionpay') {
      return '银行卡'
    } else if (cellValue === 'alipay') {
      return '支付宝'
    }
  }
  return ''
}
function handle_RechargeQuestionChannel(rowData, field) {
  let cellValue = rowData[field]
  let rechargeChannels = [
    { key: '', value: '所有' },
    { key: '9127', value: '闪付1' },
    { key: '91272nd', value: '闪付2' },
    { key: '91273rd', value: '闪付3' },
    { key: '91274th', value: '闪付4' },
    { key: 'eggX', value: '蛋蛋X' },
    { key: 'dazhuang1st', value: '大壮支付' },
    { key: 'egg1st', value: '蛋蛋支付1' },
    { key: '91275th', value: '个人闪付5' },
    { key: '91276th', value: '个人闪付6' },
    { key: '3631st', value: '新闪付2' },
    { key: 'asan1st', value: '阿三支付1' },
    { key: 'taobao1st', value: '淘宝支付1' },
    { key: 'taobao2nd', value: '发财1' },
    { key: 'taobao3rd', value: '发财2' }
  ]
  let data = ''
  if (cellValue) {
    rechargeChannels.forEach(e => {
      if (e.key === cellValue) {
        data = e.value
      }
    })
  }
  return data
}
function handle_WithdrawChannel(rowData, field) {
  let cellValue = rowData[field]
  let widthdrawChannels = [
    { key: '', value: '所有' },
    { key: 'cash9127', value: '老兑换' },
    { key: '9127', value: '新兑换1' },
    { key: 'jinyu', value: '金鱼支付' },
    { key: '91272nd', value: '银行卡兑换通道1' },
    { key: '6081st', value: '608兑换通道1' }
  ]
  let data = ''
  if (cellValue) {
    widthdrawChannels.forEach(e => {
      if (e.key === cellValue) {
        data = e.value
      }
    })
  }
  return data
}
function handle_withdrawType(rowData, field) {
  let cellValue = rowData[field]
  if (!cellValue) {
    return
  }
  switch (cellValue) {
    case 1:
      return '支付宝'
    case 2:
      return '银行卡'
    case 3:
      return '代理'
    case 5:
      return '商人'
    default:
      return ''
  }
}

function handle_withdrawOrderState(rowData, field) {
  let state = rowData[field]
  let status = rowData['status']
  switch (state) {
    case 1: //WithdrawState.AUTO:
      return '自动审核'
    case 2: //WithdrawState.MANUAL:
      return '人工审核'
    case 3: //WithdrawState.AGENTACCEPTING:
      return '代理接单'
    case 4: //WithdrawState.USERACCEPTING:
      return '用户接单'
    case 5: //WithdrawState.TRANSFER:
      return '转账中'
    case 6: //WithdrawState.FINISH:
      if ((status & 0x2000) > 0) {
        // WithdrawStatus.STATUS_TRANSFER_SUC
        return '完成(成功)'
      } else {
        return '完成(失败)'
      }
    default:
      return ''
  }
}
function handle_userForbiddenType(rowData, field) {
  let state = rowData[field]
  switch (state) {
    case true:
      return '封号'
    case false:
      return '解封'
    default:
      return ''
  }
}
function handle_riskType(rowData, field) {
  let state = rowData[field]
  let result: string[] = []
  if (state.length > 0) {
    state.forEach(element => {
      switch (element) {
        case 1:
          result.push('帐号信用低')
          break
        case 2:
          result.push('垃圾帐号')
          break
        case 3:
          result.push('无效帐号')
          break
        case 4:
          result.push('黑名单')
          break
        case 101:
          result.push('批量操作')
          break
        case 102:
          result.push('自动机')
          break
        case 201:
          result.push('环境异常')
          break
        case 202:
          result.push('js上报异常')
          break
        case 203:
          result.push('撞库')
          break
        default:
          break
      }
    })
  }
  return result.toString()
}
function handle_gidTypeState(rowData, field) {
  let state = rowData[field]
  if (state == 'JH') {
    return '金花'
  } else if (state == 'QZNN') {
    return '牛牛'
  } else if (state == 'BRNN') {
    return '百人牛牛'
  } else if (state == 'XUEZHAN') {
    return '麻将'
  } else if (state == 'SUOHA') {
    return '梭哈'
  } else if (state == 'DDZ') {
    return '斗地主'
  } else if (state == 'DZPK') {
    return '德州扑克'
  } else if (state == 'QHB') {
    return '抢红包'
  } else if (state == 'EBG') {
    return '二八杠'
  } else if (state == 'HH') {
    return '红黑'
  } else if (state == 'ERMJ') {
    return '二人麻将'
  } else if (state == 'LH') {
    return '龙虎斗'
  } else if (state == 'BY') {
    return '捕鱼'
  } else if (state == 'JDNN') {
    return '经典牛牛'
  } else if (state == 'PDK') {
    return '跑得快'
  } else {
    return '大厅'
  }
}
export const downloadExcel = (data: any, obj: any) => {
  if (data.code === 200) {
    obj.$message({ message: '创建任务成功', type: 'success' })
  } else {
    obj.$message({ message: '创建任务失败！' + data.err, type: 'error' })
  }
}
// export const downloadExcel = (excelName: string, downloadExcelCfg: { title: string, field: string, type: string }[], downloadExcelData: any[]) => {
//     let tHeader: string[] = [];
//     let filterVal: string[] = [];
//     let handles = {};
//     downloadExcelCfg.forEach(e => {
//         tHeader.push(e.title);
//         filterVal.push(e.field);
//         let isDot;
//         if (e.field.indexOf(".") > 0) {
//             isDot = true;
//         }
//         let handle;
//         if (e.type === "serverType") {
//             handle = handle_serverType;
//         }
//         if (e.type === "Date") {
//             handle = handle_Date;
//         } else if (e.type === "MoneyChangeType") {
//             handle = handle_MoneyChangeType;
//         } else if (e.type === "GameTime") {//游戏时长
//             handle = handle_GameTime;
//         } else if (e.type === "onlineCharge_state") {//在线充值
//             handle = handle_OnlineChargeState;
//         } else if (e.type === "agencyType") {//代理类型
//             handle = handle_AgencyType;
//         } else if (e.type === "createDateCycle") {//注册周期
//             handle = handle_getCreateDateCycle;
//         } else if (e.type === "withdrawType") { //提现类型
//             handle = handle_withdrawType;
//         } else if (e.type === "withdrawOrderState") { //兑换订单状态
//             handle = handle_withdrawOrderState;
//         } else if (e.type === "userForbiddenType") { //兑换订单状态
//             handle = handle_userForbiddenType;
//         } else if (e.type === "riskType") { //兑换订单状态
//             handle = handle_riskType;
//         } else if (e.type === "gidType") { //gid转游戏名
//             handle = handle_gidTypeState;
//         } else if (e.type === "channelType") { //channelTo官方
//             handle = handle_ChannelType;
//         } else if (e.type === "pidType") { //pidTo项目
//             handle = handle_PidType;
//         } else if (e.type === "commentType") { //pidTo项目
//             handle = handle_CommentTypee;
//         } else if (e.type === "money") { //money
//             handle = handle_Money;
//         } else if (e.type === "rechargeQuestionType") {
//             handle = handle_RechargeQuestionType;
//         } else if (e.type === "rechargeQuestionState") {
//             handle = handle_RechargeQuestionState;
//         } else if (e.type === "rechargeQuestionChannel") {
//             handle = handle_RechargeQuestionChannel;
//         } else if (e.type === "withdrawChannel") {
//             handle = handle_WithdrawChannel;
//         } else if (e.type === "settleType") {
//             handle = handle_SettleType;
//         }else if (e.type === "recordType") {
//             handle = handle_RecordType;
//         }else if (e.type === "booleanType") {
//             handle = handle_BooleanTypee;
//         }
//         if (isDot || handle) {
//             handles[e.field] = { isDot: isDot, handle: handle };
//         }
//     })
//     let t1 = new Date();
//     for (let field in handles) {

//         let h = handles[field];
//         let splitedField;
//         let isDot = h.isDot;
//         let handle = h.handle;
//         if (isDot) {
//             splitedField = field.split(".")
//         }
//         let t2 = new Date();
//         for (let k in downloadExcelData) {
//             let item = downloadExcelData[k];
//             if (isDot) {
//                 let tmpItem = item;
//                 for (let i = 0; i < splitedField.length; i++) {
//                     let v = splitedField[i];
//                     tmpItem = tmpItem[v];
//                 }
//                 item[field] = tmpItem;
//             }
//             if (handle) {
//                 item[field] = handle(item, field);
//             }
//         }
//         let d = new Date().getTime() - t2.getTime();
//         console.log(field, d);
//     }
//     console.log("--------------", new Date().getTime() - t1.getTime());
//     const data = formatJson(filterVal, downloadExcelData);
//     export_json_to_excel(tHeader, data, excelName);

// }

const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
