import { Connection, Model, Schema } from "mongoose";
import { CodeMsg, ErrCode } from "../errorCode";
import { logger } from "../logger";
//有其他的字段，这里只写了落地页，相关的字段
export interface ChannelPageHostDoc {
    host: string,
    secret: string
}

class ChannelPageHostDAO {
    private _model: Model<any>;
    public init = (conn: Connection) => {
        let schema = new Schema({
            host: { type: String, unique: true },
            secret: { type: String, index: true }
        }, { versionKey: false })
        let name = "channelPageHost";
        this._model = conn.model(name, schema, name);
    }

    public getByHost = (host: string) => {
        return new Promise<CodeMsg<ChannelPageHostDoc>>(resolve => {
            this._model.findOne({ host }, { _id: 0 }, (err, res) => {
                if (err) {
                    logger.error("channelPageHost getByHost", host, err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: res ? res.toObject() : undefined });
            })
        })
    }
    public refreshSecretBySecret = (fromSecret: string, toSecret: string) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.updateMany(
                { secret: fromSecret },
                { $set: { secret: toSecret } },
                (err, raw) => {
                    if (err) {
                        logger.error("channelPageHost refreshSecretBySecret from", fromSecret, "to", toSecret, err);
                        resolve({ code: ErrCode.Unknown, err });
                        return;
                    }
                    resolve({ code: ErrCode.OK, msg: raw })
                }
            );
        })
    }
}


export const awChannelPageHostDAO = new ChannelPageHostDAO();