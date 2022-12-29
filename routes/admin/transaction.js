const express = require("express");
const router = express.Router();

const logged = require("../../middleware/login");
const TransactionType = require('../../models/transactionType');
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
router.get('/', logged, async (req, res) => {
  if(req.user.userRole.priority > 4)
    return res.status(401).json({message: "You don't have permission to do this operation"})
  try{
    let transactions = await TransactionService.getAllTransactions(req.user)
    return res.status(200).json({transactions: transactions})
  }catch(err){
    console.log('err', err)
    return res.status(500).json({err: err})
  }
})

module.exports = router;