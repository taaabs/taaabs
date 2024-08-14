import styles from './landing.module.scss'

export namespace Landing {
  export type Props = {
    slot_logo: React.ReactNode
    slot_desktop_navigation: React.ReactNode
    slot_desktop_user: React.ReactNode
    slot_mobile_navigation: React.ReactNode
    children?: React.ReactNode
  }
}

export const Landing: React.FC<Landing.Props> = (props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.header__inner}>
          {props.slot_logo}
          <div className={styles['header__inner__desktop-nav-and-user']}>
            {props.slot_desktop_navigation}
            {props.slot_desktop_user}
          </div>
          <div className={styles.header__inner__burger}>[BURGER]</div>
        </div>
      </header>
      {props.children}
    </div>
  )
}
