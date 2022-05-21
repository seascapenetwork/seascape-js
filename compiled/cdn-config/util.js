"use strict";
exports.__esModule = true;
exports.validateConfNetwork = exports.defaultAbiConfig = exports.cdnAbiUrl = exports.cdnAbiConfigUrl = exports.cdnConfigUrl = exports.SEASCAPE_CDN = void 0;
exports.SEASCAPE_CDN = 'https://cdn.seascape.network/';
var cdnConfigUrl = function (path) {
    return "".concat(exports.SEASCAPE_CDN).concat(path.project, "/").concat(path.env, "/config.json");
};
exports.cdnConfigUrl = cdnConfigUrl;
var cdnAbiConfigUrl = function (contractName, fullAddress) {
    if (fullAddress === void 0) { fullAddress = true; }
    if (fullAddress) {
        return "".concat(exports.SEASCAPE_CDN, "abi/").concat(contractName, "/info.json");
    }
    else {
        return "/abi/".concat(contractName, "/info.json");
    }
};
exports.cdnAbiConfigUrl = cdnAbiConfigUrl;
var cdnAbiUrl = function (contractName, config, fullAddress) {
    if (fullAddress === void 0) { fullAddress = true; }
    if (fullAddress) {
        return "".concat(exports.SEASCAPE_CDN, "abi/").concat(contractName, "/").concat(config.version.toString(), ".json");
    }
    else {
        return "/abi/".concat(contractName, "/").concat(config.version.toString(), ".json");
    }
};
exports.cdnAbiUrl = cdnAbiUrl;
var defaultAbiConfig = function () {
    return {
        version: 0
    };
};
exports.defaultAbiConfig = defaultAbiConfig;
var validateConfNetwork = function (networkId) {
    if (global.seascapeCdnConfig === undefined || global.seascapeCdnConfig === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_config',
            message: "Please define global file"
        });
        return false;
    }
    if (global.seascapeCdnConfig[networkId] === undefined || global.seascapeCdnConfig[networkId] === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_network_id',
            message: "Invalid network id '".concat(networkId, "'")
        });
        return false;
    }
    return true;
};
exports.validateConfNetwork = validateConfNetwork;
//# sourceMappingURL=util.js.map