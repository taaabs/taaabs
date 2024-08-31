import styles from './Popup.module.scss'

export namespace Popup {
  export type Props = {
    header_slot: React.ReactNode
    children: React.ReactNode
    footer_slot: React.ReactNode
  }
}

export const Popup: React.FC<Popup.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.header_slot}
      {props.children}
      {props.footer_slot}
    </div>
  )
}
