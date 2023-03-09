const ethers = require('ethers');

const Request = require('../models/requestModel');

const sendEmail = require('./sendEmail');

const { getCurrentTime, getUnixTimestamp } = require('./dateFunction');

const {
  TOKEN_FWC_ADDRESS,
  TOKEN_BUSD_ADDRESS,
  TOKEN_USDT_ADDRESS,
} = require('../constants/tokenAddress');

const erc20Abi = require('../abi/erc20.abi.json');

const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL);

const BNBAmount = process.env.NODE_ENV === 'production' ? 1 : 0.001; //  BNB
const BNBFee = process.env.TRANSACTION_FEE;

const sendBNB = async (sender, to_address, amount, callback) => {
  sender
    .sendTransaction({
      to: to_address,
      value: ethers.utils.parseEther(amount.toString()),
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
  const contract = new ethers.Contract(contract_address, erc20Abi, sender);
  contract
    .transfer(to_address, amount, {
      gasLimit: 500000,
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
    if (request.paymentToken === 'BNB') {
      const balance = ethers.utils.formatEther(
        await provider.getBalance(request.wallet.address)
      );
      console.log(new Date(), 'BNB', balance);
      if (request.wallet.price.BNB <= balance) {
        //  Send mail
        await sendEmail({
          email: request.email,
          templateId: process.env.SENDGRID_ORDER_FUND_SUCCESS_TEMPLATEID,
          data: {
            balance,
            type: 'BNB',
            id: request._id,
          },
        });
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
            async () => {
              await Request.findByIdAndUpdate(request._id, { withdraw: true });
            }
          );
        });
      } else if (now - getUnixTimestamp(request.createdAt) > 60 * 20) {
        //  Update a request that expired after 20 mins
        Request.findByIdAndUpdate(request._id, { expired: true }).then(
          async () => {
            //  Send mail to notify the order expired
            await sendEmail({
              email: request.email,
              templateId: process.env.SENDGRID_ORDER_EXPIRED_TEMPLATEID,
              data: {
                id: request._id,
              },
            });
          }
        );
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
      console.log(new Date(), 'BUSD', balance);
      if (request.wallet.price.BUSD <= balance) {
        //  Send mail
        await sendEmail({
          email: request.email,
          templateId: process.env.SENDGRID_ORDER_FUND_SUCCESS_TEMPLATEID,
          data: {
            balance,
            type: 'BUSD',
            id: request._id,
          },
        });
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
                async () => {
                  await Request.findByIdAndUpdate(request._id, {
                    withdraw: true,
                  });
                }
              );
            }
          );
        });
      } else if (now - getUnixTimestamp(request.createdAt) > 60 * 20) {
        //  Update a request that expired after 20 mins
        Request.findByIdAndUpdate(request._id, { expired: true }).then(
          async () => {
            //  Send mail to notify the order expired
            await sendEmail({
              email: request.email,
              templateId: process.env.SENDGRID_ORDER_EXPIRED_TEMPLATEID,
              data: {
                id: request._id,
              },
            });
          }
        );
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
      console.log(new Date(), 'USDT', balance);
      if (request.wallet.price.USDT <= balance) {
        //  Send mail
        await sendEmail({
          email: request.email,
          templateId: process.env.SENDGRID_ORDER_FUND_SUCCESS_TEMPLATEID,
          data: {
            balance,
            type: 'USDT',
            id: request._id,
          },
        });
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
                async () => {
                  await Request.findByIdAndUpdate(request._id, {
                    withdraw: true,
                  });
                }
              );
            }
          );
        });
      } else if (now - getUnixTimestamp(request.createdAt) > 60 * 20) {
        //  Update a request that expired after 20 mins
        Request.findByIdAndUpdate(request._id, { expired: true }).then(
          async () => {
            //  Send mail to notify the order expired
            await sendEmail({
              email: request.email,
              templateId: process.env.SENDGRID_ORDER_EXPIRED_TEMPLATEID,
              data: {
                id: request._id,
              },
            });
          }
        );
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
      console.log(new Date(), 'FWC', balance);
      if (request.wallet.price.FWC <= balance) {
        //  Send mail
        await sendEmail({
          email: request.email,
          templateId: process.env.SENDGRID_ORDER_FUND_SUCCESS_TEMPLATEID,
          data: {
            balance,
            type: 'FWC',
            id: request._id,
          },
        });
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
              console.log('balance*', ethers.utils.parseUnits(balance, 9));
              sendToken(
                senderSigner,
                TOKEN_FWC_ADDRESS,
                process.env.MAIN_WALLET_ADDRESS,
                ethers.utils.parseUnits(balance, 9),
                async () => {
                  await Request.findByIdAndUpdate(request._id, {
                    withdraw: true,
                  });
                }
              );
            }
          );
        });
      } else if (now - getUnixTimestamp(request.createdAt) > 60 * 20) {
        //  Update a request that expired after 20 mins
        Request.findByIdAndUpdate(request._id, { expired: true }).then(
          async () => {
            //  Send mail to notify the order expired
            await sendEmail({
              email: request.email,
              templateId: process.env.SENDGRID_ORDER_EXPIRED_TEMPLATEID,
              data: {
                id: request._id,
              },
            });
          }
        );
      }
    }
  }
};

module.exports = walletChecker;
