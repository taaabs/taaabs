import cn from 'classnames'
import styles from './bookmark.module.scss'
import useResizeObserver from 'beautiful-react-hooks/useResizeObserver'
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
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

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
    is_public: boolean
    points?: number
    title?: string
    note?: string
    date: Date
    density: 'default' | 'compact'
    is_compact?: boolean
    on_tag_click: (tag_id: number) => void
    on_tag_delete_click: (tag_id: number) => void
    on_selected_tag_click: (tag_id: number) => void
    on_mouse_up_on_tag: (tag_id: number) => void
    on_give_point_click: () => void
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
    const DOMRect = useResizeObserver(ref)
    const is_visible = useViewportSpy(ref)
    const [is_menu_open, toggle_is_menu_open] = useToggle(false)
    const [render_height, set_render_height] = useState<number | undefined>(
      props.render_height,
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

    useUpdateEffect(() => {
      if (render_height === undefined) {
        if (!ref.current) return
        const height = ref.current.getBoundingClientRect().height
        set_render_height(height)
        props.set_render_height(height)
      }
    }, [render_height])

    useUpdateEffect(() => {
      if (!DOMRect) return
      set_render_height(undefined)
    }, [DOMRect])

    useEffect(() => {
      if (is_visible && !render_height) {
        if (!ref.current) return
        const height = ref.current.getBoundingClientRect().height
        set_render_height(height)
        props.set_render_height(height)
      }
    }, [is_visible])

    const relative_time = dayjs(props.date).fromNow()

    const bookmark_date =
      relative_time != ''
        ? relative_time
        : dayjs(props.date).format('MMM DD, YYYY')

    return (
      <div
        ref={ref}
        style={{
          height: !is_visible && render_height ? render_height : undefined,
          pointerEvents: props.is_not_interactive ? 'none' : undefined,
        }}
        className={cn(styles.wrapper, {
          [styles['wrapper--compact']]: props.density == 'compact',
          [styles['wrapper--margin-override']]: !props.is_compact,
        })}
      >
        {is_visible == undefined || is_visible || !render_height ? (
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
              if (
                props.on_mouse_up &&
                props.dragged_tag &&
                !props.tags.find((tag) => tag.name == props.dragged_tag!.name)
              ) {
                document.body.classList.remove('adding-tag')
                props.on_mouse_up()
              }
            }}
            onMouseEnter={() => {
              if (
                props.dragged_tag &&
                !props.tags.find((tag) => tag.name == props.dragged_tag!.name)
              ) {
                document.body.classList.add('adding-tag')
              }
            }}
            onMouseLeave={() => {
              if (props.dragged_tag) {
                document.body.classList.remove('adding-tag')
              }
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
                    {props.stars >= 1 && (
                      <div
                        className={styles.bookmark__main__content__title__stars}
                      >
                        {[...new Array(props.stars)].map((_, i) => (
                          <Icon variant="STAR_FILLED" key={i} />
                        ))}
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
                  {props.is_public ? (
                    <button
                      className={styles.bookmark__main__tags__emoji}
                      onClick={(e) => {
                        e.stopPropagation()
                        props.on_give_point_click()
                      }}
                    >
                      {/* Empty space needed by inline element to render correctly. */}
                      ⠀
                      <div
                        className={
                          styles.bookmark__main__tags__emoji__hugging__eyes
                        }
                      >
                        <svg
                          viewBox="0 0 18 5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="var(--neutral950)"
                        >
                          <path d="M14.4915 3.47358C15.1131 3.69079 15.3559 4.98422 15.9824 4.64852C16.4067 4.41958 16.7546 4.06789 16.9821 3.63794C17.2097 3.20799 17.3067 2.71909 17.261 2.23308C17.2152 1.74707 17.0286 1.28578 16.7249 0.907545C16.4212 0.529311 16.014 0.251126 15.5547 0.108175C15.0955 -0.034777 14.6048 -0.0360746 14.1449 0.104447C13.6849 0.244968 13.2762 0.520996 12.9706 0.89762C12.665 1.27424 12.4761 1.73454 12.4278 2.22031C12.3795 2.70607 12.4741 3.19547 12.6994 3.62662C12.9957 4.19434 13.9378 3.27117 14.4963 3.46864L14.4915 3.47358ZM3.0544 3.47358C2.43276 3.69079 2.18508 4.98422 1.56345 4.64852C1.13923 4.41958 0.79133 4.06789 0.563752 3.63794C0.336175 3.20799 0.239141 2.71909 0.284923 2.23308C0.330705 1.74707 0.517246 1.28578 0.820954 0.907545C1.12466 0.529311 1.53189 0.251126 1.99115 0.108175C2.4504 -0.034777 2.94104 -0.0360746 3.40101 0.104447C3.86099 0.244968 4.26964 0.520996 4.57528 0.89762C4.88092 1.27424 5.06982 1.73454 5.11809 2.22031C5.16636 2.70607 5.07182 3.19547 4.84645 3.62662C4.5502 4.19434 3.60318 3.27117 3.04954 3.46864L3.0544 3.47358Z" />
                        </svg>
                      </div>
                      <div
                        className={
                          styles.bookmark__main__tags__emoji__hugging__mouth
                        }
                      >
                        <svg
                          viewBox="0 0 12 7"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.85206 6.70256C9.91819 6.70256 11.2294 3.06782 11.2294 1.20066C11.2294 0.229731 10.58 0.536776 9.53764 1.05128C8.57385 1.52845 7.27914 2.18818 5.8562 2.18818C2.8821 2.18818 0.478821 -0.666506 0.478821 1.20066C0.478821 3.06782 1.78594 6.70256 5.8562 6.70256H5.85206Z"
                            fill="var(--red)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.74059 5.76168C2.95877 5.31262 3.26596 4.9139 3.643 4.59038C4.02004 4.26687 4.45885 4.0255 4.93206 3.88134C5.09745 3.83108 5.38657 3.71082 6.00561 3.71082C6.62466 3.71082 6.87544 3.84783 7.05324 3.90228C7.9415 4.18788 8.68377 4.81487 9.12067 5.64861C10.663 4.41738 11.2294 2.40721 11.2294 1.16761C11.2294 0.187649 10.5803 0.49755 9.53829 1.01684L9.4804 1.04616C8.52525 1.52776 7.25171 2.16432 5.85413 2.16432C4.45655 2.16432 3.18715 1.52776 2.22786 1.04616C1.1528 0.505927 0.478821 0.16671 0.478821 1.16761C0.478821 2.4449 1.08251 4.54302 2.74059 5.76168Z"
                            fill="var(--neutral950)"
                          />
                        </svg>
                      </div>
                      <div
                        className={
                          styles[
                            'bookmark__main__tags__emoji__hugging__left-hand'
                          ]
                        }
                      >
                        <svg
                          viewBox="0 0 12 11"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.83136 8.96455C9.46853 9.55133 8.94003 9.93714 8.61491 10.0895C8.28979 10.2419 7.59645 10.5082 7.03657 10.3569C6.47668 10.2057 3.41948 9.37974 2.45077 9.11803C1.48206 8.85633 0.527558 7.52332 0.697742 6.05857C0.867925 4.59382 1.49254 3.96967 2.04424 3.58115C2.59595 3.19263 3.48669 3.28602 4.05196 3.33963C4.14921 3.34885 4.28591 3.37271 4.42198 3.39779C4.42198 3.39779 4.9159 3.49621 5.21661 3.56971C5.51732 3.6432 6.03314 3.77576 6.03314 3.77576C5.99569 3.44571 5.96904 3.18787 6.18718 2.82626C6.63736 2.07998 7.50432 2.10085 7.91838 2.60018C8.33243 3.09951 9.86903 5.77911 10.1624 6.60924C10.4558 7.43937 10.1942 8.37777 9.83136 8.96455Z"
                            fill="var(--blue500)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.42198 3.39779C4.42198 3.39779 4.9159 3.49621 5.21661 3.56971C5.51732 3.6432 6.03314 3.77576 6.03314 3.77576C5.74425 4.86279 6.03708 4.73977 6.04866 5.62698C6.06024 6.5142 5.51732 7.2631 4.6451 7.2631C3.77288 7.2631 3.28606 6.69046 3.28606 5.9133C3.28607 5.13614 3.96026 4.2827 4.42198 3.39779Z"
                            fill="var(--blue600)"
                          />
                        </svg>
                      </div>
                      <div
                        className={
                          styles[
                            'bookmark__main__tags__emoji__hugging__right-hand'
                          ]
                        }
                      >
                        <svg
                          width="12"
                          height="11"
                          viewBox="0 0 12 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.16864 8.96284C2.53147 9.54962 3.05997 9.93543 3.38509 10.0878C3.71021 10.2402 4.40355 10.5065 4.96343 10.3552C5.52332 10.204 8.58052 9.37803 9.54923 9.11632C10.5179 8.85462 11.4724 7.52161 11.3023 6.05686C11.1321 4.59211 10.5075 3.96796 9.95576 3.57944C9.40405 3.19092 8.51331 3.28431 7.94804 3.33792C7.85079 3.34715 7.71409 3.37101 7.57802 3.39608C7.57802 3.39608 7.0841 3.49451 6.78339 3.568C6.48268 3.64149 5.96686 3.77405 5.96686 3.77405C6.00431 3.444 6.03096 3.18616 5.81282 2.82455C5.36264 2.07827 4.49568 2.09914 4.08162 2.59847C3.66757 3.0978 2.13097 5.7774 1.8376 6.60753C1.54423 7.43766 1.80581 8.37606 2.16864 8.96284Z"
                            fill="var(--blue500)"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.57802 3.39608C7.57802 3.39608 7.0841 3.49451 6.78339 3.568C6.48268 3.64149 5.96686 3.77405 5.96686 3.77405C6.25575 4.86108 5.96292 4.73806 5.95134 5.62528C5.93976 6.51249 6.48268 7.26139 7.3549 7.26139C8.22712 7.26139 8.71394 6.68875 8.71394 5.91159C8.71393 5.13443 8.03974 4.28099 7.57802 3.39608Z"
                            fill="var(--blue600)"
                          />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <button
                      className={styles.bookmark__main__tags__emoji}
                      onClick={(e) => {
                        e.stopPropagation()
                        props.on_give_point_click()
                      }}
                    >
                      ⠀
                      <div
                        className={
                          styles.bookmark__main__tags__emoji__silent__eyes
                        }
                      >
                        <svg
                          viewBox="0 0 18 5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="var(--neutral950)"
                        >
                          <path d="M14.4915 3.47358C15.1131 3.69079 15.3559 4.98422 15.9824 4.64852C16.4067 4.41958 16.7546 4.06789 16.9821 3.63794C17.2097 3.20799 17.3067 2.71909 17.261 2.23308C17.2152 1.74707 17.0286 1.28578 16.7249 0.907545C16.4212 0.529311 16.014 0.251126 15.5547 0.108175C15.0955 -0.034777 14.6048 -0.0360746 14.1449 0.104447C13.6849 0.244968 13.2762 0.520996 12.9706 0.89762C12.665 1.27424 12.4761 1.73454 12.4278 2.22031C12.3795 2.70607 12.4741 3.19547 12.6994 3.62662C12.9957 4.19434 13.9378 3.27117 14.4963 3.46864L14.4915 3.47358ZM3.0544 3.47358C2.43276 3.69079 2.18508 4.98422 1.56345 4.64852C1.13923 4.41958 0.79133 4.06789 0.563752 3.63794C0.336175 3.20799 0.239141 2.71909 0.284923 2.23308C0.330705 1.74707 0.517246 1.28578 0.820954 0.907545C1.12466 0.529311 1.53189 0.251126 1.99115 0.108175C2.4504 -0.034777 2.94104 -0.0360746 3.40101 0.104447C3.86099 0.244968 4.26964 0.520996 4.57528 0.89762C4.88092 1.27424 5.06982 1.73454 5.11809 2.22031C5.16636 2.70607 5.07182 3.19547 4.84645 3.62662C4.5502 4.19434 3.60318 3.27117 3.04954 3.46864L3.0544 3.47358Z" />
                        </svg>
                      </div>
                      <div
                        className={
                          styles.bookmark__main__tags__emoji__silent__zip
                        }
                      >
                        <svg
                          viewBox="0 0 9 3"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.573393 1.26148C0.645952 0.91131 0.900727 0.670167 1.14245 0.722872L2.66279 1.05437C2.90451 1.10707 3.04164 1.43367 2.96909 1.78383V1.78383C2.89653 2.134 2.64175 2.37515 2.40003 2.32244L0.879688 1.99095C0.637967 1.93824 0.500834 1.61165 0.573393 1.26148V1.26148Z"
                            fill="#0A0A0A"
                          />
                          <path
                            d="M3.70923 1.896C3.70923 1.53801 3.88841 1.2478 4.10943 1.2478H5.49962C5.72064 1.2478 5.89982 1.53801 5.89982 1.896V1.896C5.89982 2.254 5.72064 2.54421 5.49962 2.54421H4.10943C3.88841 2.54421 3.70923 2.254 3.70923 1.896V1.896Z"
                            fill="#0A0A0A"
                          />
                          <path
                            d="M6.63262 1.96135C6.57202 1.6088 6.69934 1.29108 6.91701 1.25171L8.28608 1.00408C8.50375 0.96471 8.72933 1.21859 8.78993 1.57115C8.85053 1.9237 8.7232 2.24142 8.50553 2.28079L7.13647 2.52842C6.9188 2.56779 6.69322 2.31391 6.63262 1.96135Z"
                            fill="#0A0A0A"
                          />
                        </svg>
                      </div>
                      <div
                        className={
                          styles.bookmark__main__tags__emoji__silent__handle
                        }
                      >
                        <svg
                          viewBox="0 0 12 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.3396 3.73331C10.9324 2.32792 3.80375 0.286184 1.91168 0.853799C0.019618 1.42141 -0.331868 3.26096 0.446892 4.63621C1.22565 6.01146 5.88454 10.8776 6.9675 10.7489C8.05046 10.6202 11.7469 5.1387 11.3396 3.73331ZM6.66955 7.22569C7.30513 7.27632 8.8027 5.23113 8.16981 4.56013C7.53693 3.88914 5.44112 3.71413 4.99439 4.45654C4.54766 5.19896 6.03398 7.17507 6.66955 7.22569Z"
                            fill="var(--blue600)"
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                  {props.points !== undefined && (
                    <button
                      className={styles.bookmark__main__tags__amount}
                      onClick={() => {}}
                    >
                      {props.points}
                    </button>
                  )}
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
                                  const is_highlighted = props.highlights!.find(
                                    ([index, length]) =>
                                      real_i >= index &&
                                      real_i < index + length,
                                  )
                                  return is_highlighted ? (
                                    <span className={styles.highlight} key={i}>
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
                </div>
              </div>
              <div
                className={cn(styles.bookmark__links, {
                  [styles['bookmark__links--compact']]: props.is_compact,
                })}
              >
                {props.links.map((link, link_idx) => {
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
                      .slice(0, link_idx)
                      .join('')
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
                                      link_first_char_index_in_search_title +
                                      i +
                                      (link_idx > 0 ? 1 : 0)
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
    o.points == n.points &&
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
