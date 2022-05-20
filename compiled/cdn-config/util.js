"use strict";
exports.__esModule = true;
exports.validateConfNetwork = exports.cdnConfigUrl = exports.SEASCAPE_CDN = void 0;
exports.SEASCAPE_CDN = 'https://cdn.seascape.network/';
var cdnConfigUrl = function (path) {
    return "".concat(exports.SEASCAPE_CDN).concat(path.project, "/").concat(path.env, "/config.json");
};
exports.cdnConfigUrl = cdnConfigUrl;
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