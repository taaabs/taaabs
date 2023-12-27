import Link from 'next/link'
import { Ui } from '@web-ui'
import styles from './logo-for-header.module.scss'
import cn from 'classnames'

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
      <Ui.Common.Particles.Icon variant="LOGO" />
      <span>taaabs</span>
    </Link>
  )
}
