import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('shows blog information and no buttons to an unauthorized user', async () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'https://test.com',
    likes: 1,
    user: {
      name: 'tester',
      username: 'tester',
      password: 'testerPassword',
    }
  }

  render(<Blog blog={blog} user={null} />)

  expect(screen.getByText('TestTitle')).toBeVisible()
  expect(screen.getByText('by TestAuthor')).toBeVisible()
  expect(screen.getByText('https://test.com')).toBeVisible()
  expect(screen.getByText('1 likes')).toBeVisible()
  expect(screen.getByText('Added by tester')).toBeVisible()

  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('shows like button and no remove button to a non-creator', async () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'https://test.com',
    likes: 1,
    user: {
      username: 'tester',
      password: 'testerPassword',
    }
  }

  const notBlogCreator = {
    username: 'oleh',
    password: 'oleh123',
  }

  render(<Blog blog={blog} user={notBlogCreator} />)

  expect(screen.getByText('like')).toBeVisible()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

test('shows like and remove buttons to a creator', async () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'https://test.com',
    likes: 1,
    user: {
      username: 'tester',
      password: 'testerPassword',
    }
  }

  render(<Blog blog={blog} user={blog.user} />)

  expect(screen.getByText('like')).toBeVisible()
  expect(screen.getByText('remove')).toBeVisible()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor'
  }

  const loggedUser = {
    username: 'oleh',
    name: 'Oleh',
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={loggedUser}
      onLike={mockHandler}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})