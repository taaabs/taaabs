import styles from './AssistantSelector.module.scss'

export namespace AssistantSelector {
  export type Props = {
    chatbots: {
      display_name: string
      name: string
    }[]
    selected_assistant_name: string
    on_assistant_change: (assistant_name: string) => void
  }
}

export const AssistantSelector: React.FC<AssistantSelector.Props> = (props) => {
  return (
    <div className={styles.container}>
      <select
        value={props.selected_assistant_name}
        onChange={(e) => props.on_assistant_change(e.target.value)}
      >
        {props.chatbots.map((chatbot) => (
          <option key={chatbot.name} value={chatbot.name}>
            {chatbot.display_name}
          </option>
        ))}
      </select>
    </div>
  )
}
