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
    cashier: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'TransactionType',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
