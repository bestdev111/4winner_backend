const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required: true,
        auto:true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    userRole: {
        type: Schema.Types.ObjectId,
        ref : 'Role',
        required: true
    },
    lang: {
        type: String,
        required: true,
        default: 1
    },
    balance: {
        type: Number,
        required: true,
        default: 0.00,
        min: 0.00
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    isCasinoEnabled: {
        type: Boolean,
        default: false
    },
    isSlotEnabled: {
        type: Boolean,
        default: false
    },
    allowedSportTypes: [
        {
          type: Schema.Types.ObjectId,
          refer: 'SportType'
        }
      ],
    maximumStakeLimit: {
        type: Number,
        default: 0
    },
    totalOddsLimit: {
        type: Number,
        default: 0
    },
    turnOver: {
        type: Number,
        default: 0
    },
    won: {
        type: Number,
        default: 0
    },
    unsettled: {
        type: Number,
        default: 0
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    refund: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
