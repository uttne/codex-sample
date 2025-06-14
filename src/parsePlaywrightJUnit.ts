import { XMLParser } from 'fast-xml-parser'

export interface TestResult {
  name: string
  classname?: string
  time?: number
  file?: string
  line?: number
  assertions?: number
  status: 'passed' | 'failed' | 'error' | 'skipped'
  message?: string
  type?: string
  details?: string
  systemOut?: string
  systemErr?: string
  properties?: Record<string, string>
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
    let status: 'passed' | 'failed' | 'error' | 'skipped' = 'passed'
    let message: string | undefined
    let type: string | undefined
    let text: string | undefined

    const fail = tc.failure
    const error = tc.error
    const skipped = tc.skipped

    if (fail) {
      status = 'failed'
      if (typeof fail === 'string') text = fail
      else if (typeof fail === 'object') {
        message = fail.message
        type = fail.type
        text = fail['#text']
      }
    } else if (error) {
      status = 'error'
      if (typeof error === 'string') text = error
      else if (typeof error === 'object') {
        message = error.message
        type = error.type
        text = error['#text']
      }
    } else if (skipped) {
      status = 'skipped'
      if (typeof skipped === 'string') text = skipped
      else if (typeof skipped === 'object') {
        message = skipped.message
        type = skipped.type
        text = skipped['#text']
      }
    }

    const props: Record<string, string> = {}
    if (tc.properties && tc.properties.property) {
      const list = Array.isArray(tc.properties.property)
        ? tc.properties.property
        : [tc.properties.property]
      for (const p of list) {
        const key = p.name
        const val = p.value ?? p['#text']
        if (key) props[key] = String(val ?? '')
      }
    }

    return {
      name: tc.name,
      classname: tc.classname,
      time: tc.time ? Number(tc.time) : undefined,
      file: tc.file,
      line: tc.line ? Number(tc.line) : undefined,
      assertions: tc.assertions ? Number(tc.assertions) : undefined,
      status,
      message,
      type,
      details: text,
      systemOut: typeof tc['system-out'] === 'string' ? tc['system-out'] : tc['system-out']?.['#text'],
      systemErr: typeof tc['system-err'] === 'string' ? tc['system-err'] : tc['system-err']?.['#text'],
      properties: Object.keys(props).length > 0 ? props : undefined
    }
  })

  return { tests }
}
