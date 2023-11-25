import { get_domain_from_url } from './get-domain-from-url'

describe('[get_domain_from_url]', () => {
  it('returns expected result', () => {
    const testData: [string, string][] = [
      ['https://example.com', 'example.com'],
      ['http://example.com', 'example.com'],
      ['https://example.com/', 'example.com'],
      ['http://example.com/', 'example.com'],
      ['https://example.com/test', 'example.com'],
      ['http://example.com/test', 'example.com'],
      ['http://test.example.com', 'test.example.com'],
      ['http://test.example.com/', 'test.example.com'],
      ['http://test.example.com/test', 'test.example.com'],
    ]
    testData.forEach((pair) => {
      expect(get_domain_from_url(pair[0])).toBe(pair[1])
    })
  })
})
