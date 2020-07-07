const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config').get(process.env.NODE_ENV)
const SALT_I = 10

const adminSchema = mongoose.Schema({
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
    }
})


//determines if an admin is new or is trying to change password, then salts and hashes before storing
adminSchema.pre('save', function(next){
    var admin = this

    if (admin.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(admin.password, salt, function(err, hash) {
                if (err) return next(err)

                admin.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


//checks if password sent matches password in database
adminSchema.methods.comparePassword = function(candidate, cb) {
    var admin = this

    bcrypt.compare(candidate, admin.password, function(err, isMatch){
        if (err) return cb(err)
        
        cb(null, isMatch)
    })
}

//generates JWT for cookie authentication
adminSchema.methods.generateToken = function(cb) {
    var admin = this

    var token = jwt.sign(admin._id.toHexString(), config.SECRET)
    admin.token = token

    admin.save((err, admin) => {
        if (err) return cb(err)

        cb(null, admin)
    })
    
}

//static method called from authentication middleware --> checks if a admin is associated with a given token
adminSchema.statics.findByToken = function(token, cb) {
    var admin = this

    jwt.verify(token, config.SECRET, function(err, decode) {
        if (err) return cb(err)

        admin.findOne({_id:decode, token:token}, function(err, admin) {
            if (err) return cb(err)
            
            cb(null, admin)
        })
    })
}

//delete JWT, called on logout
adminSchema.methods.deleteToken = function(token, cb) {
    var admin = this

    admin.updateOne({$unset: {token: 1}}, function(err,admin) {
        if (err) return cb(err)

        cb(null, admin)
    })
}


const Admin = mongoose.model('Admin', adminSchema)

module.exports = {Admin}