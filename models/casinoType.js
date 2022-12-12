const mongoose = require('mongoose');
const { Schema } = mongoose;
const CasinoTypeSchema = new Schema({
    id: {
        type: Number,
        auto: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CasinoType', CasinoTypeSchema);
