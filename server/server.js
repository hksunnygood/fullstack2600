(() => {
    console.log(`current directory is ${__dirname}`)
    const homeController = require(`${__dirname}/../controllers/HomeController`)
    const memberController = require(`${__dirname}/../controllers/MemberController`) 
    //const regionController = require(`${__dirname}/../controllers/RegionController`) 
    const grapeController = require(`${__dirname}/../controllers/GrapeController`) 
    const config = require(`${__dirname}/config/config`)
    const utils = require(`${__dirname}/utils`)
    const express = require("express")   

    const app = express()

    let wines = undefined 
    let countries = undefined 

    const getJSONData = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } 
   
    app.use(express.static(config.ROOT))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use((request, response, next) => {
        utils.logRequest(request)
        next()
    })
    app.use(homeController)
    app.use(memberController)   
    //app.use(regionController)   
    app.use(grapeController)   

    app.get('/wines', async(request, response) => {
        if (!wines)
            wines = await getJSONData(config.API_URL)
        response.status(200).json(wines)
    })

    /*app.get('/grapes', async(request, response) => {
        if (!grapes)
            grapes = await getJSONData(config.GRAPES)
        response.status(200).json(grapes)
    })*/

    /*app.get('/grapes', async(request, response) => {
        if (!grapes)
            grapes = await utils.readJson(config.GRAPES)
        response.status(200).json(grapes)
    })*/

    app.get('/countries', async(request, response) => {
        if (!countries)
            countries = await utils.readJson(config.REGIONS)
        response.status(200).json(countries)
    })
        

    // Start Node.js HTTP webapp
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|app listening on ${config.PORT}`)
    })
})()
