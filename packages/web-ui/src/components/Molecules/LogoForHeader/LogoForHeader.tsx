import Link from 'next/link'
import { Icon } from '@web-ui/components/Atoms/Icon'
import styles from './LogoForHeader.module.scss'
import cn from 'classnames'

export namespace LogoForHeaderTypes {
  export type Props = {
    isLarge?: boolean
  }
}

export const LogoForHeader: React.FC<LogoForHeaderTypes.Props> = (props) => {
  return (
    <Link
      className={cn(styles.logo, { [styles['logo--large']]: props.isLarge })}
      href="/"
    >
      <Icon variant="LOGO" />
      <span>taaabs</span>
    </Link>
  )
}
