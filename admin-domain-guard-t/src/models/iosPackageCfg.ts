import { Connection, Model, Schema } from "mongoose";
import { CodeMsg, ErrCode } from "../errorCode";
import { logger } from "../logger";


export interface IosPackageCfgDoc {
    _id?: string,
    name: string,
    bundleId: string,
    url: string,
    tipsImgUrl: string,
    isOnline: boolean,
}

class IosPackageCfgDAO {
    private _model: Model<any>;
    public init = (conn: Connection) => {
        let schema = new Schema({
            name: String,
            bundleId: String,
            url: { type: String, unique: true, required: true },//商店包下载链接
            tipsImgUrl: String,//tips图片链接
            isOnline: Boolean,//是否在线
        }, { versionKey: false })
        let name = "iosPackageCfg"
        this._model = conn.model(name, schema, name);
    }
    

    public getIosPackageCfgByUrl = (url: string): Promise<CodeMsg<IosPackageCfgDoc>> => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.findOne(
                { url: url },
                (err, raw) => {
                    if (err) {
                        logger.error("channelPageCompat getIosPackageCfgByUrl url", url, err);
                        resolve({ code: ErrCode.Unknown, err });
                        return;
                    }
                    resolve({ code: ErrCode.OK, msg: raw })
                }
            );
        })
    }

}

export const awIosPackageCfgDAO = new IosPackageCfgDAO();