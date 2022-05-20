/**
 * This module writes the contracts to the global CDN.
 * It uploads the abi name, and smartcontract name, and smartcontract address in each network.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */

import { SmartcontractConfig, ConfigPath, SmartcontractPath } from './util';
import { contractIndex } from './read';
import { uploadConfig, connection } from './alicloud';

export const setSmartcontract = async (path: ConfigPath, cdnClient: any, smartcontractPath: SmartcontractPath, obj: SmartcontractConfig) => {
    if ((global as any).config === undefined || (global as any).config === null) {
        console.log({
            error_path: 'src/cdn-config/write.setSmartcontract',
            line: 'no_config',
            message: `Please define global file`
        });
        return false;
    }

    let idString = smartcontractPath.networkId.toString();
    let type = smartcontractPath.type;

    if (!(global as any).config[idString]) {
        (global as any).config[idString] = {};
    }

    if (!(global as any).config[idString][type]) {
        (global as any).config[idString][type] = [];
    }

    let i = contractIndex(idString, type, obj.name);
    if (!i) {
        (global as any).config[idString][type].push(obj);
    } else {
        (global as any).config[idString][type][i] = obj;
    }

    let uploaded = await uploadConfig(path, cdnClient, (global as any).config);
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

export const connectCdn = connection;