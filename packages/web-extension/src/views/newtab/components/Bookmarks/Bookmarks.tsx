import { Button as UiButton } from '@web-ui/components/Button'
import styles from './Bookmarks.module.scss'

export const Bookmarks: React.FC = () => {
  return (
    <div className={styles.container}>
      <span className={styles.load}>
        <UiButton href={`https://taaabs.com/library`} is_outlined={true}>
          Load bookmarks
        </UiButton>
      </span>
      <div className={styles.bookmark} />
      <div className={styles.bookmark} />
    </div>
  )
}
