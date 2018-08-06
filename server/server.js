// require packages
const express = require("express");
const app = express();
var bodyParser = require("body-parser");

// custom error handler
const errorHandler = require("../helpers/error");
// db 
const db = require("../models");
// routes
const todoRoutes = require("../routes/todos");
const userRoutes = require("../routes/users");
const {isAuthenticated, isAuthorized } = require("../middleware/auth");

// settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// root route
app.get("/", (req, res)=>{
    res.json({
        message: "OK"
    });
});

// use todos routes
app.use("/todos", todoRoutes);
// use user routes
app.use("/users", userRoutes);

// invalid request eror handler
app.use((req, res, next) => {
    let err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

// error middleware
app.use(errorHandler);

// start server
app.listen(3000, () => {
    console.log("Todo API is running on port 3000");
});

module.exports = app;