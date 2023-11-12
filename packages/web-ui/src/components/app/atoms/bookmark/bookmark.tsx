import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'
import styles from './bookmark.module.scss'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { memo, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import OutsideClickHandler from 'react-outside-click-handler'
import useToggle from 'beautiful-react-hooks/useToggle'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '',
    MM: '',
    y: '',
    yy: '',
  },
})

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
    is_unread?: boolean
    is_starred?: boolean
    links: { url: string; site_path?: string; saves: number }[]
    render_height?: number
    set_render_height: (height: number) => void
    on_link_click?: () => Promise<void>
    favicon_host: string
    on_menu_click: () => void
    menu_slot: React.ReactNode
  }
}

export const Bookmark: React.FC<Bookmark.Props> = memo(
  (props) => {
    const ref = useRef<HTMLDivElement>(null)
    const is_visible = useViewportSpy(ref)
    const [is_menu_open, toggle_is_menu_open] = useToggle(false)
    const [render_height, set_render_height] = useState<number | undefined>(
      undefined,
    )

    useEffect(() => {
      if (typeof render_height == 'undefined' && props.render_height) {
        set_render_height(props.render_height)
      } else {
        set_render_height(0)
        setTimeout(() => {
          props.set_render_height(ref.current!.clientHeight)
          set_render_height(ref.current!.clientHeight)
        }, 0)
      }
    }, [props.is_unread])

    const relative_time = dayjs(props.date).fromNow()

    const bookmark_date =
      relative_time != ''
        ? relative_time
        : dayjs(props.date).format('MMM DD, YYYY')

    return (
      <div
        ref={ref}
        style={{
          height: render_height ? render_height : undefined,
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
                  {props.is_unread && (
                    <div className={styles.bookmark__title__inner__unread} />
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
                <OutsideClickHandler
                  disabled={!is_menu_open}
                  onOutsideClick={() => {
                    toggle_is_menu_open()
                  }}
                >
                  <button
                    className={cn(styles.bookmark__menu__button, {
                      [styles['bookmark__menu--toggled']]: is_menu_open,
                    })}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle_is_menu_open()
                      if (!is_menu_open) {
                        props.on_menu_click()
                      }
                    }}
                  >
                    <Icon variant="THREE_DOTS" />
                  </button>
                  <div
                    className={cn(styles.bookmark__menu__slot, {
                      [styles['bookmark__menu__slot--hidden']]: !is_menu_open,
                    })}
                    onClick={() => {
                      toggle_is_menu_open()
                    }}
                  >
                    {props.menu_slot}
                  </div>
                </OutsideClickHandler>
              </div>
              <div className={styles['bookmark__info']}>
                <span>{props.index + 1}</span>
                <span>·</span>
                <span>{bookmark_date}</span>
                {props.tags.length > 0 && (
                  <>
                    <span>·</span>
                    {props.tags.map((tag, i) => (
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
                            {tag.name}
                          </span>
                          {!tag.isSelected &&
                            (tag.yields ? (
                              <span
                                className={
                                  styles['bookmark__info__tag__yields']
                                }
                              >
                                {tag.yields}
                              </span>
                            ) : (
                              i != props.tags.length - 1 && (
                                <span
                                  className={
                                    styles['bookmark__info__tag__separator']
                                  }
                                >
                                  ·
                                </span>
                              )
                            ))}
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
                  <div className={styles.bookmark__links__item} key={link.url}>
                    <div className={styles.bookmark__links__item__site}>
                      <button
                        className={styles.bookmark__links__item__site__favicon}
                      >
                        <LazyLoadImage
                          alt={'Favicon'}
                          width={16}
                          height={16}
                          src={`${props.favicon_host}/${_url_domain(link.url)}`}
                        />
                      </button>
                      <a
                        className={styles.bookmark__links__item__site__url}
                        href={link.url}
                        onClick={async () => {
                          if (props.on_link_click) {
                            await props.on_link_click()
                          }
                        }}
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
                          onClick={async () => {
                            if (props.on_link_click) {
                              await props.on_link_click()
                            }
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
    o.index == n.index &&
    o.is_starred == n.is_starred &&
    o.is_unread == n.is_unread &&
    o.render_height == n.render_height &&
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

  // return parsed_url.length ? `/${parsed_url}` : ''
  return parsed_url.split('/').join(' › ')
}
