const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../software/software')

//Ceremony routes
const Ceremony = require('../modules/Ceremony')

//Show Ceremony page
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

//Get all public ceremonies
router.get('/', ensureAuthenticated, async(req, res) => {
    try {
        const ceremonies = await Ceremony.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
        res.render('ceremony/index', {
            ceremonies: ceremonies,
        })
        res.sendStatus(200);
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