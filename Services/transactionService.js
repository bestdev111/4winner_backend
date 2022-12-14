const TransactionType = require('../models/transactionType');
const Transaction = require('../models/transaction');

const getTransactionTypeId = async (name) => {
  try{
    transactionType = await TransactionType.findOne({
      name: name
    });
    return transactionType._id;
  }catch(err){
    throw err;
  }
}

const TransactionService = {
  getTransactionTypeId
}

module.exports = TransactionService;