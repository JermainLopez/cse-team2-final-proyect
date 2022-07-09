const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.send('login')
})

router.get('/dashboard', (req, res) => {
    res.send('dashboard')
})

router.get('/ceremony', require('./ceremony'))
module.exports = router