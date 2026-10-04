import {useState} from "react";

const BlogCreationForm = ({createBlog}) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()
        try {
            await createBlog({
                title: newTitle,
                author: newAuthor,
                url: newUrl
            })

            setNewTitle('')
            setNewAuthor('')
            setNewUrl('')
        } catch (error) {
        }
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
                    />
                </div>

                <div>
                    author:
                    <input
                        value={newAuthor}
                        onChange={({ target }) => setNewAuthor(target.value)}
                    />
                </div>

                <div>
                    url:
                    <input
                        value={newUrl}
                        onChange={({ target }) => setNewUrl(target.value)}
                    />
                </div>

                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogCreationForm