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

# Installation

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

---

# Contribution

# installation
1. clone this repo
2. install dependencies: `npm install`
done!

# sample
You can run the sample on localhost at port 8080 :

`node index.js`

or

`cmd /C "set REMOTE_HTTP=https://rinkeby.infura.io/v3/<key> && node index.js"`

index.js + index.html is holding an example of APY of first game.

# Development and publishing
1. Compile the Typescript to Javascript code

```tsc```

2. Create a single file in `dist` folder to use it in the browser.

```browserify -t brfs --standalone seascape src/seascape.js -o dist/seascape.js`

3. Finally upload it to the NPMJS

```npm publish```