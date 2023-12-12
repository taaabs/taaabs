import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-form-inputs.module.scss'
import { useState } from 'react'
import { Input } from '@web-ui/components/common/atoms/input'
import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Button } from '@web-ui/components/common/particles/button'

namespace DraggableFormInputs {
  type Item = {
    value: string
    is_public: boolean
  }
  export type Props = {
    items: Item[]
    on_change: (items: Item[]) => void
    button_text: string
  }
}

export const DraggableFormInputs: React.FC<DraggableFormInputs.Props> = (
  props,
) => {
  const [is_autofocus_enabled, set_is_autofocus_enabled] = useState(false)
  const [last_id, set_last_id] = useState(0)
  const [items, set_items] = useState<
    { id: number; value: string; is_public: boolean }[]
  >(
    props.items.map((item, i) => ({
      id: i,
      value: item.value,
      is_public: item.is_public,
    })),
  )

  useUpdateEffect(() => {
    set_last_id(items.length > 0 ? items[items.length - 1].id : 0)
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
          handle=".handle"
        >
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={cn(styles.item__handle, 'handle')}>
                <Icon variant="HANDLE" />
              </div>
              <div className={styles.item__input}>
                <Input
                  autofocus={is_autofocus_enabled}
                  value={item.value}
                  on_change={(value) => {
                    set_items(
                      items.map((el) => {
                        if (el.id == item.id) {
                          return { ...el, value: value }
                        } else {
                          return el
                        }
                      }),
                    )
                  }}
                />
              </div>
              <div className={styles.item__actions}>
                <button
                  className={cn(styles.item__actions__button, {
                    [styles['item__actions__button--disabled']]:
                      !item.is_public,
                  })}
                  onClick={() => {
                    set_items(
                      items.map((el) => {
                        if (el.id == item.id) {
                          return { ...el, is_public: !el.is_public }
                        } else {
                          return el
                        }
                      }),
                    )
                  }}
                  type="button"
                >
                  <Icon variant="GLOBE" />
                </button>
                <button
                  className={styles.item__actions__button}
                  onClick={() => {
                    set_items(items.filter((el) => el.id != item.id))
                  }}
                  type="button"
                >
                  <Icon variant="ADD" />
                </button>
              </div>
            </div>
          ))}
        </ReactSortable>
      )}
      <Button
        on_click={() => {
          if (!is_autofocus_enabled) set_is_autofocus_enabled(true)
          set_items([
            ...items,
            { id: last_id + 1, is_public: false, value: '' },
          ])
        }}
      >
        {props.button_text}
      </Button>
    </div>
  )
}
