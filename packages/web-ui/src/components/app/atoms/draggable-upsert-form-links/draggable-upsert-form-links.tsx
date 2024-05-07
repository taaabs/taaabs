import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-upsert-form-links.module.scss'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'
import { Button } from '@web-ui/components/common/particles/button'
import { Input } from '@web-ui/components/common/atoms/input'
import { get_site_paths_from_url } from '@shared/utils/get-site-paths-from-url'
import { toast } from 'react-toastify'
import { is_url_valid } from '@shared/utils/is-url-valid/is-url-valid'

namespace DraggableUpsertFormLinks {
  type Link = {
    url: string
    site_path?: string
    is_public?: boolean
    open_snapshot?: boolean
  }
  export type Props = {
    links: Link[]
    on_change: (items: Link[]) => void
    clipboard_url?: string
    show_visibility_toggler: boolean
    max_items?: number
    translations: {
      enter_url: string
      add: string
      open: string
      original_url: string
      snapshot: string
      visibility: string
      public: string
      private: string
    }
  }
}

export const DraggableUpsertFormLinks: React.FC<
  DraggableUpsertFormLinks.Props
> = (props) => {
  const is_input_focused = useRef<boolean>()
  const [new_url, set_new_url] = useState('')
  const [count, set_count] = useState(props.links.length)
  const [items, set_items] = useState<
    {
      id: number
      url: string
      site_path?: string
      site_paths?: string[]
      is_public?: boolean
      open_snapshot?: boolean
    }[]
  >(
    props.links.map((item, i) => ({
      id: i,
      url: item.url,
      site_path: item.site_path,
      site_paths: get_site_paths_from_url(item.url),
      is_public: item.is_public,
      open_snapshot: item.open_snapshot,
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

  const add_url = () => {
    if (!new_url) return
    if (!is_url_valid(new_url)) {
      toast.error('Given URL is invalid')
      return
    }
    if (items.find((item) => item.url == new_url)) {
      set_new_url('')
      toast.error('Given URL is already there')
      return
    }
    set_items([...items, { id: count + 1, is_public: true, url: new_url }])
    set_count(items.length + 1)
    set_new_url('')
  }

  const handle_keyboard = (event: any) => {
    if (!is_input_focused) return
    if (event.code == 'Enter') {
      add_url()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)

    return () => {
      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [new_url])

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
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <button
                className={styles.item__remove}
                onClick={() => {
                  set_items(items.filter((el) => el.id != item.id))
                }}
              >
                <Icon variant="ADD" />
              </button>
              <div className={styles.item__content}>
                <div className={styles.item__content__url}>{item.url}</div>
                <div className={styles.item__content__options}>
                  {props.show_visibility_toggler && (
                    <div className={styles.item__content__options__row}>
                      <div
                        className={styles.item__content__options__row__label}
                      >
                        {props.translations.visibility}
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
                          <option value="" />
                          <option value="private">
                            {props.translations.private}
                          </option>
                          <option value="public">
                            {props.translations.public}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                  {item.site_paths && item.site_paths.length > 0 && (
                    <div className={styles.item__content__options__row}>
                      <div
                        className={styles.item__content__options__row__label}
                      >
                        Site
                      </div>
                      <div
                        className={styles.item__content__options__row__content}
                      >
                        <select
                          onChange={(e) => {
                            set_items(
                              items.map((el) => {
                                if (el.id == item.id) {
                                  return { ...el, site_path: e.target.value }
                                } else {
                                  return el
                                }
                              }),
                            )
                          }}
                          value={item.site_path}
                        >
                          <option value=""></option>
                          {item.site_paths?.map((site_path) => (
                            <option value={site_path} key={site_path}>
                              {site_path}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className={styles.item__content__options__row}>
                    <div className={styles.item__content__options__row__label}>
                      {props.translations.open}
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
                                  return { ...el, open_snapshot: false }
                                } else {
                                  return el
                                }
                              }),
                            )
                          } else if (e.target.value == 'snapshot') {
                            set_items(
                              items.map((el) => {
                                if (el.id == item.id) {
                                  return { ...el, open_snapshot: true }
                                } else {
                                  return el
                                }
                              }),
                            )
                          }
                        }}
                        value={item.open_snapshot ? 'snapshot' : 'direct'}
                      >
                        <option value="" />
                        <option value="direct">
                          {props.translations.original_url}
                        </option>
                        <option value="snapshot">
                          {props.translations.snapshot}
                        </option>
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
      <div className={styles['new-url']}>
        <Input
          value={new_url}
          on_change={(value) => {
            set_new_url(value)
          }}
          placeholder={props.translations.enter_url}
          on_focus={() => {
            is_input_focused.current = true
          }}
          on_blur={() => {
            is_input_focused.current = false
          }}
        />
        <Button
          on_click={() => {
            add_url()
          }}
          is_disabled={items.length == props.max_items}
        >
          {props.translations.add}
        </Button>
      </div>
    </div>
  )
}
