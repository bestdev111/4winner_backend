const express = require("express");
const router = express.Router();

const logged = require("../../middleware/login");
const User = require("../../models/user");
const Transaction = require('../../models/transaction');
const Shop = require('../../models/shop')
const TransactionService = require('../../Services/transactionService');
const { getCustomers } = require("../../Services/userService");

// @Route /admin/balance/getusers
// @Summary return users whose parent is logged-in cashier
router.get("/getusers", logged, async (req, res) => {
  if (req.user.userRole.role != "cashier")
      res.status(401).json({
          message: "You're not allowed to perform operation",
      });
  users = await getCustomers(req.user);
  res.status(200).json({ users: users });
});

// @Route /admin/balance/deposit
// @Summary deposit credit to the customer
router.post("/deposit", logged, async (req, res) => {
  // only agent can perform deposit
  if(req.user.userRole.role != 'cashier')
    return res.status(401).json({message: "You're not allowed to perform operation"});
  
  let shop = await Shop.findOne({
    _id: req.user.shop
  })
  user = await User.findOne({
      userName: req.body.userName
    })
    .populate('parent')
    .exec();
  // check if this cashier is the parent of the player
  if(!user.shop.equals(req.user.shop))
    return res.status(401).json({message: "This customer does not belong to the shop you belong to"});
  
  // check if the agent has enough balance left to deposit
  if(shop.balance < parseInt(req.body.amount))
    return res.status(500).json({message: "The shop don't have enough credit left to deposit the customer"});
  else{
    shop.balance -= parseInt(req.body.amount);
    user.balance += parseInt(req.body.amount);
    shop.save()
      .then(result => {
        user.save()
          .then(async result => {
            // set the log to the Transaction table
            try{
              transaction = new Transaction({
                 cashier: req.user._id,
                 customer: user._id,
                 type: 45,
                 amount: parseInt(req.body.amount)
              });
              transaction.save();
            }catch(err){
              throw err;
            }
            return res.status(200).json({message: "Transaction submitted successufuly"}); 
          })
          .catch(err => {
            console.log(err);
            throw err;
          })
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({message: "Server error while depositing"});
      });  
  }
});

// @Route /admin/balance/withdraw
// @Summary withdraw credit to the customer
router.post("/withdraw", logged, async (req, res) => {
  // only agent can perform withdraw
  if(req.user.userRole.role != 'cashier')
    res.status(401).json({message: "You're not allowed to perform operation"});
  
  let shop = await Shop.findOne({
    _id: req.user.shop
  })
  user = await User.findOne({
      userName: req.body.userName
    })
    .exec();
  // check if this agent is the parent of the player
  if(!user.shop.equals(req.user.shop))
    res.status(401).json({message: "This customer does not belong to the shop you belong to"});
  
  // check if the user has enough balance left to withdraw
  if(user.balance < parseInt(req.body.amount))
    res.status(500).json({message: "The user has no enough credit left to withdraw"});
  else {
    shop.balance += parseInt(req.body.amount);
    user.balance -= parseInt(req.body.amount);
    shop.save()
      .then(result => {
        user.save()
          .then(async result => {
            // set the log to the Transaction table
            try{
              transaction = new Transaction({
                 cashier: req.user._id,
                 customer: user._id,
                 type: 45,
                 amount: -1 * parseInt(req.body.amount)
              });
              transaction.save();
            }catch(err){
              throw err;
            }
            return res.status(200).json({message: "Transaction submitted successufuly"}); 
          })
          .catch(err => {
            console.log(err);
            throw err;
          })
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({message: "Server error while withdrawing"});
      });  
  }
});

module.exports = router;