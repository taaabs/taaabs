import styles from './tags.module.scss'

export namespace Tags {
  export type Props = {
    tags: Record<string, number>
    onClick: (tag: string) => void
  }
}

export const Tags: React.FC<Tags.Props> = (props) => {
  return (
    <div className={styles.container}>
      {Object.entries(props.tags).map(([tag, yields]) => {
        const firstChar = tag.substring(0, 1)
        const firstTagOfChar = Object.keys(props.tags).find(
          (tag) => tag.substring(0, 1) == firstChar,
        )

        return (
          <>
            {firstTagOfChar == tag && (
              <div className={styles.container__firstChar}>{firstChar}</div>
            )}
            <button
              className={styles.container__tag}
              onClick={() => props.onClick(tag)}
              key={tag}
            >
              <span>{tag}</span>
              <span>{yields}</span>
            </button>
          </>
        )
      })}
    </div>
  )
}
