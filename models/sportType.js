const mongoose = require('mongoose');

const { Schema } = mongoose;

const SportTypeSchema = new Schema({
    id:{
        type: Number,
        required: true,
        auto:true,
    },
    name: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('SportType', SportTypeSchema);
