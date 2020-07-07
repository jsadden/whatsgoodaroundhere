const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const restaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    postCode: {
        type: String,
        required: true,
        trim: true
    },
    uniqueIdentifier: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: {
            type: String
        }
    },
    typeTags: {
        type: [String]
    },
    forReview: {
        pending: {
            type: Boolean
        },
        submittedBy: {
            type: String
        }
    }
})

//presave geocoder to get location and formatted address data
restaurantSchema.pre('save', async function(next){
    var restaurant = this

    const loc = await geocoder.geocode(restaurant.address + " " + restaurant.city)

    restaurant.location = {
        type: 'Point',
        coordinates: [loc[0].latitude, loc[0].longitude],
        formattedAddress: loc[0].formattedAddress
    }

    next()
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = {Restaurant}