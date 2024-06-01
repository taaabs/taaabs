import styles from './delete.module.scss'

namespace Delete {
  export type Props = {
    text: string
    bookmark_title?: string
  }
}

export const Delete: React.FC<Delete.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div>{props.text}</div>
      {props.bookmark_title && (
        <div className={styles['bookmark-title']}>{props.bookmark_title}</div>
      )}
    </div>
  )
}
