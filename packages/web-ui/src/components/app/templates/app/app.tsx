import styles from './app.module.scss'

export namespace App {
  export type Props = {
    slot_AppHeaderDesktop: React.ReactNode
    slot_AppHeaderMobile: React.ReactNode
    slot_BottomNavigationBar: React.ReactNode
    children?: React.ReactNode
  }
}

export const App: React.FC<App.Props> = (props) => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__desktop}>
          {props.slot_AppHeaderDesktop}
        </div>
        <div className={styles.header__mobile}>
          {props.slot_AppHeaderMobile}
        </div>
      </div>
      {props.children}
      <div className={styles['mobile-bottom-navigation-bar']}>
        {props.slot_BottomNavigationBar}
      </div>
    </>
  )
}
