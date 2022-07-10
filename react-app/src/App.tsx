import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/ProStakers.sol/ProStakers.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState<string>();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAbi = abi.abi;

  const getAccountBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    return ethers.utils.formatEther(balance);
  };

  const connectWallet = async () => {
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

      const balance = await getAccountBalance();
      setCurrentAccount(accounts[0]);
      setAccountBalance(balance);
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

        const balance = await getAccountBalance();

        setCurrentAccount(account);
        setAccountBalance(balance);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkConnectedWallet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>Connect Wallet</button>
        <p>{currentAccount}</p>
        <span>Balance: {accountBalance}</span>
      </header>
      <main>This is the app</main>

      <footer>My footer</footer>
    </div>
  );
}

export default App;
