import styles from './AssistantSelector.module.scss'

export namespace AssistantSelector {
  export type Props = {
    chatbots: {
      display_name: string
      name: string
    }[]
    selected_chatbot_name: string
    on_chatbot_change: (chatbot_name: string) => void
    translations: {
      heading: string
    }
  }
}

export const AssistantSelector: React.FC<AssistantSelector.Props> = (props) => {
  return (
    <div className={styles.container}>
      <span>{props.translations.heading}</span>
      <select
        value={props.selected_chatbot_name}
        onChange={(e) => props.on_chatbot_change(e.target.value)}
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
