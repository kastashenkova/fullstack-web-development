import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible} className="hidden">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>
          view
        </button>
      </div>

      <div style={showWhenVisible} className="visible">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>
          hide
        </button>

        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => onLike(blog)}>like</button>
        </div>
        <div>{blog.user?.name}</div>
        {blog.user?.username === user?.username && (
          <button onClick={() => onDelete(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog