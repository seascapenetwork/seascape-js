import { CdnUtil, CdnWrite, SeascapeAbiConfig, SeascapeAbi, ProjectPath, SmartcontractConfig, SmartcontractPath } from "../../../src/index";

(async () => {
    let temp = true;
    let name = 'MineNFT';

    let client = await CdnWrite.connectCdn(
        temp,
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET,
    );

    let config = await SeascapeAbiConfig.New(temp, name);
    await config.incrementVersion(client);

    let abi = await SeascapeAbi.New(temp, 'MineNFT', 2);
    SeascapeAbi.SetAbi(client, config, abi);

    console.log(`Abi was uploaded to ${CdnUtil.cdnReadAbiUrl(temp, config)}`);
})();