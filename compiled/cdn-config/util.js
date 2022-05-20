"use strict";
exports.__esModule = true;
exports.validateConfNetwork = void 0;
var validateConfNetwork = function (networkId) {
    if (global.config === undefined || global.config === null) {
        console.log({
            error_path: 'src/utils/config.validateConfNetwork',
            line: 'no_config',
            message: "Please define global file"
        });
        return false;
    }
    if (global.config[networkId] === undefined || global.config[networkId] === null) {
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