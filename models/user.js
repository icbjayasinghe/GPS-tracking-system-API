var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema
var UserSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: true
    },
    emailAddress:{
        type: String,
        required: true
    },
	userName:{
        type: String,
        unique: true,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	roles: {
        type: String,
        default: ['User']
    },
    location:[{
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }],
    status:{
        type: String,
		required: true
    },
    logDetails:[{
        loggingTime: {
            type: String,
            required: true
        },
        logoutTime: {
            type: String,
            required: true
        },
        passwordChangedTime: {
            type: String,
            required: true
        }
        }]
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                console.log('all hash done');
                next();
            });
        });
    } 
    else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        //give it to callback function of cb(in server.js)
        cb(null, isMatch);
    });
};

var User = module.exports = mongoose.model('User',UserSchema);

//Add User
module.exports.createUser = function(user, callback){
	user.save(callback);
}
//Get User
module.exports.getUsers = function(callback, limit){
	User.find(callback).limit(limit);
}
//Get User 
module.exports.getUser = function(_id, callback){
	User.findById(_id, callback);
}
//Get User Name
module.exports.getUserName = function(_id, callback){
	User.findById(_id,{userName:1} ,callback);
}
//find user by name
module.exports.findUserByName = function(userName, callback){
    User.find({userName:userName}, callback);
}
// edit user
module.exports.editUser = function(user, userId, callback){
    User.findOneAndUpdate({_id: userId}, user, {new: true}, callback);
}
//delete user by flag
module.exports.resetStatus = function(userId,options,callback){
    quary = {_id:userId};
    var update = { status: 'Deleted'};
    User.findOneAndUpdate(quary, update, options, callback);  
};
//reset password
module.exports.restPassword = function(userRestPasswordDetails,callback){
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            throw err;
        }
        bcrypt.hash(userRestPasswordDetails.userName, salt, function (err, hash) {
            if (err) {
                throw err;
            }
            var quary = {_id: userRestPasswordDetails.userId};
            var newPassword = hash;
            var update = {password: newPassword};
            User.findOneAndUpdate(quary, update, callback);
        });
    });
};
//change password
module.exports.changePassword = function(userPasswordDetails,user, callback) {
    bcrypt.compare(userPasswordDetails.currentPassword, user.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        else if (!isMatch) {
            return callback(null, isMatch);
        } else {
            quary = {_id: userPasswordDetails.userId};
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    throw err;
                }
                bcrypt.hash(userPasswordDetails.newPassword, salt, function (err, hash) {
                    if (err) {
                        throw err;
                    }
                    var newPassword = hash;
                    var update = {password: newPassword};
                    User.findOneAndUpdate(quary, update, callback);
                });
            });
        }
    });
};
//view location
module.exports.viewAllLocation = function(userName, callback){
    quary = { userName:userName};
    User.findOne(quary,{ location: 1 }, callback);
}
//delete location
module.exports.deleteLocation = function(userId, locationId,callback){
    User.update( {_id: userId }, { $pull: {location : {_id: locationId }} }, callback );
}
// update user activities
module.exports.findUserActivity = function(userId, callback){
    User.find({_id:userId},{logDetails: 1}, callback);
}