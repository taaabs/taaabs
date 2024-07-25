import styles from './UpsertBookmarkContent.module.scss'

export namespace UpsertBookmarkContent {
  export type Props = {
    slot_title: React.ReactNode
    slot_note: React.ReactNode
    slot_tags: React.ReactNode
    slot_links: React.ReactNode
  }
}

export const UpsertBookmarkContent: React.FC<UpsertBookmarkContent.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.slot_title}</div>
      <div className={styles.note}>{props.slot_note}</div>
      <div className={styles.tags}>{props.slot_tags}</div>
      <div className={styles.links}>{props.slot_links}</div>
    </div>
  )
}
