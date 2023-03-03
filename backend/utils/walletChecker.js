const ethers = require('ethers');

const Request = require('../models/requestModel');

const { getCurrentTime, getUnixTimestamp } = require('./dateFunction');

const {
  TOKEN_FWC_ADDRESS,
  TOKEN_BUSD_ADDRESS,
  TOKEN_USDT_ADDRESS,
} = require('../constants/tokenAddress');

const erc20Abi = require('../abi/erc20.abi.json');

const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL);

const BNBAmount = 0.001;
const BNBFee = process.env.BNB_FEE;

const sendBNB = async (sender, to_address, amount, callback) => {
  const gasPrice = await provider.getGasPrice();
  sender
    .sendTransaction({
      to: to_address,
      value: ethers.utils.parseEther(amount.toString()),
      gasPrice,
    })
    .then((transaction) => {
      console.log(transaction.hash);
      if (callback) callback();
    })
    .catch((error) => {
      console.log(error);
    });
};

const sendToken = async (
  sender,
  contract_address,
  to_address,
  amount,
  callback
) => {
  const gasPrice = await provider.getGasPrice();
  const contract = new ethers.Contract(contract_address, erc20Abi, sender);
  contract
    .transfer(to_address, amount, {
      gasPrice,
    })
    .then((transaction) => {
      console.log(transaction.hash);
      if (callback) callback();
    })
    .catch((error) => {
      console.log(error);
    });
};

const walletChecker = async () => {
  const requests = await Request.find({ expired: false }).populate('wallet');

  const now = getCurrentTime();

  for (const request of requests) {
    if (now - getUnixTimestamp(request.createdAt) > 60 * 60 * 20) {
      //  Delete a request that expired after 20 mins
      Request.updateOne({ _id: request._id }, { expired: true });
      //  Send mail
    } else {
      if (request.paymentToken === 'BNB') {
        const balance = ethers.utils.formatEther(
          await provider.getBalance(request.wallet.address)
        );
        console.log('BNB', balance);
        if (request.wallet.price.BNB <= balance) {
          Request.findByIdAndUpdate(request._id, {
            expired: true,
            paid: true,
          }).then(() => {
            //  Move the money to the main wallet
            const sender = new ethers.Wallet(request.wallet.privateKey);
            const senderSigner = sender.connect(provider);
            sendBNB(
              senderSigner,
              process.env.MAIN_WALLET_ADDRESS,
              BNBAmount,
              () => {
                //  Send mail
              }
            );
          });
        }
      } else if (request.paymentToken === 'BUSD') {
        const contract = new ethers.Contract(
          TOKEN_BUSD_ADDRESS,
          erc20Abi,
          provider
        );
        const balance = ethers.utils.formatEther(
          await contract.balanceOf(request.wallet.address)
        );
        console.log('BUSD', balance);
        if (request.wallet.price.BUSD <= balance) {
          Request.updateOne(
            { _id: request._id },
            { expired: true, paid: true }
          ).then(() => {
            //  Move the money to the main wallet
            //  Send Some BNB For Gas Fee
            let sender = new ethers.Wallet(process.env.MAIN_WALLET_PRIVATEKEY);
            let senderSigner = sender.connect(provider);
            sendBNB(
              senderSigner,
              request.wallet.address,
              BNBFee.toString(),
              () => {
                //  Send Tokens To The Main Wallet
                sender = new ethers.Wallet(request.wallet.privateKey);
                senderSigner = sender.connect(provider);
                sendToken(
                  senderSigner,
                  TOKEN_BUSD_ADDRESS,
                  process.env.MAIN_WALLET_ADDRESS,
                  ethers.utils.parseUnits(balance, 18),
                  () => {
                    //  Send mail
                  }
                );
              }
            );
          });
        }
      } else if (request.paymentToken === 'USDT') {
        const contract = new ethers.Contract(
          TOKEN_USDT_ADDRESS,
          erc20Abi,
          provider
        );
        const balance = ethers.utils.formatEther(
          await contract.balanceOf(request.wallet.address)
        );
        console.log('USDT', balance);
        if (request.wallet.price.USDT <= balance) {
          Request.updateOne(
            { _id: request._id },
            { expired: true, paid: true }
          ).then(() => {
            //  Move the money to the main wallet
            //  Send Some BNB For Gas Fee
            let sender = new ethers.Wallet(process.env.MAIN_WALLET_PRIVATEKEY);
            let senderSigner = sender.connect(provider);
            sendBNB(
              senderSigner,
              request.wallet.address,
              BNBFee.toString(),
              () => {
                //  Send Tokens To The Main Wallet
                sender = new ethers.Wallet(request.wallet.privateKey);
                senderSigner = sender.connect(provider);
                sendToken(
                  senderSigner,
                  TOKEN_USDT_ADDRESS,
                  process.env.MAIN_WALLET_ADDRESS,
                  ethers.utils.parseUnits(balance, 18),
                  () => {
                    //  Send mail
                  }
                );
              }
            );
          });
        }
      } else if (request.paymentToken === 'FWC') {
        const contract = new ethers.Contract(
          TOKEN_FWC_ADDRESS,
          erc20Abi,
          provider
        );
        const balance = ethers.utils.formatUnits(
          await contract.balanceOf(request.wallet.address),
          9
        );
        console.log('FWC', balance);
        if (request.wallet.price.FWC <= balance) {
          Request.updateOne(
            { _id: request._id },
            { expired: true, paid: true }
          ).then(() => {
            //  Move the money to the main wallet
            //  Send Some BNB For Gas Fee
            let sender = new ethers.Wallet(process.env.MAIN_WALLET_PRIVATEKEY);
            let senderSigner = sender.connect(provider);
            sendBNB(
              senderSigner,
              request.wallet.address,
              BNBFee.toString(),
              () => {
                //  Send Tokens To The Main Wallet
                sender = new ethers.Wallet(request.wallet.privateKey);
                senderSigner = sender.connect(provider);
                sendToken(
                  senderSigner,
                  TOKEN_FWC_ADDRESS,
                  process.env.MAIN_WALLET_ADDRESS,
                  ethers.utils.parseUnits(balance, 9),
                  () => {
                    //  Send mail
                  }
                );
              }
            );
          });
        }
      }
    }
  }
};

module.exports = walletChecker;
