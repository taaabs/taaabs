import styles from './_Bookmark.module.scss'
import cn from 'classnames'
import { BlurhashCanvas } from 'react-blurhash'
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import { ReactSortable } from 'react-sortablejs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import OutsideClickHandler from 'react-outside-click-handler'
import useToggle from 'beautiful-react-hooks/useToggle'
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search/get-site-variants-for-search'
import { Icon } from '@web-ui/components/common/particles/icon'
import { useContextMenu } from 'use-context-menu'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import confetti from 'canvas-confetti'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { system_values } from '@shared/constants/system-values'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { Dropdown as UiCommon_Dropdown } from '@web-ui/components/common/Dropdown'
import { StandardItem as UiCommon_Dropdown_StandardItem } from '@web-ui/components/common/Dropdown/standard-item'
import { url_path_for_display } from '@shared/utils/url-path-for-display/url-path-for-display'

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

export namespace _Bookmark {
  export type Highlights = [number, number][]

  export type Props = {
    search_queried_at_timestamp?: number
    locale: 'pl' | 'en'
    is_search_result?: boolean
    bookmark_id: number
    updated_at: string
    is_public: boolean
    points?: number
    points_given?: number
    title?: string
    note?: string
    date: Date
    created_at: Date
    density: 'default' | 'compact'
    is_compact?: boolean
    library_url: string
    on_tag_click: (tag_id: number) => void
    on_tag_delete_click?: (tag_id: number) => void
    on_tag_rename_click?: (tag_id: number) => void
    on_tags_order_change?: (tags: _Bookmark.Props['tags']) => void
    on_selected_tag_click: (tag_id: number) => void
    on_get_points_given_click?: () => void
    on_give_point_click?: (points: number) => void
    on_modify_tags_click?: () => void
    tags: {
      id: number // Sortable requires "id", so no mangling here.
      is_public?: boolean
      name: string
      yields?: number
      is_selected?: boolean
    }[]
    search_params?: string
    on_click: () => void
    is_unsorted?: boolean
    stars: number
    links: {
      url: string
      site_path?: string
      saves?: number
      menu_slot: React.ReactNode
      is_pinned?: boolean
      open_snapshot?: boolean
      is_public?: boolean
      favicon?: string
      is_parsed?: boolean
    }[]
    on_link_click: (url: string) => void
    on_reading_mode_click: (url: string) => void
    on_link_middle_click: () => void
    on_new_tab_click: (url: string) => void
    favicon_host: string
    menu_slot: React.ReactNode
    highlights?: Highlights
    highlights_site_variants?: string[]
    orama_db_id?: string
    should_dim_visited_links: boolean
    current_filter?: string // Needs by [use_search/update_searchable_bookmarks].
    on_tag_drag_start?: (params: {
      id: number
      name: string
      yields: number
    }) => void
    dragged_tag?: {
      id: number
      name: string
      yields: number
    }
    on_mouse_up?: () => void
    cover_hash?: string
    cover?: string // Base64 encoded webp of a private bookmark.
    blurhash?: string
    translations: {
      rename: string
      delete: string
    }
  }
}

