import { memo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import styles from './pinned.module.scss'
import { system_values } from '@shared/constants/system-values'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import cn from 'classnames'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { Icon } from '@web-ui/components/common/particles/icon'

export namespace Pinned {
  type Item = {
    bookmark_id_: number
    url_: string
    created_at_: Date
    title_?: string
    stars_?: number
    is_unread_?: boolean
    is_archived_?: boolean
    tags_?: number[]
    open_snapshot_?: boolean
  }
  export type Props = {
    library_updated_at_timestamp_?: number
    items_: Item[]
    on_change_: (items: Item[]) => void
    favicon_host_: string
    on_click_: (item: Item) => void
    on_middle_click_: (item: Item) => void
    is_draggable_: boolean
    selected_tags_: number[]
    selected_starred_: boolean
    selected_unread_: boolean
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
  bookmark_id_: number
  created_at_: Date
  url_: string
  title_?: string
  stars_?: number
  is_unread_?: boolean
  is_archived_?: boolean
  tags_?: number[]
  open_snapshot_?: boolean
}

export const Pinned: React.FC<Pinned.Props> = memo(
  function Pinned(props) {
    const [items, set_items] = useState<SortableItem[]>(
      props.items_.map((item, i) => ({
        id: i,
        bookmark_id_: item.bookmark_id_,
        created_at_: item.created_at_,
        url_: item.url_,
        title_: item.title_,
        stars_: item.stars_,
        is_unread_: item.is_unread_,
        is_archived_: item.is_archived_,
        tags_: item.tags_,
        open_snapshot_: item.open_snapshot_,
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
      } else if (props.selected_unread_ && !item.is_unread_) {
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
        <a
          key={url}
          href={url}
          title={item.title_}
          className={styles.item}
          onClick={(e) => {
            e.preventDefault()
            props.on_click_(item)
          }}
          onAuxClick={() => {
            props.on_middle_click_(item)
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
        >
          <div className={styles.item__inner}>
            <div className={styles.item__inner__favicon}>
              <img
                alt={'Favicon'}
                width={16}
                height={16}
                src={`${props.favicon_host_}/${get_domain_from_url(item.url_)}`}
              />
            </div>
            <div
              className={cn(styles.item__inner__title, {
                [styles['item__inner__title--unread']]: item.is_unread_,
                [styles['item__inner__title--via-wayback']]:
                  item.open_snapshot_,
              })}
            >
              {item.title_}
            </div>
            {item.is_unread_ && (
              <div className={styles['item__inner__unread']} />
            )}
          </div>
          {item.stars_ !== undefined && item.title_ && (
            <div className={styles['item__stars']}>
              {[...Array(item.stars_)].map((_, i) => (
                <Icon variant="STAR_FILLED" key={i} />
              ))}
            </div>
          )}
        </a>
      )
    })

    return (
      <>
        {/* Shadow set from library */}
        <div className={styles['shadow-fix']} />
        {relevant_items == 0 && (
          <div className={styles['nothing-pinned']}>
            {props.translations_.nothing_pinned_}
          </div>
        )}
        {props.is_draggable_ ? (
          <ReactSortable
            list={items}
            setList={(new_items) => {
              if (JSON.stringify(new_items) == JSON.stringify(items)) return
              set_items(new_items)
              props.on_change_(new_items)
            }}
            animation={system_values.sortablejs_animation_duration}
            forceFallback={true}
            className={styles.items}
            fallbackClass={styles['item--dragging']}
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
