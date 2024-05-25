type ContentBase = {
  type: string
}

export enum ContentType {
  ARTICLE = 'article',
  CHAT = 'chat',
}

export interface GenericArticle extends ContentBase {
  type: ContentType.ARTICLE
  markdown: string
}
export interface Chat extends ContentBase {
  type: ContentType.CHAT
  conversation: Array<
    | {
        author: 'user'
        text: string
      }
    | {
        author: 'assistant'
        markdown: string
      }
  >
}

export type Content = GenericArticle | Chat
