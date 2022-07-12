import { DynamicModule, Module } from '@nestjs/common';
import { EthersModuleOptions } from "./interfaces/ethers-module-options.interface";
import { EthersCoreModule } from "./ethers-core.module";

@Module({})
export class EthersModule {
  static forRoot(options: EthersModuleOptions = {}): DynamicModule {
    return {
      module: EthersModule,
      imports: [EthersCoreModule.forRoot(options)]
    }
  }
}