export const _Bookmark: React.FC<_Bookmark.Props> = memo(
  function _Bookmark(props) {
    const [tags, set_tags] = useState<_Bookmark.Props['tags']>(props.tags)
    const [is_points_givenrequested, set_is_points_givenrequested] =
      useState<boolean>()
    const [points_given, set_points_given] = useState<number>()
    const [is_desktop_menu_open, toggle_is_desktop_menu_open] = useToggle(false)
    const [is_mobile_menu_open, toggle_is_mobile_menu_open] = useToggle(false)
    const [link_url_menu_opened, set_link_url_menu_opened] = useState<string>()
    const [recently_visited_link_idx, set_recently_visited_link_idx] =
      useState<number>()
    const main_context_menu = useContextMenu(props.menu_slot)
    const [context_menu_of_link_idx, set_context_menu_of_link_idx] =
      useState<number>()
    const link_context_menu = useContextMenu(
      props.links.length > 0
        ? props.links[context_menu_of_link_idx || 0].menu_slot
        : null,
    )
    const [context_menu_of_tag_id, set_context_menu_of_tag_id] =
      useState<number>()
    const tag_context_menu = useContextMenu(
      <UiCommon_Dropdown>
        <UiCommon_Dropdown_StandardItem
          label={props.translations.rename}
          icon_variant="EDIT"
          on_click={() => {
            if (!context_menu_of_tag_id) return
            props.on_tag_rename_click!(context_menu_of_tag_id)
          }}
        />
        <UiCommon_Dropdown_StandardItem
          label={props.translations.delete}
          icon_variant="DELETE"
          on_click={() => {
            if (!context_menu_of_tag_id) return
            props.on_tag_delete_click!(context_menu_of_tag_id)
          }}
        />
      </UiCommon_Dropdown>,
    )

    useUpdateEffect(() => {
      if (!props.on_give_point_click) return
      if (props.points_given !== undefined && points_given === undefined) {
        if (props.points_given < system_values.bookmark.points.limit_per_user) {
          props.on_give_point_click(props.points_given + 1)
          set_points_given(props.points_given + 1)
        } else {
          set_points_given(props.points_given)
        }
      }
    }, [props.points_given])

    useUpdateEffect(() => {
      set_tags(props.tags)
    }, [props.updated_at])

    const tags_dom = [
      ...tags.map((tag, i) => {
        const tag_first_char_index_in_search_title = (
          (props.title ? `${props.title} ` : '') +
          (props.note ? `${props.note} ` : '') +
          props.tags
            .map((tag) => ` ${tag.name}`)
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
              [styles['bookmark__card__tags__tag--selected']]: tag.is_selected,
            })}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (tag.is_selected) {
                props.on_selected_tag_click(tag.id)
              } else {
                props.on_tag_click(tag.id)
              }
            }}
            href={`${props.library_url}?${search_params.toString()}`}
            onMouseDown={(e) => {
              e.stopPropagation()
              if (!props.on_tag_drag_start) return
              props.on_tag_drag_start({
                id: tag.id,
                name: tag.name,
                yields: tag.yields || 0,
              })
            }}
            onContextMenu={(e) => {
              if ('ontouchstart' in window) {
                e.preventDefault()
              } else if (
                props.on_tag_delete_click ||
                props.on_tag_rename_click
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
                    tag.is_selected,
                },
              ])}
            >
              {props.highlights
                ? highlight_text(
                    tag.name,
                    props.highlights,
                    tag_first_char_index_in_search_title,
                  )
                : tag.name}
            </span>
            {!tag.is_selected && tag.yields && (
              <span className={styles.bookmark__card__tags__tag__yields}>
                {tag.yields}
              </span>
            )}
          </a>
        )
      }),
      ...(props.dragged_tag &&
      props.tags.length < system_values.bookmark.tags.limit &&
      props.tags.findIndex((tag) => tag.id == props.dragged_tag!.id) == -1
        ? [
            <button
              className={styles.bookmark__card__tags__tag}
              style={{ opacity: 'var(--dimmed-opacity)' }}
              key="candidate"
            >
              <span className={styles.bookmark__card__tags__tag__name}>
                {props.dragged_tag.name}
              </span>
              <span className={styles.bookmark__card__tags__tag__yields}>
                {props.dragged_tag.yields + 1}
              </span>
            </button>,
          ]
        : []),
    ]

    const actions_dom = (
      <div className={cn(styles.bookmark__card__tags__actions, 'static')}>
        <div
          className={cn(styles.bookmark__card__tags__actions__huggs, {
            [styles['bookmark__card__tags__actions__huggs--has-poits']]:
              props.points,
          })}
        >
          {props.is_public && (
            <button
              className={styles.bookmark__card__tags__actions__huggs__amount}
              onClick={() => {}}
            >
              {props.points}
            </button>
          )}
          {props.is_public ? (
            <button
              className={styles.bookmark__card__tags__actions__huggs__emoji}
              style={{
                pointerEvents:
                  !props.on_give_point_click || !props.on_get_points_given_click
                    ? 'none'
                    : undefined,
              }}
              onClick={
                props.on_give_point_click && props.on_get_points_given_click
                  ? (e) => {
                      e.stopPropagation()
                      if (
                        (points_given !== undefined &&
                          points_given <
                            system_values.bookmark.points.limit_per_user) ||
                        !is_points_givenrequested
                      ) {
                        confetti({
                          particleCount: 40,
                          startVelocity: 11,
                          spread: 100,
                          gravity: 0.3,
                          ticks: 30,
                          decay: 0.91,
                          scalar: 0.8,
                          shapes: ['square'],
                          colors: ['#FFD21E', '#1d4ed8'],
                          origin: {
                            x: e.clientX / window.innerWidth,
                            y: e.clientY / window.innerHeight,
                          },
                        })
                      }
                      if (points_given === undefined) {
                        if (!is_points_givenrequested) {
                          props.on_get_points_given_click!()
                          set_is_points_givenrequested(true)
                        }
                        return
                      } else if (
                        points_given <
                        system_values.bookmark.points.limit_per_user
                      ) {
                        props.on_give_point_click!(points_given + 1)
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
              {props.menu_slot}
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    )

    const relative_time = dayjs(props.date, { locale: props.locale }).fromNow()

    const bookmark_date =
      relative_time != ''
        ? relative_time
        : dayjs(props.date, { locale: props.locale }).format(
            props.locale == 'en' ? 'MMMM DD, YYYY' : 'D MMMM YYYY',
          )

    return (
      <div
        className={cn(
          styles.container,
          {
            [styles['container--clickable']]: props.density == 'compact',
          },
          {
            [styles['container--compact']]: props.density == 'compact',
          },
          {
            [styles['container--compact--opened']]:
              props.density == 'compact' && props.is_compact == false,
          },
        )}
        role="button"
        onClick={() => {
          if (
            !is_desktop_menu_open &&
            !is_mobile_menu_open &&
            !link_url_menu_opened
          )
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
            if (props.tags.length < system_values.bookmark.tags.limit) {
              set_tags([
                ...tags,
                {
                  id: 0,
                  is_public: true,
                  name: props.dragged_tag.name,
                  yields: props.dragged_tag.yields + 1,
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
                (!props.links.length && !props.note) || props.is_compact,
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
                {props.blurhash && <BlurhashCanvas hash={props.blurhash} />}
                {props.cover ? (
                  <>
                    <img
                      className={styles.bookmark__card__cover__image__fill}
                      src={`data:image/webp;base64,${props.cover}`}
                    />
                    <img
                      className={styles.bookmark__card__cover__image__top}
                      src={`data:image/webp;base64,${props.cover}`}
                    />
                  </>
                ) : props.cover_hash ? (
                  <>
                    <img
                      className={styles.bookmark__card__cover__image__fill}
                      loading="lazy"
                      src={`${process.env.NEXT_PUBLIC_API_URL}/v1/covers/${props.cover_hash}`}
                    />
                    <img
                      className={styles.bookmark__card__cover__image__top}
                      loading="lazy"
                      src={`${process.env.NEXT_PUBLIC_API_URL}/v1/covers/${props.cover_hash}`}
                    />
                  </>
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
                    {props.menu_slot}
                  </div>
                </OutsideClickHandler>
              </div>
              {props.is_unsorted && (
                <div className={styles.bookmark__card__title__unsorted}>
                  UNSORTED
                </div>
              )}
              {props.stars >= 1 && (
                <div className={styles.bookmark__card__title__stars}>
                  {[...new Array(props.stars)].map((_, i) => (
                    <Icon variant="STAR_FILLED" key={i} />
                  ))}
                </div>
              )}
              {props.title ? (
                <div
                  className={cn(styles.bookmark__card__title__text, {
                    [styles['bookmark__card__title__text--unsorted']]:
                      props.is_unsorted,
                  })}
                >
                  {props.highlights
                    ? highlight_text(props.title, props.highlights)
                    : props.title}
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

            {props.on_tags_order_change ? (
              <ReactSortable
                list={tags}
                setList={(new_tags) => {
                  if (JSON.stringify(new_tags) == JSON.stringify(tags)) return
                  set_tags(new_tags)
                  props.on_tags_order_change?.(new_tags)
                }}
                animation={system_values.sortablejs_animation_duration}
                forceFallback={true}
                dropBubble={true} // Needed for clearing dragged tag UI.
                delay={system_values.sortablejs_delay}
                delayOnTouchOnly={true}
                className={styles.bookmark__card__tags}
                filter={`.static`}
                fallbackClass={
                  !('ontouchstart' in window)
                    ? styles['sortable-fallback']
                    : undefined
                }
              >
                {tags_dom}
                <button
                  key={'edit-tags'}
                  onClick={props.on_modify_tags_click}
                  className={cn(styles.bookmark__card__tags__edit, 'static')}
                >
                  <Icon variant="TAG" />
                </button>
                {actions_dom}
              </ReactSortable>
            ) : (
              <div className={styles.bookmark__card__tags}>
                {tags_dom}
                {actions_dom}
              </div>
            )}
          </div>
          {props.note && !props.is_compact && (
            <div className={styles.bookmark__note}>
              {props.highlights
                ? highlight_text(
                    props.note,
                    props.highlights,
                    (props.title ? `${props.title} ` : '').length,
                  )
                : props.note}
            </div>
          )}
          <OutsideClickHandler
            onOutsideClick={() => {
              set_recently_visited_link_idx(undefined)
            }}
          >
            <div
              className={cn(styles.bookmark__links, {
                [styles['bookmark__links--compact']]: props.is_compact,
              })}
            >
              {props.links.map((link, i) => {
                const url = link.open_snapshot
                  ? url_to_wayback({ date: props.created_at, url: link.url })
                  : link.url

                let is_site_highlighted = false
                if (
                  props.highlights_site_variants !== undefined &&
                  props.highlights_site_variants.length
                ) {
                  const site =
                    get_domain_from_url(link.url) +
                    (link.site_path ? `/${link.site_path}` : '')
                  const link_site_variants = get_site_variants_for_search(site)
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
                  (props.note ? `${props.note} ` : '') +
                  props.tags.map((tag) => tag.name).join(' ') +
                  props.links
                    .map(
                      (link) =>
                        ` ${get_domain_from_url(link.url)}${
                          link.site_path ? ` ${link.site_path}` : ''
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
                    key={link.url}
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
                        {link.is_public ? (
                          <img
                            alt={'Favicon'}
                            width={16}
                            height={16}
                            src={`${props.favicon_host}/${get_domain_from_url(
                              link.url,
                            )}`}
                            loading="lazy"
                          />
                        ) : link.favicon ? (
                          <img
                            alt={'Favicon'}
                            width={16}
                            height={16}
                            src={`data:image/webp;base64,${link.favicon}`}
                          />
                        ) : (
                          <Icon variant="GLOBE" />
                        )}
                      </button>
                      {link.is_parsed && (
                        <button
                          className={styles.bookmark__links__item__link__reader}
                          onClick={() => {
                            props.on_reading_mode_click(link.url)
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
                            ]]: props.should_dim_visited_links,
                          },
                          {
                            [styles[
                              'bookmark__links__item__link__url--via-wayback'
                            ]]: link.open_snapshot,
                          },
                        )}
                        href={url}
                        onClick={async (e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          set_recently_visited_link_idx(i)
                          props.on_link_click(url)
                        }}
                        onAuxClick={props.on_link_middle_click}
                      >
                        <span>
                          {props.highlights
                            ? highlight_link_text(
                                `${get_domain_from_url(link.url)} ${
                                  link.site_path ? `› ${link.site_path} ` : ''
                                }`,
                                props.highlights,
                                link_first_char_index_in_search_title,
                              )
                            : `${get_domain_from_url(link.url)
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
                        className={styles.bookmark__links__item__actions__open}
                        onClick={async (e) => {
                          e.stopPropagation()
                          set_recently_visited_link_idx(i)
                          props.on_new_tab_click(url)
                        }}
                      >
                        <Icon variant="NEW_TAB" />
                      </button>
                      <div
                        className={styles.bookmark__links__item__actions__menu}
                      >
                        <OutsideClickHandler
                          disabled={link_url_menu_opened != link.url}
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
                                ]]: link_url_menu_opened == link.url,
                              },
                            )}
                            onClick={async (e) => {
                              e.stopPropagation()
                              link_url_menu_opened != link.url
                                ? set_link_url_menu_opened(link.url)
                                : set_link_url_menu_opened(undefined)
                            }}
                          >
                            <Icon variant="MORE" />
                          </button>
                          <div
                            className={cn(styles.slot, {
                              [styles['slot--visible']]:
                                link_url_menu_opened == link.url,
                            })}
                            onClick={() => {
                              set_link_url_menu_opened(undefined)
                            }}
                          >
                            {link.menu_slot}
                          </div>
                        </OutsideClickHandler>
                      </div>
                    </div>
                    {link.is_pinned && (
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
    o.updated_at == n.updated_at &&
    o.search_queried_at_timestamp == n.search_queried_at_timestamp &&
    o.is_search_result == n.is_search_result &&
    o.cover == n.cover &&
    o.points == n.points &&
    o.points_given == n.points_given &&
    o.is_compact == n.is_compact &&
    o.density == n.density &&
    o.orama_db_id == n.orama_db_id &&
    o.current_filter == n.current_filter &&
    o.dragged_tag?.id == n.dragged_tag?.id &&
    o.highlights == n.highlights,
)

const highlight_text = (
  text: string,
  highlights: [number, number][],
  start_index: number = 0,
) => {
  const words = text.split(/(\s+)/)
  let current_index = start_index

  return words.map((word, i) => {
    const word_start = current_index
    const word_end = current_index + word.length
    current_index = word_end

    const is_highlighted = highlights.some(
      ([index, length]) =>
        (word_start >= index && word_start < index + length) ||
        (word_end > index && word_end <= index + length) ||
        (word_start <= index && word_end >= index + length),
    )

    return is_highlighted ? (
      <mark key={i}>{word}</mark>
    ) : (
      <span key={i}>{word}</span>
    )
  })
}

const highlight_link_text = (
  text: string,
  highlights: [number, number][],
  start_index: number = 0,
) => {
  const words = text.split(/(\s+|\.)/)
  let current_index = start_index

  return words.map((word, i) => {
    const word_start = current_index
    const word_end = current_index + word.length
    current_index = word_end

    const is_highlighted =
      word != '.' &&
      highlights.some(
        ([index, length]) =>
          (word_start >= index && word_start < index + length) ||
          (word_end > index && word_end <= index + length) ||
          (word_start <= index && word_end >= index + length),
      )

    return is_highlighted ? (
      <mark key={i}>{word}</mark>
    ) : (
      <span key={i}>{word}</span>
    )
  })
}
