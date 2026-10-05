import { useState } from 'react'

const Blog = ({ blog, onLike, deleteBlog, user }) => {
  // const [visible, setVisible] = useState(false)

  if(!blog) {
    return null
  }

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5
  // }

  const handleDelete = async () => {
    await deleteBlog(blog)
  }

  // const hideWhenVisible = { display: visible ? 'none' : '' }
  // const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      {/*<div style={hideWhenVisible} className="hidden">*/}
      {/*  {blog.title} {blog.author}*/}
      {/*  <button onClick={() => setVisible(true)}>*/}
      {/*    view*/}
      {/*  </button>*/}
      {/*</div>*/}

      <div>
        <h2>{blog.title} {blog.author}</h2>

        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
        <div>
          likes {blog.likes}
          {user && (
              <button onClick={() => onLike(blog)}>
                like
              </button>
          )}
        </div>
        <div>{blog.user?.name}</div>
        {blog.user?.username === user?.username && (
            <button onClick={handleDelete}>
              remove
            </button>
        )}
      </div>
    </div>
  )
}

export default Blog