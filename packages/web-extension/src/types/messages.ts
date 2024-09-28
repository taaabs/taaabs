export type CheckUrlSavedMessage = { action: 'check-url-saved' }
export type CreateBookmarkMessage = { action: 'create-bookmark'; data: any }
export type DeleteBookmarkMessage = {
  action: 'delete-bookmark'
  url: string
}
export type GetAuthDataMessage = { action: 'get-auth-data' }
export type OpenOptionsPageMessage = { action: 'open-options-page' }
export type OpenPopupMessage = { action: 'open-popup' }
export type PopupClosedMessage = { action: 'popup-closed' }
export type PopupOpenedMessage = { action: 'popup-opened' }
export type SendChatbotPromptMessage = {
  action: 'send-chatbot-prompt'
  chatbot_url: string
  prompt: string
  plain_text?: string
  window_width: number
  window_height: number
}
export type ThemeChangedMessage = {
  action: 'theme-changed'
  theme: 'light' | 'dark'
}
export type GetAuthDataContentScriptMessage = { action: 'get-auth-data' }
export type GetThemeContentScriptMessage = { action: 'get-theme' }
export type UrlSavedStatusMessage = {
  action: 'url-saved-status'
  is_saved: boolean
}
export type BookmarkCreatedMessage = {
  action: 'bookmark-created'
}
export type BookmarkDeletedMessage = {
  action: 'bookmark-deleted'
}
export type InjectPopupContentScriptMessage = { action: 'inject-popup' }
export type ClosePopupContentScriptMessage = { action: 'close-popup' }
export type LogoutMessage = { action: 'logout' }

export type Message =
  | CheckUrlSavedMessage
  | CreateBookmarkMessage
  | DeleteBookmarkMessage
  | GetAuthDataMessage
  | OpenOptionsPageMessage
  | OpenPopupMessage
  | PopupClosedMessage
  | PopupOpenedMessage
  | SendChatbotPromptMessage
  | ThemeChangedMessage
  | GetAuthDataContentScriptMessage
  | GetThemeContentScriptMessage
  | UrlSavedStatusMessage
  | BookmarkCreatedMessage
  | BookmarkDeletedMessage
  | InjectPopupContentScriptMessage
  | ClosePopupContentScriptMessage
  | LogoutMessage

export type CheckUrlSavedResponse = { is_saved: boolean }
export type CreateBookmarkResponse = any // TODO: Replace 'any' with the actual type
export type GetAuthDataResponse = any // TODO: Replace 'any' with the actual type
export type GetCustomChatbotUrlResponse = { custom_chatbot_url: string }
export type GetLastUsedChatbotNameResponse = { last_used_chatbot_name: string }
export type OpenOptionsPageResponse = void
export type SendChatbotPromptResponse = void
export type ThemeChangedResponse = void
