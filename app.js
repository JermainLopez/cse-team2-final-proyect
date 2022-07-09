const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoDbStore = require('connect-mongo')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// Load config and path all variables
dotenv.config({ path: './config.env' })

const app = express()
    // Connect to MongoDB database from Jermain mongodb database
connectDB()


//Add body parser to parse the body of the request for each controller
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Suagger method to use the PUT and DELETE method in the form
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-wedding-output.json');



// Save each session in the mongodb database
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoDbStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
)

//set passport middleware to use session
app.use(passport.initialize())
app.use(passport.session())

//My static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'))
    //app.use('/ceremony', require('./controllers/ceremony'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/', require('./routes/'))
//app.use('/', require('./routes/'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in mode on port ${PORT}`)
)