import { Global, Module, DynamicModule, OnApplicationShutdown } from "@nestjs/common";
import { Provider as EthersProvider } from '@ethersproject/providers';
import { DiscoveryModule, DiscoveryService } from "@nestjs/core";
import { EthersModuleOptions } from "./interfaces/ethers-module-options.interface";
import { createEthersWSProvider, createContractWSProvider } from "./ethers.providers";
import { EthersContract } from "./ethers.contract";


@Global()
@Module({})
export class EthersCoreModule implements OnApplicationShutdown {

  constructor(private readonly discoveryService: DiscoveryService) {
  }

  static forRoot(options: EthersModuleOptions): DynamicModule {
    const ethersProvider = createEthersWSProvider(options)
    const ethersContractProvider = createContractWSProvider();
    return {
      module: EthersCoreModule,
      imports: [ DiscoveryModule ],
      exports: [ EthersContract, ethersProvider, ethersContractProvider  ],
      providers: [ EthersContract, ethersProvider, ethersContractProvider ]
    }
  }

  async onApplicationShutdown(signal?: string) {
    const providers = this.discoveryService.getProviders();

    providers.forEach((provider) => {
      const { instance } = provider ?? {}

      if (provider.isDependencyTreeStatic() && instance && instance instanceof EthersProvider) {
        instance.removeAllListeners()
      }
    })
  }
}