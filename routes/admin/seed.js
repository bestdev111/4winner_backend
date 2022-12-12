const express = require("express");
const router = express.Router();

const CasinoType = require('../../models/casinoType');
const SportType = require('../../models/sportType');
const Role = require('../../models/role');

const logged = require("../../middleware/login");
const user = require("../../models/user");

// @Route get /admin/seed/sporttype
router.get('/sporttype', logged, async(req, res) => {
  console.log('role is ', req.user.userRole.role);
  // only admin and agent can crud sport type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});

  sportTypes = await SportType.find().exec();
  return res.status(200).json({sportTypes: sportTypes});
})

// @Route post /admin/seed/sporttype
router.post('/sporttype', logged, async (req, res) => {
  console.log('role is ', req.user.userRole.role);
  // only admin and agent can crud sport type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});
  
  // If there is already a sport type which has the requested sport type name, return error
  const sportType = await SportType.find({name: req.body.name}).exec();
  if(sportType.length)
    return res.status(500).json({error: "That sport type already exists"});
  
  // Create the sport type
  const newSportType = new SportType({
    name: req.body.name
  });
  newSportType.save()
    .then(result => {
      return res.status(200).json({newSportType});
    })
    .catch(err => {
      return res.status(500).json({error: err});
    })
});

// @Route delete /admin/seed/sporttype
router.delete('/sporttype', logged, async (req, res) => {
  // only admin and agent can crud sport type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});

  // delete that sport type
  SportType.deleteOne({
    name: req.body.name
  })
    .then(result => {
      return res.json(200).json(result);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({error: err});
    });
})

// @Route get /admin/seed/casinotype
router.get('/casinotype', logged, async(req, res) => {
  console.log('role is ', req.user.userRole.role);
  // only admin and agent can crud sport type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});
  
  casinoTypes = await CasinoType.find().exec();
  return res.status(200).json({casinoTypes: casinoTypes});
})

// @Route post /admin/seed/casinoType
router.post('/casinoType', logged, async (req, res) => {
  console.log('role is ', req.user.userRole.role);
  // only admin and agent can crud sport type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});
  
  // If there is already a sport type which has the requested sport type name, return error
  const casinoType = await CasinoType.find({name: req.body.name}).exec();
  if(casinoType.length)
    return res.status(500).json({error: "That casino type already exists"});
  
  // Create the sport type
  const newCasinoType = new CasinoType({
    name: req.body.name
  });
  newCasinoType.save()
    .then(result => {
      return res.status(200).json({newCasinoType});
    })
    .catch(err => {
      return res.status(500).json({error: err});
    })
});

// @Route delete /admin/seed/casinoType
router.delete('/casinoType', logged, async (req, res) => {
  // only admin and agent can crud sport type
  if(req.user.userRole.role == 'agent' || req.user.userRole.role == 'admin' ){}
  else  return res.status(401).json({error: "You don't have permission to perform this operation"});

  // delete that sport type
  CasinoType.deleteOne({
    name: req.body.name
  })
    .then(result => {
      return res.json(200).json(result);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({error: err});
    });
})

// @Route get /admin/seed/role
router.get('/role', async(req, res) => {  
  roles = await Role.find().exec();
  return res.status(200).json({roles: roles});
})

// @Route post /admin/seed/role
router.post('/role', async (req, res) => {
  
  // If there is already a sport type which has the requested sport type name, return error
  const role = await Role.find({role: req.body.role}).exec();
  if(role.length)
    return res.status(500).json({error: "That casino type already exists"});
  
  // Create the sport type
  const newRole = new Role({
    role: req.body.role,
    priority: req.body.priority
  });
  newRole.save()
    .then(result => {
      return res.status(200).json({newRole});
    })
    .catch(err => {
      return res.status(500).json({error: err});
    })
});

// @Route delete /admin/seed/role
router.delete('/role', async (req, res) => {

  // delete that sport type
  Role.deleteOne({
    role: req.body.role,
    priority: req.body.priority
  })
    .then(result => {
      return res.json(200).json(result);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({error: err});
    });
})
module.exports = router;