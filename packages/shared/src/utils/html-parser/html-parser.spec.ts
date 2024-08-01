import * as fs from 'fs'
import { HtmlParser } from './html-parser'

describe('HtmlParser', () => {
  describe('[parse]', () => {
    it('should transform HTML to expected output', () => {
      const html = fs.readFileSync(
        require.resolve('./examples/chatgpt-input.html'),
        'utf8',
      )
      const result = HtmlParser.parse({
        url: 'https://chatgpt.com/share/ef385561-fb5c-4ac6-a8e7-8a5a539f9ff6',
        html,
      })
      expect(JSON.parse(result!.reader_data)).toStrictEqual({
        type: 'chat',
        conversation: [
          { author: 'user', text: 'write me a single letter' },
          {
            author: 'assistant',
            content: `Sure, here's a single letter: A`,
          },
          { author: 'user', text: 'and now, another' },
          { author: 'assistant', content: 'B' },
        ],
      })
    })
    it('should transform HTML to expected output', () => {
      const html = fs.readFileSync(
        require.resolve('./examples/article-input.html'),
        'utf8',
      )
      const result = HtmlParser.parse({
        url: 'https://example.com/lorem-ipsum',
        html,
      })
      expect({
        ...JSON.parse(result!.reader_data),
        content: 'test',
      }).toStrictEqual({
        type: 'article',
        title: 'Does mymind index entire websites and articles?',
        site_name: null,
        published_at: null,
        author: null,
        length: 818,
        content: 'test',
      })
    })
  })
})
