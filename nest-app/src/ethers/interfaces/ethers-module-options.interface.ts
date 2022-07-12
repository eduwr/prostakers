import abi from '../../abi.json';

export interface EthersModuleOptions {
  url: string;
  abi: ReturnType<() => typeof abi.abi>;
  address: string;
}