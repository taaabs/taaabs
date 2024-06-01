import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { Article } from './article'

export default {
  component: Article,
}

export const Primary = () => {
  return (
    <Article
      article={{
        type: ReaderData.ContentType.ARTICLE,
        author: 'x',
        length: 1,
        published_at: '',
        site_name: '',
        title: '',
        content: 'Lorem ipsum',
      }}
    />
  )
}
