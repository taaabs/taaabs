import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'
import styles from './bookmark.module.scss'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { memo, useEffect, useRef } from 'react'
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
    links: { url: string; site_path?: string; saves: number }[]
    render_height?: number
    set_render_height: (height: number) => void
  }
}

export const Bookmark: React.FC<Bookmark.Props> = memo(
  (props) => {
    const ref = useRef<HTMLDivElement>(null)
    const is_visible = useViewportSpy(ref)

    useEffect(() => {
      if (props.render_height) return
      props.set_render_height(ref.current!.clientHeight)
    }, [])

    return (
      <div
        ref={ref}
        style={{
          height: props.render_height ? props.render_height : undefined,
        }}
      >
        {is_visible == undefined || is_visible || !props.render_height ? (
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
                <span>#{props.index + 1}</span>
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
                          src={`https://icons.bitwarden.net/${_url_domain(
                            link.url,
                          )}/icon.png`}
                        />
                      </button>
                      <a
                        className={styles.bookmark__links__item__site__url}
                        href={link.url}
                      >
                        <span>
                          {`${_url_domain(link.url)} ${
                            link.site_path ? `› ${link.site_path}` : ''
                          }`}
                        </span>
                        <span>
                          {_url_path({
                            url: link.url,
                            site_path: link.site_path,
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
  (o, n) =>
    o.render_height == n.render_height &&
    o.id == n.id &&
    JSON.stringify(o.tags) == JSON.stringify(n.tags),
)

function _url_domain(url: string): string {
  let parsed_url = ''
  if (url.substring(0, 12) == 'https://www.') {
    parsed_url = url.substring(12)
  } else if (url.substring(0, 11) == 'http://www.') {
    parsed_url = url.substring(11)
  } else if (url.substring(0, 8) == 'https://') {
    parsed_url = url.substring(8)
  } else if (url.substring(0, 7) == 'http://') {
    parsed_url = url.substring(7)
  } else {
    parsed_url = url
  }

  return parsed_url.split('/')[0]
}

function _url_path(params: { url: string; site_path?: string }): string {
  let parsed_url = params.url.replace('://', '').split('?')[0]

  if (parsed_url.substring(parsed_url.length - 1, parsed_url.length) == '/') {
    parsed_url = parsed_url.substring(0, parsed_url.length - 1)
  }

  if (
    parsed_url.substring(parsed_url.length - 11, parsed_url.length) ==
    '/index.html'
  ) {
    parsed_url = parsed_url.substring(0, parsed_url.length - 11)
  } else if (
    parsed_url.substring(parsed_url.length - 10, parsed_url.length) ==
    '/index.htm'
  ) {
    parsed_url = parsed_url.substring(0, parsed_url.length - 10)
  } else if (
    parsed_url.substring(parsed_url.length - 5, parsed_url.length) == '.html'
  ) {
    parsed_url = parsed_url.substring(0, parsed_url.length - 5)
  } else if (
    parsed_url.substring(parsed_url.length - 4, parsed_url.length) == '.htm'
  ) {
    parsed_url = parsed_url.substring(0, parsed_url.length - 4)
  }

  const parsed_url_arr = parsed_url.split('/')
  parsed_url_arr.shift()

  parsed_url = parsed_url_arr.join('/')

  if (params.site_path && parsed_url.startsWith(params.site_path)) {
    parsed_url = parsed_url.substring(params.site_path.length + 1)
  }

  return parsed_url.length ? `/${parsed_url}` : ''
}
