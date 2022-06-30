const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const seascape = require("../../../compiled/index");

module.exports = async function(deployer) {
  await deployer.deploy(ConvertLib);
  await deployer.link(ConvertLib, MetaCoin);
  let metacoin = await deployer.deploy(MetaCoin);

  let projectParams = new seascape.CdnUtil.ProjectParams('greeter', 'beta', true, true);
  let smartcontractPath = new seascape.CdnUtil.SmartcontractPath(await deployer.network_id, 'main');

  let smartcontract = new seascape.CdnUtil.SmartcontractConfig('MetaCoin', metacoin.address, metacoin.transactionHash, metacoin.abi);
  // you can call it
  // smartcontract.owner = "";
  // smartcontract.verifier = "";
  // smartcontract.fund = "";

  let cdnUpdated = await seascape.CdnWrite.setSmartcontract(projectParams, smartcontractPath, smartcontract);
  
  console.log(`Deployed successfully`);
  if (cdnUpdated) {
    console.log(`CDN was updated successfully`);
  } else {
    console.log(`CDN update failed. Please upload upload it manually!`);
    console.log(truffleParams);
  }
};
