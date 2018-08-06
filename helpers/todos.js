// require mongoose connection and models
const db = require("../models");

exports.getTodos = async function (req, res, next) {
  try {
    let todos = await db.Todo.find();
    return res.status(200).json({todos});
  }
  catch(err) {
    return next(err);
  }
}

exports.getTodo = async function (req, res, next) {
  try {
    let todo = await db.Todo.findById(req.params.id);
    return res.status(200).json(todo);
  }
  catch(err) {
    err.status = 404;
    return next(err);
  }
}

exports.createTodo = async function (req, res, next) {
  try {
    let todo = await db.Todo.create(req.body);
    return res.status(201).json(todo);
  }
  catch(err) {
    return next(err);
  }
}

exports.updateTodo = async function (req, res, next) {
  try {
    let updatedTodo = await db.Todo.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
    return res.status(200).json(updatedTodo);
  }
  catch(err) {
    return next(err);
  }
};

exports.deleteTodo = async function (req, res, next) {
  try {
    await db.Todo.remove({_id: req.params.id});
    res.status(200).json({message: "Todo deleted!"});
  }
  catch(err) {
    return next(err);
  }
}