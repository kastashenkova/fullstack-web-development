import {useState, useEffect, useRef} from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from "./components/Blog";
import Notification from './components/Notification'
import BlogCreationForm from './components/BlogCreationForm'
import Togglable from "./components/Togglable.jsx";

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

            setBlogs(blogs.concat(returnedBlog))

            setSuccessMessage(
                `a new blog ${object.title} by ${object.author} added`
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

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>

                <Notification
                    message={errorMessage}
                />

                {loginForm()}
            </div>
        )
    }

    return (
        <div>
            <Notification
                message={successMessage || errorMessage}
            />

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
                    {blogs.map(blog =>
                        <Blog
                            key={blog.id}
                            blog={blog}
                        />
                    )}
                </div>
            )}

        </div>
    )
}

export default App