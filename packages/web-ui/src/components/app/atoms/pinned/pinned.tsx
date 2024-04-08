import { memo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import styles from './pinned.module.scss'
import { system_values } from '@shared/constants/system-values'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import cn from 'classnames'
import { Icon } from '@web-ui/components/common/particles/icon'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace Pinned {
  type Item = {
    bookmark_id: number
    url: string
    created_at: number
    title?: string
    stars?: number
    is_unread?: boolean
    tags?: number[]
  }
  export type Props = {
    first_bookmarks_fetched_at_timestamp?: number // Hiding not relevant pins.
    items: Item[]
    on_change: (items: Item[]) => void
    favicon_host: string
    header_title: string
    on_link_click?: (bookmark_id: number) => void
    is_draggable: boolean
    selected_tags: number[]
    selected_starred: boolean
    selected_unread: boolean
    selected_archived: boolean
    current_gte?: number
    current_lte?: number
  }
}

type SortableItem = {
  id: number
  bookmark_id: number
  created_at: number
  url: string
  title?: string
  stars?: number
  is_unread?: boolean
  tags?: number[]
}

export const Pinned: React.FC<Pinned.Props> = memo(
  function Pinned(props) {
    const [is_holding_item, set_is_holding_item] = useState(false)
    const [items, set_items] = useState<SortableItem[]>(
      props.items.map((item, i) => ({
        id: i,
        bookmark_id: item.bookmark_id,
        created_at: item.created_at,
        url: item.url,
        title: item.title,
        stars: item.stars,
        is_unread: item.is_unread,
        tags: item.tags,
      })),
    )

    useUpdateEffect(() => {
      props.on_change(items)
    }, [items])

    const items_dom = items.map((item) => {
      let is_not_relevant = false
      // check if item includes every selected tags
      if (props.selected_starred && !item.stars) {
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
        (item.created_at <
          new Date(
            parseInt(props.current_gte.toString().substring(0, 4)),
            parseInt(props.current_gte.toString().substring(4, 6)) - 1,
          ).getTime() /
            1000 ||
          item.created_at >
            new Date(
              parseInt(props.current_lte.toString().substring(0, 4)),
              parseInt(props.current_lte.toString().substring(4, 6)),
            ).getTime() /
              1000 -
              1)
      ) {
        is_not_relevant = true
      }
      return (
        <a
          key={item.url}
          href={item.url}
          title={item.title}
          className={styles.item}
          onClick={async (e) => {
            e.preventDefault()
            props.on_link_click?.(item.bookmark_id)
            location.href = item.url
          }}
          onContextMenu={(e) => {
            if (is_holding_item) {
              e.preventDefault()
            }
          }}
        >
          <div
            className={cn(styles.item__favicon, {
              [styles['item__favicon--not-relevant']]: is_not_relevant,
            })}
          >
            <img
              alt={'Favicon'}
              width={16}
              height={16}
              src={`${props.favicon_host}/${get_domain_from_url(item.url)}`}
            />
          </div>
          {!is_not_relevant && (
            <div>
              <div
                className={cn(styles.item__title, {
                  [styles['item__title--unread']]: item.is_unread,
                })}
              >
                <span>{item.title}</span>
              </div>
              {item.stars && item.title && (
                <div className={styles['item__stars']}>
                  {[...Array(item.stars)].map((_, i) => (
                    <Icon variant="STAR_FILLED" key={i} />
                  ))}
                </div>
              )}
              {item.is_unread && <div className={styles['item__unread']} />}
            </div>
          )}
        </a>
      )
    })

    if (props.selected_archived) {
      return <></>
    }

    return props.is_draggable ? (
      <ReactSortable
        list={items}
        setList={(new_items) => {
          if (JSON.stringify(new_items) == JSON.stringify(items)) return
          set_items(new_items)
        }}
        animation={system_values.sortablejs_animation_duration}
        forceFallback={true}
        className={styles.items}
        fallbackClass={styles['item--dragging']}
        delay={system_values.sortablejs_delay}
        delayOnTouchOnly={true}
        onStart={() => {
          set_is_holding_item(true)
        }}
        onEnd={() => {
          set_is_holding_item(false)
        }}
      >
        {items_dom}
      </ReactSortable>
    ) : (
      <div className={styles.items}>{items_dom}</div>
    )
  },
  (o, n) =>
    o.first_bookmarks_fetched_at_timestamp ==
    n.first_bookmarks_fetched_at_timestamp,
)
