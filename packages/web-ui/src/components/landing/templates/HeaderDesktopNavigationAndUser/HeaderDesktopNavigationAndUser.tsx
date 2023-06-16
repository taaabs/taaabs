import styles from './HeaderDesktopNavigationAndUser.module.scss'

export namespace HeaderDesktopNavigationAndUserTypes {
  export type Props = {
    navigationSlot: React.ReactNode
    userSlot: React.ReactNode
  }
}

export const HeaderDesktopNavigationAndUser: React.FC<
  HeaderDesktopNavigationAndUserTypes.Props
> = (props) => {
  return (
    <div className={styles.container}>
      {props.navigationSlot}
      {props.userSlot}
    </div>
  )
}
