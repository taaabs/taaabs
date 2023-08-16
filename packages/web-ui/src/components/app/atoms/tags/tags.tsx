import { memo } from 'react'
import styles from './tags.module.scss'

export namespace Tags {
  export type Props = {
    tags: Record<string, number>
    onClick: (tag: string) => void
  }
}

export const Tags: React.FC<Tags.Props> = memo(
  (props) => {
    const renderedFirstChars: Set<string> = new Set([])

    return (
      <div className={styles.container}>
        {Object.entries(props.tags).map(([tag, yields]) => {
          let displayFirstChar = false
          const firstChar = tag.substring(0, 1)
          if (!renderedFirstChars.has(firstChar)) {
            renderedFirstChars.add(firstChar)
            displayFirstChar = true
          }

          return (
            <>
              {displayFirstChar && renderedFirstChars.size > 1 && (
                <div className={styles.break} />
              )}
              <div className={styles.item} key={tag}>
                {displayFirstChar && (
                  <div className={styles.item__firstChar}>{firstChar}</div>
                )}
                <button
                  className={styles.item__tag}
                  onClick={() => props.onClick(tag)}
                >
                  <span>{tag.replaceAll('-', ' ')}</span>
                  <span>{yields}</span>
                </button>
              </div>
            </>
          )
        })}
      </div>
    )
  },
  (o, n) => JSON.stringify(o.tags) == JSON.stringify(n.tags),
)
