const User = require('../models/user');

const getAllUsers = async (currentUser) => {
  try {
    // fetch all users whose parent is the signed-in agent
    users = await User.find({
      parent: currentUser._id
    })
    .exec();
    return users;
  } catch (error) {
    console.log('getAllUsers error', error);
    throw error;
  }
};

const userService = {
  getAllUsers
};

module.exports = userService;