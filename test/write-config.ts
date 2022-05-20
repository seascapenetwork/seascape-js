import { CdnRead, CdnWrite, ConfigPath, SmartcontractConfig } from "../src/index";

(async () => {
    let path = {project: 'lighthouse', env: 'beta'} as ConfigPath;
    let url = `https://cdn.seascape.network/${path.project}/${path.env}/config.json`;

    let initialized = await CdnRead.initConfig(url);
    if (!initialized) {
        console.log(`Global initializiation failed`);
        process.exit(1);
    } 

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

    let smartcontract = {
        name: "MSCP ALLO",
        address: "0x93Efe41A6a5377bC1d7DD43412fD14B4bA0134Fb",
        abi: "no-abi",
    } as SmartcontractConfig;

    let networkId = 1287;
    let updated = await CdnWrite.setSmartcontract(path, client, networkId, 'nfts', smartcontract);
    console.log(`Was CDN updated successfully? ${updated}`);
})();