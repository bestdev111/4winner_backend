const express = require("express");
const router = express.Router();

const logged = require("../../middleware/login");
const User = require("../../models/user");
const TransactionType = require('../../models/transactionType');
const Transaction = require('../../models/transaction');
const TransactionService = require("../../Services/transactionService");

// @Route get /admin/transactions/transactiontype
router.get('/transactiontype', logged, async(req, res) => {
  console.log('role is ', req.user.userRole.role);
  // only admin and agent can crud transaction type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});
  
  transactionTypes = await TransactionType.find().exec();
  return res.status(200).json({transactionType: transactionTypes});
})

// @Route get /admin/transactions
router.post('/', logged, async (req, res) => {
  console.log('role is ', req.user.userRole.role);
  // only admin and agent can crud transaction type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});
  // get the timestamp
  if(!req.body.time)
    req.body.time = 24;
  time = new Date().getTime() - 3600 * 1000 * req.body.time;
  try{
    queryObject = {
      createdAt : {
        $gte: new Date(time),
        $lt: new Date()
      }
    }
    if(req.body.transactionType && req.body.transactionType != 'All')
      queryObject.type = await TransactionService.getTransactionTypeId(req.body.transactionType);
    if(req.body.userId)
      queryObject.customer = req.body.userId;
    transactions = await Transaction.find(
      queryObject
    )
    .populate('cashier', 'userName')
    .populate('customer', 'userName')
    .populate('type', 'name');
  }catch(err){
    console.log('error while getting transaction', err);
    return res.status(500).json({message: 'Server error occured while fetching transactions'});
  }
  return res.status(200).json({transactions: transactions});
})

module.exports = router;