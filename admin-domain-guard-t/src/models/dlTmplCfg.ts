import { Connection, Model, Schema } from "mongoose";
import { CodeMsg, ErrCode } from "../errorCode";
import { logger } from "../logger";

export interface DlTmplCfgDoc {
    pid: string,
    tmpl: { value: string, label: string }[]
}

class DlTmplCfgDao {
    private _model: Model<any>;
    public init = (conn: Connection) => {
        let schema = new Schema({
            pid: String,
            tmpl: [{ value: String, label: String }],
        }, { versionKey: false })
        let name = "dlTmplCfg";
        this._model = conn.model(name, schema, name);
    }

    public getAllTmplCfg = () => {
        return new Promise<CodeMsg<DlTmplCfgDoc[]>>(resolve => {
            this._model.find({}, (err, docs) => {
                if (err) {
                    logger.error("dlTmplCfgs getAllTmplCfg :", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                docs = docs || [];
                let _docs: DlTmplCfgDoc[] = docs.map(f => f.toObject());
                resolve({ code: ErrCode.OK, msg: _docs });
            })
        })
    }

    public getOneByPid = (pid: string) => {
        return new Promise<CodeMsg<DlTmplCfgDoc>>(resolve => {
            this._model.findOne({ pid: pid }, (err, doc) => {
                if (err) {
                    logger.error("dlTmplCfgs getOneByPid :", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: doc ? doc.toObject() : undefined });
            })
        })
    }

    public deleteOneByPid = (pid: string) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.deleteOne({ pid }, err => {
                if (err) {
                    logger.error("dlTmplCfgs deleteOneByPid :", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK });
            })
        })
    }

    public pullTmplByPid = (pid: string, tmpls: string[]) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.updateOne({ pid },
                { $pull: { tmpl: { value: { $in: tmpls } } } },
                (err, raw) => {
                    if (err) {
                        logger.error("dlTmplCfgs pullTmplByPid :", err);
                        resolve({ code: ErrCode.Unknown, err });
                        return;
                    }
                    resolve({ code: ErrCode.OK, msg: raw });
                })
        })
    }

    public createOne = (doc: DlTmplCfgDoc) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.create(doc, (err: any, raw: any) => {
                if (err) {
                    logger.error("dlTmplCfgs pushTmplByPid :", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: raw });
            })
        })

    }

    public pushTmplByPid = (pid: string, tmpls: { value: string, label: string }[]) => {
        return new Promise<CodeMsg<any>>(resolve => {
            this._model.updateOne({ pid }, { $push: { tmpl: { $each: tmpls } } }, (err, raw) => {
                if (err) {
                    logger.error("dlTmplCfgs pushTmplByPid :", err);
                    resolve({ code: ErrCode.Unknown, err });
                    return;
                }
                resolve({ code: ErrCode.OK, msg: raw });
            })
        })
    }
}

export const awDlTmplCfgDao = new DlTmplCfgDao();

