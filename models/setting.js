const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
}, {
    timestamps: true
});

const Setting = mongoose.model("Setting", accountSchema, "settings");

module.exports = Setting;