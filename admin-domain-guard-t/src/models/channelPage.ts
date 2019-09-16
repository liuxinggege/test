import { Connection, Model, Schema } from "mongoose";
import { CodeMsg, ErrCode } from "../errorCode";
import { logger } from "../logger";

export interface ChannelPageDlInfo {
    iosUrl: string,
    adrUrl: string,
    dlTmpl: string,
    secret: string
}

export interface ChannelPageDoc {
    pid: string,
    channel: string,
    type?: number, //全民还是普通
    qrUrls?: { url: string, longUrl: string }[],
    dlUrls?: string[],
    dlInfos: ChannelPageDlInfo[]
}

class ChannelPageDAO {
    private _model: Model<any>;
    public init = (conn: Connection) => {
        //这里不建索引，所有的在web-server创建
        let schema = new Schema({
            pid: String,
            channel: String,
            type: Number,
            qrUrls: [{ url: String, longUrl: String }],
            dlUrls: [String],
            dlInfos: [{
                iosUrl: String,
                adrUrl: String,
                dlTmpl: String,
                secret: String,
            }]
        }, { versionKey: false })
        schema.index({ pid: 1, channel: 1 }, { unique: true });
        schema.index({ channel: 1, }, { unique: true, partialFilterExpression: { channel: { $gt: "" } } });
        schema.index({ "dlInfos.secret": 1 }, { unique: true });
        schema.index({ "qrUrls.url": 1 }, { index: true });
        let name = "channelPage";
        this._model = conn.model(name, schema, name);
    }

    public getList = (page: number, count: number) => {
        return new Promise<CodeMsg<ChannelPageDoc[]>>(resolve => {
            this._model.find({}).skip((page - 1) * count).limit(count).exec((err, res) => {
                if (err) {
                    logger.error("channelPage getList err", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                res = res ? res.map(e => e.toObject()) : [];
                resolve({ code: ErrCode.OK, msg: res });
            })
        })
    }

    public getByPidChannel = (pid: string, channel: string) => {
        return new Promise<CodeMsg<ChannelPageDoc>>(resolve => {
            this._model.findOne({ pid, channel }, (err, res) => {
                if (err) {
                    logger.error("channelPage getByPidChannel", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: res ? res.toObject() : undefined });
            })
        })
    }

    public getDlUrlsBySecret = async (secret: string): Promise<CodeMsg<string[]>> => {
        let docRet = await this.getDocBySecret(secret);
        if (docRet.code !== ErrCode.OK) {
            return { code: docRet.code, err: docRet.err };
        }
        let doc = docRet.msg;
        if (!doc) {
            return { code: docRet.code };
        }
        return { code: ErrCode.OK, msg: doc.dlUrls };
    }

    public getDlInfoBySecret = async (secret: string): Promise<CodeMsg<{ pid: string, channel: string, iosUrl: string, adrUrl: string, dlTmpl: string }>> => {
        let docRet = await this.getDocBySecret(secret);
        if (docRet.code !== ErrCode.OK) {
            return { code: docRet.code, err: docRet.err };
        }
        let doc = docRet.msg;
        if (!doc) {
            return { code: docRet.code };
        }
        let info = doc.dlInfos.find(e => e.secret === secret);
        return {
            code: ErrCode.OK,
            msg: {
                pid: doc.pid,
                channel: doc.channel,
                iosUrl: info.iosUrl,
                adrUrl: info.adrUrl,
                dlTmpl: info.dlTmpl,
            }
        }
    }

    private getDocBySecret = (secret: string): Promise<CodeMsg<ChannelPageDoc>> => {
        return new Promise(resolve => {
            this._model.findOne({ "dlInfos.secret": secret }, { _id: 0 }, (err, doc) => {
                if (err) {
                    logger.error("channelPage getDocBySecret", secret, err);
                    resolve({ code: ErrCode.Unknown, err })
                    return;
                }
                resolve({ code: ErrCode.OK, msg: doc ? doc.toObject() : undefined });
            })
        })
    }

    public insert = (docs: ChannelPageDoc[]) => {
        return this._model.insertMany(docs);
    }

    public refreshSecretBySecret = (fromSecret: string, toSecret: string) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.updateOne(
                { "dlInfos.secret": fromSecret },
                { $set: { "dlInfos.$.secret": toSecret } },
                (err, raw) => {
                    if (err) {
                        logger.error("channelPage refreshSecretBySecret from", fromSecret, err);
                        resolve({ code: ErrCode.Unknown, err });
                        return;
                    }
                    resolve({ code: ErrCode.OK, msg: raw })
                }
            );
        })
    }
}


export const awChannelPageDAO = new ChannelPageDAO();