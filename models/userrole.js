const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserRoleSchema = new Schema({
    id: {
        type: Number,
        required: true,
        auto: true,
    },
    roleName: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('UserRole', UserRoleSchema);
