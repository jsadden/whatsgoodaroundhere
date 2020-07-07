//dotenv
const dotenv = require('dotenv')
dotenv.config()

//config
const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
        PROVIDER: process.env.PROVIDER,
        PROVIDER_API_KEY: process.env.PROVIDER_API_KEY
    },
    default:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
        PROVIDER: process.env.PROVIDER,
        PROVIDER_API_KEY: process.env.PROVIDER_API_KEY
    }
}

exports.get = function get(env){
    return config[env] || config.default
}
