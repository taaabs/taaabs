import browser from 'webextension-polyfill'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { assistants } from '@/constants/assistants'
import { SendPrompt_Message } from '@/types/messages'

import '@web-ui/styles/style.scss'
import { usePopup } from '../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../data/default-prompts'

export const PromptField: React.FC<{
  assistant_url: string
  shortened_plain_text?: string
  prompt_field_value: string
  set_prompt_field_value: (value: string) => void
}> = (props) => {
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
      value={props.prompt_field_value}
      on_change={props.set_prompt_field_value}
      on_submit={() => {
        if (!props.prompt_field_value) return

        if (vision_mode_hook.is_save_prompt_checked) {
          prompts_vision_history_hook.update_stored_prompts_history(
            props.prompt_field_value,
          )
        }

        const message: SendPrompt_Message = {
          action: 'send-prompt',
          is_touch_screen: 'ontouchstart' in window,
          assistant_name:
            selected_assistant_vision_hook.selected_assistant_name!,
          assistant_url: props.assistant_url,
          prompt: props.prompt_field_value,
          window_height: window_dimensions_hook.dimensions!.height,
          window_width: window_dimensions_hook.dimensions!.width,
          image: vision_mode_hook.image!,
        }
        browser.runtime.sendMessage(message)
        window.close()
      }}
      is_switch_disabled={false}
      is_switch_checked={vision_mode_hook.is_save_prompt_checked}
      is_switch_visible={true}
      on_switch_click={() => {
        vision_mode_hook.set_is_save_prompt_checked(
          !vision_mode_hook.is_save_prompt_checked,
        )
      }}
      prompts_history={[
        ...prompts_vision_history_hook.prompts_history.filter(
          (prompt) => !default_vision_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={true}
      is_plain_text_too_long={false}
      text_not_found={false}
      translations={{
        new_prompt: 'New chat',
        placeholder: `Ask ${
          assistants[selected_assistant_vision_hook.selected_assistant_name!]
            .display_name
        }`,
        switch: 'Save prompt',
        active_input_placeholder_suffix: '(⇅ for history)',
        plain_text_too_long: <></>,
        text_not_found: <></>,
      }}
    />
  ) : (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={props.prompt_field_value}
      on_change={(value) => {
        props.set_prompt_field_value(value)
      }}
      on_submit={() => {
        if (
          !props.prompt_field_value &&
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
          prompts_history_hook.update_stored_prompts_history(
            props.prompt_field_value,
          )
        }

        const message: SendPrompt_Message = {
          action: 'send-prompt',
          is_touch_screen: 'ontouchstart' in window,
          assistant_name: selected_assistant_hook.selected_assistant_name!,
          assistant_url: props.assistant_url,
          prompt: props.prompt_field_value,
          plain_text:
            (attach_text_switch_hook.is_checked &&
              (text_selection_hook.selected_text ||
                props.shortened_plain_text)) ||
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
      is_switch_visible={
        !current_url_hook.is_new_tab_page &&
        !current_url_hook.url.startsWith('https://taaabs.com')
      }
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
      is_plain_text_too_long={
        ((!!parsed_html_hook.parsed_html ||
          !!text_selection_hook.selected_text) &&
          parsed_html_hook.parsed_html?.plain_text &&
          props.shortened_plain_text &&
          parsed_html_hook.parsed_html?.plain_text.length >
            props.shortened_plain_text?.length) ||
        false
      }
      text_not_found={
        !current_url_hook.is_new_tab_page &&
        !current_url_hook.url.startsWith('https://taaabs.com') &&
        parsed_html_hook.parsed_html === null &&
        !text_selection_hook.selected_text
      }
      translations={{
        new_prompt: 'New chat',
        placeholder: `Ask ${
          assistants[selected_assistant_hook.selected_assistant_name!]
            .display_name
        }`,
        switch: text_selection_hook.selected_text
          ? 'Attach text selection'
          : get_attach_text_checkbox_label(current_url_hook.url),
        active_input_placeholder_suffix: '(⇅ for history)',
        plain_text_too_long: (
          <>
            ⚠ {current_url_hook.is_youtube_video ? 'Transcript' : 'Text'} is{' '}
            {calculate_shortening_percentage(
              parsed_html_hook.parsed_html?.plain_text,
              props.shortened_plain_text,
            )}
            % over the limit in{' '}
            {
              assistants[selected_assistant_hook.selected_assistant_name!]
                .display_name
            }
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
  const conversation = 'Attach chat and save prompt'
  const label_map = {
    'https://www.youtube.com/watch': 'Attach transcript and save prompt',
    'https://m.youtube.com/watch': 'Attach transcript and save prompt',
    'https://x.com': 'Attach tweet and save prompt',
    'https://twitter.com': 'Attach tweet and save prompt',
    'https://www.reddit.com/r/': 'Attach post and save prompt',
    'https://gemini.google.com/app/': conversation,
    'https://chatgpt.com/c/': conversation,
    'https://huggingface.co/chat/conversation/': conversation,
    'https://claude.ai/chat/': conversation,
    'https://chat.mistral.ai/chat/': conversation,
    'https://coral.cohere.com/c/': conversation,
    'https://aistudio.google.com/app/prompts/': conversation,
    'https://mail.google.com/mail/': 'Attach e-mail and save prompt',
  }

  let label = 'Attach page and save prompt' // Default label

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
