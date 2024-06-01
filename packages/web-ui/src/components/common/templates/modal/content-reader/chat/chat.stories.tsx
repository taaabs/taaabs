import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { Chat } from './chat'

export default {
  component: Chat,
}

export const Primary = () => {
  return (
    <Chat
      chat={{
        type: ReaderData.ContentType.CHAT,
        conversation: [
          { author: 'user', text: 'Question' },
          { author: 'assistant', content: 'Answer' },
          { author: 'user', text: 'Question 2' },
          { author: 'assistant', content: 'Answer 2' },
        ],
      }}
    />
  )
}
