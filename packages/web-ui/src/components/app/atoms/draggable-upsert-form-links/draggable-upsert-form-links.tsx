import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-upsert-form-links.module.scss'
import { useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'
import { Button } from '@web-ui/components/common/particles/button'
import { Input } from '@web-ui/components/common/atoms/input'

namespace DraggableUpsertFormLinks {
  type Link = {
    url: string
    is_public?: boolean
    via_wayback?: boolean
  }
  export type Props = {
    links: Link[]
    on_change: (items: Link[]) => void
    clipboard_url?: string
    show_visibility_toggler: boolean
    max_items?: number
    translations: {
      add_url: string
    }
  }
}

export const DraggableUpsertFormLinks: React.FC<
  DraggableUpsertFormLinks.Props
> = (props) => {
  const [new_url, set_new_url] = useState('')
  const [count, set_count] = useState(props.links.length)
  const [items, set_items] = useState<
    { id: number; url: string; is_public?: boolean; via_wayback?: boolean }[]
  >(
    props.links.map((item, i) => ({
      id: i,
      url: item.url,
      is_public: item.is_public,
      via_wayback: item.via_wayback,
    })),
  )

  useUpdateEffect(() => {
    if (props.clipboard_url) {
      set_new_url(props.clipboard_url)
    }
  }, [props.clipboard_url])

  useUpdateEffect(() => {
    props.on_change(items)
  }, [items])

  return (
    <div>
      {items.length > 0 && (
        <ReactSortable
          list={items}
          setList={set_items}
          className={styles.sortable}
          animation={system_values.sortablejs_animation_duration}
          forceFallback={true}
          handle={'.handle'}
        >
          {items.map((item, i) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.item__content}>
                <div className={styles.item__content__top}>
                  <div className={styles.item__content__top__heading}>
                    <div className={styles.item__content__top__heading__index}>
                      #{i + 1}
                    </div>
                    <button
                      className={styles.item__content__top__heading__remove}
                      onClick={() => {
                        set_items(items.filter((el) => el.id != item.id))
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className={styles.item__content__top__url}>
                    {item.url}
                  </div>
                </div>
                <div className={styles.item__content__options}>
                  {props.show_visibility_toggler && (
                    <div className={styles.item__content__options__row}>
                      <div
                        className={styles.item__content__options__row__label}
                      >
                        Visibility
                      </div>
                      <div
                        className={styles.item__content__options__row__content}
                      >
                        <select
                          onChange={(e) => {
                            if (e.target.value == 'private') {
                              set_items(
                                items.map((el) => {
                                  if (el.id == item.id) {
                                    return { ...el, is_public: false }
                                  } else {
                                    return el
                                  }
                                }),
                              )
                            } else if (e.target.value == 'public') {
                              set_items(
                                items.map((el) => {
                                  if (el.id == item.id) {
                                    return { ...el, is_public: true }
                                  } else {
                                    return el
                                  }
                                }),
                              )
                            }
                          }}
                          value={item.is_public ? 'public' : 'private'}
                        >
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <div className={styles.item__content__options__row}>
                    <div className={styles.item__content__options__row__label}>
                      Open...
                    </div>
                    <div
                      className={styles.item__content__options__row__content}
                    >
                      <select
                        onChange={(e) => {
                          if (e.target.value == 'direct') {
                            set_items(
                              items.map((el) => {
                                if (el.id == item.id) {
                                  return { ...el, via_wayback: false }
                                } else {
                                  return el
                                }
                              }),
                            )
                          } else if (e.target.value == 'snapshot') {
                            set_items(
                              items.map((el) => {
                                if (el.id == item.id) {
                                  return { ...el, via_wayback: true }
                                } else {
                                  return el
                                }
                              }),
                            )
                          }
                        }}
                        value={item.via_wayback ? 'snapshot' : 'direct'}
                      >
                        <option value="direct">Direct</option>
                        <option value="snapshot">Snapshot</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cn(styles.item__handle, 'handle')}>
                <Icon variant="HANDLE" />
              </div>
            </div>
          ))}
        </ReactSortable>
      )}
      <div className={styles['new-link']}>
        <Input
          value={new_url}
          on_change={(value) => {
            set_new_url(value)
          }}
          autofocus={props.links.length == 0}
        />
        <Button
          on_click={() => {
            set_items([
              ...items,
              { id: count + 1, is_public: true, url: new_url },
            ])
            set_count(items.length + 1)
            set_new_url('')
          }}
          is_disabled={
            !new_url ||
            (props.max_items ? items.length == props.max_items : undefined)
          }
        >
          {props.translations.add_url}
        </Button>
      </div>
    </div>
  )
}
