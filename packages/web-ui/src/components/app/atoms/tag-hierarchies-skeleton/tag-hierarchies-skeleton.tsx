import Skeleton from 'react-loading-skeleton'
import styles from './tag-hierarchies-skeleton.module.scss'

export const TagHierarchiesSkeleton = () => {
  const widths = [200, 180, 140, 160, 120]
  return (
    <div className={styles.container}>
      {widths.map((width, i) => (
        <Skeleton width={width} key={i} />
      ))}
    </div>
  )
}