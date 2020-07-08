const express = require('express')
const router = express.Router()

//restaurant model
const {Restaurant} = require('../models/restaurant')

//auth middleware
const {AuthMiddleware} = require('../middleware/authMiddleware')
const {AdminAuthMiddleware} = require('../middleware/adminAuthMiddleware')

////////////////////////////////////
//post a restaurant if authenticated
////////////////////////////////////
router.post('/addRestaurant', AuthMiddleware, (req,res) => {
    const restaurant = new Restaurant(req.body)


    //set for admin approval
    restaurant.forReview = {
        pending: true,
        submittedBy: req.user.email
    }

    //attempt to save
    restaurant.save((err,doc) => {
        if (err) {

            //duplicate restaurant
            if (err.code === 11000 && err.keyValue.uniqueIdentifier) {
                return res.json({success: false, message: 'This restaurant already exists', restaurant: false})
            }

            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Restaurant added', restaurant: doc})
    })
})


////////////////////////////////////
//get all matching by name
////////////////////////////////////
router.get('/getByName', (req,res) => {
    Restaurant.find({name: { "$regex": req.query.name, "$options": "i" }}, (err, docs) => {
        if (err) {
            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurants: false})
        }

        //search was valid but returned nothing
        if (docs.length < 1) {
            return res.json({success: true, message: 'Could not find any restaurants with this name', restaurants: false})
        }

        return res.json({success: true, message: 'Matching restaurants found', restaurants: docs})
    })
})


////////////////////////////////////
//get all matching by address
////////////////////////////////////
router.get('/getByAddress', (req,res) => {
    Restaurant.find({address: { "$regex": req.query.address, "$options": "i" }}, (err, docs) => {
        if (err) {
            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurants: false})
        }

        //search was valid but returned nothing
        if (docs.length < 1) {
            return res.json({success: true, message: 'Could not find any restaurants with this address', restaurants: false})
        }

        return res.json({success: true, message: 'Matching restaurants found', restaurants: docs})
    })
})


////////////////////////////////////
//get all matching by post code
////////////////////////////////////
router.get('/getByPostCode', (req,res) => {
    Restaurant.find({postCode: { "$regex": req.query.postCode, "$options": "i" }}, (err, docs) => {
        if (err) {
            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurants: false})
        }

        //search was valid but returned nothing
        if (docs.length < 1) {
            return res.json({success: true, message: 'Could not find any restaurants with this post code', restaurants: false})
        }

        return res.json({success: true, message: 'Matching restaurants found', restaurants: docs})
    })
})


////////////////////////////////////
//get all matching by city
////////////////////////////////////
router.get('/getByCity', (req,res) => {
    Restaurant.find({city: { "$regex": req.query.city, "$options": "i" }}, (err, docs) => {
        if (err) {
            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurants: false})
        }

        //search was valid but returned nothing
        if (docs.length < 1) {
            return res.json({success: true, message: 'Could not find any restaurants in this city', restaurants: false})
        }

        return res.json({success: true, message: 'Matching restaurants found', restaurants: docs})
    })
})

////////////////////////////////////
//get one by unique identifier
////////////////////////////////////
router.get('/getUnique', (req,res) => {

    Restaurant.findOne({uniqueIdentifier: { "$regex": req.query.name + '.*' + req.query.address + '.*' + req.query.city, "$options": "i" }}, (err, doc) => {
        if (err) {
            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //search was valid but returned nothing
        if (!doc) {
            return res.json({success: true, message: 'Could not find any restaurants that match', restaurant: false})
        }

        return res.json({success: true, message: 'Matching restaurant found', restaurant: doc})
    })
})


////////////////////////////////////
//get all by unique identifier
////////////////////////////////////
router.get('/getRestaurants', (req,res) => {

    let findParams = {}

    //regex of possible restaurant names
    let restaurantRegex = req.query.name.join("|")

    //query parameters
    findParams = {
        name: { "$regex": restaurantRegex , "$options": "i"},
        city: { "$regex": req.query.city , "$options": "i"},
        address: { "$regex": req.query.address , "$options": "i"}
    }

    Restaurant.find(findParams, (err, doc) => {
        if (err) {
            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //filter out unapproved restaurants
        var filteredDocs = doc.filter(restaurant => {
            return !(restaurant.forReview && restaurant.forReview.pending)
        })

        //search was valid but returned nothing
        if (filteredDocs.length < 1) {
            return res.json({success: true, message: 'Could not find any restaurants that match', restaurant: false})
        }


        return res.json({success: true, message: 'Matching restaurant found', restaurant: filteredDocs})
    })
})


////////////////////////////////////
//admin approve restaurant
////////////////////////////////////
router.route('/approveRestaurant')
.post(AdminAuthMiddleware, (req,res) => {
    Restaurant.findOneAndUpdate({_id: req.body._id},
    {$unset: {forReview: 1}},
    {new: true},
    (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //check to see if restaurant was found
        if (!doc) {
            return res.json({success:false, message: 'Restaurant not found', restaurant: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Restaurant approved', restaurant: doc})
    })
})

////////////////////////////////////
//admin approve restaurant with edits
////////////////////////////////////
.patch(AdminAuthMiddleware, (req,res) => {

    Restaurant.findOneAndDelete({_id: req.body._id},
    (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //check to see if restaurant was found
        if (!doc) {
            return res.json({success:false, message: 'Restaurant not found', restaurant: false})
        }


        //make a new entry -- this triggers the mapquest api latlong if address changed
        const restaurant = new Restaurant(req.body)

        //attempt to save
        restaurant.save((err,item) => {
            if (err) {

                //duplicate restaurant
                if (err.code === 11000 && err.keyValue.uniqueIdentifier) {
                    return res.json({success: false, message: 'This restaurant already exists', restaurant: false})
                }

                //general error
                return res.json({success: false, message: 'Something went wrong, please try again', restaurant: false})
            }

            //if no errors then return the data
            return res.json({success:true, message:'Restaurant approved with edits', restaurant: item})
        })

    })
})

////////////////////////////////////
//admin reject restaurant
////////////////////////////////////
router.post('/rejectRestaurant', AdminAuthMiddleware, (req,res) => {
    Restaurant.findOneAndDelete({_id: req.body._id},
    (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //check to see if restaurant was found
        if (!doc) {
            return res.json({success:false, message: 'Restaurant not found', restaurant: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Restaurant rejected', restaurant: doc})
    })
})


////////////////////////////////////
//admin get pending restaurants
////////////////////////////////////
router.get('/getPendingRestaurants', AdminAuthMiddleware, (req,res) => {
    Restaurant.find({'forReview.pending': true},
        (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', restaurant: false})
        }

        //check to see if restaurant was found
        if (doc.length < 1) {
            return res.json({success:false, message: 'No restaurants are pending approval', restaurant: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Pending restaurants found', restaurant: doc})
    })
})

module.exports = router