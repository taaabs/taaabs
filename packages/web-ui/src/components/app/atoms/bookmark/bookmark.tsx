import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'
import styles from './bookmark.module.scss'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { memo, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export namespace Bookmark {
  export type Props = {
    index: number
    id: string
    title: string
    date: Date
    on_tag_click: (tagId: number) => void
    on_selected_tag_click: (tagId: number) => void
    tags: { id: number; name: string; yields?: number; isSelected?: boolean }[]
    on_click: () => void
    on_menu_click: () => void
    is_nsfw?: boolean
    is_starred?: boolean
    links: { url: string; sitePath?: string; saves: number }[]
    render_height?: number
  }
}

export const Bookmark: React.FC<Bookmark.Props> = memo(
  (props) => {
    const ref = useRef<HTMLDivElement>(null)
    const [renderHeight, setRenderHeight] = useState<number | undefined>(
      undefined,
    )
    const isVisible = useViewportSpy(ref)

    useEffect(() => {
      if (renderHeight) return

      setRenderHeight(ref.current!.clientHeight)
      sessionStorage.setItem(
        `renderHeight_${props.id}`,
        ref.current!.clientHeight.toString(),
      )
    }, [])

    return (
      <div
        ref={ref}
        style={{
          height: renderHeight
            ? renderHeight
            : props.render_height
            ? props.render_height
            : undefined,
        }}
      >
        {isVisible || !renderHeight ? (
          <div
            className={styles.container}
            role="button"
            onClick={props.on_click}
          >
            <div className={styles.bookmark}>
              <div className={styles.bookmark__title}>
                <div
                  className={cn(styles.bookmark__title__inner, {
                    [styles['bookmark__title__inner--starred']]:
                      props.is_starred,
                  })}
                >
                  {props.is_nsfw && (
                    <div className={styles.bookmark__title__inner__nsfw}>
                      NSFW
                    </div>
                  )}
                  <div
                    className={styles.bookmark__title__inner__text}
                    role="button"
                    onClick={() => {}}
                  >
                    {props.title}
                  </div>
                </div>
              </div>
              <div className={styles.bookmark__menu}>
                <button
                  className={styles.bookmark__menu__button}
                  onClick={(e) => {
                    e.stopPropagation()
                    props.on_menu_click()
                  }}
                >
                  <Icon variant="THREE_DOTS" />
                </button>
              </div>
              <div className={styles['bookmark__info']}>
                <span>{props.index + 1}</span>
                <span>·</span>
                <span>{dayjs(props.date).fromNow()}</span>

                {props.tags.length > 0 && (
                  <>
                    <span>·</span>
                    {props.tags.map((tag) => (
                      <button
                        className={styles['bookmark__info__tag']}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (tag.isSelected) {
                            props.on_selected_tag_click(tag.id)
                          } else {
                            props.on_tag_click(tag.id)
                          }
                        }}
                        key={tag.id}
                      >
                        <div>
                          <span
                            className={cn([
                              styles['bookmark__info__tag__name'],
                              {
                                [styles['bookmark__info__tag__name--selected']]:
                                  tag.isSelected,
                              },
                            ])}
                          >
                            {tag.name.replaceAll('-', ' ')}
                          </span>
                          {tag.yields && (
                            <span
                              className={styles['bookmark__info__tag__yields']}
                            >
                              {tag.yields}
                            </span>
                          )}
                          {tag.isSelected && (
                            <span
                              className={styles['bookmark__info__tag__yields']}
                            >
                              ×
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
              <div className={styles.bookmark__links}>
                {props.links.map((link) => (
                  <div className={styles.bookmark__links__item}>
                    <div className={styles.bookmark__links__item__site}>
                      <button
                        className={styles.bookmark__links__item__site__favicon}
                      >
                        <img
                          src={`https://icons.bitwarden.net/${_urlDomain(
                            link.url,
                          )}/icon.png`}
                        />
                      </button>
                      <a
                        className={styles.bookmark__links__item__site__url}
                        href={link.url}
                      >
                        <span>
                          {`${_urlDomain(link.url)} ${
                            link.sitePath ? `› ${link.sitePath}` : ''
                          }`}
                        </span>
                        <span>
                          {_urlPath({
                            url: link.url,
                            sitePath: link.sitePath,
                          })}
                        </span>
                      </a>
                    </div>
                    <div className={styles.bookmark__links__item__actions}>
                      <div
                        className={styles.bookmark__links__item__actions__open}
                      >
                        <button
                          onClick={() => {
                            window.open(link.url, '_blank')
                          }}
                        >
                          <Icon variant="NEW_TAB" />
                        </button>
                      </div>
                      <button
                        className={
                          styles.bookmark__links__item__actions__bookmark
                        }
                      >
                        <span>{link.saves}</span>
                        <Icon variant="BOOKMARK" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    )
  },
  (o, n) => JSON.stringify(o.tags) == JSON.stringify(n.tags),
)

function _urlDomain(url: string): string {
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

  return parsedUrl.split('/')[0]
}

function _urlPath(params: { url: string; sitePath?: string }): string {
  let parsedUrl = params.url.replace('://', '').split('?')[0]

  if (parsedUrl.substring(parsedUrl.length - 1, parsedUrl.length) == '/') {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 1)
  }

  if (
    parsedUrl.substring(parsedUrl.length - 11, parsedUrl.length) ==
    '/index.html'
  ) {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 11)
  } else if (
    parsedUrl.substring(parsedUrl.length - 10, parsedUrl.length) == '/index.htm'
  ) {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 10)
  } else if (
    parsedUrl.substring(parsedUrl.length - 5, parsedUrl.length) == '.html'
  ) {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 5)
  } else if (
    parsedUrl.substring(parsedUrl.length - 4, parsedUrl.length) == '.htm'
  ) {
    parsedUrl = parsedUrl.substring(0, parsedUrl.length - 4)
  }

  const parsedUrlArr = parsedUrl.split('/')
  parsedUrlArr.shift()

  parsedUrl = parsedUrlArr.join('/')

  if (params.sitePath && parsedUrl.startsWith(params.sitePath)) {
    parsedUrl = parsedUrl.substring(params.sitePath.length + 1)
  }

  return parsedUrl.split('/').join(' › ')
}
