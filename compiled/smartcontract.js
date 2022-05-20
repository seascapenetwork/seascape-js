"use strict";
exports.__esModule = true;
exports.Smartcontract = void 0;
var ethers_1 = require("ethers");
var Smartcontract = /** @class */ (function () {
    function Smartcontract(provider, address, abi) {
        this.provider = provider;
        this.internalContract = new ethers_1.ethers.Contract(address, abi, provider.internal());
    }
    /**
     * @description add a signer who will make a transaction to blockchain by calling this smartcontract's methods.
     * @param signer The account that will submit the transactions
     * @returns smartcontract itself
     */
    Smartcontract.prototype.addSigner = function (signer) {
        this.internalContract.connect(signer);
        return this;
    };
    ;
    /**
     * @description Returns a Contract interface
     * @param data JSON string or object
     * @returns ethers.ContractInterface
     * @throws error is data is string and can not be parsed as a JSON
     */
    Smartcontract.loadAbi = function (data) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    };
    /**
     * Return an internal contract represantation
     * @returns ethers.Contract
     */
    Smartcontract.prototype.internal = function () {
        return this.internalContract;
    };
    return Smartcontract;
}());
exports.Smartcontract = Smartcontract;
//# sourceMappingURL=smartcontract.js.map