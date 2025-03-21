import styles from './Popup.scss'

export namespace Popup {
  export type Props = {
    header_slot: React.ReactNode
    children: React.ReactNode
  }
}

export const Popup: React.FC<Popup.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.header_slot}
      {props.children}
    </div>
  )
}
