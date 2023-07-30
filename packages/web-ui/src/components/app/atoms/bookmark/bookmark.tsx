import { Icon } from '@web-ui/components/common/atoms/icon'
import TextTruncate from 'react-text-truncate'
import cn from 'classnames'
import styles from './bookmark.module.scss'

export namespace Bookmark {
  export type Props = {
    title: string
    url: string
    sitePath?: string
    tags: { name: string; yields?: number; isSelected?: boolean }[]
    saves: number
    onClick: () => void
    onMenuClick: () => void
    isNsfw?: boolean
    isStarred?: boolean
  }
}

export const Bookmark: React.FC<Bookmark.Props> = (props) => {
  return (
    <div className={styles.container} role="button" onClick={props.onClick}>
      <div
        className={cn([
          styles.main,
          { [styles['main--has-tags']]: props.tags.length > 0 },
        ])}
      >
        <div>
          <div
            className={cn(styles.main__title, {
              [styles['main__title--starred']]: props.isStarred,
            })}
          >
            <div className={styles.main__title__saves}>{props.saves}</div>
            {props.isNsfw && (
              <div className={styles.main__title__nsfw}>NSFW</div>
            )}
            <div className={styles.main__title__text}>{props.title}</div>
          </div>
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
                onClick={(e) => {
                  e.stopPropagation()
                  if (!tag.isSelected) {
                    // remove tag from selected
                  } else if (tag.yields) {
                    // select tag
                  }
                }}
                key={tag.name}
              >
                <div>
                  <span
                    className={cn([
                      styles.main__tags__tag__name,
                      {
                        [styles['main__tags__tag__name--selected']]:
                          tag.isSelected,
                      },
                    ])}
                  >
                    {tag.name}
                  </span>
                  {tag.yields && (
                    <span className={styles.main__tags__tag__yields}>
                      {tag.yields}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actions__button}
          onClick={(e) => {
            e.stopPropagation()
            props.onMenuClick()
          }}
        >
          <Icon variant="THREE_DOTS" />
        </button>
        <button className={styles.actions__button}>
          <Icon variant="INFO" />
        </button>
      </div>

      <div className={styles.link}>
        <div className={styles.link__inner}>
          <a
            className={styles.link__inner__element}
            onClick={(e) => {
              e.stopPropagation()
            }}
            href={props.url}
          >
            <TextTruncate line={2} text={'⠀⠀' + props.url} truncateText="…" />
          </a>
        </div>
      </div>
    </div>
  )
}
