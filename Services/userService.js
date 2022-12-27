const User = require('../models/user');
const Role = require('../models/role')

const getPlayers = async (currentUser) => {
  try {
    let role = await Role.find({
      role: 'player'
    })
    // fetch all users whose parent is the signed-in agent
    users = await User.find({
      shop: currentUser.shop,
      userRole: role
    })
    .exec();
    return users;
  } catch (error) {
    console.log('getPlayers error', error);
    throw error;
  }
};

const userService = {
  getPlayers
};

module.exports = userService;