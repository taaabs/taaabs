import { useRef, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import styles from './TagsInput.module.scss'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import cn from 'classnames'
import { Icon as UiIcon } from '@web-ui/components/Icon'
import { system_values } from '@shared/constants/system-values'
import OutsideClickHandler from 'react-outside-click-handler'
import Simplebar from 'simplebar-react'

export namespace TagsInput {
  export type Tag = {
    name: string
    is_public?: boolean
  }
  export type Props = {
    selected_tags: Tag[]
    all_tags: string[]
    recent_tags: string[]
    on_selected_tags_update: (selected_tags: Tag[]) => void
    max_tags: number
    is_visibility_toggleable: boolean
    translations: {
      enter_tag_name: string
      add: string
      recent_tags: string
    }
  }
}

export const TagsInput: React.FC<TagsInput.Props> = (props) => {
  const [sortable_items, set_sortable_items] = useState<
    { id: number; name: string; is_public?: boolean }[]
  >(
    props.selected_tags.map((tag) => ({
      id: Math.random(),
      name: tag.name,
      is_public: tag.is_public,
    })),
  )
  const ref = useRef({} as HTMLInputElement)
  const [new_tag_name, set_new_tag_name] = useState('')
  const [input_width, set_input_width] = useState<number>()
  const [is_focused, set_is_focused] = useState<boolean>()

  useUpdateEffect(() => {
    props.on_selected_tags_update(
      sortable_items.map((i) => ({ name: i.name, is_public: i.is_public })),
    )
  }, [sortable_items])

  useUpdateEffect(() => {
    // Set input width dynamically
    const span = document.createElement('span')
    document.body.appendChild(span)
    const inputStyles = window.getComputedStyle(ref.current)
    span.textContent = ref.current.value
    span.style.whiteSpace = 'pre'
    const width = span.offsetWidth + parseFloat(inputStyles.paddingLeft)
    document.body.removeChild(span)
    set_input_width(width + 10)

    // Handle keyboard keys
    const handle_keyboard = (event: KeyboardEvent) => {
      if (event.code == 'Enter' || event.code == 'Comma') {
        event.preventDefault()
        if (
          sortable_items.length == props.max_tags ||
          !new_tag_name.trim().length
        ) {
          ref.current.blur()
          set_is_focused(false)
          return
        }

        if (!sortable_items.find((i) => i.name == new_tag_name.trim())) {
          set_sortable_items([
            ...sortable_items,
            { id: Math.random(), name: new_tag_name.trim(), is_public: true },
          ])
          set_new_tag_name('')
        }
      } else if (event.code == 'Tab') {
        // Apply first suggestion
        const first_suggestion = new_tag_name
          ? props.all_tags
              .filter((tag) =>
                tag.toLowerCase().includes(new_tag_name.toLowerCase()),
              )
              .filter((tag) => !sortable_items.find((i) => i.name == tag))[0]
          : undefined

        if (first_suggestion) {
          event.preventDefault()
          set_sortable_items([
            ...sortable_items,
            { id: Math.random(), name: first_suggestion, is_public: true },
          ])
          set_new_tag_name('')
        } else {
          set_is_focused(false)
        }
      } else if (event.code == 'Escape') {
        set_is_focused(false)
      } else if (event.code == 'Backspace' && new_tag_name == '') {
        set_sortable_items(sortable_items.slice(0, -1))
      }
    }

    if (is_focused) {
      document.addEventListener('keydown', handle_keyboard)
    }

    return () => document.removeEventListener('keydown', handle_keyboard)
  }, [new_tag_name, is_focused, sortable_items])

  const field = (
    <ReactSortable
      list={sortable_items}
      setList={(new_list) => {
        set_sortable_items(new_list)
      }}
      className={cn(styles.field, {
        [styles.field__focus]: is_focused,
      })}
      animation={system_values.sortablejs_animation_duration}
      draggable={`.${styles.tag}`}
      delay={system_values.sortablejs_delay}
      delayOnTouchOnly={true}
    >
      {sortable_items.map((item) => (
        <div className={styles.tag} key={item.id}>
          <span>{item.name}</span>
          <div className={styles.tag__actions}>
            {props.is_visibility_toggleable && (
              <button
                className={cn(
                  styles.tag__actions__action,
                  styles['tag__actions--visibility'],
                  { [styles['tag__actions--private']]: !item.is_public },
                )}
                onClick={() => {
                  set_sortable_items(
                    sortable_items.map((t) =>
                      t.name == item.name
                        ? { ...t, is_public: !t.is_public }
                        : t,
                    ),
                  )
                }}
              >
                <UiIcon variant="EYE" />
              </button>
            )}
            <button
              className={cn(
                styles.tag__actions__action,
                styles['tag__actions--remove'],
              )}
              onClick={() => {
                set_sortable_items(
                  sortable_items.filter((t) => t.name != item.name),
                )
              }}
            >
              <UiIcon variant="CROSS" />
            </button>
          </div>
        </div>
      ))}
      <input
        ref={ref}
        style={{
          width: !sortable_items.length
            ? undefined
            : new_tag_name
            ? `${input_width}px`
            : '10px',
          flex: !props.selected_tags.length ? '1' : undefined,
        }}
        className={cn(styles.input, {
          [styles['input--empty']]: !sortable_items.length,
        })}
        placeholder={
          !sortable_items.length ? props.translations.enter_tag_name : undefined
        }
        value={new_tag_name}
        onChange={(event) => {
          if (
            event.target.value.length >= system_values.bookmark.tags.max_length
          )
            return
          set_new_tag_name(event.target.value)
        }}
        onFocus={() => {
          set_is_focused(true)
        }}
      />
    </ReactSortable>
  )

  const suggestions = (
    <Simplebar className={styles.suggestions}>
      {!new_tag_name && (
        <div className={styles.suggestions__heading}>
          {props.translations.recent_tags}
        </div>
      )}

      <div
        className={cn(styles.suggestions__items, {
          [styles['suggestions__items--visible']]: props.all_tags !== undefined,
        })}
      >
        {/* Create new tag (shown when no match in filtered out all tags was found). */}
        {new_tag_name.trim() && (
          <button
            className={styles.suggestions__create}
            onClick={() => {
              if (sortable_items.length == props.max_tags) return
              set_sortable_items([
                ...sortable_items,
                {
                  id: Math.random(),
                  name: new_tag_name.trim(),
                  is_public: true,
                },
              ])
              set_new_tag_name('')
            }}
          >
            {props.translations.add} "<strong>{new_tag_name}</strong>"
          </button>
        )}
        {/* Recent tags. */}
        {!new_tag_name &&
          props.recent_tags
            .filter(
              (recent_tag) => !sortable_items.find((i) => i.name == recent_tag),
            )
            .slice(0, 30)
            .map((recent_tag) => (
              <button
                key={recent_tag}
                className={styles.suggestions__items__item}
                onClick={() => {
                  if (sortable_items.length == props.max_tags) return
                  set_sortable_items([
                    ...sortable_items,
                    { id: Math.random(), name: recent_tag, is_public: true },
                  ])
                }}
              >
                {recent_tag}
              </button>
            ))}
        {/* Filtered out "all tags". */}
        {new_tag_name &&
          props.all_tags
            .filter((tag) =>
              tag.toLowerCase().includes(new_tag_name.toLowerCase()),
            )
            .filter((tag) => !sortable_items.find((i) => i.name == tag))
            .slice(0, 30)
            .map((tag) => (
              <button
                key={tag}
                className={styles.suggestions__items__item}
                onClick={() => {
                  if (sortable_items.length == props.max_tags) return
                  set_sortable_items([
                    ...sortable_items,
                    { id: Math.random(), name: tag, is_public: true },
                  ])
                  set_new_tag_name('')
                }}
                dangerouslySetInnerHTML={{
                  __html: highlight_typed_chars({
                    tag,
                    typed_chars: new_tag_name,
                  }),
                }}
              />
            ))}
      </div>
    </Simplebar>
  )

  return (
    <OutsideClickHandler
      disabled={!is_focused}
      onOutsideClick={() => {
        set_is_focused(false)
      }}
    >
      <div
        className={styles.container}
        onClick={() => {
          if (!is_focused) {
            ref.current.selectionStart = ref.current.value.length
            ref.current.selectionEnd = ref.current.value.length
          }
          ref.current?.focus()
        }}
      >
        {field}
        {suggestions}
      </div>
    </OutsideClickHandler>
  )
}

function escape_regex_chars(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function highlight_typed_chars(params: { tag: string; typed_chars: string }) {
  const escaped_chars = escape_regex_chars(params.typed_chars)
  const regex = new RegExp(
    escaped_chars.replace(
      /[a-zA-Z]/g,
      (m) => `[${m.toUpperCase()}${m.toLowerCase()}]`,
    ),
    'g',
  )
  const highlighted_tag = params.tag.replace(
    regex,
    (match) => `<mark>${match}</mark>`,
  )
  return highlighted_tag
}
