import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icon } from '@web-ui/components/Atoms/Icon'
import cn from 'classnames'
import styles from './Bookmark.module.scss'

dayjs.extend(relativeTime)

export namespace BookmarkTypes {
  export type Visibility = 'public' | 'unlisted' | 'secret'
  export type Props = {
    title: string
    description?: string
    site: string
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
  const separator = <div className={styles.info__inner__separator}>·</div>

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div>
          {props.isNSFW && <div className={styles.main__nsfw}>NSFW</div>}{' '}
          <a
            className={cn(styles.main__title, {
              [styles['main__title--starred']]: props.isStarred,
            })}
            href={props.url}
          >
            {props.title}
          </a>
        </div>
        {props.tags.length > 0 && (
          <div className={styles['main__tags']}>
            {props.tags.map((tag) => (
              <button
                className={styles['main__tags__tag']}
                onClick={() => {}}
                key={tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        {props.description && (
          <div className={styles.main__description}>{props.description}</div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.actions__button}>
          <Icon variant="THREE_DOTS" />
        </button>
        <button className={styles.actions__button}>
          <Icon variant="BOOKMARK" />
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.info__inner}>
          <button className={styles.info__inner__site}>{props.site}</button>
          {separator}
          <div className={styles['info__inner__dimmed-text']}>
            {dayjs(props.createdAt).fromNow()}
          </div>
          {props.visibility && (
            <>
              <div className={styles.info__inner__separator}>·</div>
              <div className={styles['info__inner__dimmed-text']}>
                {props.visibility == 'unlisted' && 'unlisted'}
                {props.visibility == 'secret' && 'secret'}
              </div>
            </>
          )}
          {props.isArchived && (
            <>
              <div className={styles.info__inner__separator}>·</div>
              <div className={styles['info__inner__dimmed-text']}>archived</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
