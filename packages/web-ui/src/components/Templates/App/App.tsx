import styles from './App.module.scss'

export namespace AppTypes {
  export type Props = {
    slotHeaderDesktop: React.ReactNode
    slotHeaderMobile: React.ReactNode
    slotBottomNavigationBar: React.ReactNode
    slotFooterDesktop: React.ReactNode
    children?: React.ReactNode
  }
}

export const App: React.FC<AppTypes.Props> = (props) => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__desktop}>{props.slotHeaderDesktop}</div>
        <div className={styles.header__mobile}>{props.slotHeaderMobile}</div>
      </div>
      {props.children}
      <div className={styles['footer-desktop']}>{props.slotFooterDesktop}</div>
      <div className={styles['mobile-bottom-navigation-bar']}>
        {props.slotBottomNavigationBar}
      </div>
    </>
  )
}
