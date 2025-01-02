import styles from './PinnedBookmarks.module.scss'
import { ReactSortable } from 'react-sortablejs'
import { memo, useState } from 'react'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { system_values } from '@shared/constants/system-values'
import { _Item } from './_Item/_Item'
import { Dropdown as Ui_Dropdown } from '@web-ui/components/Dropdown'
import { StandardItem as Ui_Dropdown_StandardItem } from '@web-ui/components/Dropdown/StandardItem'

export namespace PinnedBookmarks {
  export type Item = {
    bookmark_id: number
    url: string
    created_at: Date
    updated_at: Date
    is_public?: boolean
    title?: string
    tags?: number[]
    site_path?: string
    saves?: number
    open_snapshot?: boolean
    favicon?: string
    is_archived?: boolean
    stars?: number
    is_unsorted?: boolean
  }
  export type Props = {
    items: Item[]
    on_change: (items: Item[]) => void
    favicon_host: string
    on_video_player_click: (item: Item) => void
    on_link_click: (item: Item) => void
    on_link_middle_click: (item: Item) => void
    on_new_tab_click: (item: Item) => void
    on_unpin_click?: (item: Item) => void
    is_draggable: boolean
    selected_tags: number[]
    selected_starred: boolean
    selected_unsorted: boolean
    selected_archived: boolean
    current_gte?: number
    current_lte?: number
    translations: {
      nothing_pinned: string
      open_original_url: string
      open_snapshot: string
      unpin: string
    }
    is_revealed?: boolean
    on_uncollapsed: () => void
  }
}

type SortableItem = {
  id: number
} & PinnedBookmarks.Item

export const PinnedBookmarks: React.FC<PinnedBookmarks.Props> = memo(
  function PinnedBookmarks(props) {
    const [sortable_items, set_sortable_items] = useState<SortableItem[]>(
      props.items.map((item, i) => ({
        id: i,
        ...item,
      })),
    )
    const [is_sortable_disabled, set_is_sortable_disabled] = useState<boolean>()
    const [is_collapsed, set_is_collapsed] = useState<boolean>(
      props.is_revealed === undefined ? true : !props.is_revealed,
    )

    let relevant_items = 0

    const items_dom = sortable_items.map((item) => {
      const created_at_timestamp = Math.round(item.created_at.getTime() / 1000)
      let is_not_relevant = false

      if (
        (props.selected_archived && !item.is_archived) ||
        (!props.selected_archived && item.is_archived)
      ) {
        is_not_relevant = true
      } else if (props.selected_starred && !item.stars) {
        is_not_relevant = true
      } else if (props.selected_unsorted && !item.is_unsorted) {
        is_not_relevant = true
      } else if (
        item.tags &&
        !props.selected_tags.every((t) => item.tags!.includes(t))
      ) {
        is_not_relevant = true
      } else if (
        props.current_gte &&
        props.current_lte &&
        (created_at_timestamp <
          new Date(
            parseInt(props.current_gte.toString().substring(0, 4)),
            parseInt(props.current_gte.toString().substring(4, 6)) - 1,
          ).getTime() /
            1000 ||
          created_at_timestamp >
            new Date(
              parseInt(props.current_lte.toString().substring(0, 4)),
              parseInt(props.current_lte.toString().substring(4, 6)),
            ).getTime() /
              1000 -
              1)
      ) {
        is_not_relevant = true
      } else {
        relevant_items++
      }

      return is_not_relevant ? (
        <span key={item.id} />
      ) : (
        <_Item
          key={item.id}
          favicon_host={props.favicon_host}
          menu_slot={
            <Ui_Dropdown>
              {item.open_snapshot ? (
                <Ui_Dropdown_StandardItem
                  icon_variant="LINK"
                  label={props.translations.open_original_url}
                  on_click={() => {
                    props.on_link_middle_click(item) // TODO: Function name should be more generic
                    window.onbeforeunload = null
                    location.href = item.url
                  }}
                />
              ) : (
                <Ui_Dropdown_StandardItem
                  icon_variant="LINK"
                  label={props.translations.open_snapshot}
                  on_click={() => {
                    props.on_link_middle_click(item)
                    window.onbeforeunload = null
                    location.href = url_to_wayback({
                      date: new Date(item.created_at),
                      url: item.url,
                    })
                  }}
                />
              )}
              {props.on_unpin_click && (
                <Ui_Dropdown_StandardItem
                  icon_variant="DELETE"
                  is_danger={true}
                  label={props.translations.unpin}
                  on_click={() => props.on_unpin_click!(item)}
                />
              )}
            </Ui_Dropdown>
          }
          on_link_click={() => {
            props.on_link_click(item)
          }}
          on_link_middle_click={() => {
            props.on_link_middle_click(item)
          }}
          on_new_tab_click={() => {
            props.on_new_tab_click(item)
          }}
          on_video_player_click={() => {
            props.on_video_player_click(item)
          }}
          on_menu_toggled={(is_open: boolean) => {
            set_is_sortable_disabled(is_open)
          }}
          should_dim_visited_links={false}
          url={item.url}
          created_at={item.created_at}
          favicon={item.favicon}
          open_snapshot={item.open_snapshot}
          saves={item.saves}
          site_path={item.site_path}
          title={item.title}
          is_public={item.is_public}
          stars={item.stars}
        />
      )
    })

    return (
      <>
        {relevant_items == 0 ? (
          <div className={styles['nothing-pinned']}>
            {props.translations.nothing_pinned}
          </div>
        ) : (
          <>
            {is_collapsed ? (
              <div
                className={styles['collapsed-state']}
                onClick={() => {
                  set_is_collapsed(false)
                  props.on_uncollapsed?.()
                }}
              >
                <button>{relevant_items} pinned bookmarks</button>
              </div>
            ) : props.is_draggable ? (
              <ReactSortable
                list={sortable_items}
                setList={(new_sortable_items) => {
                  if (
                    JSON.stringify(new_sortable_items.map((i) => i.id)) ==
                    JSON.stringify(sortable_items.map((i) => i.id))
                  )
                    return
                  set_sortable_items(new_sortable_items)
                  props.on_change(
                    new_sortable_items.map((i) => {
                      const { id, ...rest } = i
                      return rest
                    }),
                  )
                }}
                animation={system_values.sortablejs_animation_duration}
                className={styles.items}
                delay={system_values.sortablejs_delay}
                delayOnTouchOnly={true}
                filter=".no-drag"
                disabled={is_sortable_disabled}
              >
                {items_dom}
              </ReactSortable>
            ) : (
              <div className={styles.items}>{items_dom}</div>
            )}
          </>
        )}
      </>
    )
  },
  () => true,
)
