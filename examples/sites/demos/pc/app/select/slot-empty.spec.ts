import { expect, test } from '@playwright/test'

test('空数据插槽', async ({ page }) => {
  await page.goto('select#slot-empty')

  const wrap = page.locator('#slot-empty')
  const select = wrap.locator('.tiny-select')
  const input = select.locator('.tiny-input__inner')
  const dropdown = page.locator('body > .tiny-select-dropdown')
  const option = dropdown.locator('.tiny-option')

  await input.click()
  await expect((await option.all()).length).toEqual(0)
  await expect(page.locator('.tiny-select-dropdown')).toHaveText('空数据插槽')
})
