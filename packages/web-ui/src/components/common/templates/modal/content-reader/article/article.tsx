import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { _RenderMarkdown } from '../_render-markdown'
import styles from './article.module.scss'

namespace Article {
  export type Props = {
    article: ReaderData.Article
  }
}

export const Article: React.FC<Article.Props> = (props) => {
  return (
    <div className={styles.container}>
      <_RenderMarkdown content={props.article.content} />
    </div>
  )
}
