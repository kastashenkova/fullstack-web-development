import { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogCreationForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    navigate('/')

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder="write blog title here"
          />
        </div>

        <div>
          <TextField style={{ marginTop: 10 }}
            label="author"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder="write blog author here"
          />
        </div>

        <div>
          <TextField style={{ marginTop: 10 }}
            label="url"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder="write blog url here"
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogCreationForm