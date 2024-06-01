import { ReaderData } from '@shared/utils/html-parser/reader-data'
import styles from './chat.module.scss'
import { _RenderMarkdown } from '../_render-markdown'

namespace Chat {
  export type Props = {
    chat: ReaderData.Chat
  }
}

export const Chat: React.FC<Chat.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.chat.conversation.map((message, i) => {
        if (message.author == 'user') {
          return (
            <div className={styles.user} key={i}>
              {message.text}
            </div>
          )
        } else if (message.author == 'assistant') {
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
