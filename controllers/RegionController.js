const config = require(`${__dirname}/../server/config/config`)
const utils = require(`${__dirname}/../server/utils`)
const express = require("express")
const regionController = express.Router()
let data1 = []

regionController.post('/region', async (request,response) => {
    //const country = request.body
    data1 = utils.readJson(config.REGIONS)
    //data2.push(data1[country].length)
    response.status(200).json(data1)
})

module.exports = regionController