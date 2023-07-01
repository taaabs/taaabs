import React from 'react'
import styles from './landing.module.scss'

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
          {props.slotLogo}
          <div className={styles.header__desktopNavAndUser}>
            {props.slotDesktopNavigation}
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
