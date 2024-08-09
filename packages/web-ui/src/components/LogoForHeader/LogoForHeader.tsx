import Link from 'next/link'
import styles from './LogoForHeader.module.scss'
import cn from 'classnames'
import { Icon as UiIcon } from '../Icon'

export namespace LogoForHeader {
  export type Props = {
    is_large?: boolean
    href: string
  }
}

export const LogoForHeader: React.FC<LogoForHeader.Props> = (props) => {
  return (
    <Link
      className={cn(styles.logo, { [styles['logo--large']]: props.is_large })}
      href={props.href}
    >
      <div className={styles.logo__icon}>
        <UiIcon variant="LOGO" />
      </div>
      <span>taaabs</span>
    </Link>
  )
}
