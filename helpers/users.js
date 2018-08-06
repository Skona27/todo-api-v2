// require mongoose connection and models
const db = require("../models");
// require jwt package
const jwt = require("jsonwebtoken");

exports.createUser = async function (req, res, next) {
  try {
   let user = await db.User.create(req.body)
   // destructure user data
   let { id, email } = user;
   // generate jwt token
   let token = jwt.sign({ id, email }, "SECRET");//process.env.SECRET_KEY );
   // return status with user data and token
   return res.status(201).json({ id, email, token });
  }
  catch(err) {
    // check if user already exists
    if (err.code === 11000) {
      err.message = "Sorry, that username or email is taken";
      err.status = 409;
    }

    return next(err);
  }
}

exports.loginUser = async function (req, res, next) {
  try {
      // find user by email
      let user = await db.User.findOne({ email: req.body.email });
      let { id, email } = user;
      // check if password matches
      let isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
          // create jwt token, send data back
          let token = jwt.sign({ id, email }, "SECRET"); //process.env.SECRET_KEY );
          return res.status(200).json({ id, email, token });
      } else {
          return next({ status: 409, message: "Invalid Password." });
      }
  }
  catch (err) {
      return next({ status: 400, message: "User does not exist." });
  }
};