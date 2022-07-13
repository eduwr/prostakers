import {Inject} from '@nestjs/common'
import { EthersProvidersEnum } from "./ethers.providers.enum";

export const InjectWebSocketContractProvider = () => {
  return Inject(EthersProvidersEnum.ETHERS_WS_CONTRACT_PROVIDER)
}

export const InjectWebSocketProvider = () => {
  return Inject(EthersProvidersEnum.ETHERS_WS_PROVIDER)
}