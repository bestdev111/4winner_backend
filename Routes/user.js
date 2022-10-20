const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { restart } = require('nodemon');
const login = require('../middleware/login')
const User = mongoose.model("User") 

router.put('/follow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followid}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})
router.put('/unfollow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowid,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowid}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})
router.put('/updatepic',login,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
    (err,result)=>{

        if(err)
        {
            res.status(422).json({error:"pic cannot post"})
        }
        res.json(result)
    })

})
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id name")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})
module.exports =  router