import React, { createContext, ReactNode } from "react";

import proStakers from "../contracts/proStakers.json";
import abi from "../contracts/abi.json";
import { ethers } from "ethers";

interface ProviderProps {
  children: ReactNode;
}

export interface ProStakersContextValues {
  address: string;
  contractABI: ReturnType<() => typeof abi.abi>;
  deposit: (amount: string) => void;
}

export const ProStakersContext = createContext<ProStakersContextValues>(
  {} as ProStakersContextValues
);

export const ProStakersProvider = ({ children }: ProviderProps) => {
  const address = proStakers.address;
  const contractABI = abi.abi;

  const deposit = async (amount: string) => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const proStakersContract = new ethers.Contract(
        address,
        contractABI,
        signer
      );

      if (!amount) return;

      const proStakersTxn = await proStakersContract.deposit({
        value: amount && ethers.utils.parseEther(amount),
      });
      console.log("Depositing...", proStakersTxn.hash);

      await proStakersTxn.wait();
      console.log("Deposited -- ", proStakersTxn.hash);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProStakersContext.Provider
      value={{
        contractABI,
        address,
        deposit,
      }}
    >
      {children}
    </ProStakersContext.Provider>
  );
};
