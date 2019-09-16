const CHANNEL_STATUS_SHIELD = 0x000000001;              //屏蔽
const CHANNEL_STATUS_USE_ALIAS = 0x000000002;           //使用别名
const CHANNEL_STATUS_JMP = 0x000000004;           //跳转到渠道落地页面
const CHANNEL_BAN_MASTER = 0x000000008;   //屏蔽拜师
const CHANNEL_REPORT = 0x000000010;                      //举报开关
const CHANNEL_RECHARGE_ENFORCE = 0x000000020;            //充值策略
const CHANNEL_ONLINE_RECHARGE = 0x000000040;             //在线支付开关
const CHANNEL_SHOW_CHANNEL_AGENT = 0x000000080;             //只显示渠道代理

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
    CHANNEL_STATUS_SHIELD: 0x000000001,
    CHANNEL_STATUS_USE_ALIAS: 0x000000002,
    CHANNEL_STATUS_JMP: 0x000000004,
    CHANNEL_BAN_MASTER: 0x000000008,
    CHANNEL_REPORT: 0x000000010,
    CHANNEL_RECHARGE_ENFORCE: 0x000000020,
    CHANNEL_ONLINE_RECHARGE: 0x000000040,
    CHANNEL_SHOW_CHANNEL_AGENT: 0x000000080,
}
