import { XMLParser } from 'fast-xml-parser'

export interface TestResult {
  name: string
  status: string
  details?: string
}

export interface JUnitResult {
  tests: TestResult[]
}

/**
 * Playwright の JUnit XML を解析してテスト結果を返す
 */
export function parsePlaywrightJUnit(xmlText: string): JUnitResult {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
  const root = parser.parse(xmlText)

  const suites: Record<string, unknown>[] = []
  if (root.testsuites) {
    const ts = root.testsuites.testsuite
    if (Array.isArray(ts)) suites.push(...ts)
    else if (ts) suites.push(ts)
  }
  if (root.testsuite) {
    const ts = root.testsuite
    if (Array.isArray(ts)) suites.push(...ts)
    else suites.push(ts)
  }

  const cases: Record<string, unknown>[] = []
  for (const suite of suites) {
    if (!suite) continue
    const tcs = suite.testcase
    if (Array.isArray(tcs)) cases.push(...tcs)
    else if (tcs) cases.push(tcs)
  }

  const tests = cases.map(tc => {
    const details = tc.failure
    let text: string | undefined
    if (details) {
      if (typeof details === 'string') {
        text = details
      } else if (typeof details === 'object') {
        text = details['#text'] || details['message'] || details['@_message']
      }
    }
    return {
      name: tc.name,
      status: details ? 'failed' : 'passed',
      details: text
    }
  })

  return { tests }
}
