const express = require('express')
const router = express.Router()
const { ensureAuthenticated, ensureAuthor } = require('../software/software')

//Ceremony routes
const Ceremony = require('../modules/Ceremony')

router.get('/', ensureAuthor, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    try {
        const ceremonies = await Ceremony.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            ceremonies: ceremonies
        })
    } catch (err) {
        console.error(err)
        res.render('geterror/error500')

    }


})

module.exports = router