// require mongoose
const mongoose = require("mongoose");
// custom validator 
const validator = require("validator");
// bcrypt for hashing passwords
const bcrypt = require("bcrypt");

// define user schema
// using 3rd party library to validate emails
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

// hash password before saving the user
userSchema.pre("save", async function(next) {
  try {
    // check if passward was modified
      if(!this.isModified("password")) {
          return next();
      }
      // hash password
      let hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      return next();
  }
  catch(err) {
      next(err);
  }
});

// method for checking password
userSchema.methods.comparePassword = async function(password, next) {
  try {
    // compare user password against hashed password
      let isMatch = await bcrypt.compare(password, this.password);
      return isMatch;
  }
  catch(err) {
      next(err);
  }
}

// create model
const User = mongoose.model("User", userSchema);

module.exports = User;