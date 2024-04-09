const config = require(`${__dirname}/../server/config/config`)
const utils = require(`${__dirname}/../server/utils`)
const util = require(`${__dirname}/../models/util`)
const Post = require(`${__dirname}/../models/post`)
const user = require(`${__dirname}/../models/user`)
const client = util.getMongoClient()
const express = require("express")
const bcrypt = require("bcrypt")
const memberController = express.Router()
let members = []
let authenticated = []
memberController.post('/addReview2', async (request, response) => {
    let collection = client.db().collection('Reviews')
    //members = await util.find(collection, {})
    //console.log('MongoDB Members', members)
    //console.info(`\t|Inside app.post('/signup')`)
    const { email,wine,country,message } = request.body
    //console.log(`\t|Password = ${password}`)
    //let hashed = await bcrypt.hash(password, config.SALT_ROUNDS)
    //console.log(`${password} hash is ${hashed}`)
    const review = Post(email, wine, country, message)
    //if (members.length === 0)
    //    members = utils.readJson(config.MEMBERS)
    //console.log(members)
    //const isMember = members.filter((m) => m.email === email)[0]
    //if (!isMember) {
    //    members.push(member)
    //    console.info(members)
    //    authenticated.push(email)
        util.insertOne(collection, review)
        //utils.saveJson(config.MEMBERS, JSON.stringify(members))
        response
            .status(200)
            .json({
                success: {
                    email: email,
                    message: `Review was added successfuly to members.`,
                },
            })
    //} else {
    //    response
    //        .status(200)
    //        .json({ error: `${email} already exists. Choose a different email` })
    //}
})
memberController.post('/signup', async (request, response) => {
    let collection = client.db().collection('Members')
    members = await util.find(collection, {})
    console.log('MongoDB Members', members)
    console.info(`\t|Inside app.post('/signup')`)
    const { email, password } = request.body
    console.log(`\t|Password = ${password}`)
    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS)
    console.log(`${password} hash is ${hashed}`)
    const member = user(email, hashed)
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    //console.log(members)
    const isMember = members.filter((m) => m.email === email)[0]
    if (!isMember) {
        members.push(member)
        console.info(members)
        authenticated.push(email)
        util.insertOne(collection, member)
        //utils.saveJson(config.MEMBERS, JSON.stringify(members))
        response
            .status(200)
            .json({
                success: {
                    email: email,
                    message: `${email} was added successfuly to members.`,
                },
            })
    } else {
        response
            .status(200)
            .json({ error: `${email} already exists. Choose a different email` })
    }
})
memberController.get('/reviews', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Reviews')
    let reviews = await util.find(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(reviews)
    
})
memberController.post('/Member/addReview', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Reviews')
    let user = req.body.postedBy
    let wine = req.body.wine
    let country = req.body.country
    let message = req.body.message
    let post = Post(user, wine, country, message)
    util.insertOne(collection, post)
   
    // res.json(
    //     {
    //         message: `You post was added to the ${topic} forum`
    //     }
    // )
    //Utils.saveJson(__dirname + '/../data/posts.json', JSON.stringify(posts))
    //res.redirect(index.html)
    //window.opener.location.replace('/Member');
})

memberController.post('/signin', async (request, response) => {
    let collection = client.db().collection('Members')
    members = await util.find(collection, {})
    console.log('MongoDB Members', members)
    console.info(`\t|Inside app.post('/signin')`)
    const { email, password } = request.body
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    console.log(members)
    const error = {
        email: email,
        error: `Email or password is incorrect.`,
    }
    const member = members.filter((m) => m.email === email)[0]

    if (!member) {
        response
            .status(200)
            .json(error)
    } else {
        const isMatched = await bcrypt.compare(password, member.hashedPassword);
        if (!isMatched) {
            response
                .status(200)
                .json(error)
        } else {
            response
                .status(200)
                .json({ success: `${email} logged in successfully!` })
            authenticated.push(email)
        }
    }
})
memberController.post('/signout', (request, response) => {
    console.log('inside /signout')
    email = request.body.email
    console.log("authenticated", authenticated)
    authenticated.splice(authenticated.indexOf(email), 1)
    console.log("authenticated", authenticated)
    response
        .status(200)
        .json({
            success: {
                email: email,
                message: `${email} logout successfully.`,
            },
        })
})
module.exports = memberController