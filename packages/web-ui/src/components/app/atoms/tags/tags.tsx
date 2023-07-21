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
      {Object.entries(props.tags).map(([tag, yields]) => (
        <button
          className={styles.container__tag}
          onClick={() => props.onClick(tag)}
        >
          <span>{tag}</span>
          <span>{yields}</span>
        </button>
      ))}
    </div>
  )
}
