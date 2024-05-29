import cn from 'classnames'
import styles from './bookmark.module.scss'
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import { ReactSortable } from 'react-sortablejs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import OutsideClickHandler from 'react-outside-click-handler'
import useToggle from 'beautiful-react-hooks/useToggle'
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search/get-site-variants-for-search'
import { Icon } from '@web-ui/components/common/particles/icon'
import { useContextMenu } from 'use-context-menu'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import confetti from 'canvas-confetti'
import { shared_values } from '@web-ui/constants'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { system_values } from '@shared/constants/system-values'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { Dropdown as UiCommon_Dropdown } from '@web-ui/components/common/dropdown'
import { StandardItem as UiCommon_Dropdown_StandardItem } from '@web-ui/components/common/dropdown/standard-item'

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
    d: 'yesterday',
    dd: '%dd',
    M: '',
    MM: '',
    y: '',
    yy: '',
  },
})

dayjs.updateLocale('pl', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'teraz',
    m: '1 min.',
    mm: '%d min.',
    h: '1 godz.',
    hh: '%d godz.',
    d: 'wczoraj',
    dd: '%d dni temu',
    M: '',
    MM: '',
    y: '',
    yy: '',
  },
})

export namespace Bookmark {
  export type Highlights = [number, number][]

  export type Props = {
    search_queried_at_timestamp_?: number
    locale: 'pl' | 'en'
    is_search_result_?: boolean
    bookmark_id_: number
    updated_at_: string
    is_public_: boolean
    points_?: number
    points_given_?: number
    title_?: string
    note_?: string
    date_: Date
    created_at_: Date
    density_: 'default' | 'compact'
    is_compact_?: boolean
    library_url_: string
    on_tag_click_: (tag_id: number) => void
    on_tag_delete_click_?: (tag_id: number) => void
    on_tag_rename_click_?: (tag_id: number) => void
    on_tags_order_change_?: (tags: Bookmark.Props['tags_']) => void
    on_selected_tag_click_: (tag_id: number) => void
    on_get_points_given_click_?: () => void
    on_give_point_click_?: (points: number) => void
    tags_: {
      id: number // Sortable requires "id", so no mangling here.
      is_public_?: boolean
      name_: string
      yields_?: number
      is_selected_?: boolean
    }[]
    search_params_?: string
    on_click_: () => void
    is_unread_?: boolean
    stars_: number
    links_: {
      url_: string
      site_path_?: string
      saves_?: number
      menu_slot_: React.ReactNode
      is_pinned_?: boolean
      open_snapshot_?: boolean
      is_public_?: boolean
      favicon_?: string
      is_parsed_?: boolean
    }[]
    on_link_click_: (url: string) => void
    on_reading_mode_click_: (url: string) => void
    on_link_middle_click_: () => void
    on_new_tab_link_click_: (url: string) => void
    favicon_host_: string
    menu_slot_: React.ReactNode
    highlights_?: Highlights
    highlights_site_variants_?: string[]
    orama_db_id_?: string
    should_dim_visited_links_: boolean
    current_filter_?: string // Needs by [use_search/update_searchable_bookmarks].
    on_tag_drag_start_?: (params: {
      id_: number
      name_: string
      yields_: number
    }) => void
    dragged_tag_?: {
      id_: number
      name_: string
      yields_: number
    }
    on_mouse_up_?: () => void
    cover_?: string
    translations_: {
      rename_: string
      delete_: string
    }
  }
}

