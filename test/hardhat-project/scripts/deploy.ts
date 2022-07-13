// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
let seascape = require("../../../compiled");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let smartcontractName = 'Greeter';
  const Greeter = await ethers.getContractFactory(smartcontractName);
  const greeter = await Greeter.deploy("Hello, Hardhat and Seascape JS!");

  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);

  let projectPath = new seascape.CdnUtil.ProjectPath('greeter', 'beta', true, true);
  
  const addresses = await ethers.getSigners();
  let networkId = await addresses[0].getChainId();
  let smartcontractPath = new seascape.CdnUtil.SmartcontractPath(networkId, 'main');

  let smartcontract = new seascape.CdnUtil.SmartcontractConfig(
    smartcontractName,
    greeter.address,
    greeter.deployTransaction.hash,
    ""
  );
  smartcontract.owner = "";
  smartcontract.verifier = "";
  smartcontract.fund = "";

  let abi = await seascape.utils.hardhatAbiFile(smartcontractName);
  if (!abi) {
    console.log(`Failed to load the abi of ${smartcontractName} in hardhat framework`);
    return false;
  } else {
    smartcontract.abi = abi;
  }
  
  let cdnUpdated = await seascape.CdnWrite.setSmartcontract(projectPath, smartcontractPath, smartcontract);
  if (!cdnUpdated) {
    console.log("Please update the cdn");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
