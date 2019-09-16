import { configure, getLogger } from 'log4js';
import { globalCfg } from './globalCfg';


//typeof process.env.NODE_APP_INSTANCE === 'string'
//pm2 "exec_mode": "cluster_mode", instance_var不配置，就使用默认的NODE_APP_INSTANCE
let pid = process.pid;
let pm2InstanceId = process.env.NODE_APP_INSTANCE;
let isPM2 = !!pm2InstanceId;
configure({
    appenders: {
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                //https://github.com/log4js-node/log4js-node/blob/master/docs/layouts.md#pattern-format
                pattern: isPM2 ? '%[[%d] [%p] [%X{pid}] [%X{pm2id}] -%] %m' : '%[[%d] [%p] [%X{pid}] -%] %m'
            }
        }
    },
    categories: { default: { appenders: ['console'], level: globalCfg.logLevel } },
    pm2: isPM2
})

let _logger = getLogger();
_logger.addContext("pid", pid);
if (isPM2) {
    _logger.addContext("pm2id", pm2InstanceId)
}

export const logger = _logger;