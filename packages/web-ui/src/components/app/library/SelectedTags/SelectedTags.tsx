import styles from './SelectedTags.module.scss'
import { system_values } from '@shared/constants/system-values'
import cn from 'classnames'
import { memo, useState } from 'react'
import { useContextMenu } from 'use-context-menu'
import { Dropdown as Ui_Dropdown } from '@web-ui/components/Dropdown'
import { StandardItem as Ui_Dropdown_StandardItem } from '@web-ui/components/Dropdown/StandardItem'

export namespace SelectedTags {
  export type Props = {
    selected_tags: { name: string; id: number }[]
    on_selected_tag_click: (tagId: number) => void
    on_tag_rename_click?: (tag_id: number) => void
    translations: {
      rename: string
    }
  }
}

export const SelectedTags: React.FC<SelectedTags.Props> = memo(
  function SelectedTags(props) {
    const [context_menu_of_tag_id, set_context_menu_of_tag_id] =
      useState<number>()
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

    return props.selected_tags.length ? (
      <div className={styles.container}>
        {contextMenu}
        {props.selected_tags.length >=
          system_values.library.max_selected_tags - 1 && (
          <div
            className={cn(styles.count, {
              [styles['count--limit-reached']]:
                props.selected_tags.length ==
                system_values.library.max_selected_tags,
            })}
          >{`${props.selected_tags.length}/${system_values.library.max_selected_tags}`}</div>
        )}
        {props.selected_tags.map((tag) => (
          <button
            className={styles.tag}
            onClick={() => props.on_selected_tag_click(tag.id)}
            key={tag.id}
            onContextMenu={(e) => {
              if ('ontouchstart' in window) {
                e.preventDefault()
              } else if (props.on_tag_rename_click) {
                set_context_menu_of_tag_id(tag.id)
                onContextMenu(e)
              }
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    ) : (
      <></>
    )
  },
  () => true,
)
