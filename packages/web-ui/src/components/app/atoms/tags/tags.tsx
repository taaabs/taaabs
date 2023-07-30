import styles from './tags.module.scss'

export namespace Tags {
  export type Props = {
    tags: Record<string, number>
    selectedTags: string[]
    onSelectedTagClick: (tag: string) => void
    onClick: (tag: string) => void
  }
}

export const Tags: React.FC<Tags.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.selectedTags.length > 0 && (
        <div className={styles.selected}>
          {props.selectedTags.map((tag) => (
            <button
              className={styles.selected__tag}
              onClick={() => props.onSelectedTagClick(tag)}
            >
              <span>{tag}</span>
              <span>✗</span>
            </button>
          ))}
        </div>
      )}
      <div className={styles.unselected}>
        {Object.entries(props.tags).map(([tag, yields]) => {
          const firstChar = tag.substring(0, 1)
          const firstTagOfChar = Object.keys(props.tags).find(
            (tag) => tag.substring(0, 1) == firstChar,
          )

          return (
            <>
              {firstTagOfChar == tag && (
                <div className={styles.unselected__firstChar}>
                  <div className={styles.unselected__firstChar__inner}>
                    {firstChar}
                  </div>
                </div>
              )}
              <button
                className={styles.unselected__tag}
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
    </div>
  )
}
