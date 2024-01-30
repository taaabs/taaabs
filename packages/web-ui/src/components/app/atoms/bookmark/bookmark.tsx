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
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search/get-site-variants-for-search'
import { Icon } from '@web-ui/components/common/particles/icon'
import { useContextMenu } from 'use-context-menu'
import { DropdownMenu } from '../dropdown-menu'

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
  export type Highlights = [number, number][]

  export type Props = {
    bookmark_id: number
    updated_at: string
    title?: string
    note?: string
    date: Date
    density: 'default' | 'compact'
    is_compact?: boolean
    on_tag_click: (tag_id: number) => void
    on_tag_delete_click: (tag_id: number) => void
    on_selected_tag_click: (tag_id: number) => void
    on_mouse_up_on_tag: (tag_id: number) => void
    tags: { id: number; name: string; yields?: number; isSelected?: boolean }[]
    number_of_selected_tags: number
    query_params?: string
    on_click: () => void
    is_unread?: boolean
    stars: number
    links: { url: string; site_path?: string; saves?: number }[]
    render_height?: number
    set_render_height: (height: number) => void
    on_link_click?: () => void
    favicon_host: string
    on_menu_click: () => Promise<void>
    menu_slot: React.ReactNode
    highlights?: Highlights
    highlights_note?: Highlights
    highlights_site_variants?: string[]
    orama_db_id?: string
    should_dim_visited_links: boolean
    current_filter?: string // Needs by [use_search/update_searchable_bookmarks]
    is_fetching_bookmarks: boolean
    counts_refreshed_at_timestamp?: number // When updating other bookmark, we refetch counts and this is needed to trigger a rerender of all bookmarks
    is_not_interactive?: boolean
    on_tag_drag_start?: (params: {
      id: number
      name: string
      source_bookmark_id: number
      over_sibling_tag_name?: string
    }) => void
    dragged_tag?: { id: number; name: string; source_bookmark_id?: number }
    on_mouse_up?: () => void
  }
}

