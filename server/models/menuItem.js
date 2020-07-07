const mongoose = require('mongoose')

const menuItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    restaurant: {
        type: String,
        required: true,
        trim: true
    },
    recommendations: {
        type: Number,
        required: true,
        trim: true
    },
    uniqueIdentifier: {
        type: String,
        required: true,
        trim: true,
        unique: true
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

const MenuItem = mongoose.model('MenuItem', menuItemSchema)

module.exports = {MenuItem}