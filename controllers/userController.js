var User  = require('../models/user.js');

var user = {
  addUser: function(req, res) {
    var newUser = new User({
      fullName: req.body.fullName,
      address: req.body.address,
      contactNumber: req.body.contactNumber,
      emailAddress: req.body.emailAddress,
      userName: req.body.userName,
      password: req.body.userName,
      role: req.body.role,
      location: [],
      status:"Active",
      logDetails:[]
    });
    User.createUser(newUser, function(err,userRes){
      if (err){
        res.json({success: false, msg: 'Something Wrong, Try Again!', err: err});
      }
      res.json({success: true,user: userRes, msg: 'New User Added Successfully!'});
    })
  },

    editUser: function(req, res) {
        let updateUser = {
            fullName: req.body.fullName,
            address: req.body.address,
            contactNumber: req.body.contactNumber,
            emailAddress: req.body.emailAddress,
            userName: req.body.userName,
            roles: req.body.roles,
            status: req.body.status
        };
        User.editUser(updateUser, req.body.userId, function(err,result){
            if (err){
                res.json({success: false, msg: 'Something Wrong, Try Again!', err: err});
            }
            res.json({success: true, msg: 'User Update Successfully!'});
        })
    },
  getAll: function(req, res) {
    User.getUsers(function(err,userRes){
      if (err){
        res.json({success: false, msg: err});
      }
      res.json(userRes);
    })
  },
  getOne: function(req, res) {
    var id = req.params.id;
    User.getUser(id, function(err,userRes){
      if (err){
        res.json({success: false, msg: err});
      }
      res.json(userRes);
    })
  },
  findByName: function(req, res){
    var userName = req.params.userName; 
    User.findUserByName(userName, function(err, userRes){
      if(err){
        res.json({success: false, msg: err});
      }
      res.json({success: true, userRes});
    })
  },
  deleteFlag: function(req, res){
    var userId = req.params.userId;
    User.resetStatus(userId,{}, function(err, userRes){
      if(err){
        res.json({success: false, msg: 'Something Wrong, Try Again!', err: err});
      }
      res.json({success: true, userRes, msg: 'User Blocked from the System Successfully!'});
    })
  },
  restPassword: function(req, res){
        const userRestPasswordDetails = {
            userId: req.body.userId,
            userName: req.body.userName
        };
        User.restPassword(userRestPasswordDetails,function(err, result) {
            if(err){
                console.log(err);
                res.json({success: false, msg: 'Something Wrong, Try Again!', err: err});
            }
            res.json({success: true, msg: 'Rest Password Successfully..!!!'});
        });
    },
  changeUserPassword: function(req, res){
      const userPasswordDetails = {
          userId: req.body.userId,
          currentPassword: req.body.currentPassword,
          newPassword: req.body.newPassword,
          confirmPassword: req.body.confirmPassword
      };

      User.getUser(userPasswordDetails.userId,function(err, user) {
          if (err) throw err;
              // check if password matches
                      User.changePassword(userPasswordDetails, user,function(err, userRes) {
                          if (err) {
                              res.json({success: false, msg: 'Something Wrong, Try Again!', err: err});
                          } else if (!userRes) {
                              res.json({success: false, msg: 'Current Password Not Matched!'});
                          } else {
                          User.findUserActivity(userPasswordDetails.userId, function (err, logDetails) {
                              let todayDate = new Date();
                              logDetails[0].logDetails.reverse()[0].passwordChangedTime = todayDate;

                              User.findOneAndUpdate({'_id': logDetails[0]._id}, {'$set': {logDetails: logDetails[0].logDetails.reverse()}}, {new: true}, function (err) {
                                  if (err) {
                                      console.log(err);
                                  }
                              });
                              res.json({success: true, msg: 'Password Changed Successfully!'});
                          });
                      }
                      });
      });
  },
    getUserLogs: function(req, res){
        let userId = req.params.id;
        User.findUserActivity(userId, function (err, logDetails) {
            if (err) {
                console.log(err);
                res.json({success: false, message: 'Something Went Wrong, Try Again!'});
                //throw err ;
            } else {
                res.json({success: true, logDetails: logDetails});
            }
        });
    },
  addLocation: function(req,res){
    var userName = req.body.userName;
    let location = {
      name:req.body.locationName,
      type:req.body.locationType,
      latitude:req.body.latitude,
      longitude:req.body.longitude
    };
    User.updateMany({'userName': userName}, {'$push': { location : location }}, function (err) {
      if (err) {
          res.json({ success: false, msg: "Something Wrong, Try Again!", err: err });
      } else {
          res.json({ success: true, msg: "successfully added location" });
      }
    });
  },
  viewLocation: function(req, res){
    var userName = req.params.userName;
    User.viewAllLocation(userName, function(err,locationRes){
      if (err){
        throw err;
      } else {
        res.json(locationRes);
      }
    });
  },
  removeLocation: function(req,res){
    var userId = req.body.userId;
    var locationId = req.body.locationId;
    User.deleteLocation(userId,locationId,function(err,locationRes){
      if (err){
        res.json({success:false, msg: 'Something Wrong, Try Again!', err: err});
        //throw err ; 
      }else{
        res.json({success:true, msg:"location Deleted Successfully!"});
      }
    });
  },
    trackLogoutTime: function(req,res){
        let userId = req.params.id;
        User.findUserActivity(userId, function (err, logDetails) {
            if (err){
                res.json({success:false, message:err});
                //throw err ;
            }else{
                let todayDate = new Date();
                logDetails[0].logDetails.reverse()[0].logoutTime = todayDate;

                User.findOneAndUpdate({'_id': logDetails[0]._id}, {'$set': { logDetails :  logDetails[0].logDetails.reverse()}}, {new: true}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.json({success:true, message:"TrackedLogoutTime"});
            }
        });
    }
};

module.exports = user;