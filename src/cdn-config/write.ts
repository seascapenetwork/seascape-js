/**
 * This module writes the contracts to the global CDN.
 * It uploads the abi name, and smartcontract name, and smartcontract address in each network.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { SmartcontractConfig, ConfigPath, SmartcontractPath, HardhatSmartcontractConfig, TruffleConfig } from './util';
import { connection, connectionByEnvironment } from './alicloud';
import { abiFile as hardhatAbiFile } from '../utils/hardhat';
import SeascapeCdnConfig from './seascape-cdn-config';
import SeascapeAbiConfig from './seascape-abi-config';
import SeascapeAbi from './seascape-abi';
import { CdnUtil } from '..';


let setSmartcontract = async(temp: Boolean, contractName: string, abi: any, configPath: ConfigPath, smartcontractPath: SmartcontractPath, smartcontract: SmartcontractConfig) => {
    let client = await connectionByEnvironment(temp);
    if (client === undefined) {
        return false;
    }

    let abiConfig = await SeascapeAbiConfig.New(temp, contractName);
    await abiConfig.incrementVersion(client);

    smartcontract.abi = CdnUtil.cdnReadAbiUrl(temp, abiConfig);
    await SeascapeAbi.SetAbi(client, abiConfig, abi);

    let seascapeCdnConfig = await SeascapeCdnConfig.New(configPath);
    return await seascapeCdnConfig.setSmartcontract(client, smartcontractPath, smartcontract);
}


/**
 * @param params Object containing the following parameters
 */
export const setHardhatSmartcontract = async (temp: Boolean, params: HardhatSmartcontractConfig) => {
    let configPath = {project: params.projectName, env: params.projectEnv, empty: true} as ConfigPath;
    let smartcontractPath = {networkId: params.networkId, type: params.contractType} as SmartcontractPath;
    let smartcontract = {
        name: params.contractName,
        address: params.deployedInstance.address,
        txid: params.deployedInstance.deployTransaction.hash,
        abi: "",
        owner: params.owner? params.owner : "",
        verifier: params.verifier? params.verifier : "",
        fund: params.fund? params.fund : ""
    } as SmartcontractConfig;

    let abi = await hardhatAbiFile(params.contractName);
    if (!abi) {
        console.log(`Failed to load the abi of ${params.contractName} in hardhat framework`);
        return false;
    }

    return setSmartcontract(temp, params.contractName, abi, configPath, smartcontractPath, smartcontract);
}

/**
 * Order in which data is updated:
 * - Set the Abi Configuration, Abi URL depends on the Abi Configuration
 * - Set the Abi, CDN Config requires the URL of the Abi
 * - Set the CDN Config
 * @param params 
 * @param temp 
 * @returns 
 */
export const setTruffleSmartcontract = async (temp: Boolean, params: TruffleConfig) => {
    let configPath = {project: params.projectName, env: params.projectEnv, empty: true} as ConfigPath;
    let smartcontractPath = {networkId: params.networkId, type: params.contractType} as SmartcontractPath;
    let smartcontract = {
        name: params.contractName,
        address: params.contractAddress,
        txid: params.txid,
        abi: "",
        owner: params.owner? params.owner : "",
        verifier: params.verifier? params.verifier : "",
        fund: params.fund? params.fund : ""
    } as SmartcontractConfig;

    return setSmartcontract(temp, params.contractName, params.contractAbi, configPath, smartcontractPath, smartcontract);
}

export const connectCdn = connection;
export const connectCdnByEnv = connectionByEnvironment;