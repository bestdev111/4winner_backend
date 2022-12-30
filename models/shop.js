const mongoose = require('mongoose');
const { Schema } = mongoose;
const ShopSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required: true,
        auto:true,
    },
    name:{
      type:String,
      required:true
    },
    currency:{
      type: String,
      refer: 'Currency'
    },
    balance:{
      type: Number,
      default: 0
    },
    operator: {
      type: Schema.Types.ObjectId,
      required: true,
      refer: 'User'
    },
    allowedSportTypes: [
      {
        type: Schema.Types.ObjectId,
        refer: 'SportType'
      }
    ],
    isCasinoEnabled: {
      type: Boolean,
      default: false
    },
    isSlotEnabled: {
      type: Boolean,
      default: false
    },
    maximumStakeLimit: {
      type: Number,
      default: 5
    },
    totalOddsLimit: {
      type: Number,
      default: 3
    },
    refund: {
      type: Number,
      default: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shop', ShopSchema);
