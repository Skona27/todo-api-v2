// require mongoose
const mongoose = require("mongoose");

// connect to mongo db
mongoose.connect("mongodb://localhost/todo-api-2");
// use promises as callbacks
mongoose.Promise = Promise;
// log mongoose queries
//mongoose.set("debug", true);

module.exports.Todo = require("./todo");
module.exports.User = require("./user");