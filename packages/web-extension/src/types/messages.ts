export type CheckUrlSaved_Message = { action: 'check-url-saved' }
export type CreateBookmark_Message = { action: 'create-bookmark'; data: any }
export type DeleteBookmark_Message = {
  action: 'delete-bookmark'
  url: string
}
export type GetAuthData_Message = { action: 'get-auth-data' }
export type OpenOptionsPage_Message = { action: 'open-options-page' }
export type OpenPopup_Message = { action: 'open-popup' }
export type PopupClosed_Message = { action: 'popup-closed' }
export type PopupOpened_Message = { action: 'popup-opened' }
export type SendChatbotPrompt_Message = {
  action: 'send-chatbot-prompt'
  chatbot_url: string
  prompt: string
  plain_text?: string
  window_width: number
  window_height: number
  open_in_new_tab?: boolean
}
export type ThemeChanged_Message = {
  action: 'theme-changed'
  theme: 'light' | 'dark'
}
export type GetAuthDataContentScript_Message = { action: 'get-auth-data' }
export type GetThemeContentScript_Message = { action: 'get-theme' }
export type UrlSavedStatus_Message = {
  action: 'url-saved-status'
  is_saved: boolean
}
export type BookmarkCreated_Message = {
  action: 'bookmark-created'
}
export type BookmarkDeleted_Message = {
  action: 'bookmark-deleted'
}
export type InjectPopupContentScript_Message = { action: 'inject-popup' }
export type ClosePopupContentScript_Message = { action: 'close-popup' }
export type Logout_Message = { action: 'logout' }
export type ShowFloatingButton_Message = { action: 'show-floating-button' }

export type Message =
  | CheckUrlSaved_Message
  | CreateBookmark_Message
  | DeleteBookmark_Message
  | GetAuthData_Message
  | OpenOptionsPage_Message
  | OpenPopup_Message
  | PopupClosed_Message
  | PopupOpened_Message
  | SendChatbotPrompt_Message
  | ThemeChanged_Message
  | GetAuthDataContentScript_Message
  | GetThemeContentScript_Message
  | UrlSavedStatus_Message
  | BookmarkCreated_Message
  | BookmarkDeleted_Message
  | InjectPopupContentScript_Message
  | ClosePopupContentScript_Message
  | Logout_Message
  | ShowFloatingButton_Message

export type CheckUrlSavedResponse = { is_saved: boolean }
export type CreateBookmarkResponse = any // TODO: Replace 'any' with the actual type
export type GetAuthDataResponse = any // TODO: Replace 'any' with the actual type
export type GetCustomChatbotUrlResponse = { custom_chatbot_url: string }
export type GetLastUsedChatbotNameResponse = { last_used_chatbot_name: string }
export type OpenOptionsPageResponse = void
export type SendChatbotPromptResponse = void
export type ThemeChangedResponse = void
