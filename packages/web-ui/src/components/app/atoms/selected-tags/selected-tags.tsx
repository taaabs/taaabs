import { memo } from 'react'
import styles from './selected-tags.module.scss'

export namespace Tags {
  export type Props = {
    selected_tags: { name: string; id: number }[]
    on_selected_tag_click: (tagId: number) => void
    is_fetching_bookmarks?: boolean
  }
}

export const SelectedTags: React.FC<Tags.Props> = memo(
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
  (o, n) => o.is_fetching_bookmarks == n.is_fetching_bookmarks,
)
