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
