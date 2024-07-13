import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { _RenderMarkdown } from '../common/_RenderMarkdown'
import styles from './Article.module.scss'

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
