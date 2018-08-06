// require express
const express = require("express");
const router = express.Router();

// routes destructuring
const {getTodos, getTodo, createTodo, updateTodo, deleteTodo} = require("../helpers/todos");

// routes
router.route("/")
    .get(getTodos)
    .post(createTodo)

router.route("/:id")
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo)


module.exports = router;