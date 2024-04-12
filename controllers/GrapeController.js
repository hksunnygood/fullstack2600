const util = require(`${__dirname}/../models/util`)
const client = util.getMongoClient()
const express = require("express")
const grapeController = express.Router()


grapeController.get('/grape', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Grapes')
    let posts = await util.find(collection, {})
    res.status(200).json(posts)
    
})

module.exports = grapeController