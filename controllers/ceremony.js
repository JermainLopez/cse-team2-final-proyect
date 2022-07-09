const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../software/software')

//Ceremony routes
const Ceremony = require('../modules/Ceremony')

//Show Recipe page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ceremony/ceremony')
})

//Post Ceremony into de database
router.post('/', ensureAuthenticated, async(req, res) => {
    try {
        req.body.user = req.user.id
        await Ceremony.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err.message)
        res.redirect('geterror/error500')
    }
})

router.get('/', ensureAuthenticated, async(req, res) => {
    try {
        const ceremony = await Ceremony.find({ status: 'public' }).populate('ceremony').sort({ createdAt: 'desc' }).lean()
        res.render('ceremony/index', {
            ceremony: ceremony,
        })
    } catch (err) {
        console.error(err)
        res.render('geterror/error500')
    }
})





module.exports = router