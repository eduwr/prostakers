import { VoidSigner } from '@ethersproject/abstract-signer'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { Provider as EthersProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

export class EthersContract {
  private readonly provider: EthersProvider

  constructor(provider: EthersProvider) {
    this.provider = provider
  }

  create(address: string, abi: ContractInterface, signer?: Wallet | VoidSigner): Contract {
    return new Contract(address, abi, signer ?? this.provider)
  }
}