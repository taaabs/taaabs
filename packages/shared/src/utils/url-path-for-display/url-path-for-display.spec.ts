import { url_path_for_display } from './url-path-for-display' // Assume this file exports the function

describe('url_path_for_display', () => {
  it('removes domain and trailing slash', () => {
    const input = 'https://example.com/path/'
    const expected_output = 'path'
    expect(url_path_for_display({ url: input })).toBe(expected_output)
  })

  it('concatenates with ›', () => {
    const input = 'https://example.com/a/b'
    const expected_output = 'a › b'
    expect(url_path_for_display({ url: input })).toBe(expected_output)
  })

  it("strips trailing 'index.html' or 'index.htm'", () => {
    const input_1 = 'https://example.com/path/index.html'
    const expected_output_1 = 'path'
    expect(url_path_for_display({ url: input_1 })).toBe(expected_output_1)

    const input_2 = 'https://example.com/path/index.htm'
    const expected_output_2 = 'path'
    expect(url_path_for_display({ url: input_2 })).toBe(expected_output_2)
  })

  it("strips trailing '.html' or '.htm'", () => {
    const input_1 = 'https://example.com/path.htm'
    const expected_output_1 = 'path'
    expect(url_path_for_display({ url: input_1 })).toBe(expected_output_1)

    const input_2 = 'https://example.com/path.html'
    const expected_output_2 = 'path'
    expect(url_path_for_display({ url: input_2 })).toBe(expected_output_2)
  })
})
