import { SeascapeAbiConfig } from "../../../src/index";

(async () => {
    let temp = true;
    let abiConfig = await SeascapeAbiConfig.New(temp, 'MineNFT');
    console.log(abiConfig.toString());
})();