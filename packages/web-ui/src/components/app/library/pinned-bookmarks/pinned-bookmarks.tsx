import styles from './pinned-bookmarks.module.scss'
import { ReactSortable } from 'react-sortablejs'
import { memo, useState } from 'react'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { system_values } from '@shared/constants/system-values'
import { Item } from './item/item'

export namespace PinnedBookmarks {
  export type Props = {
    items_: Item.Props[]
    library_updated_at_timestamp_?: number
    on_change_: (items: Item.Props[]) => void
    favicon_host_: string
    on_click_: (item: Item.Props) => void
    on_middle_click_: (item: Item.Props) => void
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
} & Item.Props

export const PinnedBookmarks: React.FC<PinnedBookmarks.Props> = memo(
  function PinnedBookmarks(props) {
    const [items, set_items] = useState<SortableItem[]>(
      props.items_.map((item, i) => ({
        id: i,
        bookmark_id_: item.bookmark_id_,
        created_at_: item.created_at_,
        url_: item.url_,
        cover_: item.cover_,
        title_: item.title_,
        stars_: item.stars_,
        is_unsorted_: item.is_unsorted_,
        is_archived_: item.is_archived_,
        tags_: item.tags_,
        open_snapshot_: item.open_snapshot_,
        menu_slot_: item.menu_slot_,
        is_parsed_: item.is_parsed_,
        saves_: item.saves_,
        site_path_: item.site_path_,
      })),
    )

    let relevant_items = 0

    const items_dom = items.map((item) => {
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
        <div key={url} />
      ) : (
        <Item
          key={url}
          bookmark_id_={item.bookmark_id_}
          created_at_={item.created_at_}
          menu_slot_={item.menu_slot_}
          tags_={item.tags_}
          url_={item.url_}
          cover_={item.cover_}
          title_={item.title_}
        />
      )
    })

    return (
      <>
        {relevant_items == 0 && (
          <div>{props.translations_.nothing_pinned_}</div>
        )}
        {props.is_draggable_ ? (
          <ReactSortable
            list={items}
            setList={(new_items) => {
              if (
                JSON.stringify(new_items.map((i) => i.id)) ==
                JSON.stringify(items.map((i) => i.id))
              )
                return
              set_items(new_items)
              props.on_change_(new_items)
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
      </>
    )
  },
  (o, n) => o.library_updated_at_timestamp_ == n.library_updated_at_timestamp_,
)
