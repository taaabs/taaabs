import React from 'react'
import styles from './Landing.module.scss'

export namespace LandingTypes {
  export type Props = {
    slotLogo: React.ReactNode
    slotDesktopNavigation: React.ReactNode
    slotDesktopUser: React.ReactNode
    slotMobileNavigation: React.ReactNode
    slotFooter: React.ReactNode
    children?: React.ReactNode
  }
}

export const Landing: React.FC<LandingTypes.Props> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.header__logo}>{props.slotLogo}</div>
          <div className={styles.header__desktopNavigation}>
            {props.slotDesktopNavigation}
          </div>
          <div className={styles.header__desktopUser}>
            {props.slotDesktopUser}
          </div>
          <div className={styles.header__burger}>[BURGER]</div>
        </header>
        {props.children}
      </div>
      {props.slotFooter}
    </>
  )
}
