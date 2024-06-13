import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-upsert-form-tags.module.scss'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'
import { Button } from '@web-ui/components/common/particles/button'
import { Input } from '@web-ui/components/common/atoms/input'
import { toast } from 'react-toastify'

namespace DraggableUpsertFormTags {
  type Tag = {
    name: string
    is_public?: boolean
  }
  export type Props = {
    tags: Tag[]
    on_change: (items: Tag[]) => void
    show_visibility_toggler: boolean
    max_tags?: number
    suggestions: { recent: string[]; frequent: string[] }[]
    translations: {
      enter_tag_name: string
      add: string
      visibility: string
      public: string
      private: string
    }
  }
}

export const DraggableUpsertFormTags: React.FC<
  DraggableUpsertFormTags.Props
> = (props) => {
  const is_input_focused = useRef<boolean>()
  const [new_tag, set_new_tag] = useState('')
  const [count, set_count] = useState(props.tags.length)
  const [tags, set_tags] = useState<
    { id: number; name: string; is_public?: boolean }[]
  >(
    props.tags.map((item, i) => ({
      id: i,
      name: item.name,
      is_public: item.is_public,
    })),
  )

  useUpdateEffect(() => {
    props.on_change(tags)
  }, [tags])

  const add_tag = (tag: string) => {
    if (props.max_tags == tags.length) return
    if (tags.find((item) => item.name == tag)) {
      set_new_tag('')
      toast.error('Given tag is already there')
      return
    }
    set_tags([...tags, { id: count + 1, is_public: true, name: tag }])
    set_count(tags.length + 1)
    set_new_tag('')
  }

  const handle_keyboard = (event: any) => {
    if (!is_input_focused.current) return
    if (event.code == 'Enter') {
      add_tag(new_tag)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)

    return () => {
      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [new_tag])

  return (
    <div>
      {tags.length > 0 && (
        <ReactSortable
          list={tags}
          setList={set_tags}
          className={styles.sortable}
          animation={system_values.sortablejs_animation_duration}
          forceFallback={true}
          handle={'.handle'}
        >
          {tags.map((item) => (
            <div key={item.id} className={styles.item}>
              <button
                className={styles.item__remove}
                onClick={() => {
                  set_tags(tags.filter((el) => el.id != item.id))
                }}
              >
                <Icon variant="ADD" />
              </button>
              <div className={styles.item__content}>
                <input
                  className={styles.item__content__tag}
                  value={item.name}
                  onChange={(e) => {
                    set_tags(
                      tags.map((i) =>
                        i.id == item.id
                          ? {
                              ...i,
                              name: e.target.value,
                            }
                          : i,
                      ),
                    )
                  }}
                />
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
                              set_tags(
                                tags.map((el) => {
                                  if (el.id == item.id) {
                                    return { ...el, is_public: false }
                                  } else {
                                    return el
                                  }
                                }),
                              )
                            } else if (e.target.value == 'public') {
                              set_tags(
                                tags.map((el) => {
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
                </div>
              </div>
              <div className={cn(styles.item__handle, 'handle')}>
                <Icon variant="HANDLE" />
              </div>
            </div>
          ))}
        </ReactSortable>
      )}
      <div className={styles['new-tag']}>
        <Input
          value={new_tag}
          on_change={(value) => {
            set_new_tag(value)
          }}
          placeholder={props.translations.enter_tag_name}
          on_focus={() => {
            is_input_focused.current = true
          }}
          on_blur={() => {
            is_input_focused.current = false
          }}
        />
        <Button
          on_click={() => {
            add_tag(new_tag)
          }}
          is_disabled={tags.length == props.max_tags}
        >
          {props.translations.add}
        </Button>
      </div>

      <div className={styles.suggestions}>
        {props.suggestions.map((item, i) => (
          <div className={styles.suggestions__pair} key={i}>
            <div>
              <div className={styles.suggestions__pair__label}>Recent</div>
              <div>
                <div className={styles.suggestions__pair__tags}>
                  {item.recent.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        add_tag(tag)
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className={styles.suggestions__pair__label}>Frequent</div>
              <div>
                <div className={styles.suggestions__pair__tags}>
                  {item.frequent.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        add_tag(tag)
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
