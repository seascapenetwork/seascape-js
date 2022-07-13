# Seascape JS
Seascape JS is the Node.js module written in Typescript. 

Features:
* Generate the Proof of Server for the data that the user submits to the blockchain.
* Convert the Javascript/Typescript type to the blockchain type.
* More developer-friendly smartcontract interaction.

Upcoming features:
* Connect to the list of the smartcontracts.
* Generate the Proof of Server using Vault.
* APR calculation of the DeFi staking.
* Fetch the price of any token or blockchain in USD dollars.
* Wallet connection on the browser.
* Walletless connection to the browser.
* Add the browserify in the future to enable it in the browsers.

```
browserify -t brfs --standalone seascape src/seascape.js -o dist/seascape.js
```


The following document is divided into two sections. The first section is for users, who want to use Seascape JS in their product. The second section is for users who want to contribute to Seascape JS.

---

# Usage

## Installation

For node.js use the following:

```
npm install seascape
```

## Smartcontrantract interaction

```typescript
import * as fs from 'fs';
import { Smartcontract, Provider } from 'seascape';

(async () => {
    // need an abi (something like the smartcontract API list)
    let onsaleAbiPath = './src/abi/Onsales.json';
    const onsaleAbi = fs.readFileSync(onsaleAbiPath, 'utf8') as string;
    const onsaleInterface = Smartcontract.loadAbi(onsaleAbi);

    // need smartcontract address
    let onsaleAddress = `0x0D1b5d8a3c67b72C10caF0749D32e5e3F3629672`;

    // need a blockchain connection where the smartcontract deployed on
    // Api endpoint source: https://rpc.info/
    let provider = new Provider(`https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`);

    // Our smartcontract interface instance connected to the internet.
    let onsaleInstance = new Smartcontract(provider, onsaleAddress, onsaleInterface);

    // now calling some method
    let lastId = await onsaleInstance.internal().lastSalesId();

    console.log(lastId);
})();
```

