const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',  // This links the todo to an account
        required: true
    },
}, {
    timestamps: true
});

const Setting = mongoose.model("Setting", accountSchema, "settings");

module.exports = Setting;