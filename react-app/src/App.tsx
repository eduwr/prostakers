import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import { useProStakersContract } from "./hooks/useProStakersContract";
import { fromFetch } from "rxjs/fetch";
import { EventType, IEvent } from "./interfaces/Event";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const {
    deposit,
    withdraw,
    getStakedBalance,
    stakedBalance,
    contractABI,
    address: contractAddress,
  } = useProStakersContract();

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
    getStakedBalance();
  }, [events]);

  useEffect(() => {
    const subscription = fromFetch("http://localhost:3001/events").subscribe(
      (response) => response.json().then((data) => setEvents(data))
    );

    return () => subscription.unsubscribe();
  }, [stakedBalance]);

  useEffect(() => {
    const onNewEvent = () => {
      getStakedBalance();
    };

    let proStakersContract: ethers.Contract;

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      proStakersContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      Object.values(EventType).forEach((type) => {
        proStakersContract.on(type, onNewEvent);
      });
    }

    return () => {
      if (proStakersContract) {
        Object.values(EventType).forEach((type) => {
          proStakersContract.off(type, onNewEvent);
        });
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>Connect Wallet</button>
        <p>{currentAccount}</p>
        <span>Balance: {accountBalance}</span>
        <span>Staked: {stakedBalance}</span>
      </header>
      <main>
        <form>
          <label>Deposit:</label>
          <input
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <span> ETH</span>
        </form>
        <button
          type={"submit"}
          onClick={(e) => {
            e.preventDefault();
            deposit(depositAmount);
          }}
        >
          Deposit Amount
        </button>

        <form>
          <label>Withdraw:</label>
          <input
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <span> ETH</span>
        </form>
        <button
          type={"submit"}
          onClick={(e) => {
            e.preventDefault();
            withdraw(withdrawAmount);
          }}
        >
          Withdraw
        </button>

        <section>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>type</th>
                <th>from</th>
                <th>to</th>
                <th>amount</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                return (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.type}</td>
                    <td>{event.from}</td>
                    <td>{event.to}</td>
                    <td>{event.amount} ETH</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
