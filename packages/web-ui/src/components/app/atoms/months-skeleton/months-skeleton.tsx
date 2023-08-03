import Skeleton from 'react-loading-skeleton'
import styles from './months-skeleton.module.scss'

export const MonthsSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton />
    </div>
  )
}
