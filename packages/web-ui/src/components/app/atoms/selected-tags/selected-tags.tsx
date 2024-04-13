import styles from './selected-tags.module.scss'
import { system_values } from '@shared/constants/system-values'
import cn from 'classnames'
import { memo } from 'react'

export namespace SelectedTags {
  export type Props = {
    selected_tags: { name: string; id: number }[]
    on_selected_tag_click: (tagId: number) => void
  }
}

export const SelectedTags: React.FC<SelectedTags.Props> = memo(
  function SelectedTags(props) {
    return props.selected_tags.length ? (
      <div className={styles.container}>
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
          >
            <span>{tag.name}</span>
            <span>×</span>
          </button>
        ))}
      </div>
    ) : (
      <></>
    )
  },
  () => true,
)
