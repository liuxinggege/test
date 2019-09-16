import { Request } from 'express';
import { IGuardStats } from './models/cpGuardStats';
import { statsWriter } from './statsWriter';
class Stats {
  constructor() {

  }
  public async saveStatsData(req: Request) {
    const data: IGuardStats = {
      channel: req.query.c,
      pid: req.query.p,
      host: req.query.h,
      os: req.query.o,
      uuid: req.query.u,
      download: req.query.d || 0
    }
    statsWriter.write(data);
  }
}
export default new Stats