import * as CdnUtil from './util';
import { loadRemote } from '../utils/json';
import { uploadConfig } from './alicloud';

export default class SeascapeCdnConfig {
    private seascapeCdnConfig: any;
    private project: any;

    constructor(seascapeCdnConfig: any, project: CdnUtil.ConfigPath) {
        this.seascapeCdnConfig = seascapeCdnConfig;
        this.project = project;
    }

    public static New = async (configPath: CdnUtil.ConfigPath): Promise<SeascapeCdnConfig> => {
        let url = CdnUtil.cdnConfigUrl(configPath);

        let config = await loadRemote(url, configPath.empty);
        if (config === false) {
            if (configPath.empty) {
               return new SeascapeCdnConfig({}, configPath);
            } else {
                throw `Failed to load the Seascape CDN Config from the remote path`;
            }
        } else {
            return new SeascapeCdnConfig(config, configPath);
        }
    }

    static ValidateConfNetwork (seascapeCdnConfig: any, networkId: string): boolean {
        if (seascapeCdnConfig === undefined || seascapeCdnConfig === null) {
            console.log({
                error_path: 'src/utils/config.validateConfNetwork',
                line: 'noseascapeCdnConfig',
                message: `Please define global file`
            });
            return false;
        }
    
        if (seascapeCdnConfig[networkId] === undefined || seascapeCdnConfig[networkId] === null) {
            console.log({
                error_path: 'src/utils/config.validateConfNetwork',
                line: 'no_network_id',
                message: `Invalid network id '${networkId}'`
            });
            return false;
        }
    
        return true;
    }

    /**
     * Return the Address of the Contract
     * @requires Global CDN config to be initialized
     * @param networkId where the contract is deployed
     * @param type of the contract
     * @param name of the contract
     * @returns false in case of an error. Otherwise it returns string
     */
    contractAddress (networkId: string, type: string, name: string) {
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, networkId)) {
            return false;
        }

        if (this.seascapeCdnConfig[networkId][type] === undefined || this.seascapeCdnConfig[networkId][type] === null) {
            console.log({
                error_path: 'SeascapeCdnConfig.contractAddress',
                line: 'no_type',
                message: `Invalid address type '${type}'`
            });
            return false;
        }

        for (var i = 0; i < this.seascapeCdnConfig[networkId][type].length; i++ ) {
            let contract = this.seascapeCdnConfig[networkId][type][i];
            if (contract.name.toString() === name) {
                return contract.address.toString();
            }
        }

        console.log({
            error_path: 'SeascapeCdnConfig.contractAddress',
            line: 'no_found',
            message: `Could not find networkId: '${networkId}', type: '${type}', name: '${name}'`
        });
        return false;
    }

    /**
     * Returns the index of a contract information in the CDN Config
     * @requires Global CDN configuration to be initialized
     * @param networkId where the contract is deployed
     * @param type of the contract
     * @param name of the contract
     * @returns false in case of an error. Otherwise it returns a number
     */
    contractIndex (networkId: string, type: string, name: string) {
        if (this.seascapeCdnConfig[networkId][type] === undefined || this.seascapeCdnConfig[networkId][type] === null) {
            return false;
        }

        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, networkId)) {
            return false;
        }

        for (var i = 0; i < this.seascapeCdnConfig[networkId][type].length; i++ ) {
            let contract = this.seascapeCdnConfig[networkId][type][i];
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


    /**
     * Returns list of the contracts of the certain type in the certain network
     * @requires Global CDN config to be initialized
     * @param networkId where contracts are deployed
     * @param type of the contracts
     * @returns false in case of an error, otherwise it returns the list of ContractConfigs
     */
    availableContracts (networkId: string, type: string) {
        if (!SeascapeCdnConfig.ValidateConfNetwork(this.seascapeCdnConfig, networkId)) {
            return false;
        }

        if (this.seascapeCdnConfig[networkId][type] === undefined || this.seascapeCdnConfig[networkId][type] === null) {
            console.log({
                error_path: 'src/utils/config.availableContracts',
                line: 'no_type',
                message: `Invalid address type '${type}'`
            });
            return false;
        }

        return this.seascapeCdnConfig[networkId][type];
    }

    setSmartcontract = async (cdnClient: any, smartcontractPath: CdnUtil.SmartcontractPath, obj: CdnUtil.SmartcontractConfig) => {
        let idString = smartcontractPath.networkId.toString();
        let type = smartcontractPath.type;
    
        if (!this.seascapeCdnConfig[idString]) {
            this.seascapeCdnConfig[idString] = {};
        }
    
        if (!this.seascapeCdnConfig[idString][type]) {
            this.seascapeCdnConfig[idString][type] = [];
        }
    
        let i = this.contractIndex(idString, type, obj.name);
        if (i === false) {
            this.seascapeCdnConfig[idString][type].push(obj);
        } else {
            this.seascapeCdnConfig[idString][type][i] = obj;
        }
    
        let uploaded = await uploadConfig(cdnClient, this);
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

    public projectPath = () => {
        return this.project;
    }

    public toJSON = () => {
        return this.seascapeCdnConfig;
    }

    public toString = () : string => {
        return JSON.stringify(this.seascapeCdnConfig, null, 4);
    }
}