export const Bookmark: React.FC<Bookmark.Props> = memo(
  function Bookmark(props) {
    const ref = useRef<HTMLDivElement>(null)
    const is_visible = useViewportSpy(ref)
    const [is_menu_open, toggle_is_menu_open] = useToggle(false)
    const [render_height, set_render_height] = useState<number | undefined>(
      undefined,
    )
    const [context_menu_of_tag_id, set_context_menu_of_tag_id] =
      useState<number>()
    const { contextMenu, onContextMenu } = useContextMenu(
      <>
        <DropdownMenu
          items={[
            {
              label: 'Delete',
              on_click: () => {
                if (!context_menu_of_tag_id) return
                props.on_tag_delete_click(context_menu_of_tag_id)
              },
              other_icon: <Icon variant="DELETE" />,
            },
          ]}
        />
      </>,
    )

    useEffect(() => {
      if (render_height === undefined && props.render_height) {
        set_render_height(props.render_height)
      } else {
        set_render_height(0)
        setTimeout(() => {
          if (!ref.current) return
          const height = ref.current.getBoundingClientRect().height
          props.set_render_height(height)
          set_render_height(height)
        }, 0)
      }
    }, [props.updated_at, props.is_compact])

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
          pointerEvents: props.is_not_interactive ? 'none' : undefined,
        }}
        className={cn(styles.wrapper, {
          [styles['wrapper--compact']]: props.density == 'compact',
          [styles['wrapper--margin-override']]: !props.is_compact,
        })}
      >
        {is_visible == undefined || is_visible || !props.render_height ? (
          <div
            className={cn(styles.container, {
              [styles['container--clickable']]: props.density == 'compact',
            })}
            role="button"
            onClick={(e) => {
              if (
                is_menu_open ||
                // Fixes bug when dragging tags (reordering) toggles density for a duration of data fetching.
                (e.target as any).classList[0] == styles.bookmark__main__tags
              )
                return
              props.on_click()
            }}
            onMouseUp={() => {
              if (props.on_mouse_up && props.dragged_tag) props.on_mouse_up()
            }}
          >
            <div className={styles.bookmark}>
              {contextMenu}
              <div className={styles.bookmark__main}>
                <div
                  className={cn(styles.bookmark__main__top, {
                    [styles['bookmark__main__top--compact']]: props.is_compact,
                  })}
                >
                  <div className={styles.bookmark__main__top__info}>
                    {bookmark_date}
                  </div>
                  <div className={styles.bookmark__main__top__menu}>
                    <OutsideClickHandler
                      disabled={!is_menu_open}
                      onOutsideClick={() => {
                        toggle_is_menu_open()
                      }}
                    >
                      <button
                        className={cn(
                          styles.bookmark__main__top__menu__button,
                          {
                            [styles['bookmark__main__top__menu--toggled']]:
                              is_menu_open,
                          },
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!is_menu_open) {
                            props.on_menu_click()
                          }
                          toggle_is_menu_open()
                        }}
                      >
                        <Icon variant="THREE_DOTS" />
                      </button>
                      <div
                        className={cn(styles.bookmark__main__top__menu__slot, {
                          [styles['bookmark__main__top__menu__slot--hidden']]:
                            !is_menu_open,
                        })}
                        onClick={() => {
                          toggle_is_menu_open()
                        }}
                      >
                        {props.menu_slot}
                      </div>
                    </OutsideClickHandler>
                  </div>
                </div>
                <div className={styles.bookmark__main__content}>
                  <div className={styles.bookmark__main__content__title}>
                    {props.is_unread && (
                      <div
                        className={
                          styles.bookmark__main__content__title__unread
                        }
                      />
                    )}
                    {props.stars >= 1 && (
                      <div
                        className={styles.bookmark__main__content__title__stars}
                      >
                        {[...new Array(props.stars)].map((_, i) => (
                          <Icon variant="STAR_FILLED" key={i} />
                        ))}
                      </div>
                    )}
                    {props.title ? (
                      <div
                        className={cn(
                          styles.bookmark__main__content__title__text,
                          {
                            [styles[
                              'bookmark__main__content__title__text--unread'
                            ]]: props.is_unread,
                          },
                        )}
                      >
                        {props.highlights
                          ? props.title.split('').map((char, i) => {
                              const is_highlighted = props.highlights!.find(
                                ([index, length]) =>
                                  i >= index && i < index + length,
                              )

                              return is_highlighted ? (
                                <span className={styles.highlight} key={i}>
                                  {char}
                                </span>
                              ) : (
                                <span key={i}>{char}</span>
                              )
                            })
                          : props.title}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          styles.bookmark__main__content__title__text,
                          styles[
                            'bookmark__main__content__title__text--untitled'
                          ],
                        )}
                      >
                        (Untitled)
                      </div>
                    )}
                  </div>
                  {props.note && (
                    <div className={styles.bookmark__main__content__note}>
                      {props.highlights_note
                        ? props.note.split('').map((char, i) => {
                            const is_highlighted = props.highlights_note!.find(
                              ([index, length]) =>
                                i >= index && i < index + length,
                            )
                            return is_highlighted ? (
                              <span className={styles.highlight} key={i}>
                                {char}
                              </span>
                            ) : (
                              <span key={i}>{char}</span>
                            )
                          })
                        : props.note}
                    </div>
                  )}
                </div>
                <div className={styles.bookmark__main__tags}>
                  {props.tags.length > 0 && (
                    <>
                      {props.tags.map((tag, i) => {
                        const tag_first_char_index_in_search_title = (
                          (props.title ? `${props.title} ` : '') +
                          props.tags
                            .map((tag) => ` ${tag.name}`)
                            .slice(0, i)
                            .join('')
                        ).length

                        return (
                          <button
                            key={tag.id}
                            className={styles.bookmark__main__tags__tag}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (tag.isSelected) {
                                props.on_selected_tag_click(tag.id)
                              } else {
                                props.on_tag_click(tag.id)
                              }
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              if (!props.on_tag_drag_start) return
                              props.on_tag_drag_start({
                                id: tag.id,
                                name: tag.name,
                                source_bookmark_id: props.bookmark_id,
                              })
                            }}
                            onMouseEnter={() => {
                              if (!props.on_tag_drag_start) return
                              if (
                                props.dragged_tag &&
                                props.dragged_tag.source_bookmark_id ==
                                  props.bookmark_id &&
                                tag.name != props.dragged_tag.name &&
                                props.tags.findIndex(
                                  (tag) => tag.id == props.dragged_tag!.id,
                                ) != -1
                              ) {
                                props.on_tag_drag_start({
                                  id: props.dragged_tag.id,
                                  name: props.dragged_tag.name,
                                  source_bookmark_id: props.bookmark_id,
                                  over_sibling_tag_name: tag.name,
                                })
                              }
                            }}
                            onMouseLeave={() => {
                              if (!props.on_tag_drag_start) return
                              if (props.dragged_tag) {
                                props.on_tag_drag_start({
                                  id: props.dragged_tag.id,
                                  name: props.dragged_tag.name,
                                  source_bookmark_id: props.bookmark_id,
                                })
                              }
                            }}
                            onContextMenu={(e) => {
                              set_context_menu_of_tag_id(tag.id)
                              onContextMenu(e)
                            }}
                            onMouseUp={() => {
                              // Fixes interference with loading state when selecting.
                              setTimeout(() => {
                                props.on_mouse_up_on_tag(tag.id)
                              }, 0)
                            }}
                          >
                            <div>
                              <span
                                className={cn([
                                  styles.bookmark__main__tags__tag__name,
                                  {
                                    [styles[
                                      'bookmark__main__tags__tag__name--selected'
                                    ]]: tag.isSelected,
                                  },
                                ])}
                              >
                                {props.highlights
                                  ? tag.name.split('').map((char, i) => {
                                      const real_i =
                                        tag_first_char_index_in_search_title + i
                                      const is_highlighted =
                                        props.highlights!.find(
                                          ([index, length]) =>
                                            real_i >= index &&
                                            real_i < index + length,
                                        )
                                      return is_highlighted ? (
                                        <span
                                          className={styles.highlight}
                                          key={i}
                                        >
                                          {char}
                                        </span>
                                      ) : (
                                        <span key={i}>{char}</span>
                                      )
                                    })
                                  : tag.name}
                              </span>
                              {!tag.isSelected && tag.yields && (
                                <span
                                  className={
                                    styles.bookmark__main__tags__tag__yields
                                  }
                                >
                                  {tag.yields}
                                </span>
                              )}
                              {tag.isSelected && (
                                <span
                                  className={
                                    styles.bookmark__main__tags__tag__yields
                                  }
                                >
                                  ×
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
              <div
                className={cn(styles.bookmark__links, {
                  [styles['bookmark__links--compact']]: props.is_compact,
                })}
              >
                {props.links.map((link, i) => {
                  let is_site_highlighted = false
                  if (
                    props.highlights_site_variants !== undefined &&
                    props.highlights_site_variants.length
                  ) {
                    const site =
                      get_url_domain(link.url) +
                      (link.site_path ? `/${link.site_path}` : '')
                    const link_site_variants =
                      get_site_variants_for_search(site)
                    if (
                      link_site_variants.some((site_variant) =>
                        props.highlights_site_variants!.includes(site_variant),
                      )
                    ) {
                      is_site_highlighted = true
                    }
                  }

                  const link_first_char_index_in_search_title = (
                    (props.title ? `${props.title} ` : '') +
                    props.tags.map((tag) => tag.name).join(' ') +
                    (props.tags.length ? ' ' : '') +
                    props.links
                      .map(
                        (link, i) =>
                          `${get_url_domain(link.url)}${
                            link.site_path ? ` › ${link.site_path}` : ''
                          }${i > 0 ? ' ' : ''}`,
                      )
                      .slice(0, i)
                      .join(' ')
                  ).length

                  return (
                    <div
                      className={styles.bookmark__links__item}
                      key={link.url}
                    >
                      <div className={styles.bookmark__links__item__link}>
                        <button
                          className={cn(
                            styles.bookmark__links__item__link__site,
                            {
                              [styles[
                                'bookmark__links__item__link__site--highlighted'
                              ]]: is_site_highlighted,
                            },
                          )}
                        >
                          <LazyLoadImage
                            alt={'Favicon'}
                            width={16}
                            height={16}
                            src={`${props.favicon_host}/${get_url_domain(
                              link.url,
                            )}`}
                          />
                        </button>
                        <a
                          className={cn(
                            styles.bookmark__links__item__link__url,
                            {
                              [styles[
                                'bookmark__links__item__link__url--dim-visited'
                              ]]: props.should_dim_visited_links,
                            },
                          )}
                          href={link.url}
                          onClick={async (e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            if (props.on_link_click) {
                              props.on_link_click()
                            }
                            location.href = link.url
                          }}
                        >
                          <span>
                            {props.highlights
                              ? `${get_url_domain(link.url)} ${
                                  link.site_path ? `› ${link.site_path} ` : ''
                                }`
                                  .split('')
                                  .map((char, i) => {
                                    const real_i =
                                      link_first_char_index_in_search_title + i
                                    const is_highlighted =
                                      props.highlights!.find(
                                        ([index, length]) =>
                                          real_i >= index &&
                                          real_i < index + length,
                                      )
                                    return is_highlighted ? (
                                      <span
                                        className={styles.highlight}
                                        key={i}
                                      >
                                        {char}
                                      </span>
                                    ) : (
                                      <span key={i}>{char}</span>
                                    )
                                  })
                              : `${get_url_domain(link.url)
                                  .split('.')
                                  .map((segment) =>
                                    segment.replace(/(.{5})/g, '$1​'),
                                  )
                                  .join('.')} ${
                                  link.site_path ? `› ${link.site_path}` : ''
                                }`}
                          </span>
                          <span>
                            {url_path_for_display({
                              url: link.url,
                              site_path: link.site_path,
                            })}
                          </span>
                        </a>
                      </div>
                      <div className={styles.bookmark__links__item__actions}>
                        {link.saves !== undefined && link.saves > 0 && (
                          <button
                            className={
                              styles[
                                'bookmark__links__item__actions__public-saves'
                              ]
                            }
                          >
                            {link.saves}
                          </button>
                        )}
                        <button
                          className={
                            styles.bookmark__links__item__actions__open
                          }
                          onClick={async (e) => {
                            e.stopPropagation()
                            window.open(link.url, '_blank')
                            if (props.on_link_click) {
                              props.on_link_click()
                            }
                          }}
                        >
                          <Icon variant="NEW_TAB" />
                        </button>
                        <button
                          className={
                            styles.bookmark__links__item__actions__menu
                          }
                          onClick={async () => {}}
                        >
                          <Icon variant="THREE_DOTS" />
                        </button>
                      </div>
                    </div>
                  )
                })}
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
    o.is_compact == n.is_compact &&
    o.density == n.density &&
    o.is_not_interactive == n.is_not_interactive &&
    o.is_fetching_bookmarks == n.is_fetching_bookmarks &&
    o.updated_at == n.updated_at &&
    o.render_height == n.render_height &&
    o.query_params == n.query_params &&
    o.number_of_selected_tags == n.number_of_selected_tags &&
    o.orama_db_id == n.orama_db_id &&
    o.current_filter == n.current_filter &&
    o.counts_refreshed_at_timestamp == n.counts_refreshed_at_timestamp &&
    o.dragged_tag?.id == n.dragged_tag?.id,
)

function get_url_domain(url: string): string {
  let parsed_url = ''
  if (url.substring(0, 8) == 'https://') {
    parsed_url = url.substring(8)
  } else if (url.substring(0, 7) == 'http://') {
    parsed_url = url.substring(7)
  } else {
    parsed_url = url
  }

  return parsed_url.split('/')[0]
}

function url_path_for_display(params: {
  url: string
  site_path?: string
}): string {
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

  return parsed_url
    .split('/')
    .map((segment) => segment.replace(/(.{5})/g, '$1​'))
    .join(' › ')
}
