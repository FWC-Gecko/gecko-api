const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const gasPrice = async () => {
  const { gasPrice } = await provider.getFeeData();

  return gasPrice.toNumber() / Math.pow(10, 9);
};

module.exports = gasPrice;
