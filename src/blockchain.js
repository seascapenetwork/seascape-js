let Web3 = require('web3');

let httpProvider = process.env.REMOTE_HTTP;

if (process.env.REMOTE_HTTP == undefined) {
    if (typeof window !== "undefined" && httpProvider != window.web3.currentProvider) {
     httpProvider = window.web3.currentProvider;     
 } else {
     throw "no web3 was detected";
 }
} else {
    httpProvider = process.env.REMOTE_HTTP;
}

module.exports.web3 = new Web3(httpProvider);

module.exports.loadContract = async function(web3, address, abi) {
    let contract = await new web3.eth.Contract(abi, address)

    return contract;
};

module.exports.call = async function(instance, method, address, args) {
    //let cwsRaw = await cws.methods.balanceOf(web3.currentProvider.selectedAddress).call();
    //let raw = await instance.methods[method].apply(this, args).call();
    let raw = await instance.methods[method](...args).call();
};

