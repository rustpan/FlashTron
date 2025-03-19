<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1bce5a9 (commit backup before add sauthentication)
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const axios = require("axios");
<<<<<<< HEAD
const cors = require("cors");
const { TronWeb } = require("tronweb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cron = require("node-cron");
=======
const express = require('express');
const mongoose = require('mongoose');
// const TronWeb = require('tronweb').default;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const axios = require('axios');
// import TronWeb from 'tronweb';
// const TronWeb = require('tronweb');
// import * as TronWeb from "tronweb";
const cors = require("cors");


const { TronWeb } = require('tronweb');
>>>>>>> d0e94ba (initial commit)
=======
const cors = require("cors");
const { TronWeb } = require("tronweb");
>>>>>>> 1bce5a9 (commit backup before add sauthentication)

dotenv.config();
const app = express();
app.use(express.json());
<<<<<<< HEAD
app.use(cors({ origin: "http://localhost:3001" }));

=======
app.use(cors({ origin: "http://localhost:3001" })); // Allow frontend
<<<<<<< HEAD
>>>>>>> d0e94ba (initial commit)
=======

>>>>>>> 1bce5a9 (commit backup before add sauthentication)
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

<<<<<<< HEAD
const blacklistedTokens = new Set();

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  wallet: {
    balance: [
      {
        token: String,
        amount: Number,
      },
    ],
    address: String,
    privateKey: String,
  },
=======
const WalletSchema = new mongoose.Schema({
  currency: String,
  address: String,
  privateKey: String,
>>>>>>> 1bce5a9 (commit backup before add sauthentication)
});

const TransactionSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  sender: String,
  receiver: String,
  amount: Number,
  currency: String,
  status: String,
  expiry: Date,
  txHash: String,
  verification_link: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

<<<<<<< HEAD
const User = mongoose.model("User", UserSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);
const USDT_CONTRACT = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs"; // Sasta Testnet USDT contract address
const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
});

  const getUSDTBalance = async (address) => {
    try {
      const contract = await tronWeb.contract().at(USDT_CONTRACT);
      const balance = await contract.methods.balanceOf(address).call();
      console.log(`USDT Balance: ${balance / 1e6} USDT`);
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  };

  const getTRXBalance = async (address) => {
    try {
      const balance = await tronWeb.trx.getBalance(address);
      console.log(`TRX Balance: ${balance / 1e6} TRX`);
    } catch (error) {
      console.error("Error fetching TRX balance:", error);
    }
  };

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const actualToken = token.split(" ")[1];
  if (blacklistedTokens.has(actualToken)) {
    return res.status(401).json({ error: "Token has been invalidated. Please log in again." });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};


const algorithm = "aes-256-cbc";
const secret = process.env.SECRET_KEY; // Replace with a secure key
const key = crypto.scryptSync(secret, "salt", 32); // Derives a 32-byte key
const iv = crypto.randomBytes(16); // Generates a random 16-byte IV

function encryptPrivateKey(privateKey) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Store IV with encrypted data
}

