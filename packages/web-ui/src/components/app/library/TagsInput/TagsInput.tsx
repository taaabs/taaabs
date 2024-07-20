import { useRef, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import styles from './TagsInput.module.scss'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import cn from 'classnames'
import { Icon } from '@web-ui/components/common/particles/icon'
import { system_values } from '@shared/constants/system-values'
import OutsideClickHandler from 'react-outside-click-handler'

export namespace TagsInput {
  type Tag = {
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
    on_focus: () => void
    translations: {
      enter_tag_name: string
      add: string
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
  const ref = useRef<HTMLInputElement>(null)
  const [new_tag_name, set_new_tag_name] = useState('')
  const [input_width, set_input_width] = useState<number>()
  const [is_focused, set_is_focused] = useState<boolean>()
  const [show_dropdown, set_show_dropdown] = useState<boolean>()

  useUpdateEffect(() => {
    props.on_selected_tags_update(
      sortable_items.map((i) => ({ name: i.name, is_public: i.is_public })),
    )
  }, [sortable_items])

  useUpdateEffect(() => {
    // Set input width dynamically.
    const span = document.createElement('span')
    document.body.appendChild(span)
    const inputStyles = window.getComputedStyle(ref.current!)
    span.textContent = ref.current!.value
    span.style.whiteSpace = 'pre'
    const width = span.offsetWidth + parseFloat(inputStyles.paddingLeft)
    document.body.removeChild(span)
    set_input_width(width + 10)

    // Hanlde keyboard keys.
    const handle_keyboard = (event: KeyboardEvent) => {
      if (event.code == 'Enter') {
        if (
          sortable_items.length == props.max_tags ||
          !new_tag_name.trim().length
        )
          return
        if (!sortable_items.find((i) => i.name == new_tag_name.trim())) {
          set_sortable_items([
            ...sortable_items,
            { id: Math.random(), name: new_tag_name.trim() },
          ])
          set_new_tag_name('')
        }
      } else if (event.code == 'Tab') {
        // apply first suggestion
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
            { id: Math.random(), name: first_suggestion },
          ])
          set_new_tag_name('')
        } else {
          set_is_focused(false)
          set_show_dropdown(false)
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

  // Control dropdown visibility.
  useUpdateEffect(() => {
    if (
      is_focused &&
      (!new_tag_name || new_tag_name.trim().length) &&
      ((!new_tag_name &&
        props.recent_tags.filter(
          (recent_tag) => !sortable_items.find((i) => i.name == recent_tag),
        ).length) ||
        (new_tag_name &&
          props.all_tags
            .filter((tag) => tag.includes(new_tag_name))
            .filter((tag) => !sortable_items.find((i) => i.name == tag))
            .length) ||
        (new_tag_name && !props.all_tags.find((tag) => tag == new_tag_name)))
    ) {
      set_show_dropdown(true)
    } else {
      set_show_dropdown(false)
    }
  }, [
    new_tag_name,
    is_focused,
    sortable_items,
    props.all_tags,
    props.recent_tags,
  ])

  useUpdateEffect(() => {
    if (is_focused) {
      props.on_focus()
    }
  }, [is_focused])

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
      filter={`.${styles.input}`}
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
                <Icon variant="GLOBE" />
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
              <Icon variant="REMOVE" />
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
        className={styles.input}
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

  const dropdown = (
    <div
      className={cn(styles.dropdown, {
        [styles['dropdown--visible']]: show_dropdown,
      })}
    >
      <div className={styles.dropdown__items}>
        {/* Recent tags. */}
        {!new_tag_name &&
          props.recent_tags
            .filter(
              (recent_tag) => !sortable_items.find((i) => i.name == recent_tag),
            )
            .slice(0, 12)
            .map((recent_tag) => (
              <button
                key={recent_tag}
                className={styles.dropdown__items__item}
                onClick={() => {
                  if (sortable_items.length == props.max_tags) return
                  set_sortable_items([
                    ...sortable_items,
                    { id: Math.random(), name: recent_tag },
                  ])
                }}
              >
                {recent_tag}
              </button>
            ))}
        {/* Filtered out all tags. */}
        {new_tag_name &&
          props.all_tags
            .filter((tag) =>
              tag.toLowerCase().includes(new_tag_name.toLowerCase()),
            )
            .filter((tag) => !sortable_items.find((i) => i.name == tag))
            .slice(0, 12)
            .map((tag) => (
              <button
                key={tag}
                className={styles.dropdown__items__item}
                onClick={() => {
                  if (sortable_items.length == props.max_tags) return
                  set_sortable_items([
                    ...sortable_items,
                    { id: Math.random(), name: tag },
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
      {/* Create new tag (shown when no match in filtered out all tags was found). */}
      {new_tag_name.trim() && (
        <button
          className={styles.dropdown__create}
          onClick={() => {
            if (sortable_items.length == props.max_tags) return
            set_sortable_items([
              ...sortable_items,
              { id: Math.random(), name: new_tag_name.trim() },
            ])
            set_new_tag_name('')
          }}
        >
          {props.translations.add} "<strong>{new_tag_name}</strong>"
        </button>
      )}
    </div>
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
          ref.current?.focus()
        }}
      >
        {field}
        {dropdown}
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
    (match) => `<strong>${match}</strong>`,
  )
  return highlighted_tag
}
