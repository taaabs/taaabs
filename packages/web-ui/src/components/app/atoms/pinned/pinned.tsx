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
    url: string
    title?: string
    stars?: number
    is_unread?: boolean
  }
  export type Props = {
    items: Item[]
    on_change: (items: Item[]) => void
    favicon_host: string
    header_title: string
    on_link_click: (url: string) => void
    is_draggable: boolean
  }
}

type SortableItem = {
  id: number
  url: string
  title?: string
  stars?: number
  is_unread?: boolean
}

export const Pinned: React.FC<Pinned.Props> = memo(
  function Pinned(props) {
    const [items, set_items] = useState<SortableItem[]>(
      props.items.map((item, i) => ({
        id: i,
        url: item.url,
        title: item.title,
        stars: item.stars,
        is_unread: item.is_unread,
      })),
    )

    useUpdateEffect(() => {
      props.on_change(items)
    }, [items])

    const items_dom = items.map((item) => (
      <a
        key={item.url}
        href={item.url}
        className={styles.item}
        onClick={async (e) => {
          e.preventDefault()
          props.on_link_click(item.url)
          location.href = item.url
        }}
      >
        <img
          alt={'Favicon'}
          width={16}
          height={16}
          src={`${props.favicon_host}/${get_domain_from_url(item.url)}`}
        />
        <div>
          <div
            className={cn(styles.item__title, {
              [styles['item__title--unread']]: item.is_unread,
            })}
          >
            <span>{item.title}</span>
          </div>
          {item.stars && (
            <div className={styles.item__stars}>
              {[...Array(item.stars)].map((_, i) => (
                <Icon variant="STAR_FILLED" key={i} />
              ))}
            </div>
          )}
        </div>
      </a>
    ))

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
      >
        {items_dom}
      </ReactSortable>
    ) : (
      <div className={styles.items}>{items_dom}</div>
    )
  },
  (o, n) => o.items.length == n.items.length,
)
