const express = require('express')
const router = express.Router()

//authentication middleware
const {AdminAuthMiddleware} = require('../middleware/adminAuthMiddleware')

//admin model
const {Admin} = require('../models/admin')

/////////////////
//register an admin
/////////////////
router.post('/register', (req, res) => {
    
    //check if an admin exists
    Admin.find({}, (err, doc) => {
        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', admin: false})
        }

        //check to see if admin was found
        if (doc.length > 0) {
            return res.json({success:false, message: 'Admin already exists', admin: false})
        }
    

        const admin = new Admin(req.body)

        //attempt to save admin -- presave and model validation will run in the admin model
        admin.save((err, doc) => {

            if (err) {
                //error due to duplicate email
                if (err.code === 11000 && err.keyValue.email) {
                    return res.json({success: false, message: 'This email has already been registered'})
                }

                //error due to duplicate username
                if (err.code === 11000 && err.keyValue.username) {
                    return res.json({success: false, message: 'This username is already in use'})
                }

                //general error
                return res.json({success: false, message: 'Something went wrong, please try again'})
            }

            //if no errors, authenticate admin with JWT
            admin.generateToken((err, admin) => {
                if (err) return res.status(400).send(err)

                //if nothing went wrong, place a cookie and send admin data
                res.cookie('adminauth', admin.token).json({
                    success:true,
                    message: 'Registration successful',
                    admin:doc
                })
            })
        })
    })
})

/////////////////
//login an admin
/////////////////
router.post('/login', (req, res) => {
    Admin.findOne({email:req.body.email}, (err, admin) => {

        //if no admin found, return no auth or data, along with error message
        if (!admin) {
            return res.json({
                auth: false,
                message: 'Admin not found',
                adminData: false
            })
        }

        //if admin found, check password
        admin.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    auth:false,
                    message: "Password does not match",
                    adminData: false
                })
            }

            //if password matched, generate a login token
            admin.generateToken((err, admin) => {
                if (err) return res.status(400).send(err)

                //if nothing went wrong, place a cookie and send admin data
                res.cookie('adminauth', admin.token).json({
                    auth: true,
                    message: "Login successful",
                    adminData: {
                        id: admin._id,
                        email: admin.email,
                        username: admin.username
                    }
                })
            })
        })

    })
})


/////////////////
//check for admin authentication
/////////////////
router.get('/auth', AdminAuthMiddleware, (req,res) => {
    res.json({
        auth: true,
        adminData: {
            id: req.admin._id,
            email: req.admin.email,
            username: req.admin.username
        }
    })
})

/////////////////
//change an authenticated admin password
/////////////////
router.post('/passwordchange', AdminAuthMiddleware, (req,res) => {
    
    //compare existing password for another verification
    req.admin.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return res.send(err)

        //if no match, return this
        if (!isMatch) {
            return res.json({
                auth:true,
                message: "Password incorrect",
                adminData: false
            })
        }

        //if match, change password
        req.admin.password = req.body.newPassword

        req.admin.save((err, doc) => {
            if (err) return res.json({auth:true, success: false, adminData: false})
    
            res.json({
                auth: true,
                success:true,
                admin:doc
            })
        })
    })
})

/////////////////
//logout a admin
/////////////////
router.get('/logout', AdminAuthMiddleware, (req,res) => {
    req.admin.deleteToken(req.token, (err, admin) => {
        if (err) return res.status(400).json({success:false, message: 'Something went wrong, please refresh the page'})

        res.status(200).json({success: true, message: 'Logout successful'})
    })
})

module.exports = router