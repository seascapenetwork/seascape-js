/**
 * This module reads the contracts from the global CDN.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { loadRemote } from '../utils/json';

let validateConfNetwork = (networkId: string): boolean => {
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

export const contractAddress = (networkId: string, type: string, name: string) => {
    if (!validateConfNetwork(networkId)) {
        return false;
    }

    if ((global as any).config[networkId][type] === undefined || (global as any).config[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.getAddress',
            line: 'no_type',
            message: `Invalid address type '${type}'`
        });
        return false;
    }

    for (var i = 0; i < (global as any).config[networkId][type].length; i++ ) {
        let contract = (global as any).config[networkId][type][i];
        if (contract.name.toString() === name) {
            return contract.address.toString();
        }
    }

    console.log({
        error_path: 'src/utils/config.getAddress',
        line: 'no_found',
        message: `Could not find networkId: '${networkId}', type: '${type}', name: '${name}'`
    });
    return false;
}


export const availableContracts = (networkId: string, type: string) => {
    if (!validateConfNetwork(networkId)) {
        return false;
    }

    if ((global as any).config[networkId][type] === undefined || (global as any).config[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.getAddress',
            line: 'no_type',
            message: `Invalid address type '${type}'`
        });
        return false;
    }

    return (global as any).config[networkId][type];
}

/**
 * Initialize the Config once only. The config loaded from CDN is set globally. 
 * @param configUrl string link starting with http:// or https://
 * @returns TRUE or FALSE
 */
export const initConfig = async (configUrl :string) => {
    if ((global as any).config !== undefined && (global as any).config !== null) {
        return true;
    } else {
        let config = await loadRemote(configUrl);
        if (config === false) {
            return false;
        } else {
            (global as any).config = config;
            return true;
        }
    }
};
