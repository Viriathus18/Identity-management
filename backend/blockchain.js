// backend/blockchain.js
const crypto = require('crypto');

class Block {
    constructor(index, transactions, timestamp, previousHash = '') {
        this.index = index;
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions))
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, [], Date.now(), "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(this.chain.length, transactions, Date.now(), previousBlock.hash);
        this.chain.push(newBlock);
        return newBlock;
    }

    getAllBlocks() {
        return this.chain;
    }
}

module.exports = Blockchain;
