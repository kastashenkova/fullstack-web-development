const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app)

describe('when working with blogs, ', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('unique identifier property is named id', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body[0].id)
        assert.strictEqual(response.body[0]._id, undefined)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
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

    test('a specific blog can be viewed', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToView = initialBlogs[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body, blogToView)
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
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe('resolving user authentication', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        const blog = new Blog({
            title: 'Test blog',
            author: 'Test author',
            url: 'http://test.com',
            user: user._id
        })

        await blog.save()

        user.blogs = user.blogs.concat(blog._id)
        await user.save()
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
        }

        const login = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })

        const token = login.body.token

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const finalBlogs = await helper.blogsInDb()
        assert.strictEqual(finalBlogs.length, blogsAtStart.length + 1)

        const contents = finalBlogs.map(n => n.title)

        assert(contents.includes('Type wars'))
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: "Martin Kleppmann",
            url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/",
        }

        const login = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })

        const token = login.body.token

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const finalBlogs = await helper.blogsInDb()

        assert.strictEqual(finalBlogs.length, blogsAtStart.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
        }

        const login = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })

        const token = login.body.token

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const finalBlogs = await helper.blogsInDb()

        assert.strictEqual(finalBlogs.length, blogsAtStart.length)
    })

    test('blog without likes is added', async () => {
        const newBlog = {
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
            url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/",
        }

        const login = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })

        const token = login.body.token

        const resultBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(resultBlog.body.likes, 0)
    })

    test('a blog can be deleted', async () => {
        const blogToDelete = await Blog.findOne({ title: 'Test blog' })

        const login = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })

        const token = login.body.token

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const deletedBlog = await Blog.findById(blogToDelete._id)

        assert.strictEqual(deletedBlog, null)
    })

    test('creation fails without token', async () => {
        const newBlog = {
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
            url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/",
            likes: 20,
        }

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const finalBlogs = await helper.blogsInDb()

        assert.strictEqual(finalBlogs.length, blogsAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})