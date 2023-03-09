const addresses =
  process.env.NODE_ENV === 'production'
    ? {
        /**
         * Mainnet
         */
        TOKEN_FWC_ADDRESS: '0x6D3a160B86eDcD46D8F9bBa25c2F88ccCADe19fc',
        TOKEN_BUSD_ADDRESS: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        TOKEN_USDT_ADDRESS: '0x55d398326f99059fF775485246999027B3197955',
      }
    : {
        /**
         * Testnet
         */

        TOKEN_FWC_ADDRESS: '0xe7f2192a4c31585e7bbb0042036bf6b0226154d0',
        TOKEN_BUSD_ADDRESS: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
        TOKEN_USDT_ADDRESS: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      };

module.exports = addresses;
