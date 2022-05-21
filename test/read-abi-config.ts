import { CdnRead, ConfigPath } from "../src/index";

(async () => {
    let abiConfig = await CdnRead.abiConfig('Greeter');
    console.log(abiConfig);
})();