const {User} = require('../models/user')

//checks for the authentication of the user associated with a JWT
let AuthMiddleware = (req, res, next) => {
    let token = req.cookies.auth

    User.findByToken(token, (err, user) => {
        if (err) return res.json(err)
        if (!user) return res.send(false)

        req.token = token
        req.user = user
        return next()
    })
}

module.exports = {AuthMiddleware}