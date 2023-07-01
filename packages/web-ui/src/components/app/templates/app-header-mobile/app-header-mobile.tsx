import styles from './app-header-mobile.module.scss'

export namespace AppHeaderMobileTypes {
  export type Props = {
    navigationSlot: React.ReactNode
    logoSlot: React.ReactNode
  }
}

export const AppHeaderMobile: React.FC<AppHeaderMobileTypes.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      {props.logoSlot}
      {props.navigationSlot}
    </div>
  )
}
