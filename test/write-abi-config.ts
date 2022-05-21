import { CdnUtil, CdnRead, CdnWrite, ConfigPath, SmartcontractConfig, SmartcontractPath } from "../src/index";

(async () => {
    let smartcontractName = 'Greeter';

    let config = await CdnRead.abiConfig(smartcontractName);
    console.log(config);

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

    config.version++;

    let updated = await CdnWrite.setAbiConfig(client, smartcontractName, config);
    console.log(`Was CDN updated successfully? ${updated}`);
})();