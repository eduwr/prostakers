import { ethers } from "ethers";
import { useState } from "react";

export const useWallet = () => {
  const [ account, setAccount ] = useState("");
  const [ balance, setBalance ] = useState("");

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    return ethers.utils.formatEther(balance);
  };

  const clean = () => {
    setAccount("")
    setBalance("")
  }

  const connect = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);

      const balance = await getBalance();
      setAccount(accounts[0]);
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };

  const checkConnectedWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];

        const balance = await getBalance();
        setAccount(account);
        setBalance(balance);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return {
    account,
    balance,
    connect,
    getBalance,
    checkConnectedWallet,
    clean
  }
}
