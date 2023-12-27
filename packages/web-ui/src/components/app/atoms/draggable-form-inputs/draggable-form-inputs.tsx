import { ReactSortable } from 'react-sortablejs'
import styles from './draggable-form-inputs.module.scss'
import { useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'
import { Input } from '@web-ui/components/common/atoms/input'
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
    show_visibility_toggler: boolean
    max_items?: number
  }
}

export const DraggableFormInputs: React.FC<DraggableFormInputs.Props> = (
  props,
) => {
  const [is_autofocus_enabled, set_is_autofocus_enabled] = useState(false)
  const [count, set_count] = useState(props.items.length)
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
              <div className={styles.item__input}>
                <div className={cn(styles.item__input__handle, 'handle')}>
                  <Icon variant="HANDLE" />
                </div>
                <div className={styles.item__input__field}>
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
              </div>
              <div className={styles.item__actions}>
                {props.show_visibility_toggler && (
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
                )}
                <button
                  className={cn(
                    styles.item__actions__button,
                    styles['item__actions__button--remove'],
                  )}
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
          set_items([...items, { id: count + 1, is_public: true, value: '' }])
          set_count(items.length + 1)
        }}
        is_disabled={
          props.max_items ? items.length == props.max_items : undefined
        }
      >
        {props.button_text}
      </Button>
    </div>
  )
}
