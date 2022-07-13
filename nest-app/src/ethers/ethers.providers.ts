import { BaseProvider, WebSocketProvider, Provider as EthersProvider } from "@ethersproject/providers";
import { EthersModuleOptions } from "./interfaces/ethers-module-options.interface";
import { Provider } from "@nestjs/common";

import { defer, lastValueFrom } from "rxjs";
import { EthersContract } from "./ethers.contract";
import { EthersProvidersEnum } from "./ethers.providers.enum";

const createBaseProvider = async (url: string) => new WebSocketProvider(url);

export function createContractWSProvider(): Provider {
  return {
    provide: EthersProvidersEnum.ETHERS_WS_CONTRACT_PROVIDER,
    useFactory: async (provider: BaseProvider | EthersProvider): Promise<EthersContract> => {
      return await lastValueFrom(defer(async () => new EthersContract(provider)))
    },
    inject: [ EthersProvidersEnum.ETHERS_WS_PROVIDER ],
  }
}

export function createEthersWSProvider({ url }: EthersModuleOptions): Provider {
  return {
    provide: EthersProvidersEnum.ETHERS_WS_PROVIDER,
    useFactory: async (): Promise<BaseProvider | EthersProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(url)))
    },
  }
}
