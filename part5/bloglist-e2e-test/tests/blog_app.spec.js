const { test, expect } = require('@playwright/test')

describe('Blog app', () => {
  test('front page can be opened', async ({page}) => {
    await page.goto('http://localhost:5173')

    const locator = page.getByText('blogs')
    await expect(locator).toBeVisible()
  })
})