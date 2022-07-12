import { Global, Module, DynamicModule, Provider, OnApplicationShutdown } from "@nestjs/common";
import { Contract } from "ethers";
import { WebSocketProvider, BaseProvider, Provider as EthersProvider } from '@ethersproject/providers'
import { defer, lastValueFrom } from "rxjs";

import { DiscoveryService } from "@nestjs/core";
import { EthersModuleOptions } from "./interfaces/ethers-module-options.interface";


const createBaseProvider = async (url: string) => new WebSocketProvider(url);

function createWSContractProvider({ abi, address }: EthersModuleOptions): Provider {
  return {
    provide: "ETHERS_WS_CONTRACT_PROVIDER",
    useFactory: async (provider: BaseProvider): Promise<Contract> => {
      return await lastValueFrom(defer(async () => new Contract(address, abi, provider)))
    },
    inject: [ "ETHERS_WS_PROVIDER" ],
  }
}

function createEthersWSProvider({ url }: EthersModuleOptions): Provider {
  return {
    provide: "ETHERS_WS_PROVIDER",
    useFactory: async (): Promise<BaseProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(url)))
    },
  }
}

@Global()
@Module({})
export class EthersCoreModule implements OnApplicationShutdown {

  constructor(private readonly discoveryService: DiscoveryService) {
  }


  static forRoot(options: EthersModuleOptions): DynamicModule {
    const ethersProvider = createEthersWSProvider(options)
    const ethersContractProvider = createWSContractProvider(options);
    return {
      module: EthersCoreModule,
      exports: [ ethersProvider, ethersContractProvider ],
      providers: [ ethersProvider, ethersContractProvider ]
    }
  }


  onApplicationShutdown(signal?: string): any {
    const providers = this.discoveryService.getProviders();

    providers.forEach((provider) => {
      const { instance } = provider ?? {}

      if (provider.isDependencyTreeStatic() && instance && instance instanceof EthersProvider) {
        instance.removeAllListeners()
      }
    })
  }
}