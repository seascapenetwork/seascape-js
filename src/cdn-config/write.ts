/**
 * This module writes the contracts to the global CDN.
 * It uploads the abi name, and smartcontract name, and smartcontract address in each network.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { SmartcontractConfig, ConfigPath, SmartcontractPath, HardhatSmartcontractConfig, AbiConfig, cdnAbiUrl, TruffleConfig } from './util';
import { contractIndex, abiConfig as getAbiConfig, initConfig, abi } from './read';
import { uploadConfig, uploadAbiConfig, connection, connectionByEnvironment, uploadAbi } from './alicloud';
import { abiFile as hardhatAbiFile } from './../utils/hardhat';

export const setSmartcontract = async (path: ConfigPath, cdnClient: any, smartcontractPath: SmartcontractPath, obj: SmartcontractConfig) => {
    if ((global as any).seascapeCdnConfig === undefined || (global as any).seascapeCdnConfig === null) {
        console.log({
            error_path: 'src/cdn-config/write.setSmartcontract',
            line: 'no_config',
            message: `Please define global file`
        });
        return false;
    }

    let idString = smartcontractPath.networkId.toString();
    let type = smartcontractPath.type;

    if (!(global as any).seascapeCdnConfig[idString]) {
        (global as any).seascapeCdnConfig[idString] = {};
    }

    if (!(global as any).seascapeCdnConfig[idString][type]) {
        (global as any).seascapeCdnConfig[idString][type] = [];
    }

    let i = contractIndex(idString, type, obj.name);
    if (i === false) {
        (global as any).seascapeCdnConfig[idString][type].push(obj);
    } else {
        (global as any).seascapeCdnConfig[idString][type][i] = obj;
    }

    let uploaded = await uploadConfig(path, cdnClient, (global as any).seascapeCdnConfig);
    if (uploaded === null) {
        console.log({
            error_path: 'src/cdn-config/write.setSmartcontract',
            line: 'no_upload',
            message: `Please fix the Alicloud credentials`
        });
        return false;
    }
    return true;
};

export const setAbiConfig = async (cdnClient: any, smartcontractName: string, abiConfig: AbiConfig) => {
    let uploaded = await uploadAbiConfig(cdnClient, smartcontractName, abiConfig);
    if (uploaded === null) {
        console.log({
            error_path: 'src/cdn-config/write.setAbiConfig',
            line: 'no_upload',
            message: `Please fix the Alicloud credentials`
        });
        return false;
    }
    return true;
};

export const setAbi = async (cdnClient: any, smartcontractName: string, abiConfig: AbiConfig, abi: Object) => {
    let uploaded = await uploadAbi(cdnClient, smartcontractName, abiConfig, abi);
    if (uploaded === null) {
        console.log({
            error_path: 'src/cdn-config/write.setAbi',
            line: 'no_upload',
            message: `Please fix the Alicloud credentials`
        });
        return false;
    }
    return true;
};

export const incrementAbiConfiguration = async (client: any, smartcontractName: string) => {
    let abiConfig = await getAbiConfig(smartcontractName);
    console.log(`Before incremention`)
    console.log(abiConfig);
    abiConfig.version++;

    let abiUpdated = await setAbiConfig(client, smartcontractName, abiConfig);
    if (!abiUpdated) {
        console.error(`Abi config wasn't updated.`);
        return false;
    }

    console.log(`After incremention`)
    console.log(abiConfig);

    return abiConfig;
}


/**
 * 
 * @param params Object containing the following parameters
 */
export const setHardhatSmartcontract = async (params: HardhatSmartcontractConfig) => {
    let client = await connectionByEnvironment();
    if (client === undefined) {
        return false;
    }

    let abiConfig = await incrementAbiConfiguration(client, params.contractName);
    console.log('after the function')
    console.log(abiConfig)

    let abi = await hardhatAbiFile(params.contractName);
    if (!abi) {
        console.log(`Failed to load the abi of ${params.contractName} in hardhat framework. Please upload manually as ${abiConfig.version}`);
        return false;
    }
    let abiSetted = await setAbi(client, params.contractName, abiConfig, abi);
    if (!abiSetted) {
        return false;
    }

    let path = {project: params.projectName, env: params.projectEnv} as ConfigPath;

    let smartcontractPath = {networkId: params.networkId, type: params.contractType} as SmartcontractPath;

    console.log(`The cdn list path where smartcontract object will be`);
    console.log(smartcontractPath);

    let initialized = await initConfig(path);
    if (!initialized) {
        console.log(`Global initializiation failed`);
        process.exit(1);
    } 

    let smartcontract = {
        name: params.contractName,
        address: params.deployedInstance.address,
        txid: params.deployedInstance.deployTransaction.hash,
        abi: cdnAbiUrl(params.contractName, abiConfig, true),
    } as SmartcontractConfig;

    console.log(`The smartcontract object in the cdn config is`);
    console.log(smartcontract);

    let updated = await setSmartcontract(path, client, smartcontractPath, smartcontract);
    console.log(`Was CDN updated successfully? ${updated}`);

    return updated;
}

export const setTruffleSmartcontract = async (params: TruffleConfig) => {
    let client = await connectionByEnvironment();
    if (client === undefined) {
        return false;
    }

    let abiConfig = await incrementAbiConfiguration(client, params.contractName);

    let abiSetted = await setAbi(client, params.contractName, abiConfig, params.contractAbi);
    if (!abiSetted) {
        return false;
    }

    let path = {project: params.projectName, env: params.projectEnv} as ConfigPath;

    let smartcontractPath = {networkId: params.networkId, type: params.contractType} as SmartcontractPath;

    console.log(`The cdn list path where smartcontract object will be`);
    console.log(smartcontractPath);

    let initialized = await initConfig(path);
    if (!initialized) {
        console.log(`Global initializiation failed`);
        process.exit(1);
    } 

    let smartcontract = {
        name: params.contractName,
        address: params.contractAddress,
        txid: params.txid,
        abi: cdnAbiUrl(params.contractName, abiConfig, true),
    } as SmartcontractConfig;

    console.log(`The smartcontract object in the cdn config is`);
    console.log(smartcontract);

    let updated = await setSmartcontract(path, client, smartcontractPath, smartcontract);
    console.log(`Was CDN updated successfully? ${updated}`);

    return updated;
}

export const connectCdn = connection;
export const connectCdnByEnv = connectionByEnvironment;