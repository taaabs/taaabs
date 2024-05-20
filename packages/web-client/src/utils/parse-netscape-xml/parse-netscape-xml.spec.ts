import * as fs from 'fs'
import { parse_netscape_xml } from './parse-netscape-xml'
import raindrop_output from './examples/raindrop/output.json'
import chrome_output from './examples/chrome/output.json'

describe('[parse_netscape_xml]', () => {
  it('should transform XML to expected output', () => {
    const xml_file = fs.readFileSync(
      require.resolve('./examples/raindrop/input.html'),
      'utf8',
    )
    const result = parse_netscape_xml(xml_file)
    expect(result).toStrictEqual(raindrop_output)
  })

  it('should transform XML to expected output', () => {
    const xml_file = fs.readFileSync(
      require.resolve('./examples/chrome/input.html'),
      'utf8',
    )
    const result = parse_netscape_xml(xml_file)
    expect(result).toStrictEqual(chrome_output)
  })
})
