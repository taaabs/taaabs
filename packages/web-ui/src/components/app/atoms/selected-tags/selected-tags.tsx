import styles from './selected-tags.module.scss'

export namespace Tags {
  export type Props = {
    selectedTags: string[]
    onSelectedTagClick: (tag: string) => void
  }
}

export const SelectedTags: React.FC<Tags.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.selectedTags.map((tag) => (
        <button
          className={styles.container__tag}
          onClick={() => props.onSelectedTagClick(tag)}
        >
          <span>{tag}</span>
          <span>×</span>
        </button>
      ))}
    </div>
  )
}
