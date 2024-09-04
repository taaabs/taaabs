import { Icon } from '@web-ui/components/Icon'
import styles from './Footer.module.scss'

export namespace Footer {
  export type Props = {
    chatbots: {
      display_name: string
      name: string
    }[]
    selected_chatbot_name: string
    on_chatbot_change: (chatbot_name: string) => void
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Icon variant="TAAABS" />
      </div>
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
