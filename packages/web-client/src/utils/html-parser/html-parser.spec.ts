import * as fs from 'fs'
import { HtmlParser } from './html-parser'
import chatgpt_output from './examples/chatgpt-output.json'
import article_output from './examples/article-output.json'

describe('HtmlParser', () => {
  describe('[to_content]', () => {
    it('should transform HTML to expected output', () => {
      const html = fs.readFileSync(
        require.resolve('./examples/chatgpt-input.html'),
        'utf8',
      )
      const result = HtmlParser.to_content({
        url: 'https://chatgpt.com/share/ef385561-fb5c-4ac6-a8e7-8a5a539f9ff6',
        html,
      })
      expect(JSON.parse(result!)).toStrictEqual(chatgpt_output)
    })

    it('should transform HTML to expected output', () => {
      const html = fs.readFileSync(
        require.resolve('./examples/article-input.html'),
        'utf8',
      )
      const result = HtmlParser.to_content({
        url: 'https://example.com/lorem-ipsum',
        html,
      })
      expect(JSON.parse(result!)).toStrictEqual(article_output)
    })
  })
})
