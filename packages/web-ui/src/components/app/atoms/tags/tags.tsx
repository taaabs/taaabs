import { memo } from 'react'
import styles from './tags.module.scss'

export namespace Tags {
  export type Props = {
    results_fetched_at_timestamp: number // Synchonizes UI updates.
    tags: Record<string, { id: number; yields: number }>
    on_click: (tag: number) => void
    on_tag_drag_start?: (params: { id: number; name: string }) => void
  }
}

/**
 * Do not refactor memo to useState as it defers rendering
 * to the next frame causing render jitter.
 */

type Tag = {
  name: string
  id: number
  yields: number
}

export const Tags: React.FC<Tags.Props> = memo(
  function Tags(props) {
    const first_chars_processed: string[] = []
    const new_tags_grouped: Tag[][] = []
    Object.entries(props.tags).map(([name, details]) => {
      const current_tag_first_char = name.substring(0, 1)
      first_chars_processed.find(
        (group) => current_tag_first_char == group[0].substring(0, 1),
      )
        ? new_tags_grouped[new_tags_grouped.length - 1].push({
            name,
            id: details.id,
            yields: details.yields,
          })
        : new_tags_grouped.push([
            { name, yields: details.yields, id: details.id },
          ]) && first_chars_processed.push(current_tag_first_char)
    })

    return (
      <div className={styles.container}>
        {new_tags_grouped.map((group) => (
          <div className={styles.group} key={group[0].name.substring(0, 1)}>
            <div className={styles['first-char']}>
              <span>{group[0].name.substring(0, 1)}</span>
            </div>
            {group
              .sort((a, b) => b.yields - a.yields)
              .map((tag) => (
                <button
                  className={styles.tag}
                  onClick={() => props.on_click(tag.id)}
                  key={tag.id}
                  onMouseDown={() => {
                    if (!props.on_tag_drag_start) return
                    props.on_tag_drag_start({
                      id: tag.id,
                      name: tag.name,
                    })
                  }}
                >
                  <span>{tag.name}</span>
                  <span> {tag.yields}</span>
                </button>
              ))}
          </div>
        ))}
      </div>
    )
  },
  (o, n) => o.results_fetched_at_timestamp == n.results_fetched_at_timestamp,
)
