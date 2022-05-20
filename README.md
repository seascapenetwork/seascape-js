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
import { Wallet, SmartcontractData, SmartcontractDataTypes as TYPE, ProofOfServer } from "../src/index";

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

## Verify
Verification of the Proof Of Server.

```typescript
import { SmartcontractData, SmartcontractDataTypes as TYPE, Verify } from "../src/index";

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

    let verified = await Verify(params, signature, serverAddress);
    console.log(`
    The parameters 
        user: ${user}, 
        saleId: ${saleId} 
    are approved by the server account 
        ${serverAddress}
    using the proof 
        ${signature}
    Proof is valid? 
        ${verified}
    `);
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
* Update the version in package.json and push it to the github. 
* Push to the npm: `npm publish`.

# TODO
Add the browserify in the future to enable it in the browsers.

```browserify -t brfs --standalone seascape src/seascape.js -o dist/seascape.js`
