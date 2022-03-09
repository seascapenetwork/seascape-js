const fs = require("fs");
import { Smartcontract, Provider } from "../src/index";

(async () => {
    // need an abi
    let onsaleAbiPath = "./src/abi/Onsales.json";
    const onsaleAbi = fs.readFileSync(onsaleAbiPath, 'utf8') as string;
    const onsaleInterface = Smartcontract.loadAbi(onsaleAbi);

    // need smartcontract address
    let onsaleAddress = `0x0D1b5d8a3c67b72C10caF0749D32e5e3F3629672`;

    // need a blockchain connection where the smartcontract deployed on
    let provider = new Provider(`https://ropsten.infura.io/v3/5ddda5dd2d714c299b468caae630f0c6`);

    let onsaleInstance = new Smartcontract(provider, onsaleAddress, onsaleInterface);

    // now calling some method
    let lastId = await onsaleInstance.internal().lastSalesId();

    console.log(lastId);
})();