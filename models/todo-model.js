const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: String,
    data: String,
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    dateTime: {
        type: Date,
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',  // This links the todo to an account
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
