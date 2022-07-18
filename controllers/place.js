const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../software/software')

// Places routes
const Place = require('../modules/Place')
const Joi = require('@hapi/joi');

const schemaPlace = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(255).required(),
    city: Joi.string().min(3).max(255).required(),
    state: Joi.string().min(3).max(255).required(),
    zip: Joi.string().min(3).max(255).required(),
    country: Joi.string().min(3).max(255).required(),
    information: Joi.string().min(3).max(500).required(),
    status: Joi.string().min(6).max(7).required()
});

// Show Place page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('place/place')
})

// Post Place into the database
router.post('/', ensureAuthenticated, async(req, res) => {

    const { error } = schemaPlace.validate(req.body);

    if (error) {
        //await alert(error.details[0].message);
        return res.status(400).send({
            error: error.details[0].message
        });
    }

    try {
        req.body.user = req.user.id
        await Place.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err.message)
        res.redirect('geterror/error500')
    }
})

// Get all public places
router.get('/', ensureAuthenticated, async(req, res) => {
    try {
        const places = await Place.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
        res.render('place/index', {
            places: places,
        })
    } catch (err) {
        console.error(err)
        res.render('geterror/error500')
    }
}) 

// Delete Place
router.delete('/delete/:id', ensureAuthenticated, async(req, res) => {
    try {
        const place = await Place.findOne({ _id: req.params.id }).lean()

        if (!place) {
            return res.render('geterror/error404')
        }

        if (place.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            await Place.deleteOne({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('geterror/error500')
    }
})

// Edit Place by id
router.get('/edit/:id', ensureAuthenticated, async(req, res) => {
    try {
        const place = await Place.findOne({ _id: req.params.id }).lean()

        if (!place) {
            return res.render('geterror/error404')
        }

        if (place.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            res.render('place/place', {
                place: place,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('geterror/error500')
    }
}) 

// Put Place by id
router.put('/edit/:id', ensureAuthenticated, async(req, res) => {
    try {
        const place = await Place.findOne({ _id: req.params.id }).lean()

        if (!place) {
            return res.render('geterror/error404')
        }

        if (place.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            await Place.findOneAndUpdate({ _id: req.params.id }, req.body)
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('geterror/error500')
    }
})

router.get('/test/:id', async(req,res) => {
    let id = req.params.id
    if (id == '04') {
        res.status(200)
    } else {
        res.status(404)
    }
})

module.exports = router