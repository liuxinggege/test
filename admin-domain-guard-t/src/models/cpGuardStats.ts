import { Connection, Model, Schema } from "mongoose";
export interface IGuardStats {
  channel: string,
  pid: string,
  host: string,
  os: string,
  uuid: string,
  download?: number
}

class CPGuardStatsDAO {
  private _model: Model<any>;
  public init = (conn: Connection) => {
    let schema = new Schema({
      channel: { type: String, index: true },
      pid: { type: String, index: true },
      host: { type: String, index: true },
      os: { type: String },
      uuid: { type: String },
      download: { type: Number }
    }, { versionKey: false, timestamps: { createdAt: 'sumDate' } })
    let name = "cpGuardStats";
    this._model = conn.model(name, schema, name);
  }
  /**
   * 创建记录
   */
  public create(docs: IGuardStats) {
    return this._model.create(docs);
  }

  public createMany(docs: Array<IGuardStats>) {
    return this._model.create(docs);
  }
}


export const awGuardStatsDAO = new CPGuardStatsDAO();