const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Kateryna',
        username: 'astkatrya',
        password: 'admin123'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Oleh',
        username: 'oleh',
        password: 'user123'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'astkatrya', 'admin123')
      await expect(page.getByText('Kateryna logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'astkatrya', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Kateryna logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'astkatrya', 'admin123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'TestTitle', 'TestAuthor', 'https://test.com')
      await expect(page.locator('.blog').filter({ hasText: 'TestTitle TestAuthor' })).toBeVisible()
    })

    describe('and blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'TestTitle1', 'TestAuthor1', 'https://test1.com')
        await createBlog(page, 'TestTitle2', 'TestAuthor2', 'https://test2.com')
        await createBlog(page, 'TestTitle3', 'TestAuthor3', 'https://test3.com')
      })

      test('one of those can be liked', async ({ page }) => {
        const otherBlogElement = page.locator('.blog').filter({ hasText: 'TestTitle2 TestAuthor2' })

        await otherBlogElement.getByRole('button', { name: 'view' }).click()
        await otherBlogElement.getByRole('button', { name: 'like' }).click()

        await expect(otherBlogElement.getByText('likes 1')).toBeVisible()
      })

      test('one of those can be deleted', async ({ page }) => {
        const otherBlogElement = page.locator('.blog').filter({ hasText: 'TestTitle1 TestAuthor1' })

        page.on('dialog', async dialog => {
          await dialog.accept()
        })

        await otherBlogElement.getByRole('button', { name: 'view' }).click()
        await otherBlogElement.getByRole('button', { name: 'remove' }).click()
        await expect(otherBlogElement).not.toBeVisible()
      })

      test('only the user who added the blog sees the remove button', async ({ page }) => {
        const otherBlogElement = page.locator('.blog').filter({ hasText: 'TestTitle1 TestAuthor1' })

        await otherBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(otherBlogElement.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'oleh', 'user123')

        const sameBlogElement = page.locator('.blog').filter({ hasText: 'TestTitle1 TestAuthor1' })
        await expect(sameBlogElement).toBeVisible()
        await sameBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(sameBlogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are arranged in the order according to the likes', async ({ page }) => {
        const secondBlogElement = page.locator('.blog').filter({ hasText: 'TestTitle2 TestAuthor2' })
        await secondBlogElement.getByRole('button', { name: 'view' }).click()
        await secondBlogElement.getByRole('button', { name: 'like' }).click()
        await secondBlogElement.getByRole('button', { name: 'like' }).click()

        const thirdBlogElement = page.locator('.blog').filter({ hasText: 'TestTitle3 TestAuthor3' })
        await thirdBlogElement.getByRole('button', { name: 'view' }).click()
        await thirdBlogElement.getByRole('button', { name: 'like' }).click()

        const blogs = page.locator('.blog')
        await expect(blogs.first()).toContainText('TestTitle2 TestAuthor2')
        await expect(blogs.nth(1)).toContainText('TestTitle3 TestAuthor3')
        await expect(blogs.last()).toContainText('TestTitle1 TestAuthor1')
      })
    })
  })
})