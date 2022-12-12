const mongoose = require('mongoose');
const { Schema } = mongoose;
const RoleSchema = new Schema({
    id: {
        type: Number,
        auto: true,
    },
    role: {
        type: String,
        required: true,
        unique: true,
    },
    priority: {
        type: Number,
        required: true,
        unique: true,
    }
}, {
    timeseries: true
});

module.exports = mongoose.model('Role', RoleSchema);
