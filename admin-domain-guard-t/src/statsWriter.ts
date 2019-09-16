import { logger } from "./logger";
import { awGuardStatsDAO, IGuardStats } from "./models/cpGuardStats";

class StatsWriter {
    private queue: Array<IGuardStats>;
    private timer: NodeJS.Timer;

    constructor() {
        this.queue = [];

        // 每10秒写一次数据库
        this.timer = setInterval(async () => {
            await this.flush();
        }, 10 * 1000);
    }

    write(data: IGuardStats) {
        this.queue.push(data);
    }

    exit() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private async flush() {
        if (this.queue.length === 0) {
            return;
        }

        const toWrite = this.queue;
        this.queue = new Array();

        const size = 5000; // 一次写5000条
        for (let i = 0; i < toWrite.length; i += size) {
            const end = Math.min(toWrite.length, i + size);
            const slice = toWrite.slice(i, end);
            try {
                await awGuardStatsDAO.createMany(slice);
                logger.info("stats write logs ", slice.length);
            } catch (err) {
                logger.error("flush to db err:", JSON.stringify(err));
            }
        }
    }
}

export const statsWriter = new StatsWriter();
