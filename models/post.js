(() => {
const Post = (topic, message, user) => {
    return {
        Topic: topic,
        Message: message,
        postedBy: user,
        postedAt: new Date().toUTCString()
    }
}
module.exports = Post
})()
