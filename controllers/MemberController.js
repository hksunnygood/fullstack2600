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

memberController.post('/addReview', async (request, response) => {
    let collection = client.db().collection('Reviews')
    const { email,wine,country,message } = request.body
    const review = Post(email, wine, country, message)
        util.insertOne(collection, review)
        response
            .status(200)
            .json({
                success: {
                    email: email,
                    message: `Review was added successfuly to members.`,
                },
            })
})

memberController.post('/deleteMem', async (request, response) => {
    let collection = client.db().collection('Members')
    const {email} = request.body
    const query = { email: email}
        util.deleteOne(collection, query)
        response
            .status(200)
            .json({
                success: `delete successfuly to members.`
                }
            )
})

memberController.post('/signup', async (request, response) => {
    let collection = client.db().collection('Members')
    members = await util.find(collection, {})
    console.info(`\t|Inside app.post('/signup')`)
    const { email, password } = request.body
    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS)
    const member = user(email, hashed)
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    const isMember = members.filter((m) => m.email === email)[0]
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (email == '' || password ==''){
        response
            .status(200)
            .json({ error: `email and password cannot be empty!` })
    } else if (!email.match(regex)){
        response
            .status(200)
            .json({ error: `Email address format is incorrect.` })
    } else if (isMember) {
        response
            .status(200)
            .json({ error: `${email} already exists. Choose a different email` })
        
    } else {
        members.push(member)
        console.info(members)
        authenticated.push(email)
        util.insertOne(collection, member)
        response
            .status(200)
            .json({
                success: {
                    email: email,
                    message: `${email} was added successfuly to members.`,
                },
            })
    }
})

memberController.get('/reviews', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Reviews')
    let reviews = await util.find(collection, {})
    res.status(200).json(reviews)
    
})

memberController.get('/members', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Members')
    let mem = await util.find(collection, {})
    res.status(200).json(mem)
})


memberController.post('/signin', async (request, response) => {
    let collection = client.db().collection('Members')
    members = await util.find(collection, {})
    console.info(`\t|Inside app.post('/signin')`)
    const { email, password } = request.body
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
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
            if (member.role == 'admin'){
                response
                .status(200)
                .json({ admin: `admin success` })
            } else {
                response
                .status(200)
                .json({ success: `${email} logged in successfully!` })
            }
            authenticated.push(email)
        }
    }
})
memberController.post('/signout', (request, response) => {
    email = request.body.email
    authenticated.splice(authenticated.indexOf(email), 1)
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