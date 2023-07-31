import Link from 'next/link'
import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './logo-for-header.module.scss'
import cn from 'classnames'

export namespace LogoForHeader {
  export type Props = {
    isLarge?: boolean
    href: string
  }
}

export const LogoForHeader: React.FC<LogoForHeader.Props> = (props) => {
  return (
    <Link
      className={cn(styles.logo, { [styles['logo--large']]: props.isLarge })}
      href={props.href}
    >
      <Icon variant="LOGO" />
      <span>taaabs</span>
    </Link>
  )
}
