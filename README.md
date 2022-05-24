# Seascape JS
Seascape JS is the Node.js module written in Typescript. 

Features:
* Generate the Proof of Server for the data that user submits to the blockchain.
* Convert the Javscript/Typescript type to the blockchain type.
* More developer friendly smartcontract interaction.

Upcoming features:
* Connect to the list of the Smartcontracts.
* Generate the Proof of Server using Vault.
* APR calculation of the DeFi staking.
* Fetch the price of any token or blockchain in USD dollars.
* Wallet connection on the browser.
* Walletless connection to the browser.

The following of the document is divided into two sections. The first section is for users, who wants to use Seascape JS in their product. The second section is for users who wants to contribute to Seascape JS.

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
CDN config is handling the information about the abi, address of the smartcontracts.

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
`"1"` is the network id. In our case it's the Ethereum Mainnet.
Each network has the group of smartcontracts. "erc20" is the group of ERC20 Tokens. The group is the list of config objects.
Each config object has `name`, `address`, `abi` fields required. 
Additionally, developer can add the following optional parameters:

* `txid` &ndash; transaction when it was deployed.
* `owner` &ndash; owner of the smartcontract.
* `verifier` &ndash; the `Proof of Server` address in the smartcontract.
* `fund` &ndash; the account that keeps the tokens/nfts of the smartcontract.

---

## Hardhat framework CDN update
Upload the smartcontract address and abi to the Seascape CDN after smartcontract deployment in [hardhat](https://hardhat.org/) framework.

> It uploads the smartcontract address and the ABI to the Seascape CDN.

In the hardhat framework, install the `seascape`.
Then add the following lines to the deploying script:

```typescript
// On top import the `CdnWrite` module.
// Add the following .env variables
//  ALIBABA_REGION=
//  ALIBABA_ACCESSID=
//  ALIBABA_SECRET=
//  ALIBABA_BUCKET=
import { CdnWrite } from "seascape";

//
// ... the rest of the code.
//

// Smartcontract name should be same as Smartcontract name that you deploy.
let smartcontractName = 'Greeter';
const Greeter = await ethers.getContractFactory(smartcontractName);

const greeter = await Greeter.deploy("Hello, Hardhat and Seascape JS!");

const addresses = await ethers.getSigners();
let networkId = await addresses[0].getChainId();

// Get the transaction id.
await greeter.deployed();

// the cdn should be available at
// https://cdn.seascape.network/greeter/beta/config.json
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
```

## Truffle framework CDN update
Upload the smartcontract address and abi to the Seascape CDN after smartcontract deployment in [truffle](https://trufflesuite.com/truffle/) framework.

* Import the 'seascape' into the project:
```bash
npm install seascape
```

* Add the `.env` based on the [seascape-js/.example.env](https://github.com/blocklords/seascape-js/blob/main/.example.env).

* In the migrations file import the `CdnWrite`
```javascript
let { CdnWrite } = require('seascape');

```

* Then, update the migration and add the CdnWrite.

```javascript
const MetaCoin = artifacts.require("MetaCoin");
let { CdnWrite } = require("seascape");

module.exports = async function(deployer) {
    await deployer.deploy(MetaCoin);

    // The CDN will be available at
    // https://cdn.seascape.network/<projectName>/<projectEnv>/config.json
    //
    // In our case:
    // https://cdn.seascape.network/greeter/beta/config.sjon
    let truffleParams = {
        projectName: 'greeter',
        projectEnv: 'beta',
        networkId: await deployer.network_id,
        txid: MetaCoin.transactionHash,
        contractName: 'MetaCoin',
        contractType: 'main',
        contractAbi: MetaCoin.abi,
        contractAddress: MetaCoin.address,
        owner: deployer.address
    };

    let cdnUpdated = await seascape.CdnWrite.setTruffleSmartcontract(truffleParams);
  
    console.log(`Deployed successfully`);
    if (cdnUpdated) {
        console.log(`CDN was updated successfully`);
    } else {
        console.log(`CDN update failed. Please upload upload it manually!`);
        console.log(truffleParams);
    }
}
```

### CDN Update custom

```typescript
import { CdnRead, CdnWrite, ConfigPath, SmartcontractConfig, SmartcontractPath } from "seascape";

(async () => {
    let path = {project: 'lighthouse', env: 'beta'} as ConfigPath;

    let initialized = await CdnRead.initConfig(path);
    if (!initialized) {
        console.log(`Global initializiation failed`);
        process.exit(1);
    } 

    let client = await CdnWrite.connectCdn(
        process.env.ALIBABA_REGION, 
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET,
        process.env.ALIBABA_BUCKET
    );
    if (client === undefined) {
        console.log(`Could not connect to the CDN`);
        process.exit(2);
    }

    let smartcontract = {
        name: "MSCP ALLO",
        address: "0x93Efe41A6a5377bC1d7DD43412fD14B4bA0134Fb",
        abi: "no-abi",
    } as SmartcontractConfig;

    let smartcontractPath = {
        networkId: 1287,
        type: 'nfts'
    } as SmartcontractPath;

    let updated = await CdnWrite.setSmartcontract(path, client, smartcontractPath, smartcontract);
    console.log(`Was CDN updated successfully? ${updated}`);
})();
```

# Contribution

## Installation
1. fork this repo
2. install dependencies: `npm install`
done!

## Development
1. Compile the Typescript to Javascript code

```tsc```

2. Add the tests.
3. Add the example of code use in examples folder.
4. Add the part of the code in README.md.

## Publishing for contributors
* Create a pull request to the https://github.com/blocklords/seacape-js
* Raise the issue with your changes.

# Seascape Team development maintaining
Its mostly for me [ahmetson](https://github.com/ahmetson) as the main maintainer I want to be able to remember how to work on this project.

* Clone if you didn't.
* Create .env based on `.example.env`
* Run the docker container: `docker-compose up -d`
* Enter into the docker container: `docker exec -it seascape-js`
* Install dependencies: `npm install`.
* Run your code.
* Create the test.
* Create the example.
* Compile to Javascript `npx tsc`.
* Update the version in package.json and push it to the github. 
* Push to the npm: `npm publish`.

# Tests
See the test scripts to see how it's used.
In order to run the test scripts, run the following command:

```sh
npx ts-node test/<test file name>
```

There are example projects inside the test to see how to update the smartcontract address in the frameworks.

## Hardhat framework
The upload of the smartcontract in hardhat framework test is located as a sub project inside the `test/hardhat-project` directory. It should have the `.env` setted up based on the `.example.env`.

## Truffle framework
In the truffle, the better way to deploy the smartcontracts is using the `truffle migrate` instead the `truffle deploy`. So `seascape` SDK is built for that.
Truffle uses the Javascript example. Therefore to test the updating the CDN after truffle migration, we should first compile the typescript source code to the javascript module.
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

# TODO
Add the browserify in the future to enable it in the browsers.

```browserify -t brfs --standalone seascape src/seascape.js -o dist/seascape.js`
