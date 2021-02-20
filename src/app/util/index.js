const logger = require('pino')({
    prettyPrint: {
        ignore: 'pid,hostname'
    }
})
const key = process.env.KEY

function filterQuery(query) {
    const { skip, limit, ...filter } = query
    const pagination = {
        skip: skip ? Number(skip) : 0,
        limit: limit ? Number(limit) : 10
    }
    return { filter, pagination }
}

module.exports = { logger, key, filterQuery }