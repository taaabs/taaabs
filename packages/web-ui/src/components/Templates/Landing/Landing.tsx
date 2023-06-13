import React from 'react'
import styles from './Landing.module.scss'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'

export namespace LandingTypes {
  export type Props = {
    slotRightSide: React.ReactNode
    slotMobileNavigation: React.ReactNode
    children?: React.ReactNode
    footerSlot: React.ReactNode
  }
}

export const Landing: React.FC<LandingTypes.Props> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <LogoForHeader isLarge={true} />
          {props.slotRightSide}
        </header>
        {props.children}
      </div>
      {props.footerSlot}
    </>
  )
}
