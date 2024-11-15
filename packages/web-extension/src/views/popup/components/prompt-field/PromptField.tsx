import browser from 'webextension-polyfill'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { AssistantSelector as Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField/AssistantSelector'
import {
  AssistantName,
  assistants,
  assistants_vision,
} from '@/constants/assistants'
import { SendPrompt_Message } from '@/types/messages'

import '@web-ui/styles/style.scss'
import { usePopup } from '../../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../../data/default-prompts'

export const PromptField: React.FC<{
  assistant_url: string
  shortened_plan_text?: string
  prompt_field_value: string
  set_prompt_field_value: (value: string) => void
}> = ({
  assistant_url,
  shortened_plan_text,
  prompt_field_value,
  set_prompt_field_value,
}) => {
  const {
    prompts_history_hook,
    prompts_vision_history_hook,
    parsed_html_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    attach_text_switch_hook,
    text_selection_hook,
    vision_mode_hook,
    window_dimensions_hook,
    current_url_hook,
  } = usePopup()

  return vision_mode_hook.is_vision_mode ? (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={prompt_field_value}
      on_change={(value) => {
        set_prompt_field_value(value)
      }}
      on_submit={() => {
        if (!prompt_field_value) return

        prompts_vision_history_hook.update_stored_prompts_history(
          prompt_field_value,
        )

        const message: SendPrompt_Message = {
          action: 'send-prompt',
          is_touch_screen: 'ontouchstart' in window,
          assistant_name:
            selected_assistant_vision_hook.selected_assistant_name!,
          assistant_url,
          prompt: prompt_field_value,
          window_height: window_dimensions_hook.dimensions!.height,
          window_width: window_dimensions_hook.dimensions!.width,
          image: vision_mode_hook.image!,
        }
        browser.runtime.sendMessage(message)
        window.close()
      }}
      is_switch_disabled={false}
      is_switch_checked={false}
      is_switch_visible={false}
      on_switch_click={() => {}}
      prompts_history={[
        ...prompts_vision_history_hook.prompts_history.filter(
          (prompt) => !default_vision_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={true}
      assistant_selector_slot={
        <Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector
          selected_assistant_name={
            selected_assistant_vision_hook.selected_assistant_name!
          }
          chatbots={Object.entries(assistants)
            .filter(([key]) => assistants_vision.includes(key as AssistantName))
            .map(([key, value]) => ({
              name: key,
              display_name: value.display_name,
            }))}
          on_assistant_change={(assistant_name) => {
            selected_assistant_vision_hook.set_selected_assistant_name(
              assistant_name as AssistantName,
            )
          }}
        />
      }
      is_plain_text_too_long={false}
      text_not_found={false}
      translations={{
        new_prompt: 'New chat',
        active_assistant: 'Chat will continue in',
        placeholder: `Ask ${
          assistants[selected_assistant_vision_hook.selected_assistant_name!]
            .display_name
        }`,
        switch: '',
        active_input_placeholder_suffix: '(⇅ for history)',
        plain_text_too_long: <></>,
        text_not_found: <></>,
      }}
    />
  ) : (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={prompt_field_value}
      on_change={(value) => {
        set_prompt_field_value(value)
      }}
      on_submit={() => {
        if (
          !prompt_field_value &&
          !(
            attach_text_switch_hook.is_checked &&
            text_selection_hook.selected_text
          )
        )
          return

        if (
          attach_text_switch_hook.is_checked &&
          (parsed_html_hook.parsed_html || text_selection_hook.selected_text)
        ) {
          prompts_history_hook.update_stored_prompts_history(prompt_field_value)
        }

        const message: SendPrompt_Message = {
          action: 'send-prompt',
          is_touch_screen: 'ontouchstart' in window,
          assistant_name: selected_assistant_hook.selected_assistant_name!,
          assistant_url,
          prompt: prompt_field_value,
          plain_text:
            (attach_text_switch_hook.is_checked &&
              (text_selection_hook.selected_text || shortened_plan_text)) ||
            '',
          window_height: window_dimensions_hook.dimensions?.height,
          window_width: window_dimensions_hook.dimensions?.width,
        }
        browser.runtime.sendMessage(message)
        window.close()
      }}
      is_switch_disabled={
        !parsed_html_hook.parsed_html && !text_selection_hook.selected_text
      }
      is_switch_checked={
        parsed_html_hook.parsed_html === null &&
        !text_selection_hook.selected_text
          ? false
          : attach_text_switch_hook.is_checked
      }
      is_switch_visible={!current_url_hook.is_new_tab_page}
      on_switch_click={() => {
        attach_text_switch_hook.set_is_checked(
          !attach_text_switch_hook.is_checked,
        )
      }}
      prompts_history={[
        ...prompts_history_hook.prompts_history.filter(
          (prompt) => !default_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={
        !!parsed_html_hook.parsed_html || !!text_selection_hook.selected_text
      }
      assistant_selector_slot={
        <Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector
          selected_assistant_name={
            selected_assistant_hook.selected_assistant_name!
          }
          chatbots={Object.entries(assistants).map(([key, value]) => ({
            name: key,
            display_name: value.display_name,
          }))}
          on_assistant_change={(chatbot_name) => {
            selected_assistant_hook.set_selected_assistant_name(
              chatbot_name as AssistantName,
            )
          }}
        />
      }
      is_plain_text_too_long={
        (attach_text_switch_hook.is_checked &&
          (!!parsed_html_hook.parsed_html ||
            !!text_selection_hook.selected_text) &&
          parsed_html_hook.parsed_html?.plain_text &&
          shortened_plan_text &&
          parsed_html_hook.parsed_html?.plain_text.length >
            shortened_plan_text?.length) ||
        false
      }
      text_not_found={
        !current_url_hook.is_new_tab_page &&
        parsed_html_hook.parsed_html === null
      }
      translations={{
        new_prompt: 'New chat',
        active_assistant: 'Chat will continue in',
        placeholder: `Ask ${
          assistants[selected_assistant_hook.selected_assistant_name!]
            .display_name
        }`,
        switch: text_selection_hook.selected_text
          ? 'Send text selection'
          : get_attach_text_checkbox_label(current_url_hook.url),
        active_input_placeholder_suffix: '(⇅ for history)',
        plain_text_too_long: (
          <>
            ⚠ {current_url_hook.is_youtube_video ? 'Transcript' : 'Text'} will
            be shortened by{' '}
            {calculate_shortening_percentage(
              parsed_html_hook.parsed_html?.plain_text,
              shortened_plan_text,
            )}
            %
          </>
        ),
        text_not_found: current_url_hook.is_youtube_video
          ? '⚠ Transcript not found'
          : '⚠ Unable to read this page',
      }}
    />
  )
}

const get_attach_text_checkbox_label = (url: string) => {
  const conversation = 'Send chat'
  const label_map = {
    'https://www.youtube.com/watch': 'Send transcript',
    'https://m.youtube.com/watch': 'Send transcript',
    'https://x.com': 'Send tweet',
    'https://twitter.com': 'Send tweet',
    'https://www.reddit.com/r/': 'Send post',
    'https://gemini.google.com/app/': conversation,
    'https://chatgpt.com/c/': conversation,
    'https://huggingface.co/chat/conversation/': conversation,
    'https://claude.ai/chat/': conversation,
    'https://chat.mistral.ai/chat/': conversation,
    'https://coral.cohere.com/c/': conversation,
    'https://aistudio.google.com/app/prompts/': conversation,
    'https://mail.google.com/mail/': 'Send e-mail',
  }

  let label = 'Send page' // Default label

  for (const prefix in label_map) {
    if (url.startsWith(prefix)) {
      label = (label_map as any)[prefix]
      break
    }
  }
  return label
}

const calculate_shortening_percentage = (
  full_text?: string,
  shortened_text?: string,
): number | undefined => {
  if (!full_text || !shortened_text) {
    return
  }

  const full_length = full_text.length
  const shortened_length = shortened_text.length

  const difference = full_length - shortened_length
  const percentage = (difference / full_length) * 100

  return Math.floor(percentage)
}
