import styles from './PinnedBookmarks.module.scss'
import { ReactSortable } from 'react-sortablejs'
import { memo, useState } from 'react'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { system_values } from '@shared/constants/system-values'
import { _Item } from './_Item/_Item'

export namespace PinnedBookmarks {
  export type Item = {
    bookmark_id_: number
    url_: string
    created_at_: Date
    is_public_?: boolean
    title_?: string
    tags_?: number[]
    site_path_?: string
    saves_?: number
    open_snapshot_?: boolean
    favicon_?: string
    is_parsed_?: boolean
    is_archived_?: boolean
    stars_?: number
    is_unsorted_?: boolean
  }
  export type Props = {
    items_: Item[]
    library_updated_at_timestamp_?: number
    on_change_: (items: Item[]) => void
    favicon_host_: string
    on_click_: (item: Item) => void
    on_middle_click_: (item: Item) => void
    is_draggable_: boolean
    selected_tags_: number[]
    selected_starred_: boolean
    selected_unsorted_: boolean
    selected_archived_: boolean
    current_gte_?: number
    current_lte_?: number
    translations_: {
      nothing_pinned_: string
    }
  }
}

type SortableItem = {
  id: number
} & PinnedBookmarks.Item

export const PinnedBookmarks: React.FC<PinnedBookmarks.Props> = memo(
  function PinnedBookmarks(props) {
    const [sortable_items, set_sortable_items] = useState<SortableItem[]>(
      props.items_.map((item, i) => ({
        id: i,
        ...item,
      })),
    )

    let relevant_items = 0

    const items_dom = sortable_items.map((item) => {
      const created_at_timestamp = Math.round(item.created_at_.getTime() / 1000)
      let is_not_relevant = false

      if (
        (props.selected_archived_ && !item.is_archived_) ||
        (!props.selected_archived_ && item.is_archived_)
      ) {
        is_not_relevant = true
      } else if (props.selected_starred_ && !item.stars_) {
        is_not_relevant = true
      } else if (props.selected_unsorted_ && !item.is_unsorted_) {
        is_not_relevant = true
      } else if (
        item.tags_ &&
        !props.selected_tags_.every((t) => item.tags_!.includes(t))
      ) {
        is_not_relevant = true
      } else if (
        props.current_gte_ &&
        props.current_lte_ &&
        (created_at_timestamp <
          new Date(
            parseInt(props.current_gte_.toString().substring(0, 4)),
            parseInt(props.current_gte_.toString().substring(4, 6)) - 1,
          ).getTime() /
            1000 ||
          created_at_timestamp >
            new Date(
              parseInt(props.current_lte_.toString().substring(0, 4)),
              parseInt(props.current_lte_.toString().substring(4, 6)),
            ).getTime() /
              1000 -
              1)
      ) {
        is_not_relevant = true
      } else {
        relevant_items++
      }

      const url = item.open_snapshot_
        ? url_to_wayback({ date: item.created_at_, url: item.url_ })
        : item.url_

      return is_not_relevant ? (
        <div key={item.id} />
      ) : (
        <_Item
          key={item.id}
          favicon_host_={props.favicon_host_}
          menu_slot_={<>menu</>}
          on_link_click_={() => {}}
          on_link_middle_click_={() => {}}
          on_new_tab_link_click_={() => {}}
          on_reading_mode_click_={() => {}}
          should_dim_visited_links_={false}
          url_={url}
          favicon_={item.favicon_}
          is_parsed_={item.is_parsed_}
          open_snapshot_={item.open_snapshot_}
          saves_={item.saves_}
          site_path_={item.site_path_}
          title_={item.title_}
          is_public_={item.is_public_}
        />
      )
    })

    return (
      <>
        {relevant_items == 0 ? (
          <div className={styles['nothing-pinned']}>
            {props.translations_.nothing_pinned_}
          </div>
        ) : props.is_draggable_ ? (
          <ReactSortable
            list={sortable_items}
            setList={(new_sortable_items) => {
              if (
                JSON.stringify(new_sortable_items.map((i) => i.id)) ==
                JSON.stringify(sortable_items.map((i) => i.id))
              )
                return
              set_sortable_items(new_sortable_items)
              props.on_change_(new_sortable_items)
            }}
            animation={system_values.sortablejs_animation_duration}
            forceFallback={true}
            className={styles.items}
            fallbackClass={styles.dragging}
            delay={system_values.sortablejs_delay}
            delayOnTouchOnly={true}
          >
            {items_dom}
          </ReactSortable>
        ) : (
          <div className={styles.items}>{items_dom}</div>
        )}
        {}
      </>
    )
  },
  (o, n) => o.library_updated_at_timestamp_ == n.library_updated_at_timestamp_,
)
