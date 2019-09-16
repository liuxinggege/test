const config = require("./config");
const configMap = {
    dev: {
        NODE_ENV: '"development"',
        ENV_CONFIG: '"dev"',
        BASE_API_URL: config.targetUrl,
        BASE_URL: config.clientUrl,
    },
    sit: {
        NODE_ENV: '"production"',
        ENV_CONFIG: '"sit"',
        BASE_API_URL:  config.sitdUrl,
        BASE_URL:  config.sitdUrl,
    },
    prod: {
        NODE_ENV: '"production"',
        ENV_CONFIG: '"prod"',
        BASE_API_URL: config.prodUrl,
        BASE_URL: config.prodUrl,
    }
}
const processEnv = configMap[process.env.env_config]
     process.env.BASE_API_URL = processEnv.BASE_API_URL
     process.env.BASE_URL = processEnv.BASE_URL
module.exports = processEnv