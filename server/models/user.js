const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config').get(process.env.NODE_ENV)
const SALT_I = 10

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    username: {
        type: String,
        required: true,
        maxlength: 75,
        unique: true
    },
    token: {
        type: String
    },
    recommended: {
        type: [String]
    }
})


//determines if a user is new or is trying to change password, then salts and hashes before storing
userSchema.pre('save', function(next){
    var user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)

                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


//checks if password sent matches password in database
userSchema.methods.comparePassword = function(candidate, cb) {
    var user = this

    bcrypt.compare(candidate, user.password, function(err, isMatch){
        if (err) return cb(err)
        
        cb(null, isMatch)
    })
}

//generates JWT for cookie authentication
userSchema.methods.generateToken = function(cb) {
    var user = this

    var token = jwt.sign(user._id.toHexString(), config.SECRET)
    user.token = token

    user.save((err, user) => {
        if (err) return cb(err)

        cb(null, user)
    })
    
}

//static method called from authentication middleware --> checks if a user is associated with a given token
userSchema.statics.findByToken = function(token, cb) {
    var user = this

    jwt.verify(token, config.SECRET, function(err, decode) {
        if (err) return cb(err)

        user.findOne({_id:decode, token:token}, function(err, user) {
            if (err) return cb(err)
            
            cb(null, user)
        })
    })
}

//delete JWT, called on logout
userSchema.methods.deleteToken = function(token, cb) {
    var user = this

    user.updateOne({$unset: {token: 1}}, function(err,user) {
        if (err) return cb(err)

        cb(null, user)
    })
}

//add to recommend list
userSchema.methods.addRecommendation = function(item, cb) {
    var user = this

    var index = user.recommended.indexOf(item)
    if (index === -1) {
        user.recommended.push(item)
    } else {
        return cb(null, true, user)
    }
    
    user.save((err, user) => {
        if (err) return cb(err)

        cb(null, false, user)
    })
}

//remove from recommend list
userSchema.methods.deleteRecommendation = function(item, cb) {
    var user = this

    var index = user.recommended.indexOf(item)
    if (index > -1) {
        user.recommended.splice(index, 1)
    } else {
        return cb(null, false, user)
    }

    user.save((err, user) => {
        if (err) return cb(err)

        cb(null, true, user)
    })
}



const User = mongoose.model('User', userSchema)

module.exports = {User}