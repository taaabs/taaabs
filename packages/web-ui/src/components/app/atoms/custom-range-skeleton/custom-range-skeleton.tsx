import Skeleton from 'react-loading-skeleton'
import styles from './custom-range-skeleton.module.scss'

export const CustomRangeSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton />
    </div>
  )
}
