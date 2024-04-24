import Skeleton from 'react-loading-skeleton'
import styles from './segmented-buttons-skeleton.module.scss'

export const SegmentedButtonsSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  )
}
