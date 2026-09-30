const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})


test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert(contents.includes('Go To Statement Considered Harmful'))
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const finalBlogs = await helper.blogsInDb()
    assert.strictEqual(finalBlogs.length, helper.initialBlogs.length + 1)

    const contents = finalBlogs.map(n => n.title)

    assert(contents.includes('Type wars'))
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: "Martin Kleppmann",
        url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const finalBlogs = await helper.blogsInDb()

    assert.strictEqual(finalBlogs.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const finalBlogs = await helper.blogsInDb()

    assert.strictEqual(finalBlogs.length, helper.initialBlogs.length)
})

test('blog without likes is added', async () => {
    const newBlog = {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/",
    }

    const resultBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    assert.strictEqual(resultBlog.body.likes, 0)
})

test('a specific blog can be viewed', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToView = initialBlogs[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be deleted', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToDelete = initialBlogs[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const resultBlogs = await helper.blogsInDb()

    const ids = resultBlogs.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(resultBlogs.length, helper.initialBlogs.length - 1)
})

test('a specific blog can be updated', async () => {
    const updatedInfo = {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/",
        likes: 20,
    }

    const initialBlogs = await helper.blogsInDb()
    const blogToUpdate = initialBlogs[0]

    const resultBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedInfo)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(resultBlog.body.title, updatedInfo.title)
    assert.strictEqual(resultBlog.body.author, updatedInfo.author)
    assert.strictEqual(resultBlog.body.url, updatedInfo.url)
    assert.strictEqual(resultBlog.body.likes, updatedInfo.likes)
})

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
})