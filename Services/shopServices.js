const User = require('../models/user')
const Shop = require('../models/shop')

const getShops = async (user) => {
    if(user.userRole.priority == 3){ // if it is distributor
      let shopsToAdd = await Shop.find({
        operator: user._id
      })
      // console.log('finding shop: current user ' + user.userName + ' role ' + user.userRole.role + ' _id ' + user._id)
      // console.log('shop count : ' + shopsToAdd.length)
      return shopsToAdd
    }
    else if(user.userRole.priority < 3){  // if it is admin or agent
      let users = await User.find({
        parent: user._id
      })
      .populate('userRole');
      // const temp = await funcTempAsync(users, shops);
      let idx = 0;
      shops = new Array()
      for(;idx < users.length; idx ++)
        shops = shops.concat(await getShops(users[idx], shops))
      // console.log('finding another user: current user ' + user.userName + ' role ' + user.userRole.role )
      // console.log('shop merged: ' + shops.length)
      return shops
    }
    else {
      console.log('---')
      return shops
    }
}

const shopService = {
  getShops
};

module.exports = shopService;