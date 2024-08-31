import { Icon } from '@web-ui/components/Icon'
import styles from './Footer.module.scss'

export const Footer: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Icon variant="TAAABS" />
      </div>
    </div>
  )
}
