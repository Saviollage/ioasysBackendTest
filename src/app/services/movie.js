const Movie = require('../models/movie')
const objectId = require('mongoose').Types.ObjectId;

class MovieService {
    constructor() {
        this.movieRepository = Movie
    }
    /**
        * Get all movier
        *
        * @param {Object} filter
        * @return {Promise<movie>}
        */
    async findAll(filter = {}, pagination) {
        const query = this.movieRepository.find(filter)
            .skip(pagination.skip)
            .limit(pagination.limit)
        const movies = await query.exec()
        const total = await this.movieRepository.countDocuments()
        return { movies, total };
    }

    /**
    * Search for movie id
    *
    * @param {ObjectId} id
    * @return {Promise<movie>}
    */
    async findById(id) {
        if (!objectId.isValid(id))
            throw {
                code: 400,
                message: `Please provide a valid ID`
            }
        const movie = await this.movieRepository
            .findById(id)
            .select("+totalVotes")
            .select("+quantVotes")
        if (!movie)
            throw {
                code: 404,
                message: `Movie ${id} not found`
            }
        return movie;
    }

    /**
    * Search for movie title.
    * Throw error if exists. Use this function before create a new one
    * @param {string} title
    * @return {Promise<movie>}
    */
    async findByTitle(title) {
        const movie = await this.movieRepository
            .findOne({ title })
        if (movie)
            throw {
                code: 400,
                message: `Movie ${title} alerady exists`
            }
    }

    /**
    * Create new movie
    *
    * @param {object} params   
    * @return {Promise<movie>}
    */
    async createMovie(params = {}) {
        await this.findByTitle(params.title)

        const movie = await this.movieRepository
            .create({ ...params })
            .catch(error => {
                throw {
                    code: 400,
                    message: error.message
                }
            })
        return movie
    }

    /**
    * Vote on movie
    *
    * @param {objectId} movieId
    * @param {number} vote
    * @return {Promise<movie>}
    */
    async vote(movieId, vote) {
        if (vote < 0 || vote > 4)
            throw {
                code: 400,
                message: `Please provide a vote between [0, 4]`
            }
        const movie = await this.findById(movieId)
        movie.totalVotes += vote
        movie.quantVotes++
        movie.averageVotes = (movie.totalVotes / movie.quantVotes).toFixed(2)
        await movie.save()
        // Limpando o retorno
        movie.totalVotes = undefined
        return movie
    }
}

const movieService = new MovieService()

module.exports = movieService