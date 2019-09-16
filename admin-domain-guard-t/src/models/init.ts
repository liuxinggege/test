import { Connection, createConnection } from "mongoose";
import { logger } from "../logger";
import { awChannelPageDAO } from "./channelPage";
import { awChannelPageCompatDAO } from "./channelPageCompat";
import { awChannelPageHostDAO } from "./channelPageHost";
import { awGuardStatsDAO } from "./cpGuardStats";
import { awDlTmplCfgDao } from "./dlTmplCfg";
import { awIosPackageCfgDAO } from "./iosPackageCfg";
export async function initAdminWebModels(url: string) {
    let conn: Connection;
    try {
        conn = await createConnection(url, {
            useNewUrlParser: true,
            poolSize: 2,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            keepAlive: true,
            connectTimeoutMS: 5000,
        })
    } catch (reason) {
        logger.error("initAdminWebModels err reason:", reason);
    }
    if (!conn) {
        return;
    }
    awChannelPageDAO.init(conn);
    awChannelPageHostDAO.init(conn);
    awChannelPageCompatDAO.init(conn);
    awDlTmplCfgDao.init(conn);
    awIosPackageCfgDAO.init(conn);
    awGuardStatsDAO.init(conn);
    return conn;
}