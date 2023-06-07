import Link from 'next/link'
import { Icon } from '@web-ui/components/Atoms/Icon'
import styles from './LogoForHeader.module.scss'

export const LogoForHeader: React.FC = () => {
  return (
    <Link className={styles.logo} href="/">
      <Icon variant="LOGO" />
      <span>taaabs</span>
    </Link>
  )
}
