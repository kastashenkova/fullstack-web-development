import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogCreationForm from './components/BlogCreationForm'
import Togglable from './components/Togglable.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
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
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
                    username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
                    password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

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

      blogFormRef.current.toggleVisibility()

    } catch (error) {
      setErrorMessage(error.response.data.error)

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      throw error
    }
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
      blogs.map(b =>
        b.id === blogWithUser.id ? blogWithUser : b
      )
    )

    setBlogs(blogs =>
      blogs.map(blog =>
        blog.id === blogWithUser.id ? blogWithUser : blog
      )
    )
  }

  const compareByLikes = (blog1, blog2) => {
    return blog2.likes - blog1.likes
  }

  const deleteBlog = async blog => {
    try {
      const confirmation = window.confirm(`Remove ${blog.title} by ${blog.author} ?`)
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
      }
    } catch (error) {
      setErrorMessage(error.response.data.error)

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      throw error
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification
            message={errorMessage}
            className="error"
        />

        {loginForm()}
      </div>
    )
  }

  const sortedBlogs = [...blogs].sort(compareByLikes)

  return (
    <div>
      <Notification message={successMessage ? successMessage : errorMessage}
        className={successMessage ? 'success' : 'error'} />

      <h2>blogs</h2>

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in
            <button onClick={handleLogout}>
                            logout
            </button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef} >
            <BlogCreationForm createBlog={addBlog} />
          </Togglable>

        </div>
      )}
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          onLike={handleLike}
          onDelete={deleteBlog}
          user={user}
        />
      )}
    </div>
  )
}

export default App