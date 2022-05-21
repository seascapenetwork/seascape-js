/**
 * This module reads the contracts from the global CDN.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { loadRemote } from '../utils/json';
import { validateConfNetwork, cdnConfigUrl, ConfigPath, cdnAbiConfigUrl, cdnAbiUrl, defaultAbiConfig, AbiConfig } from './util';

export const contractAddress = (networkId: string, type: string, name: string) => {
    if (!validateConfNetwork(networkId)) {
        return false;
    }

    if ((global as any).seascapeCdnConfig[networkId][type] === undefined || (global as any).seascapeCdnConfig[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.contractAddress',
            line: 'no_type',
            message: `Invalid address type '${type}'`
        });
        return false;
    }

    for (var i = 0; i < (global as any).seascapeCdnConfig[networkId][type].length; i++ ) {
        let contract = (global as any).seascapeCdnConfig[networkId][type][i];
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

    if ((global as any).seascapeCdnConfig[networkId][type] === undefined || (global as any).seascapeCdnConfig[networkId][type] === null) {
        return false;
    }

    for (var i = 0; i < (global as any).seascapeCdnConfig[networkId][type].length; i++ ) {
        let contract = (global as any).seascapeCdnConfig[networkId][type][i];
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

    if ((global as any).seascapeCdnConfig[networkId][type] === undefined || (global as any).seascapeCdnConfig[networkId][type] === null) {
        console.log({
            error_path: 'src/utils/config.availableContracts',
            line: 'no_type',
            message: `Invalid address type '${type}'`
        });
        return false;
    }

    return (global as any).seascapeCdnConfig[networkId][type];
}

/**
 * Initialize the Config once only. The config loaded from CDN is set globally. 
 * @param configUrl string link starting with http:// or https://
 * @param empty by default FALSE, if it's empty, then when the remote is not exists, 
 * then it will be created in the repo as empty object
 * @returns TRUE or FALSE
 */
export const initConfig = async (configPath: ConfigPath, empty = false) => {
    let url = cdnConfigUrl(configPath);

    if ((global as any).seascapeCdnConfig !== undefined && (global as any).seascapeCdnConfig !== null) {
        return true;
    } else {
        let config = await loadRemote(url, empty);
        if (config === false) {
            if (empty) {
                (global as any).seascapeCdnConfig = {};
                return true;
            } else {
                return false;
            }
        } else {
            (global as any).seascapeCdnConfig = config;
            return true;
        }
    }
};

export const abiConfig = async (smartcontractName: string) => {
    let url = cdnAbiConfigUrl(smartcontractName);

    let config = await loadRemote(url, true);
    if (config === false) {
        return defaultAbiConfig();
    } else {
        return config;
    }
};

export const abi = async (contractName: string, config: AbiConfig) => {
    let url = cdnAbiUrl(contractName, config);

    return await loadRemote(url);
}

