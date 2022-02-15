const express = require("express");
const User = require("../modules/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'Harryisagoodcoder';

// create a user using :POST "/api/auth/""
// creating user no authencation no login
router.post(
  "/createuser",
  [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "password must be at least 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check if the email(user) exit in databaset

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exit " });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user:{
          id:user.id
        }
      }
      const authtoken =   jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
