import { readFileSync } from 'fs'
import { parsePlaywrightJUnit } from '@/parsePlaywrightJUnit'
import { expect, test } from 'vitest'

// 複数の JUnit XML を読み込みパース結果を検証する
const xml1 = readFileSync('tests/sample-junit1.xml', 'utf-8')
const xml2 = readFileSync('tests/sample-junit2.xml', 'utf-8')
const xml3 = readFileSync('tests/sample-junit3.xml', 'utf-8')
const xmlFull = readFileSync('tests/sample-junit-full.xml', 'utf-8')

const result1 = parsePlaywrightJUnit(xml1)
const result2 = parsePlaywrightJUnit(xml2)
const result3 = parsePlaywrightJUnit(xml3)
const resultFull = parsePlaywrightJUnit(xmlFull)

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

test('複雑な XML を正しく解析できる', () => {
  const tc4 = resultFull.tests.find(t => t.name === 'testCase4')
  expect(tc4?.status).toBe('skipped')
  expect(tc4?.message).toBe('Test was skipped.')
  const tc5 = resultFull.tests.find(t => t.name === 'testCase5')
  expect(tc5?.status).toBe('failed')
  expect(tc5?.message).toBe('Expected value did not match.')
  const tc6 = resultFull.tests.find(t => t.name === 'testCase6')
  expect(tc6?.status).toBe('error')
  expect(tc6?.message).toBe('Division by zero.')
  const tc7 = resultFull.tests.find(t => t.name === 'testCase7')
  expect(tc7?.systemOut).toBe('Data written to standard out.')
})
