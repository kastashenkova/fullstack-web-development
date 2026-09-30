const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const { title, author, url, likes } = request.body

        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).end()
        }

        blog.title = title
        blog.author = author
        blog.url = url
        blog.likes = likes

        const updatedBlog = await blog.save()

        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter