import "./App.css";

import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { useProStakersContract } from "./hooks/useProStakersContract";
import { fromFetch } from "rxjs/fetch";
import { EventType, IEvent } from "./interfaces/Event";

function App() {


  const [ currentAccount, setCurrentAccount ] = useState("");
  const [ accountBalance, setAccountBalance ] = useState<string>("");
  const [ depositAmount, setDepositAmount ] = useState<string>("");
  const [ withdrawAmount, setWithdrawAmount ] = useState<string>("");
  const [ events, setEvents ] = useState<IEvent[]>([]);

  const cleanState = () => {
    setCurrentAccount("");
    setAccountBalance("");
    setDepositAmount("");
    setWithdrawAmount("");
  }

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
      getStakedBalance();
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
        getStakedBalance();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkConnectedWallet();
  }, [ events ]);

  useEffect(() => {
    const subscription = fromFetch(`${import.meta.env.VITE_NEST_BASE_URL}/events`).subscribe(
      (response) => response.json().then((data) => setEvents(data))
    );

    return () => subscription.unsubscribe();
  }, [ stakedBalance ]);

  useEffect(() => {
    const onNewEvent = () => {
      getStakedBalance();
    };



    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts: string[]) {
      if (accounts.length === 0) {
        cleanState()
        return
      }

      if (accounts[0] !== currentAccount) {
        checkConnectedWallet()
      }
    }

    let proStakersContract: ethers.Contract;

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
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
    <div className="">
      <header className="navbar p-8">
        <div className="flex flex-col w-full items-start">
          <p>
            <strong>Account: </strong>
            {currentAccount || "Not Connected!"}
          </p>
          {currentAccount && (
            <>
              <span>
                <strong>Total Balance: </strong>{`${accountBalance} ETH`}
              </span>
              <span>
                <strong>Staked Amount: </strong>{`${stakedBalance} ETH`}
              </span>
            </>
          )}
        </div>
        <button disabled={!!currentAccount} className="btn" onClick={connectWallet}>
          {currentAccount ? 'Wallet Connected!' : 'Connect Wallet'}
        </button>
      </header>
      <div className="divider">Pro Stakers</div>
      <main className="flex flex-col">
        <section className="flex justify-around p-8">
          <div className="card">
            <form className="form-control">
              <label className="label">
                <span className="label-text">Deposit amount:</span>
              </label>
              <label className="input-group mb-2">
                <input
                  type="text"
                  placeholder="0.01"
                  className="input input-bordered"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <span>ETH</span>
              </label>
            </form>
            <button
              className="btn btn-primary"
              type={"submit"}
              onClick={(e) => {
                e.preventDefault();
                deposit(depositAmount);
              }}
            >
              Deposit
            </button>
          </div>
          <div className="card">
            <form>
              <label className="label">
                <span className="label-text">Withdraw amount:</span>
              </label>
              <label className="input-group mb-2">
                <input
                  type="text"
                  placeholder="0.01"
                  className="input input-bordered"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <span> ETH</span>
              </label>
            </form>
            <button
              className="btn btn-secondary"
              type={"submit"}
              onClick={(e) => {
                e.preventDefault();
                withdraw(withdrawAmount);
              }}
            >
              Withdraw
            </button>
          </div>
        </section>
        <section className="overflow-x-auto mt-8">
          <table className="table w-full">
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
