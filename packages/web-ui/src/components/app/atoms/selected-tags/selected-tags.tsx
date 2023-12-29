import { memo } from 'react'
import styles from './selected-tags.module.scss'

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
        {props.selected_tags.map((tag) => (
          <button
            className={styles.container__tag}
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
)
