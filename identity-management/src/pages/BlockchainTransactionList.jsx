import React, { useState, useEffect, useRef } from 'react';
import transactions from "../data/mockTransactions";
import { sha256 } from 'js-sha256';

const calculateHash = (block) => {
  return sha256(
    block.id +
    block.type +
    block.amount +
    block.method +
    block.status +
    block.activity +
    block.person +
    block.date +
    block.previousHash
  );
};

const getRandomHash = () => {
  return sha256(Math.random().toString());
};

const BlockchainTransactionList = () => {
  const [chain, setChain] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tampered, setTampered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setChain((prev) => {
        if (currentIndex >= transactions.length) {
          clearInterval(intervalRef.current);
          return prev;
        }

        const tx = transactions[currentIndex];
        const previousHash = prev.length === 0 ? '0' : prev[prev.length - 1].hash;

        const block = {
          ...tx,
          previousHash,
          status: 'Success', // force initial status
        };
        block.hash = calculateHash(block);

        setCurrentIndex((i) => i + 1);
        return [...prev, block];
      });
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const tamperBlockchain = () => {
    if (tampered || chain.length === 0) return;

    const tamperedIndex = Math.floor(Math.random() * chain.length);
    const newChain = [...chain];

    // Tamper with selected block
    newChain[tamperedIndex] = {
      ...newChain[tamperedIndex],
      status: 'Failed',
      activity: newChain[tamperedIndex].activity + ' (Tampered)',
      hash: calculateHash({ ...newChain[tamperedIndex], status: 'Failed' }),
    };

    // Randomize all downstream blocks
    for (let i = tamperedIndex + 1; i < newChain.length; i++) {
      newChain[i] = {
        ...newChain[i],
        status: 'Failed',
        previousHash: getRandomHash(),
        hash: calculateHash({
          ...newChain[i],
          status: 'Failed',
          previousHash: getRandomHash(),
        }),
      };
    }

    setChain(newChain);
    setTampered(true);
  };

  const isBlockValid = (block, index, chain) => {
    if (index === 0) return block.previousHash === '0';
    return block.previousHash === chain[index - 1].hash;
  };

  return (
    <div className="p-4">
      <button
        onClick={tamperBlockchain}
        disabled={tampered}
        className="mb-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
      >
        Tamper Blockchain
      </button>

      <div className="space-y-4">
        {chain.map((block, index) => {
          const valid = isBlockValid(block, index, chain);

          return (
            <div
              key={block.id}
              className={`p-4 rounded-lg shadow-md border-2 transition-all duration-300 ${
                valid ? 'border-green-500' : 'border-red-500 bg-red-100'
              }`}
            >
              <p><strong>ID:</strong> {block.id}</p>
              <p><strong>Activity:</strong> {block.activity}</p>
              <p><strong>Amount:</strong> {block.amount}</p>
              <p><strong>Status:</strong> {block.status}</p>
              <p><strong>Method:</strong> {block.method}</p>
              <p><strong>Date:</strong> {block.date}</p>
              <p><strong>Hash:</strong> {block.hash.slice(0, 20)}...</p>
              <p><strong>Prev Hash:</strong> {block.previousHash.slice(0, 20)}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlockchainTransactionList;
