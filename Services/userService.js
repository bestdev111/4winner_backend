const User = require('../models/user');
const Role = require('../models/role')

// get users for cashier
const getCustomers = async (currentUser) => {
  try {
    let role = await Role.find({
      role: 'user'
    })
    // fetch all users whose parent is the signed-in agent
    users = await User.find({
      shop: currentUser.shop,
      userRole: role
    })
    .exec();
    return users;
  } catch (error) {
    console.log('getCustomers error', error);
    throw error;
  }
};

// get users for admin, agent, distributor
const getUsers = async (user) => {
  
  try{
    let users = [];
    // add users in shop
    if(user.shop){
      cashierRole = await Role.find({
        role: 'cashier'
      });
      playerRole = await Role.find({
        role: 'user'
      });
      agentRole = await Role.find({
        role: 'agent',
      })
      distributorRole = await Role.find({
        role: 'distributor',
      })

      shopUsers = await User.find({
        shop: user.shop,
        userRole : cashierRole._id
      })
      shopCashier = await User.find({
        shop: user.shop,
        userRole: playerRole._id
      })

      users = users.concat(shopUsers);
      users = users.concat(shopCashier);
    }

    // if it's admin add agents and their distributors
    if(user.userRole.priority == 1){

      agents = await User.find({
        userRole: agentRole._id,
        parent: user._id
      })

      users = users.concat(agents);

      await agents.forEach(async agent => {
        distributors = await User.find({
          userRole: distributorRole._id,
          parent: agent._id
        })

        users = users.concat(distributors)
      });
    }

    // if it's agent add it's distributors
    if(user.userRole.priority == 2){
      distributors = await User.find({
        userRole: distributorRole._id,
        parent: user._id
      })

      users = users.concat(distributors)
    }

    return users;
  }catch(err){
    console.log(err);
    throw err;
  }
}

const userService = {
  getCustomers,
  getUsers
};

module.exports = userService;