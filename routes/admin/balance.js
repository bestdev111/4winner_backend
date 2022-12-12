const express = require("express");
const router = express.Router();

const getAllUsers = require('../../Services/userService');
const logged = require("../../middleware/login");

// @Route /admin/balance/getusers
// @Summary return users whose parent is logged-in agent
router.get("/getusers", logged, async (req, res) => {
  try {
      console.log('api uri is /admin/balance/getusers');
      users = getAllUsers({
        parent: req.user._id
      });
      return res.status(200).json({ users: users });
  } catch (err) {
      return res.status(500).json({ message: err });
  }
});

module.exports = router;