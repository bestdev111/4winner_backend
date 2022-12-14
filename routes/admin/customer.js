const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require('../../models/user');
const CasinoType = require('../../models/casinoType');
const SportType = require('../../models/sportType');
const Role = require('../../models/role');
const logged = require("../../middleware/login");
const validateRegister = require("../../validation/validateRegister");
const defaultValues = require("../../utils/defaultValue");
const { getAllUsers } = require("../../Services/userService");

// @Route /admin/customer/create
// @Summary an agent (or a cashier) is creating a user
router.post("/create", logged, async (req, res) => {
  if(req.user.userRole.role != 'agent')
    res.status(401).json({message: "You're not allowed to perform operation"});

  req.body.password = defaultValues.defaultPassword;
  const { errors, isValid } = validateRegister(req.body, 1);

  if (!isValid) {
      return res.status(400).json(errors);
  }

  try {
      // If there is a user whose userName is the same as the requested userName return name-already-exist error message
      const user = await User.find({ userName: req.body.userName }).exec();
      if (user.length > 0) {
          return res.status(409).json({ error: "Name already exists." });
      }
      // Create a user whose parentId is the agent who is requesting this user creation
      return bcrypt.hash(req.body.password, 10, async (error, hash) => {
        if (error) {
          return res.status(500).json({ error });
        }
        // find the object id of the requested role to refer
        try {
            role = await Role.find({role: 'player'}).exec();
        } catch (error) {
            return res.status(404).json({ error: "This role does not exist" });
        }
        // find the object id of the requested casino type to refer
        casinoType = null;
        if(req.body.casinoType)
          try {
              casinoType = await CasinoType.find({name: req.body.casinoType}).exec();
              casinoType = casinoType[0]._id;
          } catch (error) {
              return res.status(404).json({ error: "That casino type does not exist" });
          }
        // fetch the object ids of allowed Sport Types
        allowedSportType = new Array();
        try {
          sportType = await SportType.find({name: { $in: req.body.allowedSportType}}).exec();
          sportType.forEach(element => {
            allowedSportType.push(element._id);
          });
        } catch (error) {
          return res.status(404).json({ error: "Some of those sport types do not exist" });
        }
        // now set up a new user
        const newUser = new User({
            userName: req.body.userName,
            name: req.body.name,
            isCasinoEnabled: req.body.enableCasino,
            casinoType: casinoType,
            allowedSportType: allowedSportType,
            maximumStakeLimit: req.body.maximumStakeLimit,
            totalOddsLimit: req.body.totalOddsLimit,
            isCashoutEnabled: req.body.isCashoutEnabled,
            userRole: role[0]._id,
            parent: req.user._id,
            password: hash
        });
        return newUser
            .save()
            .then((result) => {
                return res.status(200).json({ result });
            })
            .catch((err) => {
                return res.status(500).json({ error: err });
            });
    });
  } catch (err) {
      return res.status(500).json({ err });
  }
});

// @Route put /admin/customer/update
// @Summary an agent (or a cashier) is creating a user
router.put("/update", logged, async (req, res) => {
  if(req.user.userRole.role != 'agent')
    return res.status(401).json({message: "You're not allowed to perform operation"});

  try {
      // If there is a user whose userName is the same as the requested userName return name-already-exist error message
      user = await User.findOne({ userName: req.body.userName }).exec();
      if (!user) {
          return res.status(409).json({ error: "User not found" });
      }
      // find the object id of the requested casino type to refer
      casinoType = null;
      if(req.body.casinoType)
        try {
          casinoType = await CasinoType.find({name: req.body.casinoType}).exec();
          casinoType = casinoType[0]._id;
        } catch (error) {
          console.log('That casino type does not exist');  
          throw error;
        }
      // fetch the object ids of allowed Sport Types
      allowedSportType = new Array();
      try {
        sportType = await SportType.find({name: { $in: req.body.allowedSportType}}).exec();
        sportType.forEach(element => {
          allowedSportType.push(element._id);
        });
      } catch (error) {
        console.log("Some of those sport types do not exist");
        throw error;
      }
      // now set up a new user
      user = await User.findOneAndUpdate({
        userName: req.body.userName
      },
      {
        name: req.body.name,
        isCasinoEnabled: req.body.enableCasino,
        casinoType: casinoType,
        allowedSportType: allowedSportType,
        maximumStakeLimit: req.body.maximumStakeLimit,
        totalOddsLimit: req.body.totalOddsLimit,
        isCashoutEnabled: req.body.isCashoutEnabled
      });
      return res.status(200).json({message: "User " + user.userName + " updated successufuly"});
    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "Temporary Error while updating customer"});
    }
});

// @Route /admin/customer/getusers
// @Summary get users whose parent is that agent
router.get('/getusers', logged, async (req, res) => {
  if(req.user.userRole.role != 'agent')
    res.status(401).json({message: "You're not allowed to perform operation"});
  users = await getAllUsers(req.user);
  res.status(200).json({users: users});
})

// @Route /admin/customer/changestatus
// @Summary block or active the customer
router.post('/changestatus', logged, async (req, res) => {
  if(req.user.userRole.role != 'agent')
    res.status(401).json({message: "You're not allowed to perform operation"});
  try{
    const user = await User.findOneAndUpdate({
      userName: req.body.userName
    }, {
      active: req.body.blockStatus
    })
    user.active = req.body.blockStatus;
    return res.status(200).json({user: user});
  }catch(err){
    console.log('err while blocking/activating statuas', err);
    return res.status(500).json({message: 'Error while blocking/activating customer'});
  }
})

// @Route /admin/customer/changepass
// @Summary block or active the customer
router.post('/changepass', logged, async (req, res) => {
  if(req.user.userRole.role != 'agent')
    res.status(401).json({message: "You're not allowed to perform operation"});
  bcrypt.compare(
    req.body.loginPass,
    req.user.password,
    async (err, result) => {
      if(err) 
        return res.status(401).json({message: "Auth failed"});
      else if(result){
        bcrypt.hash(req.body.newPass, 10, async (err, hash) => {
          try{
            user = await User.findOne({
              userName: req.body.userName
            });
          }catch(err){
            console.log(err);
            return res.status(404).json({message: 'User not found'});
          }
          user.password = hash;
          user.save()
            .then(result => {
              return res.status(200).json({message: user.userName + "'s password is updated"});
            })
            .catch(err => {
              console.log(err);
              return res.status(500).json({message: 'Server error while updating customer password'});
            })
        });
      }
      else 
        return res.status(401).json({message: "Wrong password"});
    }
  )
})

module.exports = router;