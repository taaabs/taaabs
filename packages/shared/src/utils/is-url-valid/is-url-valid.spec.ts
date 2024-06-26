import { is_url_valid } from './is-url-valid'

describe('is_url_valid function', () => {
  it('returns false for strings that do not start with http or https', () => {
    expect(is_url_valid('example.com')).toBe(false)
    expect(is_url_valid('ftp://example.com')).toBe(false)
    expect(is_url_valid('//example.com')).toBe(false)
  })

  it('returns true for valid http and https URLs', () => {
    expect(is_url_valid('http://example.com')).toBeTruthy()
    expect(is_url_valid('https://example.com')).toBeTruthy()
  })

  it('returns false for invalid URL formats that fail to parse', () => {
    expect(is_url_valid('invalid-url')).toBe(false)
    expect(is_url_valid('#htp://example.com')).toBe(false)
  })
})
