const mongoose = require('mongoose');
const { Schema } = mongoose;
const BarcodeSchema = new Schema({
    id: {
        type: Number,
        auto: true
    },
    barcodeJsonString: {
        type: String,
        required: true
    },
    barcode: {
      type: String,
      required:true,
      unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Barcode', BarcodeSchema);
