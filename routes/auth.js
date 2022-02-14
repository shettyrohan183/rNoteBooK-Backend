const express = require("express");
const User = require("../modules/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

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
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      res.json({ user });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
