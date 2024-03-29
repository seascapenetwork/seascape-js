const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const seascape = require("../../../compiled/index");

module.exports = async function(deployer) {
  await deployer.deploy(ConvertLib);
  await deployer.link(ConvertLib, MetaCoin);
  await deployer.deploy(MetaCoin);
  console.log(`'MetaCoin' was deployed successfully at ${MetaCoin.address}`);

  let projectPath = new seascape.CdnUtil.ProjectPath('greeter', 'beta', true, true);
  let smartcontractPath = new seascape.CdnUtil.SmartcontractPath(await deployer.network_id, 'main');

  let smartcontract = new seascape.CdnUtil.SmartcontractConfig('MetaCoin', MetaCoin.address, MetaCoin.transactionHash, MetaCoin.abi);
  // you can call it
  // smartcontract.owner = "";
  // smartcontract.verifier = "";
  // smartcontract.fund = "";

  let cdnUpdated = await seascape.CdnWrite.setSmartcontract(projectPath, smartcontractPath, smartcontract);
  
  if (cdnUpdated) {
    console.log(`CDN was updated successfully`);
  } else {
    console.log(`CDN update failed. Please upload upload it manually!`);
    console.log(projectPath, smartcontractPath, smartcontract);
  }
};
