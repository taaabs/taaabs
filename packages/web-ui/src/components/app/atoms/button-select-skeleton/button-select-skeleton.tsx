import Skeleton from 'react-loading-skeleton'
import styles from './button-select-skeleton.module.scss'

export const ButtonSelectSkeleton = () => {
  return (
    <div className={styles.container}>
      <Skeleton />
    </div>
  )
}
