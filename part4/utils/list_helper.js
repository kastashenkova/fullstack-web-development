const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    let favoriteBlog = blogs[0]

    blogs.forEach(blog => {
        if (blog.likes > favoriteBlog.likes) {
            favoriteBlog = blog
        }
    })

    return favoriteBlog
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const counts = _.countBy(blogs, 'author')

    const [author, blogsCount] = _.maxBy(
        Object.entries(counts),
        ([author, count]) => count
    )

    return {
        author,
        blogs: blogsCount
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const grouped = _.groupBy(blogs, 'author')

    const authorLikes = _.mapValues(grouped, blogs =>
        _.sumBy(blogs, 'likes')
    )

    const [author, likes] = _.maxBy(
        Object.entries(authorLikes),
        ([author, likes]) => likes
    )

    return {
        author,
        likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}