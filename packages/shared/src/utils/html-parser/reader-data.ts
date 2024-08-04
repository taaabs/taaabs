export namespace ReaderData {
  export enum ContentType {
    ARTICLE = 'article',
    CHAT = 'chat',
  }
  type Base = {
    type: ContentType
  }
  export interface Article extends Base {
    type: ContentType.ARTICLE
    title: string
    published_at: string
    author: string
    site_name: string
    length: number
    content: string
  }
  export interface Chat extends Base {
    type: ContentType.CHAT
    conversation: Array<
      | {
          role: 'system'
          content: string
        }
      | {
          role: 'user'
          content: string
        }
      | {
          role: 'assistant'
          content: string
        }
    >
  }
  export type Data = Article | Chat
}
