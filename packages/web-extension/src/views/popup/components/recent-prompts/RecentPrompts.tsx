import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { usePopup } from '../../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../../data/default-prompts'
import { SendPrompt_Message } from '@/types/messages'
import browser from 'webextension-polyfill'
import { useEffect } from 'react'
import { use_prompts_history } from '../../hooks/use-prompts-history'
import { use_prompts_vision_history } from '../../hooks/use-prompts-vision-history'

export const RecentPrompts: React.FC<{
  prompt_field_value: string
  assistant_url: string
  shortened_plan_text?: string
}> = ({ prompt_field_value, assistant_url, shortened_plan_text }) => {
  const {
    parsed_html_hook,
    attach_text_switch_hook,
    text_selection_hook,
    vision_mode_hook,
    current_url_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    window_dimensions_hook,
  } = usePopup()
  const prompts_history_hook = use_prompts_history()
  const prompts_vision_history_hook = use_prompts_vision_history()

  const handle_quick_prompt_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    if (text_selection_hook.selected_text || parsed_html_hook.parsed_html) {
      prompts_history_hook.update_stored_prompts_history(prompt)
      const message: SendPrompt_Message = {
        action: 'send-prompt',
        is_touch_screen: 'ontouchstart' in window,
        assistant_name: selected_assistant_hook.selected_assistant_name!,
        assistant_url,
        prompt,
        plain_text: text_selection_hook.selected_text || shortened_plan_text,
        open_in_new_tab: is_middle_click,
        window_height: window_dimensions_hook.dimensions!.height,
        window_width: window_dimensions_hook.dimensions!.width,
      }
      browser.runtime.sendMessage(message)
      window.close()
    }
  }

  const handle_quick_prompt_vision_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    prompts_vision_history_hook.update_stored_prompts_history(prompt)
    const message: SendPrompt_Message = {
      action: 'send-prompt',
      is_touch_screen: 'ontouchstart' in window,
      assistant_name: selected_assistant_vision_hook.selected_assistant_name!,
      assistant_url,
      prompt,
      open_in_new_tab: is_middle_click,
      window_height: window_dimensions_hook.dimensions!.height,
      window_width: window_dimensions_hook.dimensions!.width,
      image: vision_mode_hook.image!,
    }
    browser.runtime.sendMessage(message)
    window.close()
  }

  // Quick select with keyboard numbers (1-9)
  useEffect(() => {
    const handle_key_down = (e: KeyboardEvent) => {
      if (prompt_field_value == '' && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1
        const recent_prompts = vision_mode_hook.is_vision_mode
          ? prompts_vision_history_hook.prompts_history
          : prompts_history_hook.prompts_history

        if (index < recent_prompts.length) {
          e.preventDefault()
          const selected_prompt =
            recent_prompts[recent_prompts.length - 1 - index]
          if (vision_mode_hook.is_vision_mode) {
            handle_quick_prompt_vision_click(selected_prompt)
          } else {
            handle_quick_prompt_click(selected_prompt)
          }
        }
      }
    }
    window.addEventListener('keydown', handle_key_down)
    return () => window.removeEventListener('keydown', handle_key_down)
  }, [
    prompt_field_value,
    prompts_history_hook.prompts_history,
    prompts_vision_history_hook.prompts_history,
    vision_mode_hook.is_vision_mode,
    text_selection_hook.selected_text,
    parsed_html_hook.parsed_html,
    shortened_plan_text,
    selected_assistant_hook.selected_assistant_name,
    window_dimensions_hook.dimensions,
  ])

  return (
    <>
      {vision_mode_hook.is_vision_mode && (
        <>
          <Ui_extension_popup_templates_Popup_main_RecentPrompts
            recent_prompts={[
              ...prompts_vision_history_hook.prompts_history,
            ].reverse()}
            filter_phrase={
              !prompts_vision_history_hook.prompts_history.includes(
                prompt_field_value,
              )
                ? prompt_field_value
                : ''
            }
            default_prompts={default_vision_prompts}
            on_recent_prompt_click={handle_quick_prompt_vision_click}
            on_recent_prompt_middle_click={(prompt) => {
              handle_quick_prompt_vision_click(prompt, true)
            }}
            is_disabled={false}
            translations={{
              searching_heading: 'Searching in recents...',
              heading: 'Recent prompts',
            }}
          />

          <Ui_extension_popup_templates_Popup_main_Separator />
        </>
      )}

      {!vision_mode_hook.is_vision_mode &&
        !current_url_hook.is_new_tab_page && (
          <>
            <Ui_extension_popup_templates_Popup_main_RecentPrompts
              recent_prompts={[
                ...prompts_history_hook.prompts_history,
              ].reverse()}
              filter_phrase={
                attach_text_switch_hook.is_checked &&
                (parsed_html_hook.parsed_html ||
                  text_selection_hook.selected_text) &&
                !prompts_history_hook.prompts_history.includes(
                  prompt_field_value,
                )
                  ? prompt_field_value
                  : ''
              }
              default_prompts={default_prompts}
              on_recent_prompt_click={handle_quick_prompt_click}
              on_recent_prompt_middle_click={(prompt) => {
                handle_quick_prompt_click(prompt, true)
              }}
              is_disabled={
                !parsed_html_hook.parsed_html &&
                !text_selection_hook.selected_text
              }
              translations={{
                searching_heading: 'Searching in recents...',
                heading: 'Recent prompts',
              }}
            />

            <Ui_extension_popup_templates_Popup_main_Separator />
          </>
        )}
    </>
  )
}
