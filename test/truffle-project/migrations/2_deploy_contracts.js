const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const seascape = require("../../../compiled/index");

module.exports = async function(deployer) {
  await deployer.deploy(ConvertLib);
  await deployer.link(ConvertLib, MetaCoin);
  let metacoin = await deployer.deploy(MetaCoin);

  let truffleParams = {
    projectName: 'greeter',
    projectEnv: 'beta',
    networkId: await deployer.network_id,
    txid: metacoin.transactionHash,
    contractName: 'MetaCoin',
    contractType: 'main',
    contractAbi: metacoin.abi,
    contractAddress: metacoin.address
  };

  let cdnUpdated = await seascape.CdnWrite.setTruffleSmartcontract(truffleParams);
  
  console.log(`Deployed successfully`);
  if (cdnUpdated) {
    console.log(`CDN was updated successfully`);
  } else {
    console.log(`CDN update failed. Please upload upload it manually!`);
    console.log(truffleParams);
  }
};
