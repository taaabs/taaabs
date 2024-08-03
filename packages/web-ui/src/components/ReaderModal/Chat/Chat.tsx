import { ReaderData } from '@shared/utils/html-parser/reader-data'
import styles from './Chat.module.scss'
import { _RenderMarkdown } from '../common/_RenderMarkdown'
import { Icon } from '@web-ui/components/common/particles/icon'

namespace Chat {
  export type Props = {
    chat: ReaderData.Chat
  }
}

export const Chat: React.FC<Chat.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.chat.conversation.map((message, i) => {
        if (message.role == 'user') {
          return (
            <div className={styles.user} key={i}>
              <span>{message.content}</span>
              <Icon variant="CHAT_BUBBLE_CORNER" />
            </div>
          )
        } else if (message.role == 'assistant') {
          return (
            <div className={styles.assistant} key={i}>
              <_RenderMarkdown content={message.content} />
            </div>
          )
        }
      })}
    </div>
  )
}
