(() => {
const Post = (user, wine, country, message) => {
    return {
        postedBy: user,
        wine: wine,
        country: country,
        message: message,
        postedAt: new Date().toUTCString()
    }
}
module.exports = Post
})()
