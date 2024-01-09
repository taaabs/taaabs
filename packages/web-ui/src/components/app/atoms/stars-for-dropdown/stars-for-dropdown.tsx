import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './stars-for-dropdown.module.scss'

export namespace StarsForDropdown {
  export type Props = {
    stars: number
  }
}

export const StarsForDropdown: React.FC<StarsForDropdown.Props> = (props) => {
  return (
    <div className={styles.container}>
      {[...new Array(props.stars)].map((_, i) => (
        <Icon variant="STAR_FILLED" key={i} />
      ))}
    </div>
  )
}
