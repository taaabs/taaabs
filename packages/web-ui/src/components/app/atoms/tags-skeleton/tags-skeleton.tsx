import Skeleton from 'react-loading-skeleton'
import styles from './tags-skeleton.module.scss'

export const TagsSkeleton = () => {
  // console.log(
  //   [...new Array(40)].map(() => get_random_number_in_between(40, 90)),
  // )
  const widths = [
    46, 80, 61, 69, 90, 49, 46, 81, 67, 43, 84, 72, 79, 41, 53, 56, 71, 46, 65,
    45, 64, 87, 78, 69, 47, 63, 50, 66, 70, 81, 55, 52, 83, 85, 48, 52, 89, 45,
    54, 69,
  ]
  return (
    <div className={styles.container}>
      {widths.map((width, i) => (
        <Skeleton width={width} key={i} />
      ))}
    </div>
  )
}

// function get_random_number_in_between(min: number, max: number) {
//   return Math.round(Math.random() * (max - min) + min)
// }
