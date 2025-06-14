import React, { useState, useEffect } from "react";
//import axios from "axios";
import transactions from "../data/mockTransactions";
import Sidebar from "./Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const statusColors = {
  Success: "text-[#b8bb26] bg-[#3c3836]",
  Failed: "text-[#fb4934] bg-[#3c3836]",
  Incomplete: "text-[#fabd2f] bg-[#3c3836]",
};

export default function Dashboard() {
  const [secureData, setSecureData] = useState(null);
  const token = localStorage.getItem("authToken");
  const [user, setUser] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/secure-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          const errorText = await res.text(); // could be HTML or plain text
          throw new Error(`Server responded with error: ${errorText}`);
        }

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setUser(data.user);
        } else {
          throw new Error("Expected JSON response but received a different format.");
        }
      } catch (err) {
        console.error("Error fetching secure data:", err.message);
      }
    };

    fetchData();
  }, [token]);


  const filteredTransactions = transactions
    .filter(
      (tx) =>
        (typeFilter === "" || tx.type === typeFilter) &&
        (statusFilter === "" || tx.status === statusFilter) &&
        (startDate === "" || new Date(tx.date) >= new Date(startDate)) &&
        (endDate === "" || new Date(tx.date) <= new Date(endDate))
    )
    .sort((a, b) => {
      const valA = new Date(a[sortField]);
      const valB = new Date(b[sortField]);
      return sortAsc ? valA - valB : valB - valA;
    });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const chartData = [...filteredTransactions]
    .reduce((acc, tx) => {
      const date = tx.date.split("T")[0];
      const found = acc.find((item) => item.date === date);
      if (found) found.amount += parseFloat(tx.amount);
      else acc.push({ date, amount: parseFloat(tx.amount) });
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen flex bg-[#282828] text-[#ebdbb2]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* <h2 className="text-3xl font-bold mb-1">Hey there, Ankit!</h2> */}
              <h2 className="text-3xl font-bold mb-1">
                Hey there, {user ? user.name : "Loading..."}!
              </h2>
              <p className="text-[#a89984]">Welcome back, we’re happy to have you here!</p>
            </div>
            {/* <img
              src="./img1.jpeg"
              alt="User Avatar"
              className="w-12 h-12 rounded-full shadow-md"
            /> */}
          </div>

          <div className="bg-[#3c3836] p-6 rounded-2xl shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>
            <div className="flex gap-4 flex-wrap mb-4">
              <select
                className="p-2 border border-[#504945] rounded-md bg-[#504945] text-[#ebdbb2]"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Sent">Sent</option>
                <option value="Received">Received</option>
                {/* <option value="Converted">Converted</option> */}
              </select>

              <select
                className="p-2 border border-[#504945] rounded-md bg-[#504945] text-[#ebdbb2]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                {/* <option value="Incomplete">Incomplete</option> */}
              </select>

              <input
                type="date"
                className="p-2 border border-[#504945] rounded-md bg-[#504945] text-[#ebdbb2]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="p-2 border border-[#504945] rounded-md bg-[#504945] text-[#ebdbb2]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button
                className="px-4 py-2 border rounded-md bg-[#228681] hover:bg-[#fabd2f] text-[#282828]"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Sort by Date ({sortAsc ? "Oldest" : "Newest"})
              </button>
            </div>
          </div>

          <div className="bg-[#3c3836] p-6 rounded-2xl shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Transactions Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#504945" />
                <XAxis dataKey="date" stroke="#ebdbb2" />
                <YAxis stroke="#ebdbb2" />
                <Tooltip contentStyle={{ backgroundColor: "#3c3836", color: "#ebdbb2" }} />
                <Line type="monotone" dataKey="amount" stroke="#83a598" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#3c3836] p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#3c3836] text-[#ebdbb2] uppercase">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Activity</th>
                    <th className="px-4 py-3">People</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-[#ebdbb2]">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-[#504945] hover:bg-[#504945]">
                      <td className="px-4 py-3 font-medium">{tx.type}</td>
                      <td className="px-4 py-3">{tx.amount}</td>
                      <td className="px-4 py-3">{tx.method}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-xl text-xs font-medium ${statusColors[tx.status]}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{tx.activity}</td>
                      <td className="px-4 py-3">{tx.person}</td>
                      <td className="px-4 py-3 text-[#a89984]">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginatedTransactions.length === 0 && (
                <p className="text-center py-4 text-[#a89984]">No transactions found.</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-[#504945] text-[#ebdbb2] rounded-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-[#a89984]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-[#504945] text-[#ebdbb2] rounded-md"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}