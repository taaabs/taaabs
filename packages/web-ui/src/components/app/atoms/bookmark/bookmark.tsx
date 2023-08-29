import { Icon } from '@web-ui/components/common/particles/icon'
import TextTruncate from 'react-text-truncate'
import cn from 'classnames'
import styles from './bookmark.module.scss'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { memo, useRef, useState } from 'react'

export namespace Bookmark {
  export type Props = {
    id: string
    title: string
    url: string
    sitePath?: string
    onTagClick: (tagId: number) => void
    onSelectedTagClick: (tagId: number) => void
    tags: { id: number; name: string; yields?: number; isSelected?: boolean }[]
    saves: number
    onClick: () => void
    onMenuClick: () => void
    isNsfw?: boolean
    isStarred?: boolean
    renderHeight?: number
  }
}

export const Bookmark: React.FC<Bookmark.Props> = memo(
  (props) => {
    const ref = useRef<HTMLDivElement>(null)
    const [renderHeight, setRenderHeight] = useState<number | undefined>(
      undefined,
    )
    const isVisible = useViewportSpy(ref)

    return (
      <div
        ref={ref}
        style={{
          height: renderHeight
            ? renderHeight
            : props.renderHeight
            ? props.renderHeight
            : undefined,
        }}
      >
        {isVisible || !renderHeight ? (
          <div
            className={styles.container}
            role="button"
            onClick={props.onClick}
          >
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
                      className={styles['main__tags__tag']}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (tag.isSelected) {
                          props.onSelectedTagClick(tag.id)
                        } else {
                          props.onTagClick(tag.id)
                        }
                      }}
                      key={tag.id}
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
                          {tag.name.replaceAll('-', ' ')}
                        </span>
                        {tag.yields && (
                          <span className={styles.main__tags__tag__yields}>
                            {tag.yields}
                          </span>
                        )}
                        {tag.isSelected && (
                          <span className={styles.main__tags__tag__yields}>
                            ×
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
                <Icon variant="BOOKMARK" />
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
                  <TextTruncateMemo
                    text={'⠀⠀' + _displayUrl(props.url)}
                    onCalculated={() => {
                      if (renderHeight) return

                      setRenderHeight(ref.current!.clientHeight)
                      sessionStorage.setItem(
                        `renderHeight_${props.id}`,
                        ref.current!.clientHeight.toString(),
                      )
                    }}
                  />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    )
  },
  (o, n) => o.url == n.url && JSON.stringify(o.tags) == JSON.stringify(n.tags),
)

const TextTruncateMemo: React.FC<{ onCalculated: () => void; text: string }> =
  memo(
    (props) => {
      return (
        <TextTruncate
          line={2}
          text={props.text}
          truncateText="…"
          onCalculated={props.onCalculated}
        />
      )
    },
    (o, n) => o.text == n.text,
  )

function _displayUrl(url: string): string {
  let parsedUrl = ''
  if (url.substring(0, 12) == 'https://www.') {
    parsedUrl = url.substring(12)
  } else if (url.substring(0, 11) == 'http://www.') {
    parsedUrl = url.substring(11)
  } else if (url.substring(0, 8) == 'https://') {
    parsedUrl = url.substring(8)
  } else if (url.substring(0, 7) == 'http://') {
    parsedUrl = url.substring(7)
  } else {
    parsedUrl = url
  }

  if (parsedUrl.substring(parsedUrl.length - 1, parsedUrl.length) == '/') {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 1)
  }

  if (parsedUrl.substring(parsedUrl.length - 5, parsedUrl.length) == '.html') {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 5)
  } else if (
    parsedUrl.substring(parsedUrl.length - 4, parsedUrl.length) == '.htm'
  ) {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 4)
  }

  return parsedUrl.split('?')[0].split('/').join(' › ')
}
