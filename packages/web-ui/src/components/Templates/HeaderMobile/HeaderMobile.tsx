import styles from './HeaderMobile.module.scss'

export namespace HeaderMobileTypes {
  export type Props = {
    navigationSlot: React.ReactNode
    logoSlot: React.ReactNode
  }
}

export const HeaderMobile: React.FC<HeaderMobileTypes.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.logoSlot}
      {props.navigationSlot}
    </div>
  )
}
