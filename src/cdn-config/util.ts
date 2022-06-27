const SEASCAPE_CDN = 'https://cdn.seascape.network/';

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
    env: string
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

export interface AbiConfig {
    version: number
}

export const cdnUrl = function (): string {
    if ((global as any).host !== undefined) {
        return (global as any).host
    }
    return SEASCAPE_CDN;
}

export let cdnConfigUrl = (path: ConfigPath): string => {
    return `${cdnUrl()}${path.project}/${path.env}/config.json`;
}

export const cdnAbiConfigUrl = (contractName: string, fullAddress = true) : string => {
    if (fullAddress) {
        return `${cdnUrl()}abi/${contractName}/info.json`;
    } else {
        return `/abi/${contractName}/info.json`;
    }
}

export const cdnAbiUrl = (contractName: string, config: AbiConfig, fullAddress = true): string => {
    if (fullAddress) {
        return `${cdnUrl()}abi/${contractName}/${config.version.toString()}.json`;
    } else {
        return `/abi/${contractName}/${config.version.toString()}.json`;
    }
}

export let defaultAbiConfig = () : AbiConfig => {
    return {
        version: 0
    } as AbiConfig;
}

export let validateConfNetwork = (networkId: string): boolean => {
    if ((global as any).seascapeCdnConfig === undefined || (global as any).seascapeCdnConfig === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_config',
            message: `Please define global file`
        });
        return false;
    }

    if ((global as any).seascapeCdnConfig[networkId] === undefined || (global as any).seascapeCdnConfig[networkId] === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_network_id',
            message: `Invalid network id '${networkId}'`
        });
        return false;
    }

    return true;
}
