const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'userId missing or not valid' })
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(404).end()
  }

  if (blogToDelete.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)

    user.blogs = user.blogs.filter(
      blogId => blogId.toString() !== request.params.id
    )

    await user.save()

    return response.status(204).end()
  }

  return response.status(401).end()
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