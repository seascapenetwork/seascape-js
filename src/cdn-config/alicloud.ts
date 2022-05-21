const OSS = require('ali-oss');
import { ConfigPath, cdnAbiConfigUrl, cdnAbiUrl, AbiConfig } from './util';

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

export const connectionByEnvironment = async () => {
    if (!process.env.ALIBABA_REGION) {
        console.error(`Missing ALIBABA_REGION env. variable`);
        return undefined;
    }
    if (!process.env.ALIBABA_ACCESSID) {
        console.error(`Missing ALIBABA_ACCESSID env. variable`);
        return undefined;
    }
    if (!process.env.ALIBABA_SECRET) {
        console.error(`Missing ALIBABA_SECRET env. variable`);
        return undefined;
    }
    if (!process.env.ALIBABA_BUCKET) {
        console.error(`Missing ALIBABA_BUCKET env. variable`);
        return undefined;
    }

    return connection(
        process.env.ALIBABA_REGION, 
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET,
        process.env.ALIBABA_BUCKET
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
