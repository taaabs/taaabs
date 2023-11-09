import Skeleton from 'react-loading-skeleton'
import styles from './tags-skeleton.module.scss'
import { useEffect, useState } from 'react'

export const TagsSkeleton = () => {
  const [widths, set_widths] = useState<number[]>([])

  useEffect(() => {
    set_widths(
      [...new Array(40)].map(() => get_random_number_in_between(40, 90)),
    )
  }, [])

  return (
    <div className={styles.container}>
      {widths.map((width, i) => (
        <Skeleton width={width} key={i} />
      ))}
    </div>
  )
}

function get_random_number_in_between(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}
