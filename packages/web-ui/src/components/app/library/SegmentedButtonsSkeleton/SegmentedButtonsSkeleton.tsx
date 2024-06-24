import Skeleton from 'react-loading-skeleton'
import styles from './SegmentedButtonsSkeleton.module.scss'

export const SegmentedButtonsSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  )
}
