import { test, expect } from '@playwright/test'

test('获取容器数据', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('crop#get-container-data')
  await page.getByRole('button', { name: '图片裁剪' }).click()
  await page.locator('.tiny-crop__dialog-content__handle__button > div:nth-child(3)').click()
  await page.locator('div:nth-child(3) > .icon').click()
  await page.locator('.tiny-crop__dialog-content__handle__button > div:nth-child(4)').click()
  await page.locator('div:nth-child(5) > .tiny-svg').click()
  await page.locator('div:nth-child(5) > .tiny-svg').click()
  await page.locator('div:nth-child(6) > .tiny-svg').click()
  await page.locator('div:nth-child(8) > .tiny-svg').click()
  await page.locator('.tiny-crop__dialog-content__handle__button > div:nth-child(9)').click()
  await page.getByRole('button', { name: '图片裁剪' }).click()
  await page.locator('div:nth-child(9) > .tiny-svg').click()
  await page.getByRole('button', { name: '获取容器数据' }).click()
})
