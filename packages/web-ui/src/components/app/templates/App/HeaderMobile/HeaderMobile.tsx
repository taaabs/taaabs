import styles from './HeaderMobile.module.scss'

export namespace HeaderMobile {
  export type Props = {
    slot_navigation: React.ReactNode
    slot_logo: React.ReactNode
  }
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.slot_logo}
      {props.slot_navigation}
    </div>
  )
}