export const Bookmark: React.FC<Bookmark.Props> = memo(
  function Bookmark(props) {
    const [tags, set_tags] = useState<Bookmark.Props['tags_']>(props.tags_)
    const [is_points_given_requested, set_is_points_given_requested] =
      useState<boolean>()
    const [points_given, set_points_given] = useState<number>()
    const [is_desktop_menu_open, toggle_is_desktop_menu_open] = useToggle(false)
    const [is_mobile_menu_open, toggle_is_mobile_menu_open] = useToggle(false)
    const [link_url_menu_opened, set_link_url_menu_opened] = useState<string>()
    const [recently_visited_link_idx, set_recently_visited_link_idx] =
      useState<number>()
    const main_context_menu = useContextMenu(props.menu_slot_)
    const [context_menu_of_link_idx, set_context_menu_of_link_idx] =
      useState<number>()
    const link_context_menu = useContextMenu(
      props.links_.length > 0
        ? props.links_[context_menu_of_link_idx || 0].menu_slot_
        : null,
    )
    const [context_menu_of_tag_id, set_context_menu_of_tag_id] =
      useState<number>()
    const tag_context_menu = useContextMenu(
      <UiCommon_Dropdown>
        <UiCommon_Dropdown_StandardItem
          label={props.translations_.rename_}
          icon_variant="EDIT"
          on_click={() => {
            if (!context_menu_of_tag_id) return
            props.on_tag_rename_click_!(context_menu_of_tag_id)
          }}
        />
        <UiCommon_Dropdown_StandardItem
          label={props.translations_.delete_}
          icon_variant="DELETE"
          on_click={() => {
            if (!context_menu_of_tag_id) return
            props.on_tag_delete_click_!(context_menu_of_tag_id)
          }}
        />
      </UiCommon_Dropdown>,
    )

    useUpdateEffect(() => {
      if (!props.on_give_point_click_) return
      if (props.points_given_ !== undefined && points_given === undefined) {
        if (
          props.points_given_ < system_values.bookmark.points.limit_per_user
        ) {
          props.on_give_point_click_(props.points_given_ + 1)
          set_points_given(props.points_given_ + 1)
        } else {
          set_points_given(props.points_given_)
        }
      }
    }, [props.points_given_])

    useUpdateEffect(() => {
      set_tags(props.tags_)
    }, [props.updated_at_])

    const tags_dom = [
      ...tags.map((tag, i) => {
        const tag_first_char_index_in_search_title = (
          (props.title_ ? `${props.title_} ` : '') +
          (props.note_ ? `${props.note_} ` : '') +
          props.tags_
            .map((tag) => ` ${tag.name_}`)
            .slice(0, i)
            .join('')
        ).length

        const search_params = new URLSearchParams(window.location.search)
        const tags = search_params.get('t')?.split(',') || []
        if (tags.find((t) => t == tag.id.toString())) {
          search_params.set(
            't',
            tags.filter((t) => t != tag.id.toString()).join(','),
          )
        } else {
          search_params.set('t', [...tags, tag.id].join(','))
        }

        return (
          <a
            key={tag.id}
            className={cn(styles.bookmark__card__tags__tag, {
              [styles['bookmark__card__tags__tag--selected']]: tag.is_selected_,
            })}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (tag.is_selected_) {
                props.on_selected_tag_click_(tag.id)
              } else {
                props.on_tag_click_(tag.id)
              }
            }}
            href={`${props.library_url_}?${search_params.toString()}`}
            onMouseDown={(e) => {
              e.stopPropagation()
              if (!props.on_tag_drag_start_) return
              props.on_tag_drag_start_({
                id_: tag.id,
                name_: tag.name_,
                yields_: tag.yields_ || 0,
              })
            }}
            onContextMenu={(e) => {
              if ('ontouchstart' in window) {
                e.preventDefault()
              } else if (
                props.on_tag_delete_click_ ||
                props.on_tag_rename_click_
              ) {
                set_context_menu_of_tag_id(tag.id)
                tag_context_menu.onContextMenu(e)
              }
            }}
            draggable="false"
          >
            <span
              className={cn([
                styles.bookmark__card__tags__tag__name,
                {
                  [styles['bookmark__card__tags__tag__name--selected']]:
                    tag.is_selected_,
                },
              ])}
            >
              {props.highlights_
                ? tag.name_.split('').map((char, i) => {
                    const real_i = tag_first_char_index_in_search_title + i
                    const is_highlighted = props.highlights_!.find(
                      ([index, length]) =>
                        real_i >= index && real_i < index + length,
                    )
                    return is_highlighted ? (
                      <span className={styles.highlight} key={i}>
                        {char}
                      </span>
                    ) : (
                      <span key={i}>{char}</span>
                    )
                  })
                : tag.name_}
            </span>
            {!tag.is_selected_ && tag.yields_ && (
              <span className={styles.bookmark__card__tags__tag__yields}>
                {tag.yields_}
              </span>
            )}
          </a>
        )
      }),
      ...(props.dragged_tag_ &&
      props.tags_.length < system_values.bookmark.tags.limit &&
      props.tags_.findIndex((tag) => tag.id == props.dragged_tag_!.id_) == -1
        ? [
            <button
              className={styles.bookmark__card__tags__tag}
              style={{ opacity: 'var(--dimmed-opacity)' }}
              key="candidate"
            >
              <span className={styles.bookmark__card__tags__tag__name}>
                {props.dragged_tag_.name_}
              </span>
              <span className={styles.bookmark__card__tags__tag__yields}>
                {props.dragged_tag_.yields_ + 1}
              </span>
            </button>,
          ]
        : []),
    ]

    const actions_dom = (
      <div className={styles.bookmark__card__tags__actions}>
        <div
          className={cn(styles.bookmark__card__tags__actions__huggs, {
            [styles['bookmark__card__tags__actions__huggs--has-poits']]:
              props.points_,
          })}
        >
          {props.is_public_ && (
            <button
              className={styles.bookmark__card__tags__actions__huggs__amount}
              onClick={() => {}}
            >
              {props.points_}
            </button>
          )}
          {props.is_public_ ? (
            <button
              className={styles.bookmark__card__tags__actions__huggs__emoji}
              style={{
                pointerEvents:
                  !props.on_give_point_click_ ||
                  !props.on_get_points_given_click_
                    ? 'none'
                    : undefined,
              }}
              onClick={
                props.on_give_point_click_ && props.on_get_points_given_click_
                  ? (e) => {
                      e.stopPropagation()
                      if (
                        (points_given !== undefined &&
                          points_given <
                            system_values.bookmark.points.limit_per_user) ||
                        !is_points_given_requested
                      ) {
                        confetti({
                          particleCount: 20,
                          startVelocity: 11,
                          spread: 100,
                          gravity: 0.3,
                          ticks: 30,
                          decay: 0.91,
                          scalar: 0.8,
                          angle:
                            window.innerWidth < shared_values.media_query_992
                              ? 120
                              : undefined,
                          shapes: ['square'],
                          colors: ['#FFD21E', '#1d4ed8'],
                          origin: {
                            x: e.clientX / window.innerWidth,
                            y: e.clientY / window.innerHeight,
                          },
                        })
                      }
                      if (points_given === undefined) {
                        if (!is_points_given_requested) {
                          props.on_get_points_given_click_!()
                          set_is_points_given_requested(true)
                        }
                        return
                      } else if (
                        points_given <
                        system_values.bookmark.points.limit_per_user
                      ) {
                        props.on_give_point_click_!(points_given + 1)
                        set_points_given(points_given + 1)
                      }
                    }
                  : undefined
              }
            >
              {/* Empty space needed by inline element to render correctly. */}⠀
              <div
                className={
                  styles.bookmark__card__tags__actions__huggs__emoji__hugging__eyes
                }
              >
                <svg viewBox="0 0 433 129" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M387.268 123.804C373.746 120.929 365.143 107.651 368.013 94.1522C370.877 80.6783 362.255 67.3699 348.757 64.5008C335.258 61.6316 321.969 70.2827 319.105 83.7567C316.236 97.2551 302.977 105.887 289.454 103.013C275.931 100.138 267.329 86.8595 270.198 73.3611C278.795 32.9147 318.706 6.99623 359.152 15.5934C399.599 24.1905 425.517 64.1014 416.92 104.548C414.046 118.071 400.791 126.678 387.268 123.804Z"
                    fill="var(--neutral900)"
                  />
                  <path
                    d="M143.06 103.013C129.537 105.887 116.277 97.2551 113.408 83.7567C110.544 70.2827 97.2551 61.6316 83.7567 64.5008C70.2582 67.37 61.6368 80.6783 64.5008 94.1523C67.3699 107.651 58.7677 120.929 45.2449 123.804C31.722 126.678 18.4626 118.046 15.5934 104.548C6.99623 64.1014 32.9147 24.1905 73.3611 15.5934C113.807 6.99624 153.718 32.9147 162.316 73.3611C165.19 86.884 156.583 100.138 143.06 103.013Z"
                    fill="var(--neutral900)"
                  />
                </svg>
              </div>
              <div
                className={
                  styles.bookmark__card__tags__actions__huggs__emoji__hugging__mouth
                }
              >
                <svg viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.85206 6.70256C9.91819 6.70256 11.2294 3.06782 11.2294 1.20066C11.2294 0.229731 10.58 0.536776 9.53764 1.05128C8.57385 1.52845 7.27914 2.18818 5.8562 2.18818C2.8821 2.18818 0.478821 -0.666506 0.478821 1.20066C0.478821 3.06782 1.78594 6.70256 5.8562 6.70256H5.85206Z"
                    fill="var(--red)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.74059 5.76168C2.95877 5.31262 3.26596 4.9139 3.643 4.59038C4.02004 4.26687 4.45885 4.0255 4.93206 3.88134C5.09745 3.83108 5.38657 3.71082 6.00561 3.71082C6.62466 3.71082 6.87544 3.84783 7.05324 3.90228C7.9415 4.18788 8.68377 4.81487 9.12067 5.64861C10.663 4.41738 11.2294 2.40721 11.2294 1.16761C11.2294 0.187649 10.5803 0.49755 9.53829 1.01684L9.4804 1.04616C8.52525 1.52776 7.25171 2.16432 5.85413 2.16432C4.45655 2.16432 3.18715 1.52776 2.22786 1.04616C1.1528 0.505927 0.478821 0.16671 0.478821 1.16761C0.478821 2.4449 1.08251 4.54302 2.74059 5.76168Z"
                    fill="var(--neutral900)"
                  />
                </svg>
              </div>
              <div
                className={
                  styles.bookmark__card__tags__actions__huggs__emoji__hugging__blush
                }
              >
                <svg viewBox="0 0 550 75" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M512.5 75C533.211 75 550 58.2107 550 37.5C550 16.7893 533.211 0 512.5 0C491.789 0 475 16.7893 475 37.5C475 58.2107 491.789 75 512.5 75Z"
                    fill="#FB8C3C"
                  />
                  <path
                    d="M37.5 75C58.2107 75 75 58.2107 75 37.5C75 16.7893 58.2107 0 37.5 0C16.7893 0 0 16.7893 0 37.5C0 58.2107 16.7893 75 37.5 75Z"
                    fill="#FB8C3C"
                  />
                </svg>
              </div>
              <div
                className={
                  styles[
                    'bookmark__card__tags__actions__huggs__emoji__hugging__left-hand'
                  ]
                }
              >
                <svg
                  viewBox="0 0 283 249"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M242.34 199.056C233.396 213.402 220.369 222.834 212.355 226.56C204.341 230.286 187.25 236.795 173.449 233.097C159.648 229.399 84.289 209.207 60.4105 202.809C36.5321 196.41 13.0039 163.821 17.1989 128.01C21.3938 92.1998 36.7904 76.9406 50.3898 67.4419C63.9891 57.9432 85.9456 60.2265 99.8795 61.5372C102.277 61.7627 105.646 62.346 109 62.959C109 62.959 121.175 65.3654 128.588 67.1622C136 68.959 148.715 72.1998 148.715 72.1998C147.792 64.1307 147.135 57.8269 152.512 48.9863C163.609 30.7409 184.979 31.2513 195.186 43.459C205.392 55.6667 243.269 121.178 250.5 141.473C257.732 161.768 251.284 184.711 242.34 199.056Z"
                    fill="var(--blue500)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M109 62.959C109 62.959 121.175 65.3654 128.588 67.1622C136 68.959 148.715 72.1998 148.715 72.1998C148.715 72.1998 148.715 95 152.512 118.5C156.309 142 149.512 159.93 122.5 163C95.488 166.07 88.4999 147.01 88.5 128.01C88.5001 109.01 97.619 84.5936 109 62.959Z"
                    fill="var(--blue600)"
                  />
                </svg>
              </div>
              <div
                className={
                  styles[
                    'bookmark__card__tags__actions__huggs__emoji__hugging__right-hand'
                  ]
                }
              >
                <svg
                  viewBox="0 0 283 249"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M242.34 199.056C233.396 213.402 220.369 222.834 212.355 226.56C204.341 230.286 187.25 236.795 173.449 233.097C159.648 229.399 84.289 209.207 60.4105 202.809C36.5321 196.41 13.0039 163.821 17.1989 128.01C21.3938 92.1998 36.7904 76.9406 50.3898 67.4419C63.9891 57.9432 85.9456 60.2265 99.8795 61.5372C102.277 61.7627 105.646 62.346 109 62.959C109 62.959 121.175 65.3654 128.588 67.1622C136 68.959 148.715 72.1998 148.715 72.1998C147.792 64.1307 147.135 57.8269 152.512 48.9863C163.609 30.7409 184.979 31.2513 195.186 43.459C205.392 55.6667 243.269 121.178 250.5 141.473C257.732 161.768 251.284 184.711 242.34 199.056Z"
                    fill="var(--blue500)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M109 62.959C109 62.959 121.175 65.3654 128.588 67.1622C136 68.959 148.715 72.1998 148.715 72.1998C148.715 72.1998 148.715 95 152.512 118.5C156.309 142 149.512 159.93 122.5 163C95.488 166.07 88.4999 147.01 88.5 128.01C88.5001 109.01 97.619 84.5936 109 62.959Z"
                    fill="var(--blue600)"
                  />
                </svg>
              </div>
            </button>
          ) : (
            <div className={styles.bookmark__card__tags__actions__huggs__emoji}>
              ⠀
              <div
                className={
                  styles.bookmark__card__tags__actions__huggs__emoji__silent__eyes
                }
              >
                <svg viewBox="0 0 433 129" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M387.268 123.804C373.746 120.929 365.143 107.651 368.013 94.1522C370.877 80.6783 362.255 67.3699 348.757 64.5008C335.258 61.6316 321.969 70.2827 319.105 83.7567C316.236 97.2551 302.977 105.887 289.454 103.013C275.931 100.138 267.329 86.8595 270.198 73.3611C278.795 32.9147 318.706 6.99623 359.152 15.5934C399.599 24.1905 425.517 64.1014 416.92 104.548C414.046 118.071 400.791 126.678 387.268 123.804Z"
                    fill="var(--neutral900)"
                  />
                  <path
                    d="M143.06 103.013C129.537 105.887 116.277 97.2551 113.408 83.7567C110.544 70.2827 97.2551 61.6316 83.7567 64.5008C70.2582 67.37 61.6368 80.6783 64.5008 94.1523C67.3699 107.651 58.7677 120.929 45.2449 123.804C31.722 126.678 18.4626 118.046 15.5934 104.548C6.99623 64.1014 32.9147 24.1905 73.3611 15.5934C113.807 6.99624 153.718 32.9147 162.316 73.3611C165.19 86.884 156.583 100.138 143.06 103.013Z"
                    fill="var(--neutral900)"
                  />
                </svg>
              </div>
              <div
                className={
                  styles.bookmark__card__tags__actions__huggs__emoji__silent__zip
                }
              >
                <svg viewBox="0 0 9 3" xmlns="http://www.w3.org/2000/svg">
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
                  styles.bookmark__card__tags__actions__huggs__emoji__silent__handle
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
            </div>
          )}
        </div>
        <div className={styles.bookmark__card__tags__actions__menu}>
          <OutsideClickHandler
            disabled={!is_mobile_menu_open}
            onOutsideClick={() => {
              toggle_is_mobile_menu_open()
            }}
          >
            <button
              className={cn(
                styles.bookmark__card__tags__actions__menu__button,
                {
                  [styles['bookmark__card__tags__actions__menu--toggled']]:
                    is_mobile_menu_open,
                },
              )}
              onClick={(e) => {
                e.stopPropagation()
                toggle_is_mobile_menu_open()
              }}
            >
              <Icon variant="MORE" />
            </button>
            <div
              className={cn(styles.slot, {
                [styles['slot--visible']]: is_mobile_menu_open,
              })}
              onClick={() => {
                toggle_is_mobile_menu_open()
              }}
            >
              {props.menu_slot_}
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    )

    const relative_time = dayjs(props.date_, { locale: props.locale }).fromNow()

    const bookmark_date =
      relative_time != ''
        ? relative_time
        : dayjs(props.date_, { locale: props.locale }).format(
            props.locale == 'en' ? 'MMMM DD, YYYY' : 'D MMMM YYYY',
          )

    return (
      <div
        className={cn(
          styles.container,
          {
            [styles['container--clickable']]: props.density_ == 'compact',
          },
          {
            [styles['container--compact']]: props.density_ == 'compact',
          },
          {
            [styles['container--compact--opened']]:
              props.density_ == 'compact' && props.is_compact_ == false,
          },
          {
            [styles['container--search-result']]: props.is_search_result_,
          },
          {
            [styles['container--search-result-clickable']]:
              props.is_search_result_ && props.density_ == 'compact',
          },
        )}
        role="button"
        onClick={() => {
          if (
            !is_desktop_menu_open &&
            !is_mobile_menu_open &&
            !link_url_menu_opened
          )
            props.on_click_()
        }}
        onMouseUp={() => {
          if (
            props.on_mouse_up_ &&
            props.dragged_tag_ &&
            !props.tags_.find((tag) => tag.name_ == props.dragged_tag_!.name_)
          ) {
            document.body.classList.remove('adding-tag')
            props.on_mouse_up_()
            if (props.tags_.length < system_values.bookmark.tags.limit) {
              set_tags([
                ...tags,
                {
                  id: 0,
                  is_public_: true,
                  name_: props.dragged_tag_.name_,
                  yields_: props.dragged_tag_.yields_ + 1,
                },
              ])
            }
          }
        }}
      >
        <div className={styles.bookmark}>
          {tag_context_menu.contextMenu}
          {main_context_menu.contextMenu}
          {link_context_menu.contextMenu}
          <div
            className={cn(styles.bookmark__card, {
              [styles['bookmark__card--corners-fix']]:
                (!props.links_.length && !props.note_) || props.is_compact_,
            })}
            onContextMenu={(e) => {
              if ('ontouchstart' in window) {
                e.preventDefault()
              } else {
                main_context_menu.onContextMenu(e)
              }
            }}
          >
            <div className={styles.bookmark__card__cover}>
              <div className={styles.bookmark__card__cover__image}>
                {props.cover_ ? (
                  <img src={`data:image/webp;base64,${props.cover_}`} />
                ) : (
                  <Icon variant="BOOKMARK_FILLED" />
                )}
              </div>
            </div>

            <div className={styles.bookmark__card__date}>
              <div className={styles.bookmark__card__date__text}>
                {bookmark_date}
              </div>
            </div>

            <div className={styles.bookmark__card__title}>
              <div
                className={styles.bookmark__card__title__menu}
                style={
                  is_desktop_menu_open
                    ? { position: 'relative', zIndex: 1 }
                    : undefined
                }
              >
                <OutsideClickHandler
                  disabled={!is_desktop_menu_open}
                  onOutsideClick={toggle_is_desktop_menu_open}
                >
                  <button
                    className={cn(styles.bookmark__card__title__menu__button, {
                      [styles['bookmark__card__title__menu--toggled']]:
                        is_desktop_menu_open,
                    })}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle_is_desktop_menu_open()
                    }}
                  >
                    <Icon variant="MORE" />
                  </button>
                  <div
                    className={cn(styles.slot, {
                      [styles['slot--visible']]: is_desktop_menu_open,
                    })}
                    onClick={toggle_is_desktop_menu_open}
                  >
                    {props.menu_slot_}
                  </div>
                </OutsideClickHandler>
              </div>
              {props.is_unread_ && (
                <div className={styles.bookmark__card__title__unread} />
              )}
              {props.stars_ >= 1 && (
                <div className={styles.bookmark__card__title__stars}>
                  {[...new Array(props.stars_)].map((_, i) => (
                    <Icon variant="STAR_FILLED" key={i} />
                  ))}
                </div>
              )}
              {props.title_ ? (
                <div
                  className={cn(styles.bookmark__card__title__text, {
                    [styles['bookmark__card__title__text--unread']]:
                      props.is_unread_,
                  })}
                >
                  {props.highlights_
                    ? props.title_.split('').map((char, i) => {
                        const is_highlighted = props.highlights_!.find(
                          ([index, length]) => i >= index && i < index + length,
                        )

                        return is_highlighted ? (
                          <span className={styles.highlight} key={i}>
                            {char}
                          </span>
                        ) : (
                          <span key={i}>{char}</span>
                        )
                      })
                    : props.title_}
                </div>
              ) : (
                <div
                  className={cn(
                    styles.bookmark__card__title__text,
                    styles['bookmark__card__title__text--untitled'],
                  )}
                >
                  (Untitled)
                </div>
              )}
            </div>

            {props.on_tags_order_change_ ? (
              <ReactSortable
                list={tags}
                setList={(new_tags) => {
                  if (JSON.stringify(new_tags) == JSON.stringify(tags)) return
                  set_tags(new_tags)
                  props.on_tags_order_change_?.(new_tags)
                }}
                animation={system_values.sortablejs_animation_duration}
                forceFallback={true}
                dropBubble={true} // Needed for clearing dragged tag UI.
                delay={system_values.sortablejs_delay}
                delayOnTouchOnly={true}
                className={styles.bookmark__card__tags}
                filter={`.${styles.bookmark__card__tags__actions}`}
                fallbackClass={
                  !('ontouchstart' in window)
                    ? styles['sortable-fallback']
                    : undefined
                }
              >
                {tags_dom}
                {actions_dom}
              </ReactSortable>
            ) : (
              <div className={styles.bookmark__card__tags}>
                {tags_dom}
                {actions_dom}
              </div>
            )}
          </div>
          {props.note_ && !props.is_compact_ && (
            <div className={styles.bookmark__note}>
              {props.highlights_
                ? props.note_.split('').map((char, i) => {
                    const real_i =
                      (props.title_ ? `${props.title_} ` : '').length + i

                    const is_highlighted = props.highlights_!.find(
                      ([index, length]) =>
                        real_i >= index && real_i < index + length,
                    )
                    return is_highlighted ? (
                      <span className={styles.highlight} key={i}>
                        {char}
                      </span>
                    ) : (
                      <span key={i}>{char}</span>
                    )
                  })
                : props.note_}
            </div>
          )}
          <OutsideClickHandler
            onOutsideClick={() => {
              set_recently_visited_link_idx(undefined)
            }}
          >
            <div
              className={cn(styles.bookmark__links, {
                [styles['bookmark__links--compact']]: props.is_compact_,
              })}
            >
              {props.links_.map((link, i) => {
                const url = link.open_snapshot_
                  ? url_to_wayback({ date: props.created_at_, url: link.url_ })
                  : link.url_

                let is_site_highlighted = false
                if (
                  props.highlights_site_variants_ !== undefined &&
                  props.highlights_site_variants_.length
                ) {
                  const site =
                    get_domain_from_url(link.url_) +
                    (link.site_path_ ? `/${link.site_path_}` : '')
                  const link_site_variants = get_site_variants_for_search(site)
                  if (
                    link_site_variants.some((site_variant) =>
                      props.highlights_site_variants_!.includes(site_variant),
                    )
                  ) {
                    is_site_highlighted = true
                  }
                }

                const link_first_char_index_in_search_title = (
                  (props.title_ ? `${props.title_} ` : '') +
                  (props.note_ ? `${props.note_} ` : '') +
                  props.tags_.map((tag) => tag.name_).join(' ') +
                  props.links_
                    .map(
                      (link) =>
                        ` ${get_domain_from_url(link.url_)}${
                          link.site_path_ ? ` ${link.site_path_}` : ''
                        }`,
                    )
                    .slice(0, i)
                    .join('')
                ).length

                return (
                  <div
                    className={cn(styles.bookmark__links__item, {
                      [styles['bookmark__links__item--recently-visited']]:
                        recently_visited_link_idx == i,
                    })}
                    onClick={() => {
                      set_recently_visited_link_idx(undefined)
                    }}
                    key={link.url_}
                    onContextMenu={(e) => {
                      if ('ontouchstart' in window) {
                        e.preventDefault()
                      } else {
                        set_context_menu_of_link_idx(i)
                        link_context_menu.onContextMenu(e)
                      }
                    }}
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
                        {link.is_public_ ? (
                          <LazyLoadImage
                            alt={'Favicon'}
                            width={16}
                            height={16}
                            src={`${props.favicon_host_}/${get_domain_from_url(
                              link.url_,
                            )}`}
                          />
                        ) : link.favicon_ ? (
                          <img
                            alt={'Favicon'}
                            width={16}
                            height={16}
                            src={`data:image/webp;base64,${link.favicon_}`}
                          />
                        ) : (
                          <Icon variant="GLOBE" />
                        )}
                      </button>
                      {link.is_parsed_ && (
                        <button
                          className={styles.bookmark__links__item__link__reader}
                          onClick={() => {
                            props.on_reading_mode_click_(link.url_)
                          }}
                        >
                          <Icon variant="RESIZE" />
                        </button>
                      )}
                      <a
                        className={cn(
                          styles.bookmark__links__item__link__url,
                          {
                            [styles[
                              'bookmark__links__item__link__url--dim-visited'
                            ]]: props.should_dim_visited_links_,
                          },
                          {
                            [styles[
                              'bookmark__links__item__link__url--via-wayback'
                            ]]: link.open_snapshot_,
                          },
                        )}
                        href={url}
                        onClick={async (e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          set_recently_visited_link_idx(i)
                          props.on_link_click_(url)
                        }}
                        onAuxClick={props.on_link_middle_click_}
                      >
                        <span>
                          {props.highlights_
                            ? `${get_domain_from_url(link.url_)} ${
                                link.site_path_ ? `› ${link.site_path_} ` : ''
                              }`
                                .split('')
                                .map((char, i) => {
                                  const real_i =
                                    link_first_char_index_in_search_title +
                                    i -
                                    (i > get_domain_from_url(link.url_).length
                                      ? 2
                                      : 0) +
                                    (i >= 0 ? 1 : 0)
                                  const is_highlighted =
                                    props.highlights_!.find(
                                      ([index, length]) =>
                                        real_i >= index &&
                                        real_i < index + length,
                                    )
                                  return is_highlighted ? (
                                    <span
                                      className={styles['highlight-link']}
                                      key={i}
                                    >
                                      {char}
                                    </span>
                                  ) : (
                                    <span key={i}>{char}</span>
                                  )
                                })
                            : `${get_domain_from_url(link.url_)
                                .split('.')
                                .map((segment) =>
                                  segment.replace(/(.{5})/g, '$1​'),
                                )
                                .join('.')} ${
                                link.site_path_ ? `› ${link.site_path_}` : ''
                              }`}
                        </span>
                        <span>
                          {url_path_for_display({
                            url: link.url_,
                            site_path: link.site_path_,
                          })}
                        </span>
                      </a>
                    </div>
                    <div className={styles.bookmark__links__item__actions}>
                      {link.saves_ !== undefined && link.saves_ > 0 && (
                        <button
                          className={
                            styles[
                              'bookmark__links__item__actions__public-saves'
                            ]
                          }
                        >
                          {link.saves_}
                        </button>
                      )}
                      <button
                        className={styles.bookmark__links__item__actions__open}
                        onClick={async (e) => {
                          e.stopPropagation()
                          set_recently_visited_link_idx(i)
                          props.on_new_tab_link_click_(url)
                        }}
                      >
                        <Icon variant="NEW_TAB" />
                      </button>
                      <div
                        className={styles.bookmark__links__item__actions__menu}
                      >
                        <OutsideClickHandler
                          disabled={link_url_menu_opened != link.url_}
                          onOutsideClick={() => {
                            set_link_url_menu_opened(undefined)
                          }}
                        >
                          <button
                            className={cn(
                              styles.bookmark__links__item__actions__menu__button,
                              {
                                [styles[
                                  'bookmark__links__item__actions__menu__button--toggled'
                                ]]: link_url_menu_opened == link.url_,
                              },
                            )}
                            onClick={async (e) => {
                              e.stopPropagation()
                              link_url_menu_opened != link.url_
                                ? set_link_url_menu_opened(link.url_)
                                : set_link_url_menu_opened(undefined)
                            }}
                          >
                            <Icon variant="MORE" />
                          </button>
                          <div
                            className={cn(styles.slot, {
                              [styles['slot--visible']]:
                                link_url_menu_opened == link.url_,
                            })}
                            onClick={() => {
                              set_link_url_menu_opened(undefined)
                            }}
                          >
                            {link.menu_slot_}
                          </div>
                        </OutsideClickHandler>
                      </div>
                    </div>
                    {link.is_pinned_ && (
                      <div className={styles.bookmark__links__item__pinned}>
                        <Icon variant="PIN" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    )
  },
  (o, n) =>
    o.updated_at_ == n.updated_at_ &&
    o.search_queried_at_timestamp_ == n.search_queried_at_timestamp_ &&
    o.is_search_result_ == n.is_search_result_ &&
    o.points_ == n.points_ &&
    o.points_given_ == n.points_given_ &&
    o.is_compact_ == n.is_compact_ &&
    o.density_ == n.density_ &&
    o.orama_db_id_ == n.orama_db_id_ &&
    o.current_filter_ == n.current_filter_ &&
    o.dragged_tag_?.id_ == n.dragged_tag_?.id_ &&
    o.highlights_ == n.highlights_,
)

function url_path_for_display(params: {
  url: string
  site_path?: string
}): string {
  let parsed_url = params.url.replace('://', '')

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
