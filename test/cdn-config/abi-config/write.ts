import { SeascapeAbiConfig, CdnWrite } from "../../../src/index";

(async () => {
    let temp = true;
    let name = 'MineNFT';

    let config = await SeascapeAbiConfig.New(temp, name);
    
    console.log('Before update');
    console.log(config.toString());

    let client = await CdnWrite.connectCdn(
        temp,
        process.env.ALIBABA_ACCESSID,
        process.env.ALIBABA_SECRET
    )

    await config.incrementVersion(client);

    console.log('After update');
    console.log(config.toString());
})();