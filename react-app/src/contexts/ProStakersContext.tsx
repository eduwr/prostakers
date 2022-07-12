import React, { createContext, ReactNode, useState } from "react";

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
  withdraw: (amount: string) => void;
  getStakedBalance: () => void;
  stakedBalance: string;
}

export const ProStakersContext = createContext<ProStakersContextValues>(
  {} as ProStakersContextValues
);

export const ProStakersProvider = ({ children }: ProviderProps) => {
  const address = import.meta.env.VITE_CONTRACT_ADDRESS || proStakers.address;
  const contractABI = abi.abi;

  const [stakedBalance, setStakedBalance] = useState("");

  const buildContract = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Ethereum object doesn't exist!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(address, contractABI, signer);
  };

  const getStakedBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const proStakersContract = new ethers.Contract(
          address,
          contractABI,
          signer
        );

        const balance = await proStakersContract.getStakedBalance();

        setStakedBalance(ethers.utils.formatEther(balance));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deposit = async (amount: string) => {
    try {
      const proStakersContract = buildContract();

      if (!proStakersContract || !amount) {
        return;
      }

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

  const withdraw = async (amount: string) => {
    try {
      const proStakersContract = buildContract();

      if (!proStakersContract || !amount) {
        return;
      }

      const proStakersTxn = await proStakersContract.withdraw(
        ethers.utils.parseEther(amount)
      );
      console.log("Withdrawing...", proStakersTxn.hash);

      await proStakersTxn.wait();
      console.log("Withdrawn -- ", proStakersTxn.hash);
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
        getStakedBalance,
        stakedBalance,
        withdraw,
      }}
    >
      {children}
    </ProStakersContext.Provider>
  );
};
