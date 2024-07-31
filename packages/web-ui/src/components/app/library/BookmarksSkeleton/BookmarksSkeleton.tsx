import Skeleton from 'react-loading-skeleton'
import styles from './BookmarksSkeleton.module.scss'

export const BookmarksSkeleton: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  )
}