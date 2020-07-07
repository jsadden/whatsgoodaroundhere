const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const config = require('./config').get(process.env.NODE_ENV)

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

//routes
const Admin = require('./routes/admins')
app.use('/api/admins', Admin)
const User = require('./routes/users')
app.use('/api/users', User)
const Restaurant = require('./routes/restaurants')
app.use('/api/restaurants', Restaurant)
const MenuItem = require('./routes/menuItems')
app.use('/api/menuItems', MenuItem)

//connect to database
mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.use(express.static('client/build'))

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log('Server running')
})