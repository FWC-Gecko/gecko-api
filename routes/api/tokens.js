const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route    POST api/tokens/toggleWatchList
// @desc     Add Watch List
// @access   Private
router.post('/setRole', auth, async (req, res) => {
  const { _id, role } = req.body;

  try {
    await User.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          role: role
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const users = await User.find();

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
