const express = require('express')
const router = express.Router()

router.get('/', require('../controllers/ceremony'))

router.get('/:id', require('../controllers/ceremony'))

//Call the funtion to create a new contact
router.post('/', require('../controllers/ceremony'))

//Update the contact from database
router.put('/:id', require('../controllers/ceremony'))

//Delete the contact from database
router.delete('/:id', require('../controllers/ceremony'))

module.exports = router