import SeascapeAbiConfig from './seascape-abi-config';

const SEASCAPE_CDN = 'https://cdn.seascape.network';
const SEASCAPE_TEMP_CDN = 'https://cdn-temp.seascape.network';

const SEASCAPE_CDN_BUCKET = 'seascape-cdn';
const SEASCAPE_TEMP_CDN_BUCKET = 'seascape-cdn-temp';

export interface FullAddressParam {
    name: string,
    fullAddress: boolean,
    temp?: boolean
}

export interface SmartcontractConfig {
    name: string,
    abi: string,
    address: string,
    txid?: string,
    owner?: string,
    verifier?: string,
    fund?: string
}

export interface ConfigPath {
    project: string,
    env: string,
    empty: boolean,
    temp?: boolean
}

export interface SmartcontractPath {
    networkId: number,
    type: string
}

export interface HardhatSmartcontractConfig {
    networkId?: number,
    projectName: string,
    projectEnv: string,
    contractType: string, 
    contractName: string, 
    deployedInstance: any,
    owner?: string,
    verifier?: string,
    fund?: string
}

export interface TruffleConfig {
    networkId: number,
    projectName: string,
    projectEnv: string,
    contractType: string, 
    contractName: string,
    contractAddress: string,
    txid: string,
    contractAbi: any,
    owner?: string,
    verifier?: string,
    fund?: string
}

export const cdnUrl = function (temp: any): string {
    if (!temp) {
        return SEASCAPE_CDN;
    }
    return SEASCAPE_TEMP_CDN;
}

export const cdnBucket = function (temp: any): string {
    if (!temp) {
        return SEASCAPE_CDN_BUCKET;
    }
    return SEASCAPE_TEMP_CDN_BUCKET;
}

export let cdnConfigUrl = (path: ConfigPath): string => {
    return `${cdnUrl(path.temp)}/${path.project}/${path.env}/config.json`;
}

export const cdnReadAbiConfigUrl = (name: string, temp: Boolean) : string => {
    return `${cdnUrl(temp)}/abi/${name}/info.json`;
}

export const cdnWriteAbiConfigUrl = (name: string) : string => {
    return `/abi/${name}/info.json`;
}

export const cdnReadAbiUrl = (temp: Boolean, config: SeascapeAbiConfig): string => {
    return `${cdnUrl(temp)}/abi/${config.name()}/${config.version().toString()}.json`;
}

export const cdnWriteAbiUrl = (config: SeascapeAbiConfig): string => {
    return `/abi/${config.name()}/${config.version().toString()}.json`;
}

