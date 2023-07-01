import Link from 'next/link'
import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './logo-for-header.module.scss'
import cn from 'classnames'

export namespace LogoForHeaderTypes {
  export type Props = {
    isLarge?: boolean
    href: string
  }
}

export const LogoForHeader: React.FC<LogoForHeaderTypes.Props> = (props) => {
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
