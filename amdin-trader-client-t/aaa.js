let a = {
    //客户端
    "chat.agentHandler.enter": {},
    "chat.agentHandler.leave": {},
    "chat.agentHandler.updateAgentState": {
        "required int32 state": 1  //0-离线，1-休息，2-空闲，3-繁忙
    },
    "chat.agentHandler.getPayInfo": {
        "optional string act": 1,
        "optional string name": 2,
        "optional string type": 3,
        "optional int32 pageCnt": 4,
        "optional int32 page": 5
    },//获取代理收款账号
    "chat.agentHandler.insertPay": {  //添加收款账户
        "required string type": 1, //见后面的AgentPayType2定义
        "optional string act": 2,
        "optional string name": 3,
        "optional string bank": 4, //开户行
        "optional string qrCode": 5, //收款码
        "optional string feeRate": 6 //费率
    },
    "chat.agentHandler.deletePay": { //删除收款账户
        "required string payId": 1
    },
    "chat.agentHandler.modifyPay": {//修改收款账户
        "required string payId": 1,
        "optional string type": 2,
        "optional string act": 3,
        "optional string name": 4,
        "optional string bank": 5,
        "optional string qrCode": 6,
        "optional string feeRate": 7
    },
    "chat.agentHandler.activePay": {//开启或者禁止收款账户
        "required string payId": 1,
        "required int32 active": 2  //0-禁止，1-激活
    },
    "chat.agentHandler.getGreet": {}, //获取自助充值开关信息
    "chat.agentHandler.activeGreet": {
        "required int32 active": 1, //0-禁止，1-激活
        "optional string greet": 2
    },
    "chat.agentHandler.getUnfinishChats": {}, //获取未完成会话
    "chat.agentHandler.getUserChats": {   //获取某个用户的会话
        "required int32 uid": 1
    },
    "chat.agentHandler.getChatMsg": {//获取会话的聊天内容
        "required string chatId": 1,
        "optional int32 pageCnt": 2,
        "optional int32 page": 3
    },
    "chat.agentHandler.cancelOrder": { //取消会话
        "required string chatId": 1,
        "required string remarks": 2
    },
    "chat.agentHandler.finishOrder": { //完成会话
        "required string chatId": 1,
        "required string paidMoney": 2 //实际付款金额
    },
    "chat.agentHandler.getBlackList": {
        "optional int32 uid": 1,
        "optional int32 pageCnt": 2,
        "optional int32 page": 3
    },//获取黑名单
    "chat.agentHandler.setBlackUser": {  //设置黑名单
        "required int32 uid": 1,
        "required int32 setBlack": 2 // 1-拉黑，0-解除黑名单
    },
    "chat.agentHandler.sendMsgToUser": {//发送消息
        "required string chatId": 1, //会话id
        "required int32 type": 2, //见后面的ChatMsgType定义
        "required string content": 3
    },
    "chat.agentHandler.readChatMsg": { // 消息已读回执
        "required string chatId": 1
    },
    "chat.agentHandler.getUnreadMsg": {}, // 获取未读消息统计




    // 服务器返回 
    "chat.agentHandler.enter": {
        "required int32 code": 1,
        "message Info": {
            "required int32 uid": 1,
            "required string name": 2,
            "required int32 state": 3, //代理状态//0-离线，1-休息，2-空闲，3-繁忙
            "required int32 gender": 4, //性别
            "required int32 avatar": 5, //头像
            "required string gold": 6, //代理
            "required string pid": 7, //平台id
            "required int32 todayOrderCnt": 8, //今日订单数
            "required int32 todayOrderedCnt": 9, //今日完成订单数
            "required int32 badReview": 10, //差评数
            "required int32 goodReview": 11, //好评数
            "required int32 report": 12, //举报数
            "required int32 greetActive": 13,
            "optional string greet": 14
        },
        "optional Info info": 2
    },
    "chat.agentHandler.updateAgentState": {
        "required int32 code": 1
    },
    "chat.agentHandler.getPayInfo": {
        "required int32 code": 1,
        "optional int32 total": 2,
        "message Pay": {
            "required string payId": 1,
            "required string type": 2,
            "required int32 active": 3,
            "optional string act": 4,
            "optional string name": 5,
            "optional string bank": 6,
            "optional string qrCode": 7,
            "optional string feeRate": 8
        },
        "repeated Pay pays": 3
    },
    "chat.agentHandler.insertPay": {
        "required int32 code": 1
    },
    "chat.agentHandler.deletePay": {
        "required int32 code": 1
    },
    "chat.agentHandler.modifyPay": {
        "required int32 code": 1
    },
    "chat.agentHandler.activePay": {
        "required int32 code": 1
    },
    "chat.agentHandler.getGreet": {
        "required int32 code": 1,
        "optional int32 active": 2,
        "optional string greet": 3
    },
    "chat.agentHandler.activeGreet": {
        "required int32 code": 1
    },
    "chat.agentHandler.getUnfinishChats": { //未完成会话
        "required int32 code": 1,
        "message Chat": {
            "required string chatId": 1,
            "required int32 uid": 2,
            "required string name": 3,
            "required int32 createDate": 4,
            "required string pid": 5,
            "required string money": 6,
            "required int32 state": 7, //会话状态，0-未开始，1-未完成，2-取消，3-完成
            "optional string orderId": 8,//暂时没用上，先加到这
            "optional int32 orderDate": 9,//同上
            "optional int32 finishDate": 10,//完成日期
            "optional string paidMoney": 11,
            "optional string remarks": 12, //取消原因
            "optional int32 evaluation": 13,//评价0-未评价，1-差评，2-好评
            "optional int32 report": 14,// 举报，0-正常，1-被举报，2-举报成功，3-举报失败
            "optional string reportId": 15, //暂定
            "optional int32 haveProof": 16, //凭证
            "optional string payType": 17 // 会话支付类型
        },
        "repeated Chat chat": 2
    },
    "chat.agentHandler.getUserChats": {
        "required int32 code": 1,
        "message Chat": {
            "required string chatId": 1,
            "required int32 uid": 2,
            "required string name": 3,
            "required int32 createDate": 4,
            "required string pid": 5,
            "required string money": 6,
            "required int32 state": 7,
            "optional string orderId": 8,
            "optional int32 orderDate": 9,
            "optional int32 finishDate": 10,
            "optional string paidMoney": 11,
            "optional string remarks": 12,
            "optional int32 evaluation": 13,
            "optional int32 report": 14,
            "optional string reportId": 15,
            "optional int32 haveProof": 16,
            "optional string payType": 17
        },
        "repeated Chat chat": 2
    },
    "chat.agentHandler.getChatMsg": {
        "required int32 code": 1,
        "message Chat": {
            "required string chatId": 1,
            "required int32 uid": 2,
            "required string name": 3,
            "required int32 createDate": 4,
            "required string pid": 5,
            "required string money": 6,
            "required int32 state": 7,
            "optional string orderId": 8,
            "optional int32 orderDate": 9,
            "optional int32 finishDate": 10,
            "optional string paidMoney": 11,
            "optional string remarks": 12,
            "optional int32 evaluation": 13,
            "optional int32 report": 14,
            "optional string reportId": 15,
            "optional int32 haveProof": 16,
            "optional string payType": 17
        },
        "optional Chat chat": 2,
        "message ChatMsg": {
            "required string msgId": 1,//消息id
            "required int32 fromUid": 2,//发送用户id
            "required int32 toUid": 3,//目标用户id
            "required int32 fromType": 4,//发送用户类型，0-玩家，1代理
            "required int32 toType": 5,//目标用户类型，同上
            "required int32 createDate": 6,
            "required int32 read": 7,//0-未读，1-已读
            "required int32 type": 8,
            "required string content": 9
        },
        "repeated ChatMsg msgs": 3
    },
    "chat.agentHandler.cancelOrder": {
        "required int32 code": 1
    },
    "chat.agentHandler.finishOrder": {
        "required int32 code": 1
    },
    "chat.agentHandler.getBlackList": {
        "required int32 code": 1,
        "optional int32 total": 2,
        "message List": {
            "required int32 uid": 1,
            "required int32 createDate": 2
        },
        "repeated List list": 3
    },
    "chat.agentHandler.setBlackUser": {
        "required int32 code": 1
    },
    "chat.agentHandler.sendMsgToUser": {
        "required int32 code": 1,
        "optional string chatId": 2,//会话id
        "optional string msgId": 3 //消息id
    },
    "chat.agentHandler.readChatMsg": {
        "required int32 code": 1
    },
    "chat.agentHandler.getUnreadMsg": {
        "required int32 code": 1,
        "message Chat": {
            "required string chatId": 1,
            "required int32 unreadCnt": 2
        },
        "repeated Chat chats": 2
    },
    "ChatMsg": { // 及时聊天消息
        "required int32 code": 1,
        "required string chatId": 2,
        "required string msgId": 3,
        "required int32 type": 4,
        "required string content": 5,
        "required int32 createDate": 6
    },
    "MsgReaded": { // 消息已被对方读取通知
        "required int32 code": 1,
        "required string chatId": 2
    },
    "NewChat": { // 产生了一个新的会话
        "required int32 code": 1,
        "message Chat": {
            "required string chatId": 1,
            "required int32 uid": 2,
            "required string name": 3,
            "required int32 createDate": 4,
            "required string pid": 5,
            "required string money": 6,
            "required int32 state": 7,
            "optional string orderId": 8,
            "optional int32 orderDate": 9,
            "optional int32 finishDate": 10,
            "optional string paidMoney": 11,
            "optional string remarks": 12,
            "optional int32 evaluation": 13,
            "optional int32 report": 14,
            "optional string reportId": 15,
            "optional int32 haveProof": 16,
            "optional string payType": 17
        },
        "required Chat chat": 2
    },
    "OrderState": { // 会话状态通知
        "required string chatId": 1,
        "required int32 state": 2
    },
    "AgentLost": {
        "required int32 code": 1
    }
    
    
    
        错误码
        200为成功，其余为失败，先暂定
        export default {
        OK: 200,
        BAD: 400,
        FAIL: 500,

        CHAT: {
            FAILED: 14001,
            ORDER_OPEN_FAILED: 14002,
            AGENT_GET_FAILED: 14003,
            AGENT_GET_EMPTY: 14004,
            AGENT_DEL_FAILED: 14005,
            AGENT_ADD_FAILED: 14006,
            MSG_IS_NULL: 14007,
            MSG_SEND_ERR: 14008,
            EVALUATION_FAILED: 14009,
            AGENT_NOT_ONLINE: 14010,
            CHAT_OPEN_FAILED: 14011,
            REPORT_FAILED: 14012,
            AGENT_ALREADY_HAVE: 14013,
            CHAT_OVER: 14014, // 会话结束
            AGENT_FULL: 14015,
            CHAT_TIME_NOTIFY: 14016,
            PROTO_ERR: 14017,
        },

        CHAT_NEW: {
            PROTO_ERR: 15001, // 协议错误
            DATABASE_ERR: 15002, // 数据库执行失败
            SYSCFG_ERR: 15003, // 配置错误
            USER_NOT_ENTER: 15004, // 用户不在线
            AGENT_MATCH_NONE: 15005, // 代理匹配失败
            CHAT_INVALID: 15006, // 会话无效
            AGENT_NOT_ENTER: 15007, // 代理离线
            CHAT_TIME_LIMIT: 15008, // 会话发起时间限制
            CHAT_OVER: 15009, // 会话已经结束
            CHAT_ING: 15010, // 会话未结束
            DB_DUPLICATE: 15011, // 数据库重复
            CHAT_CNT_LIMIT: 15012, // 会话数目限制
            USER_NOT_EXIST: 15013, // 用户不存在
        }
    };

    export interface payInfo { // chat支付信息，功能型的content
        payId: string,
        type: string,
        active: boolean,
        act?: string,
        name?: string,
        bank?: string,
        qrCode?: string,
        feeRate?: string
    }

export enum ChatMsgType {
    WARN = 0, // 警告消息，只有代理能看到
    TEXT = 1, // 文本消息
    IMG = 2, // 图片base64数据
    AUTO_USER = 3, // 自动消息（模拟用户给代理）
    AUTO_AGENT = 4, // 自动消息（模拟代理给用户）
    FUN = 5 // 带功能消息（收款信息）
}

//ali_pay-支付宝，wx_pay-微信，union_pay-银联，xy_pay-信用卡，hb_pay-花呗，yun_pay-云闪付，qq_pay-qq支付，jd_pay-京东支付,对应修改为一下类型
export enum AgentPayType2 { // 收款类型定义
    aliPayAct = "ali_pay_act", // 支付宝账号
    aliPayQR = "ali_pay_qr", // 支付宝二维码
    wxPayAct = "wx_pay_act",
    wxPayQR = "wx_pay_qr",
    unionPayAct = "union_pay_act",
    unionPayQR = "union_pay_qr",
    xyPayAct = "xy_pay_act",
    xyPayQR = "xy_pay_qr",
    hbPayAct = "hb_pay_act",
    hbPayQR = "hb_pay_qr",
    yunPayAct = "yun_pay_act",
    yunPayQR = "yun_pay_qr",
    qqPayAct = "qq_pay_act",
    qqPayQR = "qq_pay_qr",
    jdPayAct = "jd_pay_act",
    jdPayQR = "jd_pay_qr",
}
}