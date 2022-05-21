import { CdnRead } from "../src/index";

(async () => {
    let abiConfig = await CdnRead.abiConfig('Greeter');
    let abi = await CdnRead.abi('Greeter', abiConfig);
    console.log(abi);
})();