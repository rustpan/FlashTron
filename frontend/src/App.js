import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.dismiss();

export default function FlashWallet() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [wallet, setWallet] = useState({
    "address": "",
    "balance": {
        "TRX": 0,
        "USDT": 0
    }
});
  const [transactions, setTransactions] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amountUsdt, setAmountUsdt] = useState("");
  const [receiverUsdt, setReceiverUsdt] = useState("");
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    if (token) {
      fetchWallet();
      fetchTransactions();
    }

    const interval = setInterval(() => {
      fetchWallet();
      fetchTransactions();
    }, 10000); // Calls every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [token]);

  const handleAuth = async (endpoint) => {
    try {
      const res = await axios.post(`http://localhost:3000/${endpoint}`, { username, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      await setWallet(res.data.wallet);
      console.log("Success");
      console.log(token);
      console.log(wallet);
      await fetchWallet(); // Fetch wallet immediately after authentication
      toast.success("Authentication Successful");
      window.location.reload();
    } catch (error) {
      toast.error("Authentication Failed");
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get("http://localhost:3000/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("e",res.data);
      await setWallet(res.data);
      console.log("w",wallet);
    } catch (error) {
      toast.error("Error Fetching Wallet");
    }
  };


  const createTransactionTrx = async () => {
    try {
      await axios.post(
        "http://localhost:3000/create_flash_transaction",
        { receiver, amount, currency: "TRX" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
      toast.success("Transaction Created Successfully");
    } catch (error) {
      toast.error("Transaction Failed");
    }
  };

  const createTransactionUsdt = async () => {
    try {
      await axios.post(
        "http://localhost:3000/create_flash_transaction",
        { receiver:receiverUsdt, amount:amountUsdt, currency: "USDT" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
      toast.success("Transaction Created Successfully");
    } catch (error) {
      toast.error("Transaction Failed");
    }
  };

  const executeTransaction = async (tx_id) => {
    try {
      await axios.post(
        "http://localhost:3000/execute_transaction",
        { tx_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
      toast.success("Transaction Executed Successfully");
    } catch (error) {
      toast.error("Transaction Execution Failed");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      toast.error("Error Fetching Transactions");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("token");
    await setToken(null);
    await setWallet({ address: "", balance: { TRX: 0, USDT: 0 } });
    toast.success("Logged out successfully");
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center">Flash Wallet</h1>
      {token && (
        <>

  <Button onClick={logout} className="mt-4 w-full bg-red-600 text-white">Logout</Button>
  </>
)}

      {!token ? (
        <Card className="mt-6 p-4">
          <h2 className="text-xl font-bold">Login / Register</h2>
          <Input placeholder="Username" className="mt-2" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Password" type="password" className="mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={() => handleAuth("login")} className="mt-4 w-full bg-blue-600 text-white">Login</Button>
          <Button onClick={() => handleAuth("register")} className="mt-2 w-full bg-green-600 text-white">Register</Button>
        </Card>
      ) : (
        <>
          {wallet && <><p className="mt-2 text-center">Wallet: {wallet.address}</p>
          <p className="mt-2 text-center">Balance: {wallet.balance.TRX/1e6} TRX | {wallet.balance.USDT/1e6} USDT</p></>}
          <Card className="mt-6 p-4">
            <h2 className="text-xl font-bold">Send TRX </h2>
            <Input placeholder="Receiver Address" className="mt-2" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
            <Input placeholder="Amount" className="mt-2" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button onClick={createTransactionTrx} className="mt-4 w-full bg-green-600 text-white">Send</Button>
          </Card>
          <Card className="mt-6 p-4">
            <h2 className="text-xl font-bold">Send USDT </h2>
            <Input placeholder="Receiver Address" className="mt-2" value={receiverUsdt} onChange={(e) => setReceiverUsdt(e.target.value)} />
            <Input placeholder="Amount" className="mt-2" type="number" value={amountUsdt} onChange={(e) => setAmountUsdt(e.target.value)} />
            <Button onClick={createTransactionUsdt} className="mt-4 w-full bg-green-600 text-white">Send</Button>
          </Card>
          <h2 className="mt-6 text-xl font-bold">Transaction History</h2>
          <div className="mt-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4 mb-2">
                <br></br>
                <CardContent >
                  <p><strong>{tx.sender}</strong> → <strong>{tx.receiver}</strong></p>
                  <p>{tx.amount} {tx.currency} | 
                      &nbsp;&nbsp;
                  <span className={tx.status === "Valid" ? "text-green-500" : "text-red-500"}>{tx.status === "Completed" ? (tx.sender === wallet.address ? "Sent" : "Received"):tx.status}</span>   |  &nbsp;&nbsp;
                  
{tx.verification_link  && (
                    <a href={tx.verification_link} target="_blank" rel="noopener noreferrer">
                    Verify Transaction
                 </a>
                  )}
                  {/* <br></br>
                  <a href={`https://shastapi.tronscan.org/api/transaction-info?hash=${tx.txHash}`}  target="_blank" rel="noopener noreferrer">
                  https://shastapi.tronscan.org/api/transaction-info?hash={tx.txHash}
                    </a> */}
{tx.status === "Pending" && tx.sender === wallet.address && (
                    <Button onClick={() => executeTransaction(tx.id)} className="mt-2 w-full bg-orange-600 text-white">Execute</Button>
                  )}
</p>


                 


                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
