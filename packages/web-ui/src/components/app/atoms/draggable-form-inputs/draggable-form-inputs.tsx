import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-form-inputs.module.scss'
import { useEffect, useState } from 'react'
import { Input } from '@web-ui/components/common/atoms/input'
import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'

namespace DraggableFormInputs {
  type Item = {
    value: string
    is_public: boolean
  }
  export type Props = {
    items: Item[]
    on_change: (items: Item[]) => void
  }
}

export const DraggableFormInputs: React.FC<DraggableFormInputs.Props> = (
  props,
) => {
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

  useEffect(() => {
    set_last_id(items[items.length - 1].id)
    props.on_change(items)
  }, [items])

  return (
    <div>
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
                  [styles['item__actions__button--disabled']]: !item.is_public,
                })}
                onClick={(e) => {
                  e.preventDefault()
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
              >
                <Icon variant="GLOBE" />
              </button>
              <button
                className={styles.item__actions__button}
                onClick={(e) => {
                  e.preventDefault()
                  if (items.length > 1) {
                    set_items(items.filter((el) => el.id != item.id))
                  }
                }}
              >
                <Icon variant="ADD" />
              </button>
            </div>
          </div>
        ))}
      </ReactSortable>
      <div
        className={styles.new}
        role="button"
        onClick={() => {
          set_items([
            ...items,
            { id: last_id + 1, is_public: false, value: '' },
          ])
        }}
      >
        <Input on_change={() => {}} value={''} />
      </div>
    </div>
  )
}
