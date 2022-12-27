const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../../models/user");
const Role = require("../../models/role");
const Shop = require("../../models/shop");
const Transaction = require('../../models/transaction')
const logged = require("../../middleware/login");

// @Route post /admin/subadmin/
router.post('/', logged, async (req, res) => {
  if(req.user.userRole.priority > 3)
    return res.status(401).json({message: "You don't have permission to do this operation"})
  
  try{
    const role = await Role.findOne({
      role: req.body.role
    })
    if(role.priority != req.user.userRole.priority + 1){
      console.log(role.priority, req.user.userRole.priority)
      return res.status(401).json({message: "You're not allowed to create that kind of sub-admin"})
    }
    let user = await User.find({
      userName: req.body.name
    })
    if(user.length)
      return res.status(500).json({message: "The username already exists"})

    if(role.priority == 4){
      if(req.body.shop === null || req.body.shop === undefined)
        return res.status(500).json({message: "Shop is required to create a cashier"})

      let shop = await Shop.find({
        _id: req.body.shop
      })

      if(!shop.length)
        return res.status(500).json({message: 'That shop does not exist'})
      
      user = await User.find({
        shop: req.body.shop,
        role: role._id
      })

      if(user.length)
        return res.status(500).json({message: "That shop already has a creditier"})
    }

    return bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const newUser = new User({
        userName: req.body.name,
        name: req.body.name,
        password: hash,
        userRole: role._id,
        parent: req.user._id,
        shop: req.body.shop
      })
      newUser.save()
        .then(savedUser => {
          return res.status(200).json({user: savedUser});
        })
        .catch(err => {
          console.log(err)
          return res.status(500).json({err: err})
        })
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({err: err})
  }
})

// @Route post /admin/subadmin/creditin
router.post('/creditin', logged, async (req, res) => {
  if(req.user.userRole.priority > 3)
    return res.status(401).json({message: "You don't have permission to do this operation"})

  try{
    req.body.amount = parseInt(req.body.amount)
    let user = await User.findOne({_id: req.body.user}).populate('userRole')
    // console.log(req.user, user)
    if(req.user.userRole.priority - user.userRole.priority !== -1)
      return res.status(401).json({message: "You're not allowed to add credit to " + user.userRole.role})
    
    if(req.user.balance < req.body.amount)
      return res.status(500).json({message: "You don't have enough credit to add credit to " + user.userRole.role})
    
    req.user.balance -= req.body.amount
    user.balance += req.body.amount
    req.user.save().then(result => {
      user.save().then(result => {
        // record on transaction
        const transaction = new Transaction({
          [req.user.userRole.role]: req.user._id,
          [user.userRole.role]: user._id,
          type: req.user.userRole.priority * 10 + user.userRole.priority,
          amount: req.body.amount
        })
        transaction.save()
          .then(result => {
            return res.status(200).json({message: "Successufuly funded"})
          })
          .catch(err => {
            throw err
          })
      }).catch(err => {
        throw err
      })
    })
    .catch(err => {
      throw err
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({err: err})
  }
})

// @Route post /admin/subadmmin/creditout
router.post('/creditout', logged, async (req, res) => {
  if(req.user.userRole.priority > 3)
    return res.status(401).json({message: "You don't have permission to do this operation"})

  try{
    req.body.amount = parseInt(req.body.amount)
    user = await User.findOne({_id: req.body.user}).populate('userRole')
    if(req.user.userRole.priority - user.userRole.priority !== -1)
      return res.status(401).json({message: "You're not allowed to add credit to " + user.userRole.role})
    
    if(user.balance < req.body.amount)
      return res.status(500).json({message: user.userRole.role + " don't have enough credit to be refunded"})
    
    req.user.balance += req.body.amount
    user.balance -= req.body.amount
    req.user.save().then(result => {
      user.save().then(result => {
        // record on transaction
        const transaction = new Transaction({
          [req.user.userRole.role]: req.user._id,
          [user.userRole.role]: user._id,
          type: req.user.userRole.priority * 10 + user.userRole.priority,
          amount: -1 * req.body.amount
        })
        transaction.save()
          .then(result => {
            return res.status(200).json({message: "Successufuly refunded"})
          })
          .catch(err => {
            throw err
          })
      }).catch(err => {
        throw err
      })
    })
    .catch(err => {
      throw err
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({err: err})
  }
})

// @Route post /admin/subadmmin/shopin
router.post('/shopin', logged, async (req, res) => {
  if(req.user.userRole.priority !== 3)
    return res.status(401).json({message: "Only distributor can do this operation"})

  try{
    req.body.amount = parseInt(req.body.amount)
    shop = await Shop.findOne({
      _id: req.body.shop
    }).populate('operator')
    if(shop.operator.userName != req.user.userName){
      console.log('!!!', shop.operator, req.user.userName)
      return res.status(401).json({message: "You can't do this operation to this shop: " + shop.name})
    }
    
    if(req.user.balance < req.body.amount)
      return res.status(500).json({message: "You don't have enough credit to fund"})
    
    req.user.balance -= req.body.amount
    shop.balance += req.body.amount
    req.user.save().then(result => {
      shop.save().then(result => {
        // record on transaction
        const transaction = new Transaction({
          [req.user.userRole.role]: req.user._id,
          shop: shop._id,
          type: 34,
          amount: req.body.amount
        })
        transaction.save()
          .then(result => {
            return res.status(200).json({message: "Successufuly funded"})
          })
          .catch(err => {
            throw err
          })
      }).catch(err => {
        throw err
      })
    })
    .catch(err => {
      throw err
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({err: err})
  }
})

// @Route post /admin/subadmmin/shopout
router.post('/shopout', logged, async (req, res) => {
  if(req.user.userRole.priority !== 3)
    return res.status(401).json({message: "Only distributor can do this operation"})

  try{
    req.body.amount = parseInt(req.body.amount)
    shop = await Shop.findOne({
      _id: req.body.shop
    })
    if(shop.operator !== req.user._id)
      return res.status(401).json({message: "You can't do this operation to this shop: " + shop.name})
    
    if(shop.balance < req.body.amount)
      return res.status(500).json({message: shop.name + " shop doesn't have enough credit to be refunded"})
    
    req.user.balance += req.body.amount
    shop.balance -= req.body.amount
    req.user.save().then(result => {
      shop.save().then(result => {
        // record on transaction
        const transaction = new Transaction({
          [req.user.userRole.role]: req.user._id,
          shop: shop._id,
          type: 34,
          amount: -1 * req.body.amount
        })
        transaction.save()
          .then(result => {
            return res.status(200).json({message: "Successufuly refunded"})
          })
          .catch(err => {
            throw err
          })
      }).catch(err => {
        throw err
      })
    })
    .catch(err => {
      throw err
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({err: err})
  }
})

module.exports = router;