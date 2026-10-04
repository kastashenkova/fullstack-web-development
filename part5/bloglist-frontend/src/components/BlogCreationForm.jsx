import { useState } from 'react'

const BlogCreationForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
                    title:
          <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder="write blog title here"
          />
        </div>

        <div>
                    author:
          <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder="write blog author here"
          />
        </div>

        <div>
                    url:
          <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder="write blog url here"
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogCreationForm