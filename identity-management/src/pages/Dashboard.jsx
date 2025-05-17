// import React, { useState } from "react";
// import transactions from "../data/mockTransactions";
// import Sidebar from "./Sidebar";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const statusColors = {
//   Success: "text-green-600 bg-green-100",
//   Failed: "text-red-600 bg-red-100",
//   Incomplete: "text-yellow-600 bg-yellow-100",
// };

// export default function Dashboard() {
//   const [typeFilter, setTypeFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [sortField, setSortField] = useState("date");
//   const [sortAsc, setSortAsc] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const filteredTransactions = transactions
//     .filter(
//       (tx) =>
//         (typeFilter === "" || tx.type === typeFilter) &&
//         (statusFilter === "" || tx.status === statusFilter) &&
//         (startDate === "" || new Date(tx.date) >= new Date(startDate)) &&
//         (endDate === "" || new Date(tx.date) <= new Date(endDate))
//     )
//     .sort((a, b) => {
//       const valA = new Date(a[sortField]);
//       const valB = new Date(b[sortField]);
//       return sortAsc ? valA - valB : valB - valA;
//     });

//   const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
//   const paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const chartData = [...filteredTransactions]
//     .reduce((acc, tx) => {
//       const date = tx.date.split("T")[0];
//       const found = acc.find((item) => item.date === date);
//       if (found) {
//         found.amount += parseFloat(tx.amount);
//       } else {
//         acc.push({ date, amount: parseFloat(tx.amount) });
//       }
//       return acc;
//     }, [])
//     .sort((a, b) => new Date(a.date) - new Date(b.date));

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-3xl font-bold mb-1">Hey there, Adarsh Kumar Tiwary!</h2>
//               <p className="text-gray-500">Welcome back, we’re happy to have you here!</p>
//             </div>
//             <img
//               src="./user-avatar.png"
//               alt="User Avatar"
//               className="w-12 h-12 rounded-full shadow-md"
//             />
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
//             <h3 className="text-xl font-semibold mb-4">Filters</h3>
//             <div className="flex gap-4 flex-wrap mb-4">
//               <select
//                 className="p-2 border rounded-md"
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 <option value="">All Types</option>
//                 <option value="Sent">Sent</option>
//                 <option value="Received">Received</option>
//                 <option value="Converted">Converted</option>
//               </select>

//               <select
//                 className="p-2 border rounded-md"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="">All Status</option>
//                 <option value="Success">Success</option>
//                 <option value="Failed">Failed</option>
//                 <option value="Incomplete">Incomplete</option>
//               </select>

//               <input
//                 type="date"
//                 className="p-2 border rounded-md"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//               <input
//                 type="date"
//                 className="p-2 border rounded-md"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />

//               <button
//                 className="px-4 py-2 border rounded-md bg-blue-500 text-white"
//                 onClick={() => setSortAsc(!sortAsc)}
//               >
//                 Sort by Date ({sortAsc ? "Oldest" : "Newest"})
//               </button>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
//             <h3 className="text-xl font-semibold mb-4">Transactions Over Time</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-lg">
//             <h3 className="text-xl font-semibold mb-4">Transactions</h3>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm text-left">
//                 <thead className="bg-gray-50 text-gray-700 uppercase">
//                   <tr>
//                     <th className="px-4 py-3">Type</th>
//                     <th className="px-4 py-3">Amount</th>
//                     <th className="px-4 py-3">Payment Method</th>
//                     <th className="px-4 py-3">Status</th>
//                     <th className="px-4 py-3">Activity</th>
//                     <th className="px-4 py-3">People</th>
//                     <th className="px-4 py-3">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-gray-700">
//                   {paginatedTransactions.map((tx) => (
//                     <tr key={tx.id} className="border-t hover:bg-gray-50">
//                       <td className="px-4 py-3 font-medium">{tx.type}</td>
//                       <td className="px-4 py-3">{tx.amount}</td>
//                       <td className="px-4 py-3">{tx.method}</td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-2 py-1 rounded-xl text-xs font-medium ${statusColors[tx.status]}`}
//                         >
//                           {tx.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">{tx.activity}</td>
//                       <td className="px-4 py-3">{tx.person}</td>
//                       <td className="px-4 py-3 text-gray-500">{tx.date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {paginatedTransactions.length === 0 && (
//                 <p className="text-center py-4 text-gray-500">No transactions found.</p>
//               )}
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded-md"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => prev - 1)}
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-700">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded-md"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [user, setUser] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions/blocks");
        setBlocks(response.data);
      } catch (error) {
        console.error("Failed to fetch blockchain data:", error);
      }
    };
    fetchBlockchain();
  }, []);

  const sendTransaction = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/transactions/transaction",
        {
          sender: user?.email || "sender@example.com",
          receiver: "receiver@example.com",
          amount: 100,
          description: "Testing blockchain transaction",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Transaction submitted successfully!");
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send transaction");
    }
  };

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
              <h2 className="text-3xl font-bold mb-1">Hey there, Ankit!</h2>
              <p className="text-[#a89984]">Welcome back, we’re happy to have you here!</p>
            </div>
            <img
              src="./user-avatar.png"
              alt="User Avatar"
              className="w-12 h-12 rounded-full shadow-md"
            />
          </div>

          <button
            onClick={sendTransaction}
            className="px-4 py-2 mb-6 bg-[#458588] text-[#ebdbb2] rounded hover:bg-[#83a598]"
          >
            Test Blockchain Transaction
          </button>

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
                <option value="Converted">Converted</option>
              </select>

              <select
                className="p-2 border border-[#504945] rounded-md bg-[#504945] text-[#ebdbb2]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Incomplete">Incomplete</option>
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

          <div className="bg-[#3c3836] p-6 rounded-2xl shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Blockchain Blocks</h3>
            <div className="space-y-2 text-sm">
              {blocks.map((block, i) => (
                <div key={i} className="border border-[#504945] rounded p-3">
                  <p><strong>Index:</strong> {block.index}</p>
                  <p><strong>Sender:</strong> {block.data?.sender}</p>
                  <p><strong>Receiver:</strong> {block.data?.receiver}</p>
                  <p><strong>Amount:</strong> {block.data?.amount}</p>
                  <p><strong>Timestamp:</strong> {block.timestamp}</p>
                </div>
              ))}
            </div>
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
