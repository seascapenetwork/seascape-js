// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { CdnWrite } from "../../../src";

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

  const addresses = await ethers.getSigners();

  let networkId = await addresses[0].getChainId();
  console.log(`Network ID: ${networkId}`);

  await greeter.deployed();

  let cdnUpdated = CdnWrite.setHardhatSmartcontract({
      networkId: networkId,
      projectName: 'greeter', 
      projectEnv: 'beta', 
      contractType: 'main', 
      contractName: smartcontractName, 
      deployedInstance: greeter
  });

  console.log("Greeter deployed to:", greeter.address);
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
