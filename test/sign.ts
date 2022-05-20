import { Wallet, SmartcontractData, SmartcontractDataTypes as TYPE, ProofOfServer, Verifier } from "../src/index";

(async () => {
    let privateKey: string = process.env.TEST_PRIVATE_KEY!;

    let wallet = Wallet.fromPrivateKey(privateKey);

    let user = "0x5bDed8f6BdAE766C361EDaE25c5DC966BCaF8f43";
    let saleId = 1;


    let params: Array<SmartcontractData> = [
        new SmartcontractData(TYPE.ADDRESS, user as string),
        new SmartcontractData(TYPE.UINT256, saleId as Number),
    ]

    let signature: string = await ProofOfServer(params, wallet);
    console.log(`Signature is ${signature}`);

    let verified = await Verifier(params, signature);
    console.log(`Verified? ${verified == wallet.address}`);
})();