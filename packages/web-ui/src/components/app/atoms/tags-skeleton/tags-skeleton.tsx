import Skeleton from 'react-loading-skeleton'
import styles from './tags-skeleton.module.scss'
import { memo } from 'react'

export const TagsSkeleton = memo(() => {
  return (
    <div className={styles.container}>
      {[...new Array(40)].map(() => (
        <Skeleton width={_getRandomArbitrary(30, 70)} />
      ))}
    </div>
  )
})

function _getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}
