import styles from './RecentPrompts.module.scss'

export namespace RecentPrompts {
  export type Props = {
    chatbots: {
      display_name: string
      name: string
    }[]
    selected_chatbot_name: string
    on_chatbot_change: (chatbot_name: string) => void
    recent_prompts: {
      name: string
      id: string
    }[]
    on_recent_prompt_click: (prompt_id: string) => void
    translations: {
      heading: string
    }
  }
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{props.translations.heading}</div>
        <div>
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
      </div>
      <div className={styles.prompts}>
        {props.recent_prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => props.on_recent_prompt_click(prompt.id)}
          >
            {prompt.name}
          </button>
        ))}
      </div>
    </div>
  )
}
