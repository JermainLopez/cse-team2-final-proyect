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

//config my passport
require('./config/password')(passport)
    // Load config variables
dotenv.config()

//Start app
const app = express()
    // Connect to MongoDB
connectDB()

//Add body parser to parse the body of the request
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override whit this methos we can send a POST request with a PUT or DELETE method
app.use(
    methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)


//Suager
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-wedding-output.json');


// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//Handlebars
const { engine } = require('express-handlebars')
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoDbStore.create({
            mongoUrl: process.env.MONGODB_URI,
        })
    })
)

//set passport middleware
app.use(passport.initialize())
app.use(passport.session())


//My static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/ceremonies', require('./controllers/ceremony'))
app.use('/ceremonies/delete/', require('./controllers/ceremony'))
app.use('/places', require('./controllers/place'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080

app.listen(
    PORT,
    console.log(`Server running in mode on port ${PORT}`)
)