export type CheckUrlSavedMessage = { action: 'check-url-saved' }
export type CreateBookmarkMessage = { action: 'create-bookmark'; data: any }
export type GetAuthDataMessage = { action: 'get-auth-data' }
export type GetCustomChatbotUrlMessage = { action: 'get-custom-chatbot-url' }
export type GetLastUsedChatbotNameMessage = {
  action: 'get-last-used-chatbot-name'
}
export type SetLastUsedChatbotNameMessage = {
  action: 'set-last-used-chatbot-name'
  last_used_chatbot_name: string
}
export type OpenOptionsPageMessage = { action: 'open-options-page' }
export type SendChatbotPromptMessage = {
  action: 'send-chatbot-prompt'
  chatbot_url: string
  prompt: string
  window_width: number
  window_height: number
}
export type ThemeChangedMessage = {
  action: 'theme-changed'
  theme: 'light' | 'dark'
}

export type Message =
  | CheckUrlSavedMessage
  | CreateBookmarkMessage
  | GetAuthDataMessage
  | GetCustomChatbotUrlMessage
  | GetLastUsedChatbotNameMessage
  | SetLastUsedChatbotNameMessage
  | OpenOptionsPageMessage
  | SendChatbotPromptMessage
  | ThemeChangedMessage

export type CheckUrlSavedResponse = { is_saved: boolean }
export type CreateBookmarkResponse = any // TODO: Replace 'any' with the actual type
export type GetAuthDataResponse = any // TODO: Replace 'any' with the actual type
export type GetCustomChatbotUrlResponse = { custom_chatbot_url: string }
export type GetLastUsedChatbotNameResponse = { last_used_chatbot_name: string }
export type OpenOptionsPageResponse = void
export type SendChatbotPromptResponse = void
export type ThemeChangedResponse = void
