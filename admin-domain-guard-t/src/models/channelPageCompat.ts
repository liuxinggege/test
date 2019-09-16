import { Connection, Model, Schema } from "mongoose";
import { CodeMsg, ErrCode } from "../errorCode";
import { logger } from "../logger";

export interface ChannelPageCompatDoc {
    htmlPath: string,
    secret: string
}

class ChannelPageCompatDAO {
    private _model: Model<any>;
    public init = (conn: Connection) => {
        let schema = new Schema({
            htmlPath: { type: String, unique: true },
            secret: { type: String, index: true },
        }, { versionKey: false })
        let name = "channelPageCompat"
        this._model = conn.model(name, schema, name);
    }

    public getByHtmlPath = (htmlPath: string) => {
        return new Promise<CodeMsg<ChannelPageCompatDoc>>(resolve => {
            this._model.findOne({ htmlPath }, { _id: 0 }, (err, res) => {
                if (err) {
                    logger.error("channePageCompat getByHtmpPath", htmlPath, err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: res ? res.toObject() : undefined });
            })
        })
    }

    public insert = (docs: ChannelPageCompatDoc[]) => {
        return this._model.insertMany(docs);
    }

    public refreshSecretBySecret = (fromSecret: string, toSecret: string) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.updateMany(
                { secret: fromSecret },
                { $set: { secret: toSecret } },
                (err, raw) => {
                    if (err) {
                        logger.error("channelPageCompat refreshSecretBySecret from", fromSecret, "to", toSecret, err);
                        resolve({ code: ErrCode.Unknown, err });
                        return;
                    }
                    resolve({ code: ErrCode.OK, msg: raw })
                }
            );
        })
    }
}

export const awChannelPageCompatDAO = new ChannelPageCompatDAO();