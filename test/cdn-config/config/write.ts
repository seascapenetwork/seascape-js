import { SeascapeCdnConfig, CdnWrite, ConfigPath, SmartcontractConfig, SmartcontractPath } from "../../../src/index";

(async () => {
    let temp = true;
    let path = {project: 'miner', env: 'beta3', temp: temp, empty: true} as ConfigPath;

    let seascapeCdnConfig = await SeascapeCdnConfig.New(path);

    let client = await CdnWrite.connectCdn(
        temp,
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET
    );

    let smartcontractPath = {networkId: 3, type: 'main'} as SmartcontractPath;
    let smartcontract = {
        name: "MSCP ALLO",
        address: "0x93Efe41A6a5377bC1d7DD43412fD14B4bA0134Fb",
        abi: "",
    } as SmartcontractConfig;

    let updated = await seascapeCdnConfig.setSmartcontract(client, smartcontractPath, smartcontract);
    console.log(`Was CDN updated successfully? ${updated}`);
})();