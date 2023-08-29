import Skeleton from 'react-loading-skeleton'
import styles from './tags-skeleton.module.scss'
import { memo } from 'react'

export const TagsSkeleton = memo(() => {
  return (
    <div className={styles.container}>
      {[...new Array(40)].map((_, i) => (
        <Skeleton width={_getRandomNumberInBetween(40, 90)} key={i} />
      ))}
    </div>
  )
})

function _getRandomNumberInBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}
