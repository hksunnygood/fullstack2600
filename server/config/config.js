(() => {
    const fs = require("fs")
    const config = {}
    config.PORT = process.env.PORT || 8080
    config.ROOT = `${__dirname}/../../views`
    config.SALT_ROUNDS = 10
    config.LOG_FILE = `${__dirname}/../logs/nodejs.log`
    config.MEMBERS = `${__dirname}/../../models/data/members.json`
    config.USERS = `${__dirname}/../../models/data/users.json`
    config.REGIONS = `${__dirname}/../../models/data/regions.json`
    config.API_URL = 'https://gist.githubusercontent.com/ajubin/d331f3251db4bd239c7a1efd0af54e38/raw/058e1ad07398fc62ab7f3fcc13ef1007a48d01d7/wine-data-set.json'
    config.logFile = (request, logs) => {
        log = {}
        log.date = new Date()
        log.url = request.url
        log.method = request.method
        logs.push(log)
        fs.appendFile(config.LOG_FILE, JSON.stringify(logs), (error) => {
            if (error)
                console.log(`\t|Error appending to a file\n\t|${error}`)
        })
    }
    module.exports = config
})()
