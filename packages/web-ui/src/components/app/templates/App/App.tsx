import styles from './App.module.scss'

export namespace App {
  export type Props = {
    slot_header_desktop: React.ReactNode
    slot_header_mobile: React.ReactNode
    slot_bottom_navigation_bar: React.ReactNode
    children?: React.ReactNode
  }
}

export const App: React.FC<App.Props> = (props) => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__desktop}>
          {props.slot_header_desktop}
        </div>
        <div className={styles.header__mobile}>{props.slot_header_mobile}</div>
      </header>
      {props.children}
      <div className={styles['mobile-bottom-navigation-bar']}>
        {props.slot_bottom_navigation_bar}
      </div>
    </>
  )
}
