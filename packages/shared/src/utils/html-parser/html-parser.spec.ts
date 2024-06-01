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
      expect(result?.plain_text).toEqual(
        "write me a single letter Sure, here's a single letter: A and now, another B",
      )
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
      expect(result!.plain_text).toEqual(
        "Does mymind index entire websites and articles? Does mymind save the entire text from articles and websites so I can use a full text search? We currently do not index the entire text of websites saved to your mind. There are two reasons for it in case you are curious: 1. Performance: Eventually your search will become too slow, because we'd index millions and millions of words and text from websites and articles. Often the majority of words on a website aren't really that relevant to the content or article. 2. Accuracy: Your search will eventually, over time become inaccurate as so much content will be saved without being properly analyzed. But we have a solution for it! (and we hope to get even better at it) Below is an example so you can see how it works:",
      )
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
