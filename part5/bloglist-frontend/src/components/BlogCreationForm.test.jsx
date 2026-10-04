import { render, screen } from '@testing-library/react'
import BlogCreationForm from './BlogCreationForm.jsx'
import userEvent from '@testing-library/user-event'

test('<BlogCreationForm /> calls the event handler it received as props with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogCreationForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('write blog title here')
  const author = screen.getByPlaceholderText('write blog author here')
  const url = screen.getByPlaceholderText('write blog url here')
  const createButton = screen.getByText('create')

  await user.type(title, 'TestTitle')
  await user.type(author, 'TestAuthor')
  await user.type(url, 'https://test.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('TestTitle')
  expect(createBlog.mock.calls[0][0].author).toBe('TestAuthor')
  expect(createBlog.mock.calls[0][0].url).toBe('https://test.com')
})