const express = require('express');
const User = require('../modules/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');


// create a user using :POST "/api/auth/""
router.post('/',[
    body('name',"Enter Valid Name").isLength({ min: 3}),
    body('email',"Enter a valid Email").isEmail(),
    body('password',"password must be at least 5 character").isLength({ min: 5 }),
] ,(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user))
      .catch(err=>{console.log("error")
      res.json({error:'please enter a unique vaule for email', message: err.message})})
  
})

module.exports = router