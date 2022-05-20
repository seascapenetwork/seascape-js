const OSS = require('ali-oss');
import { ConfigPath } from './util';

export const connection = async (region: any, accessId: any, secret: any, bucket: any) => {
    try {
        return new OSS({
            region: region,
            accessKeyId: accessId,
            accessKeySecret: secret,
            bucket: bucket,
        });
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function uploadConfig(path: ConfigPath, oss: any, config: any) {
    let str = JSON.stringify(config, null, 4);
    let buff = Buffer.alloc(str.length, str);
    try {
        const result = await oss.put(`/${path.project}/${path.env}/config.json`, buff);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}