import { Icon } from '@web-ui/components/Icon'
import styles from './AssistantSelector.module.scss'
import { useRef } from 'react'

export namespace AssistantSelector {
  export type Assistant = {
    name: string
    label: string
    logo_url?: string
  }

  export type Props = {
    assistants: Assistant[]
    selected_name: string
    on_change: (name: string) => void
  }
}

export const AssistantSelector: React.FC<AssistantSelector.Props> = (props) => {
  const select_ref = useRef<HTMLSelectElement>(null)
  const selected_assistant = props.assistants.find(
    (bot) => bot.name == props.selected_name,
  )

  const handle_container_click = () => {
    select_ref.current?.focus()
  }

  return (
    <div className={styles.container} onClick={handle_container_click}>
      <div className={styles.selected}>
        {selected_assistant?.logo_url && (
          <img
            src={selected_assistant?.logo_url}
            alt={selected_assistant?.label}
            className={styles.selected__logo}
          />
        )}
        <span className={styles.selected__label}>
          {selected_assistant?.label}
        </span>
        <div className={styles.selected__chevron}>
          <Icon variant="CHEVRON" />
        </div>
      </div>
      <select
        ref={select_ref}
        value={props.selected_name}
        onChange={(e) => props.on_change(e.target.value)}
        className={styles.select}
      >
        {props.assistants.map((bot) => (
          <option key={bot.name} value={bot.name}>
            {bot.label}
          </option>
        ))}
      </select>
    </div>
  )
}
