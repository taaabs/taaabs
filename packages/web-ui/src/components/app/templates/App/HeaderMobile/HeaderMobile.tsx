import { Icon } from '@web-ui/components/Icon'
import styles from './HeaderMobile.module.scss'
import Link from 'next/link'

export namespace HeaderMobile {
  export type Props = {
    slot_navigation: React.ReactNode
    on_menu_click: () => void
  }
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <button
          className={styles['left__menu-button']}
          onClick={props.on_menu_click}
        >
          <Icon variant="MENU" />
        </button>
        <Link className={styles.left__logo} href={'/'}>
          <Icon variant="LOGO" />
        </Link>
      </div>

      <div>{props.slot_navigation}</div>
    </div>
  )
}
