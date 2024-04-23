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
    bookmark_id: number
    url: string
    created_at: Date
    title?: string
    stars?: number
    is_unread?: boolean
    is_archived?: boolean
    tags?: number[]
    via_wayback?: boolean
  }
  export type Props = {
    library_updated_at_timestamp?: number
    items: Item[]
    on_change: (items: Item[]) => void
    favicon_host: string
    on_click: (item: Item) => void
    on_middle_click: (item: Item) => void
    is_draggable: boolean
    selected_tags: number[]
    selected_starred: boolean
    selected_unread: boolean
    selected_archived: boolean
    current_gte?: number
    current_lte?: number
    translations: {
      nothing_pinned: string
    }
  }
}

type SortableItem = {
  id: number
  bookmark_id: number
  created_at: Date
  url: string
  title?: string
  stars?: number
  is_unread?: boolean
  is_archived?: boolean
  tags?: number[]
  via_wayback?: boolean
}

export const Pinned: React.FC<Pinned.Props> = memo(
  function Pinned(props) {
    const [items, set_items] = useState<SortableItem[]>(
      props.items.map((item, i) => ({
        id: i,
        bookmark_id: item.bookmark_id,
        created_at: item.created_at,
        url: item.url,
        title: item.title,
        stars: item.stars,
        is_unread: item.is_unread,
        is_archived: item.is_archived,
        tags: item.tags,
        via_wayback: item.via_wayback,
      })),
    )

    let relevant_items = 0

    const items_dom = items.map((item) => {
      const created_at_timestamp = Math.round(item.created_at.getTime() / 1000)
      let is_not_relevant = false
      // check if item includes every selected tags
      if (
        (props.selected_archived && !item.is_archived) ||
        (!props.selected_archived && item.is_archived)
      ) {
        is_not_relevant = true
      } else if (props.selected_starred && !item.stars) {
        is_not_relevant = true
      } else if (props.selected_unread && !item.is_unread) {
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

      const url = item.via_wayback
        ? url_to_wayback({ date: item.created_at, url: item.url })
        : item.url

      return is_not_relevant ? (
        <div key={url} />
      ) : (
        <a
          key={url}
          href={url}
          title={item.title}
          className={styles.item}
          onClick={(e) => {
            e.preventDefault()
            props.on_click(item)
          }}
          onAuxClick={() => {
            props.on_middle_click(item)
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
                src={`${props.favicon_host}/${get_domain_from_url(item.url)}`}
              />
            </div>
            <div
              className={cn(styles.item__inner__title, {
                [styles['item__inner__title--unread']]: item.is_unread,
                [styles['item__inner__title--via-wayback']]: item.via_wayback,
              })}
            >
              {item.title}
            </div>
            {item.is_unread && (
              <div className={styles['item__inner__unread']} />
            )}
          </div>
          {item.stars && item.title && (
            <div className={styles['item__stars']}>
              {[...Array(item.stars)].map((_, i) => (
                <Icon variant="STAR_FILLED" key={i} />
              ))}
            </div>
          )}
        </a>
      )
    })

    return (
      <>
        {props.is_draggable ? (
          <ReactSortable
            list={items}
            setList={(new_items) => {
              if (JSON.stringify(new_items) == JSON.stringify(items)) return
              set_items(new_items)
              props.on_change(new_items)
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
        {relevant_items == 0 && (
          <div className={styles['nothing-pinned']}>
            {props.translations.nothing_pinned}
          </div>
        )}
      </>
    )
  },
  (o, n) => o.library_updated_at_timestamp == n.library_updated_at_timestamp,
)
