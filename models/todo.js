// require mongoose
const mongoose = require("mongoose");

// todo schema
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: String,
        default: null
    }
});

// create model
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;