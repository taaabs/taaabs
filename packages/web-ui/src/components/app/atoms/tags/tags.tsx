import { memo } from 'react'
import styles from './tags.module.scss'

export namespace Tags {
  export type Props = {
    tags: Record<string, { id: number; yields: number }>
    on_click: (tag: number) => void
  }
}

export const Tags: React.FC<Tags.Props> = memo(
  (props) => {
    const rendered_first_chars: Set<string> = new Set([])

    return (
      <div className={styles.container}>
        {Object.entries(props.tags).map(([tag, details]) => {
          let display_first_char = false
          const first_char = tag.substring(0, 1)
          if (!rendered_first_chars.has(first_char)) {
            rendered_first_chars.add(first_char)
            display_first_char = true
          }

          return (
            <>
              {display_first_char && rendered_first_chars.size > 1 && (
                <div className={styles.break} />
              )}
              <div className={styles.item} key={tag}>
                {display_first_char && (
                  <div className={styles.item__firstChar}>{first_char}</div>
                )}
                <button
                  className={styles.item__tag}
                  onClick={() => props.on_click(details.id)}
                >
                  <span>{tag}</span>
                  <span>{details.yields}</span>
                </button>
              </div>
            </>
          )
        })}
      </div>
    )
  },
  (o, n) =>
    JSON.stringify(o.tags) == JSON.stringify(n.tags) &&
    o.on_click == n.on_click,
)
