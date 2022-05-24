"use strict";
/**
 * This module writes the contracts to the global CDN.
 * It uploads the abi name, and smartcontract name, and smartcontract address in each network.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.connectCdnByEnv = exports.connectCdn = exports.setTruffleSmartcontract = exports.setHardhatSmartcontract = exports.incrementAbiConfiguration = exports.setAbi = exports.setAbiConfig = exports.setSmartcontract = void 0;
var util_1 = require("./util");
var read_1 = require("./read");
var alicloud_1 = require("./alicloud");
var hardhat_1 = require("./../utils/hardhat");
var setSmartcontract = function (path, cdnClient, smartcontractPath, obj) { return __awaiter(void 0, void 0, void 0, function () {
    var idString, type, i, uploaded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (global.seascapeCdnConfig === undefined || global.seascapeCdnConfig === null) {
                    console.log({
                        error_path: 'src/cdn-config/write.setSmartcontract',
                        line: 'no_config',
                        message: "Please define global file"
                    });
                    return [2 /*return*/, false];
                }
                idString = smartcontractPath.networkId.toString();
                type = smartcontractPath.type;
                if (!global.seascapeCdnConfig[idString]) {
                    global.seascapeCdnConfig[idString] = {};
                }
                if (!global.seascapeCdnConfig[idString][type]) {
                    global.seascapeCdnConfig[idString][type] = [];
                }
                i = (0, read_1.contractIndex)(idString, type, obj.name);
                if (i === false) {
                    global.seascapeCdnConfig[idString][type].push(obj);
                }
                else {
                    global.seascapeCdnConfig[idString][type][i] = obj;
                }
                return [4 /*yield*/, (0, alicloud_1.uploadConfig)(path, cdnClient, global.seascapeCdnConfig)];
            case 1:
                uploaded = _a.sent();
                if (uploaded === null) {
                    console.log({
                        error_path: 'src/cdn-config/write.setSmartcontract',
                        line: 'no_upload',
                        message: "Please fix the Alicloud credentials"
                    });
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.setSmartcontract = setSmartcontract;
var setAbiConfig = function (cdnClient, smartcontractName, abiConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var uploaded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, alicloud_1.uploadAbiConfig)(cdnClient, smartcontractName, abiConfig)];
            case 1:
                uploaded = _a.sent();
                if (uploaded === null) {
                    console.log({
                        error_path: 'src/cdn-config/write.setAbiConfig',
                        line: 'no_upload',
                        message: "Please fix the Alicloud credentials"
                    });
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.setAbiConfig = setAbiConfig;
var setAbi = function (cdnClient, smartcontractName, abiConfig, abi) { return __awaiter(void 0, void 0, void 0, function () {
    var uploaded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, alicloud_1.uploadAbi)(cdnClient, smartcontractName, abiConfig, abi)];
            case 1:
                uploaded = _a.sent();
                if (uploaded === null) {
                    console.log({
                        error_path: 'src/cdn-config/write.setAbi',
                        line: 'no_upload',
                        message: "Please fix the Alicloud credentials"
                    });
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.setAbi = setAbi;
var incrementAbiConfiguration = function (client, smartcontractName) { return __awaiter(void 0, void 0, void 0, function () {
    var abiConfig, abiUpdated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, read_1.abiConfig)(smartcontractName)];
            case 1:
                abiConfig = _a.sent();
                console.log("Before incremention");
                console.log(abiConfig);
                abiConfig.version++;
                return [4 /*yield*/, (0, exports.setAbiConfig)(client, smartcontractName, abiConfig)];
            case 2:
                abiUpdated = _a.sent();
                if (!abiUpdated) {
                    console.error("Abi config wasn't updated.");
                    return [2 /*return*/, false];
                }
                console.log("After incremention");
                console.log(abiConfig);
                return [2 /*return*/, abiConfig];
        }
    });
}); };
exports.incrementAbiConfiguration = incrementAbiConfiguration;
/**
 *
 * @param params Object containing the following parameters
 */
