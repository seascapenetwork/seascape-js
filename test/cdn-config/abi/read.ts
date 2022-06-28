import { SeascapeAbi } from "../../../src/index";

(async () => {
    let temp = true;
    let abi = await SeascapeAbi.New(temp, 'MineNFT', 2);

    console.log(abi);
})();