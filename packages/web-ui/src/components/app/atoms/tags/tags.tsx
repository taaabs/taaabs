import { memo, useState } from 'react'
import styles from './tags.module.scss'
import { useContextMenu } from 'use-context-menu'
import { Dropdown as UiCommon_Dropdown } from '@web-ui/components/common/dropdown'
import { StandardItem as UiCommon_Dropdown_StandardItem } from '@web-ui/components/common/dropdown/standard-item'

export namespace Tags {
  export type Tag = {
    name: string
    id: number
    yields: number
  }

  export type Props = {
    library_updated_at_timestamp_?: number
    tags_: Tag[]
    on_click_: (tag: number) => void
    library_url_: string
    on_tag_drag_start_?: (params: {
      id_: number
      name_: string
      yields_: number
    }) => void
    on_tag_rename_click_?: (tag_id: number) => void
    translations_: {
      rename_: string
    }
  }
}

export const Tags: React.FC<Tags.Props> = memo(
  function Tags(props) {
    const [context_menu_of_tag_id, set_context_menu_of_tag_id] =
      useState<number>()
    const { contextMenu, onContextMenu } = useContextMenu(
      <UiCommon_Dropdown>
        <UiCommon_Dropdown_StandardItem
          label={props.translations_.rename_}
          icon_variant="EDIT"
          on_click={() => {
            if (!context_menu_of_tag_id) return
            props.on_tag_rename_click_!(context_menu_of_tag_id)
          }}
        />
      </UiCommon_Dropdown>,
    )

    const first_chars_processed: string[] = []

    const new_tags_grouped: Tags.Tag[][] = []
    props.tags_.map((tag) => {
      const current_tag_first_char = tag.name.substring(0, 1)
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
        {contextMenu}
        {new_tags_grouped
          .sort((a, b) => {
            if (a[0].name.substring(0, 1) < b[0].name.substring(0, 1)) {
              return -1
            } else {
              return 1
            }
          })
          .map((group) => (
            <div className={styles.group} key={group[0].name.substring(0, 1)}>
              <div className={styles['first-char']}>
                <span>
                  {String.fromCodePoint(group[0].name.codePointAt(0)!)}
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
                        props.on_click_(tag.id)
                      }}
                      href={`${props.library_url_}?${search_params.toString()}`}
                      onMouseDown={() => {
                        if (!props.on_tag_drag_start_) return
                        props.on_tag_drag_start_({
                          id_: tag.id,
                          name_: tag.name,
                          yields_: tag.yields,
                        })
                      }}
                      draggable={false}
                      onContextMenu={(e) => {
                        if ('ontouchstart' in window) {
                          e.preventDefault()
                        } else if (props.on_tag_rename_click_) {
                          set_context_menu_of_tag_id(tag.id)
                          onContextMenu(e)
                        }
                      }}
                    >
                      <span>{tag.name}</span>
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
