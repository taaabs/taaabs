import { memo } from 'react'
import styles from './tags.module.scss'

export namespace Tags {
  export type Props = {
    tags: Record<string, { id: number; yields: number }>
    on_click: (tag: number) => void
  }
}

/**
 * Do not refactor memo to useState as it defers rendering
 * to the next frame causing render jitter.
 */

export const Tags: React.FC<Tags.Props> = memo(
  function Tags(props) {
    const first_chars_processed: string[] = []
    const new_tags_grouped: string[][] = []
    Object.entries(props.tags).map(([tag_name]) => {
      const current_tag_first_char = tag_name.substring(0, 1)
      first_chars_processed.find(
        (group) => current_tag_first_char == group[0].substring(0, 1),
      )
        ? new_tags_grouped[new_tags_grouped.length - 1].push(tag_name)
        : new_tags_grouped.push([tag_name]) &&
          first_chars_processed.push(current_tag_first_char)
    })

    return (
      <div className={styles.container}>
        {new_tags_grouped.map((group) => (
          <div className={styles.group} key={group[0].substring(0, 1)}>
            <div className={styles.firstChar}>
              <span>{group[0].substring(0, 1)}</span>
            </div>
            {group.map((tag_name) => (
              <button
                className={styles.tag}
                onClick={() => props.on_click(props.tags[tag_name].id)}
                key={tag_name}
              >
                <span>{tag_name}</span>
                {props.tags[tag_name] && (
                  <span> {props.tags[tag_name].yields}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  },
  (o, n) =>
    o.on_click == n.on_click &&
    JSON.stringify(o.tags) == JSON.stringify(n.tags),
)
