//config
const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
        PROVIDER: process.env.PROVIDER,
        PROVIDER_API_KEY: process.env.PROVIDER_API_KEY
    },
    default:{
        SECRET: 'secret',
        DATABASE: 'mongodb://localhost:27017/whatsgoodaroundhere',
        PROVIDER: 'mapquest',
        PROVIDER_API_KEY: '8R6cTirlnIl5pe6VfFbMKHr0Ux89q5l4'
    }
}

exports.get = function get(env){
    return config[env] || config.default
}