function decryptPrivateKey(encryptedData) {
  const [ivHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// const encryptPrivateKey = (privateKey, secret) => {
//   const cipher = crypto.createCipher("aes-256-cbc", secret);
//   let encrypted = cipher.update(privateKey, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// };

// const decryptPrivateKey = (encryptedPrivateKey, secret) => {
//   const decipher = crypto.createDecipher("aes-256-cbc", secret);
//   let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// };


const invalidateExpiredTransactions = async () => {
  try {
    const now = new Date();
    const result = await Transaction.updateMany(
      { status: "Pending", expiry: { $lt: now } },
      { $set: { status: "Expired" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Marked ${result.modifiedCount} transactions as Expired.`);
    } else {
      console.log("⏳ No expired transactions found.");
    }
  } catch (error) {
    console.error("❌ Error updating transactions:", error);
  }
};


// Function to update transaction statuses
const updateTransactionStatuses = async () => {
  try {
    console.log("Checking pending transactions...");

    // Fetch all pending transactions from DB
    const pendingTransactions = await Transaction.find({status: "OnChain Pending"});
    console.log(pendingTransactions);

    for (let tx of pendingTransactions) {
      try {
        // https://shastapi.tronscan.org/api/transaction-info?hash=2ce38d2790aa2403f9b9f2dcead2bc2c68f0ed63c6be0439b80fd69560c183a7
        const response = await axios.get(`https://shastapi.tronscan.org/api/transaction-info?hash=${tx.txHash}`);

        if (response.data.confirmed) {
          tx.status = "Completed";
          tx.updated_at = new Date();
          console.log("TXUPDATED =>",tx);
          await tx.save();
        }
      } catch (error) {
        console.error(`Error checking transaction ${tx.txHash}:`, error.message);
        console.log(`Error checking transaction ${tx.txHash}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Error fetching pending transactions:", error.message);
    console.log("Error fetching pending transactions:", error.message);
  }
};

// Run the cron job every 5 Seconds
cron.schedule("*/5 * * * * *", updateTransactionStatuses, {
  scheduled: true,
  timezone: "UTC",
});

// Run the cron job every hour
cron.schedule("0 * * * *", invalidateExpiredTransactions, {
  scheduled: true,
  timezone: "UTC",
});



console.log("🚀 Transaction status cron job scheduled every 1 minutes.");


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ error: "Username already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  const account = await tronWeb.createAccount();
  const encryptedPrivateKey = encryptPrivateKey(account.privateKey);
  user.wallet = { balance: [], address: account.address.base58, privateKey: encryptedPrivateKey };
  const result = await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid username or password" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});


app.post("/logout", authenticate, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  blacklistedTokens.add(token);
  res.json({ message: "Logged out successfully" });
});
// app.post("/generate_wallet", authenticate, async (req, res) => {
//   const { currency } = req.body;
//   if (currency !== "USDT") return res.status(400).json({ error: "Unsupported currency" });
//   const user = await User.findById(req.userId);
//   if (!user) return res.status(404).json({ error: "User not found" });
//   if (user.wallet && user.wallet.address) return res.status(400).json({ error: "Wallet already exists" });
//   const account = await tronWeb.createAccount();
//   const hashedKey = await bcrypt.hash(account.privateKey, 10);
//   user.wallet = { currency, address: account.address.base58, privateKey: hashedKey };
//   await user.save();
//   res.json({ address: account.address.base58 });
// });

app.post("/create_flash_transaction", authenticate, async (req, res) => {
  const { receiver, amount, currency } = req.body;
  const user = await User.findById(req.userId);
  if (!user || !user.wallet.address) return res.status(400).json({ error: "User wallet not found" });
  const expiry = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
  const transaction = new Transaction({
    id: uuidv4(),
    sender: user.wallet.address,
    receiver,
    amount,
    currency,
    status: "Pending",
    expiry,
    txHash: null,
    created_at: new Date(),
    updated_at: new Date(),
  });
  await transaction.save();
  res.json({ message: "Flash transaction created", transaction });
});

app.post("/execute_transaction", authenticate, async (req, res) => {
  const { tx_id } = req.body;
  // res.status(200).json({ success:true });
  const transaction = await Transaction.findOne({ id: tx_id });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  const user = await User.findById(req.userId);
  if (!user || !user.wallet) return res.status(400).json({ error: "User wallet not found" });
  try {
  const decryptedPrivateKey = decryptPrivateKey(user.wallet.privateKey);
  const tronWeb = new TronWeb({
    fullHost: "https://api.shasta.trongrid.io",
    privateKey: decryptedPrivateKey, 
  });
  if (transaction.currency === "TRX") {
    const balance = await tronWeb.trx.getBalance(user.wallet.address);
    if (balance < transaction.amount * 1e6) {
      return res.status(400).json({ error: "Insufficient TRX balance" });
    }
    const tx = await tronWeb.trx.sendTransaction(transaction.receiver, transaction.amount * 1e6, decryptedPrivateKey);
    transaction.txHash = tx.txid;
    transaction.verification_link = `https://shasta.tronscan.org/#/transaction/${tx.txid}`;
    transaction.status = "OnChain Pending";
    transaction.updated_at = new Date();
    await transaction.save();
    res.json({ message: "Transaction executed", txHash: tx.txid });

  } else if (transaction.currency === "USDT") {
    const contract = await tronWeb.contract().at("TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs");
    const balance = await contract.methods.balanceOf(user.wallet.address).call();
    if (balance < transaction.amount * 1e6) {
      return res.status(400).json({ error: "Insufficient TRX balance" });
    }
    const tx = await contract.methods.transfer(transaction.receiver, transaction.amount * 1e6).send({
      from: user.wallet.address,
      privateKey: decryptedPrivateKey
    });
    transaction.txHash = tx;
    transaction.verification_link = `https://shasta.tronscan.org/#/transaction/${tx}`;
    transaction.status = "OnChain Pending";
    transaction.updated_at = new Date();
    await transaction.save();
    res.json({ message: "Transaction executed", txHash: tx });
  }

  } catch (error) {
    res.status(500).json({ error: "Transaction failed", details: error.message });
  }
});

app.get("/verify_transaction/:tx_id", authenticate, async (req, res) => {
  const { tx_id } = req.params;
  const transaction = await Transaction.findOne({ id: tx_id });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  if (!transaction.txHash) return res.status(400).json({ error: "Transaction has not been executed yet" });
  try {
    const response = await axios.get(`https://api.shasta.trongrid.io/v1/transactions/${transaction.txHash}`);
    res.json({ status: response.data.data.length > 0 ? response.data.data[0].ret[0].contractRet : "NOT_FOUND", transaction });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction details", details: error.message });
  }
});

app.get("/transactions", authenticate, async (req, res) => {
  try {
    const wallet_address = (await User.findById(req.userId)).wallet.address
    const transactions = await Transaction.find({ 
      $or: [{ sender: wallet_address }, { receiver: wallet_address }] 
    });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions", details: error.message });
  }
});

app.get("/wallet", authenticate, async (req, res) => {
  try{
    const user = await User.findById(req.userId);
  if (!user || !user.wallet) return res.status(400).json({ error: "User wallet not found" });
  


    const decryptedPrivateKey = decryptPrivateKey(user.wallet.privateKey, process.env.SECRET_KEY);
    const tronWeb = new TronWeb({
      fullHost: "https://api.shasta.trongrid.io",
      privateKey: decryptedPrivateKey, 
    });
    const balance = await tronWeb.trx.getBalance(user.wallet.address);
    console.log("BALANCE",balance);
    console.log("Owner Address:", tronWeb.defaultAddress.base58);
    const contract = await tronWeb.contract().at("TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs");
    // console.log("CONTRACT  =>",contract.methods.balanceOf("TGqxVZkajMSsKQDLFVzVGvCymFYerJh72h").call());

    let usdtBalance = 0;
    try {
      usdtBalance = await contract.methods.balanceOf(user.wallet.address).call();
      } catch (error) {
        console.log("Owner Address:", tronWeb.defaultAddress.base58);

        console.error("Error fetching USDT balance:", error);
    }

    console.log("BALANCEUSDT =>",usdtBalance);
    res.json({ address: user.wallet.address, balance: {TRX:Number(balance),USDT:Number(usdtBalance)} });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balance", details: error.message });
=======
const Wallet = mongoose.model("Wallet", WalletSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
});

// Generate Wallet
app.post("/generate_wallet", async (req, res) => {
  const { currency } = req.body;
  if (currency !== "USDT") {
    return res.status(400).json({ error: "Unsupported currency" });
  }

  const account = await tronWeb.createAccount();
  const hashedKey = await bcrypt.hash(account.privateKey, 10);
  const wallet = new Wallet({ currency, address: account.address.base58, privateKey: hashedKey });
  await wallet.save();

  res.json({ address: account.address.base58 });
});

// Create Flash Transaction
app.post("/create_flash_transaction", async (req, res) => {
  const { sender, receiver, amount, currency } = req.body;
  const expiry = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

  const transaction = new Transaction({
    id: uuidv4(),
    sender,
    receiver,
    amount,
    currency,
    status: "Pending",
    expiry,
    txHash: null,
    created_at: new Date(),
    updated_at: new Date(),
  });

  await transaction.save();
  res.json({ message: "Flash transaction created", transaction });
});

// Execute Transaction (Send USDT on TRON Testnet)
app.post("/execute_transaction", async (req, res) => {
  const { tx_id } = req.body;
  const transaction = await Transaction.findOne({ id: tx_id });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  if (transaction.status !== "Valid") return res.status(400).json({ error: "Transaction is not valid" });

  const senderWallet = await Wallet.findOne({ address: transaction.sender });
  if (!senderWallet) return res.status(400).json({ error: "Sender wallet not found" });

  const privateKey = await bcrypt.compare(process.env.SECRET_KEY, senderWallet.privateKey)
    ? process.env.TRON_PRIVATE_KEY
    : null;
  if (!privateKey) return res.status(403).json({ error: "Invalid private key" });

  try {
    const tx = await tronWeb.trx.sendTransaction(transaction.receiver, transaction.amount * 1e6, privateKey);
    transaction.txHash = tx.txid;
    transaction.verification_link = `https://shasta.tronscan.org/#/transaction/${tx.txid}`;
    transaction.status = "Completed";
    transaction.updated_at = new Date();
    await transaction.save();

    res.json({ message: "Transaction executed", txHash: tx.txid });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed", details: error.message });
>>>>>>> 1bce5a9 (commit backup before add sauthentication)
  }
});

<<<<<<< HEAD
app.listen(3000, () => console.log(`Server running on port 3000, using TRON testnet`));
=======
// Validate Transaction using TronScan Testnet API
app.get("/verify_transaction/:tx_id", async (req, res) => {
  const { tx_id } = req.params;
  const transaction = await Transaction.findOne({ id: tx_id });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });

  if (!transaction.txHash) return res.status(400).json({ error: "Transaction has not been executed yet" });

  try {
    const response = await axios.get(`https://api.shasta.trongrid.io/v1/transactions/${transaction.txHash}`);
    const txStatus = response.data.data.length > 0 ? response.data.data[0].ret[0].contractRet : "NOT_FOUND";

    res.json({ status: txStatus, transaction });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction details", details: error.message });
  }
});

// Fetch All Transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions", details: error.message });
  }
});

<<<<<<< HEAD

app.listen(3000, () => console.log('Server running on port 3000, using TRON testnet'));
>>>>>>> d0e94ba (initial commit)
=======
// Start Server
app.listen(3000, () => console.log(`Server running on port ${3000}, using TRON testnet`));
>>>>>>> 1bce5a9 (commit backup before add sauthentication)
