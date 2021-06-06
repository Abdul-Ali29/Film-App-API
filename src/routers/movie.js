const express = require('express')
const Movie = require('../models/movie')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/movies', auth, async (req, res) => {
    const movie = Movie({
        ...req.body,
        owner: req.user._id
    })

    try {
        await movie.save()
        res.status(201).send(movie)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/movies', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.rating) {
        match.rating = req.query.rating

    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'movies',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        }).execPopulate()
        res.send(req.user.movies)
    } catch (e) {
        res.status(500).send()
    }

})

router.get('/movies/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const movie = await Movie.findOne({_id, owner: req.user._id })

        if (!movie) {
            return res.status(404).send()
        }

        res.send(movie)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/movies/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'director', 'rating', 'description']
    isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid Updates!' })
    }

    try {
        const movie = await Movie.findOne({ _id: req.params.id, owner: req.user._id})

        if (!movie) {
            res.status(400).send()

        }

        updates.forEach((update) => movie[update] = req.body[update])
        await movie.save()
        res.send(movie)
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.delete('/movies/:id', auth, async (req, res) => {
    try {
        const movie = await Movie.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        

        if (!movie) {
            return res.status(404).send()
        }

        res.send(movie)
    } catch (e) {
        res.send(500).send(e)
    }
})

module.exports = router