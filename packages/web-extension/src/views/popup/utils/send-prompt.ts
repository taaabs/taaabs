import browser from 'webextension-polyfill'
import { SendPrompt_Message } from '@/types/messages'
import { AssistantName } from '@/constants/assistants'

type SendPromptParams = {
  prompt: string
  assistant_name: AssistantName
  assistant_url: string
  plain_text?: string
  is_vision_mode?: boolean
  image?: string
  open_in_new_tab?: boolean
  window_dimensions: {
    height: number
    width: number
  }
  on_before_send?: () => void
}

export const send_prompt = async ({
  prompt,
  assistant_name,
  assistant_url,
  plain_text,
  is_vision_mode,
  image,
  open_in_new_tab,
  window_dimensions,
  on_before_send,
}: SendPromptParams) => {
  if (on_before_send) {
    on_before_send()
  }

  const message: SendPrompt_Message = {
    action: 'send-prompt',
    is_touch_screen: 'ontouchstart' in window,
    assistant_name,
    assistant_url,
    prompt,
    window_height: window_dimensions.height,
    window_width: window_dimensions.width,
  }

  // Add vision mode properties if needed
  if (is_vision_mode && image) {
    message.image = image
  } else if (plain_text) {
    message.plain_text = plain_text
  }

  // Add open in new tab if specified
  if (open_in_new_tab) {
    message.open_in_new_tab = true
  }

  await browser.runtime.sendMessage(message)
  window.close()
}

export const get_aggregated_plain_text = (params: {
  pinned_websites: Array<{
    title: string
    plain_text: string
    url: string
    is_enabled: boolean
  }>
  current_tab: {
    url: string
    title: string
    include_in_prompt: boolean
  }
  selected_text?: string
  tab_plain_text?: string
}) => {
  const { pinned_websites, current_tab, selected_text, tab_plain_text } = params

  // Get content from all enabled pinned websites
  let plain_text = pinned_websites
    .filter((website) => website.is_enabled)
    .map(
      (website) =>
        `<page title="${website.title}">\n<![CDATA[\n${website.plain_text}\n\n</page>`,
    )
    .join('\n\n')

  // Add current tab content if enabled and not pinned
  if (current_tab.include_in_prompt) {
    const is_current_tab_pinned = pinned_websites.some(
      (website) => website.url === current_tab.url,
    )

    if (!is_current_tab_pinned) {
      if (selected_text) {
        plain_text += `\n\n<![CDATA[\n${selected_text}\n]]>`
      } else if (tab_plain_text) {
        plain_text += `\n\n<page title="${current_tab.title}">\n<![CDATA[\n${tab_plain_text}\n]]>\n</page>`
      }
    }
  }

  return plain_text
}
