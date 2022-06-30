import { SeascapeCdnConfig, CdnWrite, ProjectPath, SmartcontractParams, SmartcontractPath } from "../../../src/index";

(async () => {
    let temp = true;
    let path = {project: 'miner', env: 'beta3', temp: temp, empty: true} as ProjectPath;
    let seascapeCdnConfig = await SeascapeCdnConfig.New(path);

    let client = await CdnWrite.connectCdn(
        temp,
        process.env.ALIBABA_ACCESSID, 
        process.env.ALIBABA_SECRET
    );

    let networkId = 3;
    let category = 'main';
    let smartcontractPath = new SmartcontractPath(networkId, category);
    let smartcontract = new SmartcontractParams(
        "MSCP ALLO",
        '{"msg": "no abi"}',
        "0x93Efe41A6a5377bC1d7DD43412fD14B4bA0134Fb",
        "txid null"
    );

    let updated = await seascapeCdnConfig.setSmartcontract(client, smartcontractPath, smartcontract);
    console.log(`Was CDN updated successfully? ${updated}`);
})();