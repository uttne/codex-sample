import { readFileSync } from 'fs'
import { parsePlaywrightJUnit } from '@/parsePlaywrightJUnit'
import { expect, test } from 'vitest'

// サンプル XML を読み込みパースできるか確認する
const xml = readFileSync('tests/sample-junit.xml', 'utf-8')
const result = parsePlaywrightJUnit(xml)

test('XML を正しく読み込める', () => {
  expect(result.tests.length).toBe(2)
  const [pass, fail] = result.tests
  expect(pass.status).toBe('passed')
  expect(pass.name).toBe('test success')
  expect(fail.status).toBe('failed')
  expect(fail.details).toContain('Assertion error')
})
