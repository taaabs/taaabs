import * as fs from 'fs'
import { parse_netscape_xml } from './parse-netscape-xml'
import output_1 from './examples/1/output.json'

describe('[parse_netscape_xml]', () => {
  it('should transform XML to expected output', () => {
    const xml_file = fs.readFileSync(
      require.resolve('./examples/1/input.html'),
      'utf8',
    )
    const result = parse_netscape_xml(xml_file)
    expect(result).toStrictEqual(output_1)
  })
})
