import { ConfigPath, SeascapeCdnConfig } from "../../../src/index";

(async () => {
    let path = {project: 'miner', env: 'beta2', temp: true, empty: true} as ConfigPath;

    let seascapeCdnConfig = await SeascapeCdnConfig.New(path);
    console.log(seascapeCdnConfig.toJSON());
})();