## Proof of Server
*Proof of Server* is the signature over the data that is signed on the backend. Then when the user sends the data to the smartcontract, the smartcontract verifies that the data is from the backend. For verification, blockchain uses [ecrecover](https://docs.soliditylang.org/en/v0.8.0/units-and-global-variables.html#mathematical-and-cryptographic-functions) function for verification.

```typescript
import { Wallet, SmartcontractData, SmartcontractDataTypes as TYPE, ProofOfServer } from "seascape";

(async () => {
    let privateKey: string = process.env.TEST_PRIVATE_KEY!;

    // The privatekey of the backend.
    let wallet = Wallet.fromPrivateKey(privateKey);

    let user = "0x5bDed8f6BdAE766C361EDaE25c5DC966BCaF8f43";
    let saleId = 1;


    let params: Array<SmartcontractData> = [
        new SmartcontractData(TYPE.ADDRESS, user as string),
        new SmartcontractData(TYPE.UINT256, saleId as Number),
    ]

    let signature: string = await ProofOfServer(params, wallet);
    console.log(`Signature is ${signature}`);
})();
```

## Verifier
Verification of the Proof Of Server.

```typescript
import { SmartcontractData, SmartcontractDataTypes as TYPE, Verifier } from "seascape";

(async () => {
    let user = '0x5bDed8f6BdAE766C361EDaE25c5DC966BCaF8f43';
    let saleId = 1;

    let params: Array<SmartcontractData> = [
        new SmartcontractData(TYPE.ADDRESS, user as string),
        new SmartcontractData(TYPE.UINT256, saleId as Number),
    ]

    // Proof of the server represented as a signature.
    let signature = '0x115361e2e4feb7bea1084d0059b981b95cde8edbd2346b0e23d41d5a84aeb41448bee659895f053eedf9aba125b935f6c53a926d6bae3677367c5f95a47b83131c';

    // The server account that generated the proof.
    let serverAddress = '0x5bDed8f6BdAE766C361EDaE25c5DC966BCaF8f43';

    let verifier = await Verifier(params, signature);
    console.log(`The signer of the signature is ${verifier}? Is it matching to the whitelisted address? ${serverAddress == verifier}`);
})();
```

## CDN Config
CDN config is handling the information about the abi, and address of the smartcontracts.

The structure of the configuration:
```json
{
    "1": {
        "erc20": [ 
            {
                "name": "CrownsToken",
                "address": "0xFde9cad69E98b3Cc8C998a8F2094293cb0bD6911",
                "abi": "https://cdn.seascape.network/smartcontracts/abi/CrownsToken.json"
            }
        ]
    }
}
```
`"1"` is the network id. In our case, it's the Ethereum Mainnet.
Each network has a group of smartcontracts. "erc20" is the group of ERC20 Tokens. The group is the list of config objects.
Each config object has `name`, `address`, and `abi` fields required. 
Additionally, the developer can add the following optional parameters:

* `txid` &ndash; transaction when it was deployed.
* `owner` &ndash; owner of the smartcontract.
* `verifier` &ndash; the `Proof of Server` address in the smartcontract.
* `fund` &ndash; the account that keeps the tokens/nfts of the smartcontract.

---

## Hardhat framework CDN update
The following steps explain how to use `SeascapeJS` with [hardhat](https://hardhat.org/) framework. 
Upload the smartcontract address and abi to the Seascape CDN after smartcontract deployment.

> Requires knowledge of the Hardhat framework

* In the hardhat framework, install the `seascape`.

```npm install seascape```

* Then in the script that deploys the smartcontract make it similar to the example below.

```typescript
import { ethers } from "hardhat";
let seascape = require("seascape");

async function main() {
    // Smartcontract name should be same as Smartcontract name that you deploy.
    let smartcontractName = 'Greeter';
    const Greeter = await ethers.getContractFactory(smartcontractName);
    const greeter = await Greeter.deploy("Hello, Hardhat and Seascape JS!");
    // Get the transaction id.
    await greeter.deployed();
    console.log("Greeter deployed to:", greeter.address);

    // Project name: 'greeter'
    // Project environment: 'beta'
    // If the project doesn't have any configuration on CDN, we create an empty one. If you set the third argument to false, then it will throw an error.
    // If you set the last argument to false, it will connect to https://cdn.seascape.network. If you set the last argument to true, it will connect to https://cdn-temp.seascape.network. Cdn-temp is used for development phase.
    let projectPath = new seascape.CdnUtil.ProjectPath('greeter', 'beta', true, false);

    const addresses = await ethers.getSigners();
    let networkId = await addresses[0].getChainId();
    // network id where the smartcontract is deployed
    // the smartcontract category within the project
    let smartcontractPath = new seascape.CdnUtil.SmartcontractPath(networkId, 'main');

    // smartcontract name, address and deployment transaction hash.
    // the last argument is the abi. 
    // for hardhat framework we set it in a different way
    let smartcontract = new seascape.CdnUtil.SmartcontractConfig(
        smartcontractName,
        greeter.address,
        greeter.deployTransaction.hash,
        ""
    );

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

```

## Truffle framework CDN update
The following steps demonstrates how to use `SeascapeJS` with [truffle](https://trufflesuite.com/truffle/) framework.
It will upload the smartcontract address and smartcontract ABI to the Seascape CDN.

* In your truffle project, import 'seascape' Node package into the project:
```bash
npm install seascape
```

* Create the `.env` based on the [seascape-js/.example.env](https://github.com/blocklords/seascape-js/blob/main/.example.env).

* Truffle uses migrations to deploy the smartcontracts, therefore we need to import `seascape` package into it.
```javascript
let seascape = require('seascape');

```

* Then, update the migration and add the CdnWrite.

```javascript
const MetaCoin = artifacts.require("MetaCoin");
let seascape = require("seascape");

module.exports = async function(deployer) {
    // deploying the smartcontract
    await deployer.deploy(MetaCoin);
    console.log(`MetaCoin was deployed on ${MetaCoin.address}`);

    // then updating the CDN
    // project name is greeter
    // project environment is beta
    // if the Configuration file wasn't created we create an empty one
    // the last argument is true, if you use https://cdn-temp.seascape.network/ for development.
    // the last argument is false, if you use https://cdn.seascape.network/.
    let projectPath = new seascape.CdnUtil.ProjectPath('greeter', 'beta', true, false);

    // Inside the Configuration file, what is the network id.
    // and smartcontract category
    let smartcontractPath = new seascape.CdnUtil.SmartcontractPath(await deployer.network_id, 'main');
    
    // smartcontract parameters
    // name of the smartcontract
    // the rest of the parameters are set after truffle deploys the smartcontract
    // address of the smartcontract
    // transaction id of the deployment
    // abi object
    let smartcontract = new seascape.CdnUtil.SmartcontractConfig(
        'MetaCoin', 
        MetaCoin.address, 
        MetaCoin.transactionHash, 
        MetaCoin.abi
    );

    // update the CdnConfig, Abi to the Seascape CDN
    let cdnUpdated = await seascape.CdnWrite.setSmartcontract(projectPath, smartcontractPath, smartcontract);

    if (cdnUpdated) {
        console.log(`CDN was updated successfully`);
    } else {
        console.log(`CDN update failed. Please upload upload it manually!`);
        console.log(projectPath, smartcontractPath, smartcontract);
    }
}
```

# Contribution
The following part is for the maintainer of this project.
It's mostly for me [ahmetson](https://github.com/ahmetson) as the main maintainer I want to be able to remember how to work on this project.

## Installation
1. fork this repo.
2. download [docker](https://www.docker.com/products/docker-desktop/).
3. create `.env` based on the `.example.env`
4. create the docker image and run a container based on the image: `docker-compose up -d`
5. enter into the container: `docker exec -it seascape-js bash`

## Development
1. Compile the Typescript to Javascript code

```npx tsc```

2. Add the tests.
3. Add the example of code used in the examples folder.
4. Add the part of the code in README.md.
5. Update the version in package.json and push it to GitHub. 
6. upload `npm publish`

## Publishing for contributors
* Create a pull request to the https://github.com/blocklords/seacape-js
* Raise the issue with your changes.

---

# Tests
See the test scripts to see how it's used.
In order to run the test scripts, run the following command:

```sh
npx ts-node test/<test file name>
```

There are example projects inside the test to see how to update the smartcontract address in the frameworks.

## Hardhat framework
The upload of the smartcontract in the hardhat framework test is located as a sub-project inside the `test/hardhat-project` directory. It should have the `.env` set up based on the `.example.env`.

## Truffle framework
In the truffle, the better way to deploy the smartcontracts is using the `truffle migrate` instead of the `truffle deploy`. So `seascape` SDK is built for that.
Truffle uses the Javascript example. Therefore to test the updating of the CDN after truffle migration, we should first compile the typescript source code to the javascript module.
Then to run the migration with CDN update inside the test, change the terminal's directory to the `truffle-project`:

```bash
cd test/truffle-project
```

After that create the `.env` based on the `.example.env`
Then run the `npm install`.

The truffle will be available inside this folder as `npx truffle`.
See the `test/truffle-project/migrations/2_deploy_contracts.js` how the CDN updated after the Truffle migrates the script.
In order to see it in action run the following:

```bash
npx truffle migrate --network rinkeby
```

