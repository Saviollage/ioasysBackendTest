const mongoose = require("../../database/database");

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
    },
    director: {
        type: String,
        required: true
    },
    genres: [{
        type: String
    }],
    releaseDate: {
        type: String
    },
    actors: [{
        type: String
    }],
    totalVotes: {
        type: Number,
        default: 0
    },
    quantVotes: {
        type: Number,
        default: 0,
        select: false
    },
    averageVotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
