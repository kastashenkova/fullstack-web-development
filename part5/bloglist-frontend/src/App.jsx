import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useMatch
} from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogCreationForm from './components/BlogCreationForm'
import BlogList from './components/BlogList'
import { Container, AppBar, Box, Button, Typography, Toolbar } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogAppUser'
    )

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotification({ text: `${user.name} logged in`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      navigate('/')
    } catch {
      setNotification({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)

    setUser(null)
    setUsername('')
    setPassword('')

    navigate('/', { replace: true })
  }

  const handleLike = async blog => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    const returnedBlog = await blogService.update(
      blog.id,
      updatedBlog
    )

    const blogWithUser = {
      ...returnedBlog,
      user: returnedBlog.user?.name
        ? returnedBlog.user
        : {
          id: user.id,
          username: user.username,
          name: user.name
        }
    }

    setBlogs(blogs =>
      blogs.map(blog =>
        blog.id === blogWithUser.id ? blogWithUser : blog
      )
    )
  }

  const deleteBlog = async blog => {
    try {
      const confirmation = window.confirm(
        `Remove ${blog.title} by ${blog.author} ?`
      )

      if (confirmation) {
        await blogService.deleteById(blog.id)

        setBlogs(blogs =>
          blogs.filter(b => b.id !== blog.id)
        )

        setNotification({ text: `blog ${blog.title} by ${blog.author} deleted`, type: 'success' })

        setTimeout(() => {
          setNotification(null)
        }, 5000)

        navigate('/')
      }
    } catch (error) {
      setNotification({ text: error.response.data.error, type: 'error' })

      setTimeout(() => {
        setNotification(null)
      }, 5000)

      throw error
    }
  }

  const addBlog = async object => {
    try {
      const returnedBlog = await blogService.create(object)

      const blogWithUser = {
        ...returnedBlog,
        user: returnedBlog.user?.name
          ? returnedBlog.user
          : {
            id: user.id,
            username: user.username,
            name: user.name
          }
      }

      setBlogs(blogs.concat(blogWithUser))

      setNotification({ text: `a new blog ${blogWithUser.title} by ${blogWithUser.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (error) {
      setNotification({ text: error.response.data.error, type: 'error' })

      setTimeout(() => {
        setNotification(null)
      }, 5000)

      throw error
    }
  }

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog App
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/" sx={hoverStyle}>blogs</Button>
            {!user && (
              <Button color="inherit" component={Link} to="/login" sx={hoverStyle}>login</Button>
            )}
            {user && (
              <>
                <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>new blog</Button>
                <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>logout</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            onLike={handleLike}
            deleteBlog={deleteBlog}
            user={user}
          />
        } />

        <Route
          path="/"
          element={<BlogList blogs={blogs} />}
        />

        <Route
          path="/login"
          element={
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) =>
                setUsername(target.value)
              }
              handlePasswordChange={({ target }) =>
                setPassword(target.value)
              }
              handleSubmit={handleLogin}
            />
          }
        />

        <Route
          path="/create"
          element={
            <BlogCreationForm createBlog={addBlog} />
          }
        />
      </Routes>
    </Container>
  )
}

export default App