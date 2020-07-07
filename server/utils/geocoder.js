const NodeGeocoder = require('node-geocoder')
const config = require('../config').get(process.env.NODE_ENV)

const options = {
    provider: config.PROVIDER,
    apiKey: config.PROVIDER_API_KEY,
    formatter: null 
};
   
const geocoder = NodeGeocoder(options)

module.exports = geocoder