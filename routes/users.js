// require express
const express = require("express");
const router = express.Router();

// routes destructuring
const {createUser, loginUser} = require("../helpers/users");

// routes
router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;