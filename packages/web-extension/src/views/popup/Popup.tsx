import browser from 'webextension-polyfill'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { default_prompts, default_vision_prompts } from './data/default-prompts'
import { PLAIN_TEXT_MAX_LENGTH } from '@/constants/plain-text-max-length'
import {
  assistants,
} from '@/constants/assistants'
import { SendPrompt_Message } from '@/types/messages'

import '@web-ui/styles/style.scss'
import { usePopup } from './App'
import { Actions } from './components/actions/Actions'
import { Header } from './components/header/Header'
import { PromptField } from './components/prompt-field/PromptField'

export const Applet: React.FC = () => {
  const {
    auth_state_hook,
    saved_check_hook,
    prompts_history_hook,
    prompts_vision_history_hook,
    parsed_html_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    custom_assistant_url_hook,
    attach_text_switch_hook,
    text_selection_hook,
    vision_mode_hook,
    window_dimensions_hook,
    current_url_hook,
  } = usePopup()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const [shortened_plan_text, set_shortened_plain_text] = useState<string>()

  let assistant_url = assistants['chatgpt'].url
  if (
    !vision_mode_hook.is_vision_mode &&
    selected_assistant_hook.selected_assistant_name
  ) {
    if (selected_assistant_hook.selected_assistant_name != 'custom') {
      assistant_url =
        assistants[selected_assistant_hook.selected_assistant_name].url
    } else if (custom_assistant_url_hook.custom_assistant_url) {
      assistant_url = custom_assistant_url_hook.custom_assistant_url
    }
  } else if (selected_assistant_vision_hook.selected_assistant_name) {
    if (selected_assistant_vision_hook.selected_assistant_name != 'custom') {
      assistant_url =
        assistants[selected_assistant_vision_hook.selected_assistant_name].url
    } else if (custom_assistant_url_hook.custom_assistant_url) {
      assistant_url = custom_assistant_url_hook.custom_assistant_url
    }
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

  // Shorten plain text whenever selected assistant is changed
  useUpdateEffect(() => {
    const max_length =
      (PLAIN_TEXT_MAX_LENGTH as any)[
        selected_assistant_hook.selected_assistant_name!
      ] || PLAIN_TEXT_MAX_LENGTH['default']

    const shortened_plain_text =
      parsed_html_hook.parsed_html?.plain_text &&
      (parsed_html_hook.parsed_html.plain_text.length > max_length
        ? parsed_html_hook.parsed_html.plain_text
            .substring(0, max_length)
            .trim() + '...'
        : parsed_html_hook.parsed_html.plain_text)

    set_shortened_plain_text(shortened_plain_text)
  }, [parsed_html_hook, selected_assistant_hook.selected_assistant_name])

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

  if (
    auth_state_hook.is_authenticated === undefined ||
    (auth_state_hook.is_authenticated &&
      saved_check_hook.is_saved === undefined) ||
    selected_assistant_hook.selected_assistant_name === undefined ||
    selected_assistant_vision_hook.selected_assistant_name === undefined ||
    attach_text_switch_hook.is_checked === undefined
  ) {
    return <></>
  }

  return (
    <Ui_extension_popup_templates_Popup
      should_set_height={
        // Cases when showing recent prompts which adjust its height dynamically
        !current_url_hook.is_new_tab_page &&
        ((attach_text_switch_hook.is_checked &&
          !vision_mode_hook.is_vision_mode) ||
          vision_mode_hook.is_vision_mode)
      }
      header_slot={<Header />}
    >
      {!current_url_hook.url.startsWith('https://taaabs.com') &&
        !vision_mode_hook.is_vision_mode && <Actions />}

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
        !current_url_hook.is_new_tab_page &&
        attach_text_switch_hook.is_checked && (
          <>
            <Ui_extension_popup_templates_Popup_main_RecentPrompts
              recent_prompts={[
                ...prompts_history_hook.prompts_history,
              ].reverse()}
              filter_phrase={
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

      <PromptField
        assistant_url={assistant_url}
        prompt_field_value={prompt_field_value}
        set_prompt_field_value={set_prompt_field_value}
        shortened_plan_text={shortened_plan_text}
      />
    </Ui_extension_popup_templates_Popup>
  )
}
