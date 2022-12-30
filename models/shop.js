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
    maxWin:{
      type: Number,
      default:1000
    },
    shopLimit:{
      type: Number,
      default: 5000
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shop', ShopSchema);
