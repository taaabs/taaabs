import { Icon } from '@web-ui/components/Icon'
import styles from './HeaderMobile.module.scss'
import { LogoForHeader } from '@web-ui/components/LogoForHeader'

export namespace HeaderMobile {
  export type Props = {
    slot_navigation: React.ReactNode
    on_menu_click: () => void
  }
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return (
    <div className={styles.container}>
      <button className={styles.left__menu} onClick={props.on_menu_click}>
        <Icon variant="MENU" />
      </button>

      <div className={styles.logo}>
        <LogoForHeader href="/" />
      </div>

      <div>{props.slot_navigation}</div>
    </div>
  )
}