var setHardhatSmartcontract = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var client, abiConfig, abi, abiSetted, path, smartcontractPath, initialized, smartcontract, updated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, alicloud_1.connectionByEnvironment)()];
            case 1:
                client = _a.sent();
                if (client === undefined) {
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.incrementAbiConfiguration)(client, params.contractName)];
            case 2:
                abiConfig = _a.sent();
                console.log('after the function');
                console.log(abiConfig);
                return [4 /*yield*/, (0, hardhat_1.abiFile)(params.contractName)];
            case 3:
                abi = _a.sent();
                if (!abi) {
                    console.log("Failed to load the abi of ".concat(params.contractName, " in hardhat framework. Please upload manually as ").concat(abiConfig.version));
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.setAbi)(client, params.contractName, abiConfig, abi)];
            case 4:
                abiSetted = _a.sent();
                if (!abiSetted) {
                    return [2 /*return*/, false];
                }
                path = { project: params.projectName, env: params.projectEnv };
                smartcontractPath = { networkId: params.networkId, type: params.contractType };
                console.log("The cdn list path where smartcontract object will be");
                console.log(smartcontractPath);
                return [4 /*yield*/, (0, read_1.initConfig)(path)];
            case 5:
                initialized = _a.sent();
                if (!initialized) {
                    console.log("Global initializiation failed");
                    process.exit(1);
                }
                smartcontract = {
                    name: params.contractName,
                    address: params.deployedInstance.address,
                    txid: params.deployedInstance.deployTransaction.hash,
                    abi: (0, util_1.cdnAbiUrl)(params.contractName, abiConfig, true)
                };
                if (params.owner) {
                    smartcontract.owner = params.owner;
                }
                if (params.verifier) {
                    smartcontract.verifier = params.verifier;
                }
                if (params.fund) {
                    smartcontract.fund = params.fund;
                }
                console.log("The smartcontract object in the cdn config is");
                console.log(smartcontract);
                return [4 /*yield*/, (0, exports.setSmartcontract)(path, client, smartcontractPath, smartcontract)];
            case 6:
                updated = _a.sent();
                console.log("Was CDN updated successfully? ".concat(updated));
                return [2 /*return*/, updated];
        }
    });
}); };
exports.setHardhatSmartcontract = setHardhatSmartcontract;
var setTruffleSmartcontract = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var client, abiConfig, abiSetted, path, smartcontractPath, initialized, smartcontract, updated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, alicloud_1.connectionByEnvironment)()];
            case 1:
                client = _a.sent();
                if (client === undefined) {
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.incrementAbiConfiguration)(client, params.contractName)];
            case 2:
                abiConfig = _a.sent();
                return [4 /*yield*/, (0, exports.setAbi)(client, params.contractName, abiConfig, params.contractAbi)];
            case 3:
                abiSetted = _a.sent();
                if (!abiSetted) {
                    return [2 /*return*/, false];
                }
                path = { project: params.projectName, env: params.projectEnv };
                smartcontractPath = { networkId: params.networkId, type: params.contractType };
                console.log("The cdn list path where smartcontract object will be");
                console.log(smartcontractPath);
                return [4 /*yield*/, (0, read_1.initConfig)(path)];
            case 4:
                initialized = _a.sent();
                if (!initialized) {
                    console.log("Global initializiation failed");
                    process.exit(1);
                }
                smartcontract = {
                    name: params.contractName,
                    address: params.contractAddress,
                    txid: params.txid,
                    abi: (0, util_1.cdnAbiUrl)(params.contractName, abiConfig, true)
                };
                if (params.owner) {
                    smartcontract.owner = params.owner;
                }
                if (params.verifier) {
                    smartcontract.verifier = params.verifier;
                }
                if (params.fund) {
                    smartcontract.fund = params.fund;
                }
                console.log("The smartcontract object in the cdn config is");
                console.log(smartcontract);
                return [4 /*yield*/, (0, exports.setSmartcontract)(path, client, smartcontractPath, smartcontract)];
            case 5:
                updated = _a.sent();
                console.log("Was CDN updated successfully? ".concat(updated));
                return [2 /*return*/, updated];
        }
    });
}); };
exports.setTruffleSmartcontract = setTruffleSmartcontract;
exports.connectCdn = alicloud_1.connection;
exports.connectCdnByEnv = alicloud_1.connectionByEnvironment;
//# sourceMappingURL=write.js.map