import React from 'react'
import styles from './Landing.module.scss'

export namespace LandingTypes {
  export type Props = {
    slotDesktopNavigation: React.ReactNode
    slotMobileNavigation: React.ReactNode
    slotLogo: React.ReactNode
    children?: React.ReactNode
    slotFooter: React.ReactNode
  }
}

export const Landing: React.FC<LandingTypes.Props> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          {props.slotLogo}
          <div className={styles.header__desktopNavigation}>
            {props.slotDesktopNavigation}
          </div>
          <div className={styles.header__mobileNavigation}>
            {props.slotMobileNavigation}
          </div>
        </header>
        {props.children}
      </div>
      {props.slotFooter}
    </>
  )
}
