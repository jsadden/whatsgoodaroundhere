const express = require('express')
const router = express.Router()

//authentication middleware
const {AuthMiddleware} = require('../middleware/authMiddleware')

//user model
const {User} = require('../models/user')

/////////////////
//register a user
/////////////////
router.post('/register', (req, res) => {
    const user = new User(req.body)

    //attempt to save user -- presave and model validation will run in the user model
    user.save((err, doc) => {

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

        //if no errors, authenticate user with JWT
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err)

            //if nothing went wrong, place a cookie and send user data
            res.cookie('auth', user.token).json({
                success:true,
                message: 'Registration successful',
                user:doc
            })
        })
    })
})

/////////////////
//login a user
/////////////////
router.post('/login', (req, res) => {
    User.findOne({email:req.body.email}, (err, user) => {

        //if no user found, return no auth or data, along with error message
        if (!user) {
            return res.json({
                auth: false,
                message: 'User not found',
                userData: false
            })
        }

        //if user found, check password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    auth:false,
                    message: "Password does not match",
                    userData: false
                })
            }

            //if password matched, generate a login token
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                //if nothing went wrong, place a cookie and send user data
                res.cookie('auth', user.token).json({
                    auth: true,
                    message: "Login successful",
                    userData: {
                        id: user._id,
                        email: user.email,
                        username: user.username
                    },
                    recommended: user.recommended
                })
            })
        })

    })
})


/////////////////
//check for user authentication
/////////////////
router.get('/auth', AuthMiddleware, (req,res) => {
    res.json({
        auth: true,
        userData: {
            id: req.user._id,
            email: req.user.email,
            username: req.user.username
        },
        recommended: req.user.recommended
    })
})

/////////////////
//change an authenticated users password
/////////////////
router.post('/passwordchange', AuthMiddleware, (req,res) => {
    
    //compare existing password for another verification
    req.user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return res.send(err)

        //if no match, return this
        if (!isMatch) {
            return res.json({
                auth:false,
                message: "Password incorrect",
                userData: false
            })
        }

        //if match, change password
        req.user.password = req.body.newPassword

        req.user.save((err, doc) => {
            if (err) return res.json({auth:false, success: false, userData: false})
    
            res.json({
                auth: true,
                success:true,
                user:doc
            })
        })
    })
})

/////////////////
//logout a user
/////////////////
router.get('/logout', AuthMiddleware, (req,res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).json({success:false, message: 'Something went wrong, please refresh the page'})

        res.status(200).json({success: true, message: 'Logout successful'})
    })
})


/////////////////
//add to user recommended items
/////////////////
router.route('/recommended')
.post(AuthMiddleware, (req,res) => {
    req.user.addRecommendation(req.body.recommendation, (err, itemfound, doc) => {
        if (err) return res.json({success: false, message: 'Something went wrong'})

        if (itemfound) return res.json({success: false, message: 'Item already recommended', user:doc})

        res.json({success: true, message: 'Recommendation added', user:doc})
    })
})

/////////////////
//update user recommended items
/////////////////
.patch(AuthMiddleware, (req,res) => {
    
    req.user.deleteRecommendation(req.body.recommendation, (err, itemfound, doc) => {
        if (err) return res.json({success: false, message: 'Something went wrong'})

        if (!itemfound) return res.json({success: false, message: 'Recommendation already removed', user:doc})

        res.json({success: true, message: 'Recommendation removed', user:doc})
    })
}) 


module.exports = router