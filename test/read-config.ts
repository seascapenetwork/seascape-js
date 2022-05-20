import { CdnRead, ConfigPath } from "../src/index";

(async () => {
    let path = {project: 'lighthouse', env: 'beta'} as ConfigPath;

    let initialized = await CdnRead.initConfig(path, true);
    if (!initialized) {
        console.log(`Global initializiation failed`);
    } else {
        console.log((global as any).config);
    }
})();