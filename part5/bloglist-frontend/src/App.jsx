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
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogCreationForm from "./components/BlogCreationForm";
import BlogList from "./components/BlogList";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

      setSuccessMessage(`${user.name} logged in`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

      navigate('/')
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)

    setUser(null)
    setUsername('')
    setPassword('')

    navigate('/')
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

        setSuccessMessage(
            `blog ${blog.title} by ${blog.author} deleted`
        )

        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)

        navigate('/')
      }
    } catch (error) {
      setErrorMessage(error.response.data.error)

      setTimeout(() => {
        setErrorMessage(null)
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

      setSuccessMessage(
          `a new blog ${blogWithUser.title} by ${blogWithUser.author} added`
      )

      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (error) {
      setErrorMessage(error.response.data.error)

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      throw error
    }
  }

  const padding = {
    padding: 5
  }

  return (
      <div>
        <Notification message={successMessage ? successMessage : errorMessage}
                      className={successMessage ? 'success' : 'error'} />

        <div>
          <Link style={padding} to="/">blogs</Link>
          {!user && (
              <Link to="/login">login</Link>
          )}

          {user && (
              <>
                <Link to="/create">new blog</Link>{' '}

                <button onClick={handleLogout}>
                  logout
                </button>
              </>
          )}
        </div>

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
                user
                    ? <BlogCreationForm createBlog={addBlog} />
                    : <Navigate to="/login" />
              }
          />
        </Routes>
      </div>
  )
}

export default App