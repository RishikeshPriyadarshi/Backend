const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const JWT_TOKEN =  process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
// console.log(JWT_TOKEN)
//create user using: POST "/api/auth" Dosent require auth
router.post(
  "/createuser",
  [
    //Adding validator
    body("name", "enter a valid name minimum length 3").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "enter valid email minimum length 5").isLength({ min: 5 }),
    body("phone", "enter valid number").isLength({ min: 10 }),
  ],
  async function (req, res) {
    //checking if there is error in incomming json
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res
            .status(400)
            .json({ error: "Sorry a user with this email already exists" });
        }
    //creating secure password
    //generating salt
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash( req.body.password,salt)
    //storing user details on database
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
      date: req.body.date,
      question: req.body.questions,
      phone: req.body.phone,
    })
    //creating data to assign jwt token
    const data = {
        user:{
            id:user.id
        }
    }
      const authtoken = jwt.sign(data,JWT_TOKEN);
    //   res.json(user)
    res.json(authtoken)
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error occured");
  }
}
);

//Authenticate a user: GET "/api/auth/login". No login required

router.get(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //extracting email and password from input
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ success,error: "sorry user does not exist" });
      }
      //comporing password user entered, password and database password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        // success = false;
        return res.status(400).json({ success,error: "wrong password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_TOKEN);
      // success = true;
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server occured");
    }
  }
);

//Get user user details: GET "/api/auth/getuser". login required
router.get('/getuser',fetchuser,async (req,res)=>{
  try {
     userId=req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error occured");
  }
})
module.exports = router;
