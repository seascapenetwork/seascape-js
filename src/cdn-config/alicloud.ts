const OSS = require('ali-oss');
import { ConfigPath, cdnBucket, cdnUrl, cdnWriteAbiUrl, cdnWriteAbiConfigUrl } from './util';
import SeascapeAbiConfig from './seascape-abi-config';
import SeascapeCdnConfig from './seascape-cdn-config';

export const connection = async (temp: Boolean, accessId: any, secret: any) => {
    let client = new OSS({
        accessKeyId: accessId,
        accessKeySecret: secret,
        cname: true,
        endpoint: cdnUrl(temp)
    });
    client.useBucket(cdnBucket(temp));

    return client;
}

export const connectionByEnvironment = async (temp: Boolean) => {
    if (!process.env.ALIBABA_ACCESSID) {
        console.error(`Missing ALIBABA_ACCESSID env. variable`);
        return undefined;
    }
    if (!process.env.ALIBABA_SECRET) {
        console.error(`Missing ALIBABA_SECRET env. variable`);
        return undefined;
    }

    return connection(
        temp, 
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET
    );
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

export async function uploadAbiConfig(oss: any, smartcontractName: string, config: AbiConfig) {
    let str = JSON.stringify(config, null, 4);
    let buff = Buffer.alloc(str.length, str);

    let url = cdnAbiConfigUrl(smartcontractName, false);

    try {
        const result = await oss.put(url, buff);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function uploadAbi(oss: any, smartcontractName: string, config: AbiConfig, abi: Object) {
    let str = JSON.stringify(abi, null, 4);
    let buff = Buffer.alloc(str.length, str);

    let url = cdnAbiUrl(smartcontractName, config, false);

    try {
        const result = await oss.put(url, buff);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}
