class Status {

    STATUS_JUSHANG = 0x000000001     //聚商
    STATUS_BAN_LOGIN = 0x000000002 //禁止登录
    STATUS_BAN_WITHDRAW = 0x000000004   //禁止兑换
    STATUS_BAN_RECHARGE = 0x000000008  //禁止在线充值

    normalTransferRate = 1 //一般情况下主后台上下分，转入转出金币比例


    check = (status, constStatus) => {
        return ((status & constStatus) > 0 ? true : false);
    }

    set = (status, constStatus) => {
        return (status | constStatus);
    }

    unset = (status, constStatus) => {
        return (status & (~constStatus))
    }
}
export const ban = new Status();
export const PID = process.env.PID;