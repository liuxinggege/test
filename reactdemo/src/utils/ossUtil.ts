const OSS = require('ali-oss');
const uuidv4 = require('uuid/v4');
import request from './request';

const applyTokenDo = async () => {
    const tokenData = await request('/api/user/applyUploadImg', {
        method: 'POST',
        body: {
            isInvalid: true
        }
    });
    const { bucket, ossUrl, region } = tokenData.msg;
    const {
        AccessKeyId,
        AccessKeySecret,
        SecurityToken
    } = tokenData.msg.uploadToken.credentials;
    let client = new OSS({
        region,
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        endpoint: ossUrl,
        cname: true,
        secure: true,
        bucket
    });
    return client;
};
const uploadImg = async (type: any, file: string) => {
    return new Promise(async (resolve, reject) => {
        let uuid = uuidv4();
        const fileType: any = type.substr(6, 4);
        const imgFormat = `${uuid}.${fileType}`;
        const client = await applyTokenDo();
        client
            .put(imgFormat, file)
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

export default uploadImg;
