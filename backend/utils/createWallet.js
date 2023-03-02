const ethers = require('ethers');

const createWallet = () => ethers.Wallet.createRandom();

module.exports = createWallet;
