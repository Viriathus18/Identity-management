import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import transactionsData from "../data/mockTransactions";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Wallets = () => {
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState(transactionsData);
  const navigate = useNavigate();

  const currentBalance = transactions.reduce((acc, tx) => {
    const amt = parseFloat(tx.amount);
    return tx.type === "Received" ? acc + amt : acc - amt;
  }, 0);

  const chartData = [...transactions]
    .reduce((acc, tx) => {
      const date = tx.date.split("T")[0];
      const found = acc.find((item) => item.date === date);
      if (found) {
        found.amount += parseFloat(tx.amount);
      } else {
        acc.push({ date, amount: parseFloat(tx.amount) });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleTransaction = (type) => {
    if (!amount || amount <= 0) return;

    const newTransaction = {
      id: Date.now().toString(),
      type: type === "Deposit" ? "Received" : "Sent",
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      status: "Completed",
      sender: type === "Deposit" ? "External" : "You",
      receiver: type === "Deposit" ? "You" : "External",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setAmount(0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wallet Overview</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <p className="text-xl">Current Wallet Balance:</p>
        <p className="text-3xl font-bold text-green-600">${currentBalance.toFixed(2)}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Transactions Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Make a Transaction</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
          />
          <button
            onClick={() => handleTransaction("Deposit")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Deposit
          </button>
          <button
            onClick={() => handleTransaction("Withdraw")}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallets;
