const mongoose = require('mongoose')

const CeremonySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    place: {
        type: String
    },
    date: {
        type: String
    },
    host: {
        type: String
    },
    guests: {
        tipe: String
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Ceremony', CeremonySchema)