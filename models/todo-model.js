const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: String,
    data: String,
    dateTime: {
        type: Date,
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const Todo = mongoose.model("Todo", todoSchema, "todos");

module.exports = Todo;
