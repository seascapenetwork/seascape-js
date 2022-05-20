/**
 * This module reads the contracts from the global CDN.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { loadRemote } from '../utils/json';
import { validateConfNetwork } from './util';

export const contractAddress = (networkId: string, type: string, name: string) => {
    if (!validateConfNetwork(networkId)) {
        return false;
    }

    if ((global as any).config[networkId][type] === undefined || (global as any).config[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.contractAddress',
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
        error_path: 'src/utils/config.contractAddress',
        line: 'no_found',
        message: `Could not find networkId: '${networkId}', type: '${type}', name: '${name}'`
    });
    return false;
}

export const contractIndex = (networkId: string, type: string, name: string) => {
    if (!validateConfNetwork(networkId)) {
        return false;
    }

    if ((global as any).config[networkId][type] === undefined || (global as any).config[networkId][type] === null) {
        return false;
    }

    for (var i = 0; i < (global as any).config[networkId][type].length; i++ ) {
        let contract = (global as any).config[networkId][type][i];
        if (contract.name.toString() === name) {
            return i;
        }
    }

    console.log({
        error_path: 'src/utils/config.contractIndex',
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
            error_path: 'src/utils/config.availableContracts',
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
