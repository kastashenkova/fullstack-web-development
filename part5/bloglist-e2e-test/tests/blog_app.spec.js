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

  test.afterEach(async ({ request }) => {
    await request.post('/api/testing/reset')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
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

      const alert = page.getByRole('alert')
      await expect(alert).toContainText('wrong username or password')

      await expect(page.getByText('Kateryna logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'astkatrya', 'admin123')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await createBlog(page, 'TestTitle', 'TestAuthor', 'https://test.com')
      await expect(page.getByRole('link', { name: 'TestTitle TestAuthor' })).toBeVisible()
    })

    describe('and blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'TestTitle1', 'TestAuthor1', 'https://test1.com')
        // await createBlog(page, 'TestTitle2', 'TestAuthor2', 'https://test2.com')
        // await createBlog(page, 'TestTitle3', 'TestAuthor3', 'https://test3.com')
      })

      test('one of those can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'TestTitle1 TestAuthor1' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('1 likes')).toBeVisible()
      })

      test('one of those can be deleted', async ({ page }) => {
        await page.getByRole('link', { name: 'TestTitle1 TestAuthor1' }).click()
        page.once('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('TestTitle1 TestAuthor1')).not.toBeVisible()
      })

      test('only the user who added the blog sees the remove button', async ({ page }) => {
        await page.getByRole('link', { name: 'TestTitle1 TestAuthor1' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'oleh', 'user123')

        await page.getByRole('link', { name: 'TestTitle1 TestAuthor1' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      // test('blogs are arranged in the order according to the likes', async ({ page }) => {
      //   await page.getByRole('link', { name: 'TestTitle2 TestAuthor2' }).click()
      //   await page.getByRole('button', { name: 'like' }).click()
      //   await page.getByRole('button', { name: 'like' }).click()
      //
      //   await page.getByRole('link', { name: 'blogs' }).click()
      //   await page.getByRole('link', { name: 'TestTitle3 TestAuthor3' }).click()
      //   await page.getByRole('button', { name: 'like' }).click()
      //
      //   const blogs = page.locator('.blog')
      //
      //   await page.getByRole('link', { name: 'blogs' }).click()
      //   await expect(blogs.first()).toContainText('TestTitle2 TestAuthor2')
      //   await expect(blogs.nth(1)).toContainText('TestTitle3 TestAuthor3')
      //   await expect(blogs.last()).toContainText('TestTitle1 TestAuthor1')
      // })
    })
  })
})