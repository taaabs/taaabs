import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icon } from '@web-ui/components/Atoms/Icon'
import cn from 'classnames'
import styles from './Bookmark.module.scss'

dayjs.extend(relativeTime)

export namespace BookmarkTypes {
  export type Visibility = 'unlisted' | 'secret'
  export type Props = {
    title: string
    description?: string
    sitePath?: string
    url: string
    createdAt: Date
    visibility?: Visibility
    isNSFW?: boolean
    isArchived?: boolean
    isStarred?: boolean
    tags: string[]
  }
}

export const Bookmark: React.FC<BookmarkTypes.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div>
          <a
            className={cn(styles.main__title, {
              [styles['main__title--starred']]: props.isStarred,
            })}
            href={props.url}
          >
            {props.title}
          </a>
        </div>
        <div className={styles['main__site-and-tags']}>
          <button
            className={styles['main__site-and-tags__site']}
            onClick={() => {}}
          >
            example.com
          </button>
          {props.tags.map((tag) => (
            <button
              className={styles['main__site-and-tags__tag']}
              onClick={() => {}}
              key={tag}
            >
              {tag}
            </button>
          ))}
        </div>
        {props.description && (
          <div className={styles.main__description}>{props.description}</div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.actions__button}>
          <Icon variant="THREE_DOTS" />
        </button>
        <button className={styles.actions__button}>
          <Icon variant="INFO" />
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles['info__dimmed-text']}>
          {dayjs(props.createdAt).fromNow()}
        </div>
        {props.isNSFW && (
          <>
            <div className={styles.info__separator}>·</div>
            <div className={styles.info__nsfw}>NSFW</div>
          </>
        )}
        {props.visibility && (
          <>
            <div className={styles.info__separator}>·</div>
            <div className={styles['info__dimmed-text']}>
              {props.visibility == 'unlisted' && 'Unlisted'}
              {props.visibility == 'secret' && 'Secret'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
