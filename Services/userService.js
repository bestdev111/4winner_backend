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
      userRole: role._id
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
    cashierRole = await Role.findOne({
      role: 'cashier'
    });
    playerRole = await Role.findOne({
      role: 'user'
    });
    agentRole = await Role.findOne({
      role: 'agent',
    })
    distributorRole = await Role.findOne({
      role: 'distributor',
    })
    // add users in shop
    if(user.shop){

      shopUsers = await User.find({
        shop: user.shop,
        userRole : cashierRole._id
      })
      shopCashier = await User.find({
        shop: user.shop,
        userRole: playerRole._id
      })

      // console.log("shopid", user.shop, "roleId", cashierRole._id, playerRole._id)

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

      for(let idx = 0; idx < agents.length; idx ++){
        distributors = await User.find({
          userRole: distributorRole._id,
          parent: agents[idx]._id
        })
        // console.log('role', distributorRole._id, 'agent', agents[idx]._id, distributors)
        users = users.concat(distributors)
      };
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