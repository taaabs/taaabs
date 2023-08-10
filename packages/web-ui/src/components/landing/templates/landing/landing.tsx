import React from 'react'
import styles from './landing.module.scss'

export namespace Landing {
  export type Props = {
    slotLogo: React.ReactNode
    slotDesktopNavigation: React.ReactNode
    slotDesktopUser: React.ReactNode
    slotMobileNavigation: React.ReactNode
    children?: React.ReactNode
  }
}

export const Landing: React.FC<Landing.Props> = (props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.header__inner}>
          {props.slotLogo}
          <div className={styles.header__inner__desktopNavAndUser}>
            {props.slotDesktopNavigation}
            {props.slotDesktopUser}
          </div>
          <div className={styles.header__inner__burger}>[BURGER]</div>
        </div>
      </header>
      {props.children}
    </div>
  )
}
