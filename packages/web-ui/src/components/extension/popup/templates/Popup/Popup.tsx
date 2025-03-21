import styles from './Popup.scss'

export namespace Popup {
  export type Props = {
    header_slot: React.ReactNode
    actions_slot?: React.ReactNode
    prompt_field_slot: React.ReactNode
    recent_prompts_slot: React.ReactNode
    footer_links_slot: React.ReactNode
    children?: React.ReactNode
  }
}

export const Popup: React.FC<Popup.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.header_slot}
      {props.actions_slot}
      {props.prompt_field_slot}
      {props.recent_prompts_slot}
      {props.footer_links_slot}
    </div>
  )
}
