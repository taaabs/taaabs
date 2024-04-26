import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-upsert-form-tags.module.scss'
import { useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'
import { Button } from '@web-ui/components/common/particles/button'
import { Input } from '@web-ui/components/common/atoms/input'

namespace DraggableUpsertFormTags {
  type Tag = {
    name: string
    is_public?: boolean
  }
  export type Props = {
    tags: Tag[]
    on_change: (items: Tag[]) => void
    show_visibility_toggler: boolean
    max_items?: number
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
  const [new_tag, set_new_tag] = useState('')
  const [count, set_count] = useState(props.tags.length)
  const [items, set_items] = useState<
    { id: number; name: string; is_public?: boolean }[]
  >(
    props.tags.map((item, i) => ({
      id: i,
      name: item.name,
      is_public: item.is_public,
    })),
  )

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
                <div className={styles.item__content__tag}>{item.name}</div>
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
      <div className={styles['new-link']}>
        <Input
          value={new_tag}
          on_change={(value) => {
            set_new_tag(value)
          }}
          placeholder={props.translations.enter_tag_name}
        />
        <Button
          on_click={() => {
            if (!new_tag) return
            set_items([
              ...items,
              { id: count + 1, is_public: true, name: new_tag },
            ])
            set_count(items.length + 1)
            set_new_tag('')
          }}
        >
          {props.translations.add}
        </Button>
      </div>
    </div>
  )
}
