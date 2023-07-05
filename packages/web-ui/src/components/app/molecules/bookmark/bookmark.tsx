import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icon } from '@web-ui/components/common/atoms/icon'
import cn from 'classnames'
import styles from './bookmark.module.scss'

dayjs.extend(relativeTime)

export namespace BookmarkTypes {
  export type Visibility = 'public' | 'private'
  export type Props = {
    title: string
    description?: string
    site: string
    onSiteClick: () => void
    onSavesClick: () => void
    onDateClick: () => void
    onVisibilityClick?: () => void
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
            className={cn(styles.main__title, {
              [styles['main__title--starred']]: props.isStarred,
            })}
          >
            {props.isNSFW && (
              <span className={styles.main__title__nsfw}>NSFW</span>
            )}
            <a className={styles.main__title__text} href={props.url}>
              {props.title}
            </a>
          </div>
          <button className={styles.main__site} onClick={props.onSiteClick}>
            <span>{props.site}</span>
          </button>
        </div>
        {props.tags.length > 0 && (
          <div className={styles['main__tags']}>
            {props.tags.map((tag) => (
              <button
                className={cn([
                  styles['main__tags__tag'],
                  {
                    [styles['main__tags__tag--condensed']]:
                      props.tags.length >= 4,
                  },
                ])}
                onClick={() => {}}
                key={tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        {props.tags.length > 0 && props.description && (
          <div className={styles['main__separator-middle']} />
        )}
        {props.description && (
          <div className={styles.main__description}>{props.description}</div>
        )}
        {(props.tags.length > 0 || props.description) && (
          <div className={styles['main__separator-bottom']} />
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
          <button
            className={styles['info__inner__saves']}
            onClick={props.onSavesClick}
          >
            {props.saves} saves
          </button>
          <div className={styles.info__inner__separator} />
          <div
            className={styles['info__inner__date']}
            onClick={props.onDateClick}
          >
            {dayjs(props.createdAt).fromNow()}
          </div>
          <div className={styles.info__inner__separator} />
          {/* {props.visibility && props.onVisibilityClick && (
            <>
              <button
                className={styles['info__inner__button']}
                onClick={props.onVisibilityClick}
              >
                {props.visibility == 'private' && 'Private'}
                {props.visibility == 'public' && 'Public'}
              </button>
              <div className={styles.info__inner__separator} />
            </>
          )} */}
        </div>
      </div>
    </div>
  )
}
