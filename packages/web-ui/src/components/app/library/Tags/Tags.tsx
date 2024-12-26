import { memo, useState } from 'react'
import styles from './Tags.module.scss'
import { useContextMenu } from 'use-context-menu'
import { Dropdown as Ui_Dropdown } from '@web-ui/components/Dropdown'
import { StandardItem as Ui_Dropdown_StandardItem } from '@web-ui/components/Dropdown/StandardItem'
import { Icon as UiIcon } from '@web-ui/components/Icon'
import cn from 'classnames'

export namespace Tags {
  export type Tag = {
    name: string
    id: number
    yields: number
  }

  export type Props = {
    library_updated_at_timestamp?: number
    tags: Tag[]
    on_click: (tag: number) => void
    library_url: string
    on_tag_drag_start?: (params: {
      id: number
      name: string
      yields: number
    }) => void
    on_tag_rename_click?: (tag_id: number) => void
    translations: {
      rename: string
    }
  }
}

export const Tags: React.FC<Tags.Props> = memo(
  function Tags(props) {
    const [context_menu_of_tag_id, set_context_menu_of_tag_id] =
      useState<number>()
    const [search_query, set_search_query] = useState<string>()
    const [is_search_focused, set_is_search_focused] = useState<boolean>(false)

    const { contextMenu, onContextMenu } = useContextMenu(
      <Ui_Dropdown>
        <Ui_Dropdown_StandardItem
          label={props.translations.rename}
          icon_variant="EDIT"
          on_click={() => {
            if (!context_menu_of_tag_id) return
            props.on_tag_rename_click!(context_menu_of_tag_id)
          }}
        />
      </Ui_Dropdown>,
    )

    const clear_search_query = () => {
      set_search_query('')
    }

    const filtered_tags = props.tags.filter((tag) => {
      if (!search_query) return true
      return tag.name.toLowerCase().includes(search_query.toLowerCase())
    })

    const highlight_matching_text = (text: string, query: string) => {
      if (!query) return text

      const regex = new RegExp(`(${query})`, 'gi')
      return text
        .split(regex)
        .map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index}>{part}</mark>
          ) : (
            part
          ),
        )
    }

    const first_chars_processed: string[] = []
    const new_tags_grouped: Tags.Tag[][] = []

    filtered_tags.map((tag) => {
      const current_tag_first_char = tag.name.toLowerCase().substring(0, 1)
      const idx = first_chars_processed.findIndex(
        (first_char) => first_char == current_tag_first_char,
      )
      idx != -1
        ? new_tags_grouped[idx].push(tag)
        : new_tags_grouped.push([tag]) &&
          first_chars_processed.push(current_tag_first_char)
    })

    return (
      <div className={styles.container}>
        {filtered_tags.length > 0 && (
          <div className={cn(styles.search, {
              [styles.search__focused]: is_search_focused,
            })}>
            <UiIcon variant="SEARCH" />
            <input
              type="text"
              placeholder="Search tags..."
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              onFocus={() => set_is_search_focused(true)}
              onBlur={() => set_is_search_focused(false)}
              className={is_search_focused ? 'focused' : ''}
            />
            {search_query && (
              <button
                className={styles.search__clear}
                onClick={clear_search_query}
              >
                <UiIcon variant="ADD" />
              </button>
            )}
          </div>
        )}
        {contextMenu}
        {new_tags_grouped
          .sort((a, b) => {
            if (
              a[0].name.substring(0, 1).toLowerCase() <
              b[0].name.substring(0, 1).toLowerCase()
            ) {
              return -1
            } else {
              return 1
            }
          })
          .map((group) => (
            <div className={styles.group} key={group[0].name.substring(0, 1)}>
              <div className={styles['first-char']}>
                <span>
                  {String.fromCodePoint(
                    group[0].name.codePointAt(0)!,
                  ).toUpperCase()}
                </span>
              </div>
              {group
                .sort((a, b) => b.yields - a.yields)
                .map((tag) => {
                  const search_params = new URLSearchParams(
                    window.location.search,
                  )
                  const tags = search_params.get('t')?.split(',') || []
                  search_params.set('t', [...tags, tag.id].join(','))
                  return (
                    <a
                      key={tag.id}
                      className={styles.tag}
                      onClick={(e) => {
                        e.preventDefault()
                        props.on_click(tag.id)
                      }}
                      href={`${props.library_url}?${search_params.toString()}`}
                      onMouseDown={() => {
                        if (!props.on_tag_drag_start) return
                        props.on_tag_drag_start({
                          id: tag.id,
                          name: tag.name,
                          yields: tag.yields,
                        })
                      }}
                      draggable={false}
                      onContextMenu={(e) => {
                        if ('ontouchstart' in window) {
                          e.preventDefault()
                        } else if (props.on_tag_rename_click) {
                          set_context_menu_of_tag_id(tag.id)
                          onContextMenu(e)
                        }
                      }}
                    >
                      <span>
                        {highlight_matching_text(tag.name, search_query || '')}
                      </span>
                      <span> {tag.yields}</span>
                    </a>
                  )
                })}
            </div>
          ))}
      </div>
    )
  },
  () => true,
)
