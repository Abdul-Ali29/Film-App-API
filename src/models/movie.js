const mongoose = require('mongoose')
const validator = require('validator')


const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if(value > 5) {
                throw new Error('Rating must be 0 to 5!')
            }
        },
    },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: 200
        },
        
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }

    
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie