import { AssistantName } from '@/constants/assistants'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { HtmlParser } from '@shared/utils/html-parser'

export type GetParsedHtml_Message = { action: 'get-parsed-html' }
export type ParsedHtml_Message = {
  action: 'parsed-html'
  parsed_html: HtmlParser.ParsedResult | null
}
export type GetWindowDimensions_Message = { action: 'get-window-dimensions' }
export type WindowDimensions_Message = {
  action: 'window-dimensions'
  width: number
  height: number
}
export type GetUpsertBookmarkParams_Message = {
  action: 'get-upsert-bookmark-params'
  reader_data?: HtmlParser.ParsedResult['reader_data']
}
export type UpsertBookmarkParams_Message = {
  action: 'upsert-bookmark-params'
  bookmark: UpsertBookmark_Params
}
export type GetSelectedText_Message = {
  action: 'get-selected-text'
}
export type SelectedText_Message = {
  action: 'selected-text'
  selected_text: string
}
export type GetAuthData_Message = { action: 'get-auth-data' }
export type SendPrompt_Message = {
  action: 'send-prompt'
  is_touch_screen: boolean
  assistant_name: AssistantName
  assistant_url: string
  prompt: string
  plain_text?: string
  window_width?: number
  window_height?: number
  open_in_new_tab?: boolean
  image?: string
}
export type GetAuthDataContentScript_Message = { action: 'get-auth-data' }
export type BookmarkCreated_Message = {
  action: 'bookmark-created'
}
export type BookmarkDeleted_Message = {
  action: 'bookmark-deleted'
}
export type InjectPopupContentScript_Message = { action: 'inject-popup' }
export type ClosePopupContentScript_Message = { action: 'close-popup' }
export type CapturedImage_Message = {
  action: 'captured-image'
  captured_image: string
}
export type SetFavicon_Message = {
  action: 'set-favicon'
  domain: string
  favicon: string
}
export type GetFavicon_Message = {
  action: 'get-favicon'
  domain: string
}

export type Message =
  | GetParsedHtml_Message
  | ParsedHtml_Message
  | GetWindowDimensions_Message
  | WindowDimensions_Message
  | GetUpsertBookmarkParams_Message
  | UpsertBookmarkParams_Message
  | GetAuthData_Message
  | SendPrompt_Message
  | GetAuthDataContentScript_Message
  | BookmarkCreated_Message
  | BookmarkDeleted_Message
  | InjectPopupContentScript_Message
  | ClosePopupContentScript_Message
  | CapturedImage_Message
  | GetSelectedText_Message
  | SelectedText_Message
  | SetFavicon_Message
  | GetFavicon_Message

export type CheckUrlSavedResponse = { is_saved: boolean }
export type GetAuthDataResponse = any // TODO: Replace 'any' with the actual type
