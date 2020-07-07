const {Admin} = require('../models/admin')

//checks for the authentication of the admin associated with a JWT
let AdminAuthMiddleware = (req, res, next) => {
    let token = req.cookies.adminauth

    Admin.findByToken(token, (err, admin) => {
        if (err) return res.json(err)
        if (!admin) return res.send(false)

        req.token = token
        req.admin = admin
        return next()
    })
}

module.exports = {AdminAuthMiddleware}