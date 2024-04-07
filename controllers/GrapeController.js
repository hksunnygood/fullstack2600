//const config = require(`${__dirname}/../server/config/config`)
//const utils = require(`${__dirname}/../server/utils`)
const util = require(`${__dirname}/../models/util`)
const client = util.getMongoClient()
const express = require("express")
const grapeController = express.Router()


grapeController.get('/grape', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Grapes')
    let posts = await util.find(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(posts)
    
})

module.exports = grapeController