const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');

const Token = require('../../models/Token');
const { TokenStatus } = require('../../constants/enum');

// @route    POST api/tokens/list
// @desc     List Token
// @access   Private
router.post('/list', auth, async (req, res) => {
  try {
    const {
      position,
      name,
      email,
      contactTelegram,
      token_ticker,
      contract_address,
      total_supply,
      decimals,
      chain,
      project_name,
      coinmarketcap_url,
      twitter,
      telegram,
      discord
    } = req.body;
    console.log(req.user);

    const token = new Token({
      user: req.user.id,
      token_ticker,
      contract_address,
      total_supply,
      decimals,
      chain_id: chain,
      user_position: position,
      user_name: name,
      user_email: email,
      user_telegram: contactTelegram,
      project_name,
      coinmarketcap_url,
      twitter,
      telegram,
      discord
    });

    await token.save();

    res.status(200).json({
      success: true,
      message:
        'Submitted successfully! Please wait while your request approved.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route    GET api/tokens/allowed
// @desc     Get allowed token list
// @access   Public
router.get('/allowed', async (req, res) => {
  try {
    const tokens = await Token.find({ status: TokenStatus.Allowed });
    res.json({
      success: true,
      tokens: tokens
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
