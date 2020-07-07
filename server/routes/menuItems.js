const express = require('express')
const router = express.Router()

//authentication middleware
const {AuthMiddleware} = require('../middleware/authMiddleware')
const {AdminAuthMiddleware} = require('../middleware/adminAuthMiddleware')

//menu item model
const {MenuItem} = require('../models/menuItem')

////////////////////////////////////
//post a menu item if authenticated
////////////////////////////////////
router.route('/item')
.post(AuthMiddleware, (req,res) => {
    const menuItem = new MenuItem(req.body)

    //set for admin approval
    menuItem.forReview = {
        pending: true,
        submittedBy: req.user.email
    }

    menuItem.save((err, doc) => {
        if (err) {

            //duplicate menu item
            if (err.code === 11000 && err.keyValue.uniqueIdentifier) {
                return res.json({success: false, message: 'This menu item already exists', item: false})
            }

            //general error
            return res.json({success: false, message: 'Something went wrong, please try again', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Menu item added', item: doc})

    })
})

////////////////////////////////////
//add a recommendation if authenticated
////////////////////////////////////
.patch(AuthMiddleware, (req,res) => {
    MenuItem.findOneAndUpdate(
        {uniqueIdentifier: { "$regex": req.body.name + '.*' + req.body.restaurant, "$options": "i" }}, 
        {$inc : {recommendations: req.body.increment}}, //increment recommentdations
        {new: true}, //return updated object
        (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (!doc) {
            return res.json({success:false, message: 'Menu item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Menu item recommended', item: doc})
    })
})

////////////////////////////////////
//get a specific menu item
////////////////////////////////////
.get((req,res) => {
    MenuItem.findOne(
        {uniqueIdentifier: { "$regex": req.quey.name + '.*' + req.query.restaurant, "$options": "i" }},
        (err, doc) => {
            
        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (!doc) {
            return res.json({success:false, message: 'Menu item not found', item: false})
        }
        
        //if no errors then return the data
        return res.json({success:true, message:'Menu item found', item: doc})
    })
})

////////////////////////////////////
//get list of items by restaurant name
////////////////////////////////////
router.get('/getByRestaurant', (req,res) => {
    MenuItem.find({restaurant: { "$regex": req.query.restaurant, "$options": "i" }}, (err, doc) => {
        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (doc.length < 1) {
            return res.json({success:false, message: 'Menu item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Menu items found', item: doc})
    })
})

////////////////////////////////////
//get list of items by item name
////////////////////////////////////
router.get('/getByName', (req,res) => {
    MenuItem.find({name: { "$regex": req.query.name, "$options": "i" }}, (err, doc) => {
        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (doc.length < 1) {
            return res.json({success:false, message: 'Menu item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Menu items found', item: doc})
    })
})

////////////////////////////////////
//get list of items by item and restaurant name
////////////////////////////////////
router.get('/getByUnique', (req,res) => {
    

    let findParams = {}
    if (req.query.typeTags !== '') {
        findParams = {uniqueIdentifier: { "$regex": req.query.name + '.*' + req.query.restaurant, "$options": "i" }, typeTags: {"$regex": req.query.typeTags, "$options": "i"}}
    } else {
        findParams = {uniqueIdentifier: { "$regex": req.query.name + '.*' + req.query.restaurant, "$options": "i" }}
    }

    MenuItem.find(findParams, 
        
        (err, doc) => {
        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //filter out unapproved restaurants
        var filteredDocs = doc.filter(item => {
            return !(item.forReview && item.forReview.pending)
        })

        //check to see if menu item was found
        if (filteredDocs.length < 1) {
            return res.json({success:false, message: 'Menu item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Menu items found', item: filteredDocs})
    })
})

////////////////////////////////////
//admin approve item
////////////////////////////////////
router.route('/approveItem')
.post( AdminAuthMiddleware, (req,res) => {

    MenuItem.findOneAndUpdate({_id: req.body._id},
    {$unset: {forReview: 1}},
    {new: true},
    (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (!doc) {
            return res.json({success:false, message: 'Item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Item approved', item: doc})
    })
})
////////////////////////////////////
//admin approve item with edits
////////////////////////////////////
.patch( AdminAuthMiddleware, (req,res) => {

    MenuItem.findOneAndDelete({_id: req.body._id},
    (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (!doc) {
            return res.json({success:false, message: 'Item not found', item: false})
        }

        //create a new item
        const menuItem = new MenuItem(req.body)

        menuItem.save((err, item) => {
            if (err) {

                //duplicate menu item
                if (err.code === 11000 && err.keyValue.uniqueIdentifier) {
                    return res.json({success: false, message: 'This menu item already exists', item: false})
                }

                //general error
                return res.json({success: false, message: 'Something went wrong, please try again', item: false})
            }

            //if no errors then return the data
            return res.json({success:true, message:'Menu item added', item: item})

        })

    })


})


////////////////////////////////////
//admin reject item
////////////////////////////////////
router.post('/rejectItem', AdminAuthMiddleware, (req,res) => {

    MenuItem.findOneAndDelete({_id: req.body._id},
    (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (!doc) {
            return res.json({success:false, message: 'Item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Item removed', item: doc})
    })
})


////////////////////////////////////
//get list of items by item id
////////////////////////////////////
router.get('/getById', (req,res) => {
    MenuItem.find({_id: req.query._id}, (err, doc) => {
        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (doc.length < 1) {
            return res.json({success:false, message: 'Menu item not found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Menu items found by id', item: doc})
    })
})


////////////////////////////////////
//admin get pending items
////////////////////////////////////
router.get('/getPendingItems', AdminAuthMiddleware, (req,res) => {

    MenuItem.find({'forReview.pending': true},
        (err, doc) => {

        //check for errors
        if (err) {
            return res.json({success:false, message: 'Something went wrong, please try again', item: false})
        }

        //check to see if menu item was found
        if (doc.length < 1) {
            return res.json({success:false, message: 'No pending items found', item: false})
        }

        //if no errors then return the data
        return res.json({success:true, message:'Pending items found', item: doc})
    })
})

module.exports = router