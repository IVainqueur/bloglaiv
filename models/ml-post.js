const mongo = require('mongoose')

const postSchema = mongo.Schema({
    title: String,
    content: String,
    profileLink: String,
    date: String
})

module.exports = mongo.model('post', postSchema)