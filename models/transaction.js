const mongoose = require('mongoose');
const { Schema } = mongoose;
const TransactionSchema = new Schema({
    id: {
        type: Number,
        auto: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    distributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    cashier: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
