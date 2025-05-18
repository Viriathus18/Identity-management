// backend/routes/transaction.js
const express = require('express');
const router = express.Router();
const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

router.post('/transaction', (req, res) => {
    const { sender, receiver, amount } = req.body;

    if (!sender || !receiver || !amount) {
        return res.status(400).json({ message: "Missing transaction data" });
    }

    const block = blockchain.addBlock([{ sender, receiver, amount }]);
    res.json({ message: "Transaction added", block });
});

router.get('/blocks', (req, res) => {
    res.json(blockchain.getAllBlocks());
});

module.exports = router;
