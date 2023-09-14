import styles from './app-header-mobile.module.scss'

export namespace AppHeaderMobile {
  export type Props = {
    slot_navigation: React.ReactNode
    slot_logo: React.ReactNode
  }
}

export const AppHeaderMobile: React.FC<AppHeaderMobile.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.slot_logo}
      {props.slot_navigation}
    </div>
  )
}
