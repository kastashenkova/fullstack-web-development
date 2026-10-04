import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author', () => {
    const blog = {
        title: 'TestTitle',
        author: 'TestAuthor',
        url: 'https://test.com',
        likes: 1
    }

    render(<Blog blog={blog} />)

    const element = document.querySelector('.hidden')
    expect(element).toHaveTextContent('TestTitle TestAuthor')
    expect(element).toBeVisible()

    expect(screen.getByText('https://test.com')).not.toBeVisible()
    expect(screen.getByText('likes 1')).not.toBeVisible()
})

test('shows URL and number of likes', async () => {
    const blog = {
        title: 'TestTitle',
        author: 'TestAuthor',
        url: 'https://test.com',
        likes: 1
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    expect(screen.getByText('https://test.com')).toBeVisible()
    expect(screen.getByText('likes 1')).toBeVisible()
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'TestTitle',
        author: 'TestAuthor'
    }

    const mockHandler = vi.fn()

    render(
        <Blog blog={blog} onLike={mockHandler} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})