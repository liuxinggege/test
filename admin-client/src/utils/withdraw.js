const STATUS_AUTO_FAIL_GAME_TIME_LT_LIMIT = 0x000000001;                     //机审失败 游戏总时长小于限定值
const STATUS_AUTO_FAIL_TODAY_WITHDRAW_GT_RLIMIT = 0x000000002;               //机审失败 今日提现总额大于最大限制
const STATUS_AUTO_FAIL_TOTAL_RECHARGE_LT_LIMIT = 0x000000004;                //机审失败 总充值小于最小限制
const STATUS_AUTO_FAIL_TOTAL_WITHDRAW_GTE_RECHARGE = 0x000000008;            //机审失败 兑换总额大于充值总额
const STATUS_AUTO_FAIL_TODAY_WITHDRAW_GT_RLIMIT_RED = 0x000000010;           //提现金额超过20000
const STATUS_AUTO_FAIL_TOTAL_WITHDRAW_GT_RECHARGE_AND_WINLOSE = 0x000000020; //总提现大于总充值+累计输赢
const STATUS_AUTO_FAIL_TOTAL_WITHDRAW_DIV_TAX_GTE_20 = 0x000000040;          //总提现除以总抽水大于等于20
const STATUS_AUTO_FAIL_TOTAL_WITHDRAW_EQ_SPECIAL_VALUE = 0x000000080;        //提现次数等于 5 10 20
const STATUS_AUTO_SPOT_CHECK = 0x000000100;                                  //抽查
const STATUS_MANUAL_CHECK_OK = 0x000000200;                                  //人工审核通过
const STATUS_MANUAL_CHECK_FAIL = 0x000000400;                                //人工审核失败
const STATUS_AGENT_NOT_ACCEPT = 0x000000800;                                 //代理未接单
const STATUS_TRANSFER_FAIL = 0x000001000;                                    //打钱失败
const STATUS_TRANSFER_SUC = 0x000002000;                                     //转账成功
const STATUS_AUTO_FAIL_TODAY_WITHDRAW_TIMES_GT_LIMIT = 0x000004000;          //机审失败 今日提现次数大于限制
const STATUS_AUTO_FAIL_WITHDRAW_SUCCESS_TIMES_LT_LIMIT = 0x000008000;        //机审失败 提现成功次数小于最小限制
function check(status, constStatus) {
    return ((status & constStatus) > 0 ? true : false);
}

function set(status, constStatus) {
    return (status | constStatus);
}

function unset(status, constStatus) {
    return (status & (~constStatus))
}
module.exports = {
    check: check,
    set: set,
    unset: unset,
    STATUS_AUTO_FAIL_GAME_TIME_LT_LIMIT: 0x000000001,                     //机审失败 游戏总时长小于限定值
    STATUS_AUTO_FAIL_TODAY_WITHDRAW_GT_RLIMIT: 0x000000002,               //机审失败 今日提现总额大于最大限制
    STATUS_AUTO_FAIL_TOTAL_RECHARGE_LT_LIMIT: 0x000000004,                //机审失败 总充值小于最小限制
    STATUS_AUTO_FAIL_TOTAL_WITHDRAW_GTE_RECHARGE: 0x000000008,            //机审失败 兑换总额大于充值总额
    STATUS_AUTO_FAIL_TODAY_WITHDRAW_GT_RLIMIT_RED: 0x000000010,           //提现金额超过20000
    STATUS_AUTO_FAIL_TOTAL_WITHDRAW_GT_RECHARGE_AND_WINLOSE: 0x000000020, //总提现大于总充值+累计输赢
    STATUS_AUTO_FAIL_TOTAL_WITHDRAW_DIV_TAX_GTE_20: 0x000000040,          //总提现除以总抽水大于等于20
    STATUS_AUTO_FAIL_TOTAL_WITHDRAW_EQ_SPECIAL_VALUE: 0x000000080,        //提现次数等于 5 10 20
    STATUS_AUTO_SPOT_CHECK: 0x000000100,                                  //抽查
    STATUS_MANUAL_CHECK_OK: 0x000000200,                                  //人工审核通过
    STATUS_MANUAL_CHECK_FAIL: 0x000000400,                                //人工审核失败
    STATUS_AGENT_NOT_ACCEPT: 0x000000800,                                 //代理未接单
    STATUS_TRANSFER_FAIL: 0x000001000,                                    //打钱失败
    STATUS_TRANSFER_SUC: 0x000002000,                                     //转账成功
    STATUS_AUTO_FAIL_TODAY_WITHDRAW_TIMES_GT_LIMIT: 0x000004000,       //机审失败 今日提现次数大于限制
    STATUS_AUTO_FAIL_WITHDRAW_SUCCESS_TIMES_LT_LIMIT: 0x000008000       //机审失败 提现成功次数小于最小限制
}







