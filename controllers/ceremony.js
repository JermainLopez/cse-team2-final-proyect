const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../software/software')

//Ceremony routes
const Ceremony = require('../modules/Ceremony')
const Joi = require('@hapi/joi');

const schemaCeremony = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    place: Joi.string().min(3).max(255).required(),
    date: Joi.string().min(3).max(255).required(),
    host: Joi.string().min(3).max(255).required(),
    guests: Joi.string().min(3).max(10).required(),
    information: Joi.string().min(3).max(500).required(),
    status: Joi.string().min(6).max(7).required()
});
//Show Ceremony page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ceremony/ceremony', {error: 'false'})
})

//Post Ceremony into de database
router.post('/', ensureAuthenticated, async(req, res) => {

    const { error } = schemaCeremony.validate(req.body);

    if (error) {
        console.log(error.details[0].message);
        return res.render('ceremony/ceremony', {error: error.details[0].message});
    }

    try {
        req.body.user = req.user.id
        await Ceremony.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err.message)
        res.render('geterror/error500')
    }
})

//Get all public ceremonies
router.get('/', ensureAuthenticated, async(req, res) => {
    try {
        const ceremonies = await Ceremony.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
        res.render('ceremony/index', {
            ceremonies: ceremonies,
        })
    } catch (err) {
        console.error(err)
        res.render('geterror/error500')
    }
})

//Delete Ceremony
router.delete('/delete/:id', ensureAuthenticated, async(req, res) => {
    try {
        const ceremony = await Ceremony.findOne({ _id: req.params.id, }).lean()

        if (!ceremony) {
            return res.render('geterror/error404')
        }

        if (ceremony.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            await Ceremony.deleteOne({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('geterror/error500')
    }
})


//Edit ceremony by id
router.get('/:id', ensureAuthenticated, async(req, res) => {
        try {
            const ceremony = await Ceremony.findOne({ _id: req.params.id, }).lean()

            if (!ceremony) {
                return res.render('geterror/error404')
            }

            if (ceremony.user != req.user.id) {
                res.redirect('/dashboard')
            } else {
                res.render('ceremony/edit', {
                    ceremony,
                })
            }
        } catch (err) {
            console.error(err)
            return res.render('geterror/error500')
        }
    })

    router.get('/details/:id', async(req, res) => {
        try {
            const ceremony = await Ceremony.findOne({ _id: req.params.id, }).lean()

            if (!ceremony) {
                return res.render('geterror/error404')
            }

            res.render('ceremony/details', {
                ceremony,
            })
        } catch (err) {
            console.error(err)
            return res.render('geterror/error500')
        }
    })
    //Put ceremony by id
router.put('/:id', ensureAuthenticated, async(req, res) => {
    try {
        const ceremony = await Ceremony.findOne({ _id: req.params.id, }).lean()

        if (!ceremony) {
            return res.render('geterror/error404')
        }

        if (ceremony.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            await Ceremony.findOneAndUpdate({ _id: req.params.id }, req.body)
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('geterror/error500')
    }
})

router.get('/test/:id', async(req,res) => {
    let id = req.params.id;
    if (id == '04') {
        res.status(200);
    }
    else {
        res.status(400);
    }
})




module.exports = router