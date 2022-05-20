import { Wallet, SmartcontractData, SmartcontractDataTypes as TYPE, CdnRead, ConfigPath } from "../src/index";

(async () => {
    let path = {project: 'lighthouse', env: 'prod'} as ConfigPath;
    let url = `https://cdn.seascape.network/${path.project}/${path.env}/config.json`;

    let initialized = await CdnRead.initConfig(url);
    if (!initialized) {
        console.log(`Global initializiation failed`);
    } else {
        console.log((global as any).config);
    }
})();