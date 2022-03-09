import { ethers } from "ethers";
import { Provider } from "./provider"; 

export class Smartcontract {
  provider: Provider;
  internalContract: ethers.Contract;
  
  constructor(provider: Provider, address: string, abi: ethers.ContractInterface) {
    this.provider = provider;
    this.internalContract = new ethers.Contract(address, abi, provider.internal());
  }

  /**
   * @description add a signer who will make a transaction to blockchain by calling this smartcontract's methods.
   * @param signer The account that will submit the transactions
   * @returns smartcontract itself
   */
  addSigner (signer: ethers.Signer): Smartcontract {
    this.internalContract.connect(signer);

    return this;
  };

  /**
   * @description Returns a Contract interface
   * @param data JSON string or object
   * @returns ethers.ContractInterface
   * @throws error is data is string and can not be parsed as a JSON
   */
  static loadAbi(data: string | object | Array<object>): ethers.ContractInterface {
    if (typeof data === 'string') {
      return JSON.parse(data) as ethers.ContractInterface;
    }
  
    return data as ethers.ContractInterface;
  }

  /**
   * Return an internal contract represantation
   * @returns ethers.Contract
   */
  internal(): ethers.Contract {
    return this.internalContract;
  }
}
