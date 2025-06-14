import { readFileSync } from 'fs'
import { parsePlaywrightJUnit } from '@/parsePlaywrightJUnit'
import { expect, test } from 'vitest'

// 複数の JUnit XML を読み込みパース結果を検証する
const xml1 = readFileSync('tests/sample-junit1.xml', 'utf-8')
const xml2 = readFileSync('tests/sample-junit2.xml', 'utf-8')
const xml3 = readFileSync('tests/sample-junit3.xml', 'utf-8')

const result1 = parsePlaywrightJUnit(xml1)
const result2 = parsePlaywrightJUnit(xml2)
const result3 = parsePlaywrightJUnit(xml3)

test('1つ目の XML を正しく読み込める', () => {
  expect(result1.tests.length).toBe(10)
  const failed = result1.tests.filter(t => t.status === 'failed')
  expect(failed.length).toBe(3)
  const addItem = result1.tests.find(t => t.name === 'add item')
  expect(addItem?.status).toBe('failed')
})

test('後続の XML でテストが増え失敗が解消される', () => {
  expect(result2.tests.length).toBeGreaterThan(result1.tests.length)
  expect(result3.tests.length).toBeGreaterThan(result2.tests.length)

  const addItem2 = result2.tests.find(t => t.name === 'add item')
  const deleteUser2 = result2.tests.find(t => t.name === 'delete user')
  expect(addItem2?.status).toBe('passed')
  expect(deleteUser2?.status).toBe('passed')

  const addItem3 = result3.tests.find(t => t.name === 'add item')
  const deleteUser3 = result3.tests.find(t => t.name === 'delete user')
  expect(addItem3?.status).toBe('passed')
  expect(deleteUser3?.status).toBe('passed')

  const allPassed3 = result3.tests.every(t => t.status === 'passed')
  expect(allPassed3).toBe(true)
})
