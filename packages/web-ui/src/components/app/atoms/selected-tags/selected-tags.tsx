import styles from './selected-tags.module.scss'

export namespace Tags {
  export type Props = {
    selectedTags: { name: string; id: number }[]
    onSelectedTagClick: (tagId: number) => void
  }
}

export const SelectedTags: React.FC<Tags.Props> = (props) => {
  return props.selectedTags.length ? (
    <div className={styles.container}>
      {props.selectedTags.map((tag) => (
        <button
          className={styles.container__tag}
          onClick={() => props.onSelectedTagClick(tag.id)}
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
}
