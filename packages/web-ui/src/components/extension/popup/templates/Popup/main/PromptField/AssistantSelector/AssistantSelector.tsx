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
      <span>
        {
          props.chatbots.find(
            (chatbot) => chatbot.name == props.selected_assistant_name,
          )?.display_name
        }
      </span>
      <svg viewBox="0 0 32 32" width="1.2em" height="1.2em">
        <path fill="currentColor" d="m24 12l-8 10l-8-10z"></path>
      </svg>
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
