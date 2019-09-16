import { Connection, Model, Schema, SchemaTypes } from "mongoose";
import { CodeMsg, ErrCode } from "../errorCode";
import { logger } from "../logger";
import { removeUndefinedOrNull } from "../utils";


export interface GameUserDoc {
    pid: string,
    uid: number,
    uuid: string,
    commonUsedUuid: string,
    name: string,
    createDate: Date,
    gender: boolean,
    avatar: number,
    gold: string,
    bankGold: string,
    bankPwd: string,
    location: string,
    lng: number,
    lat: number,
    ip: string,
    newbie: boolean,
    accessToken: string,
    alipayAccount: string,
    alipayRealName: string,
    shieldDate: Date,
    act: string,
    pwd: string,
    vip: number,
    vipTop: boolean,
    qq: string,
    wx: string,
    hasBill: boolean,
    channel: string,
    loginCount: number,
    lastLoginTime: Date,
    bindDate: Date,
    profit: string,
    status: number,
    rechargeCount: number,
    rechargeTotalRmb: string,
    agentRechargeCount: number,
    agentRechargeRmb: string,
    bankCardNumber: string,
    bankCardRealName: string,
    bankOfCreditCard: string,
    bundleId: string,
    platform: string,
    bonusCount: string,
    totalMatchGamingTime: number,
    totalWithdrawAmount: number,
    totalWithdrawSucCount: number,
    totalInput: string,
    totalWinLose: string,
    totalTax: string,
    today: Date,
    todayWithdrawAmount: number,
    todayWithdrawCount: number,
    masterMoney: string,
    personWaterLine: string,
    vipTotalAmount: string,
    vipTotalCount: number,
    vipTodayAmount: string,
    vipTodayCount: number,
}

//用户表 withdraw
class UserDAO {
    private _model: Model<any>;
    public init = (conn: Connection) => {
        //这里不建索引，所有的在web-server创建
        let schema = new Schema({
            uid: { type: Number },
            uuid: { type: String },
            commonUsedUuid: { type: String },
            accessToken: String,
            act: { type: String },
            pid: String,
            name: { type: String, },
            createDate: Date,
            gender: Boolean,
            avatar: Number,
            gold: { type: SchemaTypes.Decimal128 },
            bankGold: { type: SchemaTypes.Decimal128 },
            bankPwd: { type: String },
            location: { type: String, },
            lng: { type: Number, },
            lat: { type: Number, },
            ip: String,
            newbie: { type: Boolean, },
            alipayAccount: String,
            alipayRealName: String,
            shieldDate: Date,
            pwd: String,
            vip: { type: Number },
            vipTop: Number,
            qq: String,
            wx: String,
            channel: { type: String, },
            loginCount: { type: Number, },
            lastLoginTime: Date,
            bindDate: Date,
            profit: { type: SchemaTypes.Decimal128 },
            status: { type: Number, },
            bankCardNumber: { type: String, },
            bankCardRealName: { type: String, },
            bankOfCreditCard: { type: String, },
            bundleId: { type: String, },
            platform: { type: String, },
            agent: { type: Number, },
            web: String,
            /**统计信息 */
            hasBill: { type: Boolean, },
            bonusCount: { type: SchemaTypes.Decimal128 },
            rechargeCount: { type: Number, },
            rechargeTotalRmb: { type: SchemaTypes.Decimal128 },
            agentRechargeCount: { type: Number, },
            agentRechargeRmb: { type: SchemaTypes.Decimal128 },
            totalMatchGamingTime: { type: Number, },
            totalWithdrawAmount: { type: SchemaTypes.Decimal128, },
            totalWithdrawSucCount: { type: Number, },
            aliWithdrawAmount: { type: SchemaTypes.Decimal128 },
            aliWithdrawTimes: { type: Number, },
            totalWinLose: { type: SchemaTypes.Decimal128, },
            totalTax: { type: SchemaTypes.Decimal128, },
            today: { type: Date, },
            todayWithdrawAmount: { type: SchemaTypes.Decimal128, },
            todayWithdrawCount: { type: Number, },
            masterMoney: { type: SchemaTypes.Decimal128 },
            personWaterLine: { type: SchemaTypes.Decimal128 },
            buyuCount: { type: Number, },
            vipTotalAmount: { type: SchemaTypes.Decimal128 },
            vipTotalCount: { type: Number, },
            vipTodayAmount: { type: SchemaTypes.Decimal128 },
            vipTodayCount: { type: Number, },
        }, { versionKey: false })
        let name = "users";
        this._model = conn.model(name, schema, name);
    }

    public getChannelByPidAdnUuid = (cond: { pid: string, commonUsedUuid: string, channel?: string }) => {
        cond = removeUndefinedOrNull(cond);
        return new Promise<CodeMsg<GameUserDoc>>(resolve => {
            this._model.findOne(cond, { channel: 1, uuid: 1, commonUsedUuid: 1, pid: 1 }, (err, res) => {
                if (err) {
                    logger.error("game users getChannelByPidAdnUuid", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: res ? res.toObject() : undefined });
            })
        })
    }
}

export const gameUserDAO = new UserDAO();
