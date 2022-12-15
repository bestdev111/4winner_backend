const mongoose = require('mongoose');
const sportType = require('./sportType');
const { Schema } = mongoose;
const BetSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // type: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'sportType',
    //     required: true
    // },
    betSystem: {
        type: String,
        required: true,
        default: 'Single/Multiple'
    },
    initialStake: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    stakePerBet: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    maxWinning: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    matchId: {
        type: String,
        required: true,
    },
    homeTeam: {
        type: String,
        required: true,
    },
    awayTeam: {
        type: String,
        required: true,
    },
    homeTeamScore: {
        type: Number,
        required: true,
    },
    awayTeamScore: {
        type: Number,
        required: true,
    },
    betType: {
        type: String,
        required: true,
    },
    // odds: {
    //     type: Array,
    //     required: true,
    // },
    selectedOdds: {
        type: String,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    cashout: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    payout: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    payoutTime: {
        type: Date,
        required: true,
        min: 0,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    state: {
        type: Number,
        required: true,
        default: 0
    },
    winning: {
        type: Number,
        required: true,
        default: 0,
    },
    details: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bet', BetSchema);
