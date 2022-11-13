const mongoose = require('mongoose');

const { Schema } = mongoose;
// const UserRole = require("../models/userrole")
const UserSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required: true,
        auto:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        default: 'user'
    },
    userrole_id: {
        type: Number,
        required: true,
        // ref: UserRole
    },
    balance: {
        type: Number,
        required: true,
        default: 0.00
    },
    createdAt: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('User', UserSchema);
