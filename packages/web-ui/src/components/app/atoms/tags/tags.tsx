import { memo } from 'react'
import styles from './tags.module.scss'

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
    on_tag_drag_start?: (params: {
      id: number
      name: string
      yields: number
    }) => void
  }
}

export const Tags: React.FC<Tags.Props> = memo(
  function Tags(props) {
    const first_chars_processed: string[] = []
    const new_tags_grouped: Tags.Tag[][] = []
    props.tags.map((tag) => {
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
                        yields: tag.yields,
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
  (o, n) =>
    o.library_updated_at_timestamp == n.library_updated_at_timestamp &&
    o.tags == n.tags,
)
