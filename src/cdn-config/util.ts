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

export const SEASCAPE_CDN = 'https://cdn.seascape.network/';

export let cdnConfigUrl = (path: ConfigPath): string => {
    return `${SEASCAPE_CDN}${path.project}/${path.env}/config.json`;
}

export let validateConfNetwork = (networkId: string): boolean => {
    if ((global as any).config === undefined || (global as any).config === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_config',
            message: `Please define global file`
        });
        return false;
    }

    if ((global as any).config[networkId] === undefined || (global as any).config[networkId] === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_network_id',
            message: `Invalid network id '${networkId}'`
        });
        return false;
    }

    return true;
}
