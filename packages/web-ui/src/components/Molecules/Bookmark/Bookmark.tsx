import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icon } from '@web-ui/components/Atoms/Icon'
import cn from 'classnames'
import styles from './Bookmark.module.scss'

dayjs.extend(relativeTime)

export namespace BookmarkTypes {
  export type Visibility = 'public' | 'private'
  export type Props = {
    title: string
    description?: string
    site: string
    onSiteClick: () => void
    url: string
    createdAt: Date
    visibility?: Visibility
    isNSFW?: boolean
    isArchived?: boolean
    isStarred?: boolean
    tags: string[]
    saves: number
  }
}

export const Bookmark: React.FC<BookmarkTypes.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div>
          <div
            className={cn(styles.main__top, {
              [styles['main__top--starred']]: props.isStarred,
            })}
          >
            {props.isNSFW && (
              <span className={styles.main__top__nsfw}>NSFW</span>
            )}
            <a className={styles.main__top__title} href={props.url}>
              {props.title}
            </a>
            <button
              className={styles.main__top__site}
              onClick={props.onSiteClick}
            >
              ({props.site})
            </button>
          </div>
        </div>
        {props.tags.length > 0 && (
          <div
            className={cn(styles['main__tags'], {
              [styles['main__tags--starred']]: props.isStarred,
            })}
          >
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
          <div className={styles['info__inner__dimmed-text']}>
            {props.saves} saves
          </div>
          <div className={styles.info__inner__separator}>·</div>
          <div className={styles['info__inner__dimmed-text']}>
            {dayjs(props.createdAt).fromNow()}
          </div>
        </div>
      </div>
    </div>
  )
}
