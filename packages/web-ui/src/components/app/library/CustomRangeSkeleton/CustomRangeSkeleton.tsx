import Skeleton from 'react-loading-skeleton'
import styles from './CustomRangeSkeleton.module.scss'

export const CustomRangeSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton />
    </div>
  )
}
