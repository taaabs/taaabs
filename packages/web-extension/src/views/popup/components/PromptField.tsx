import browser from 'webextension-polyfill'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { Switch as UiSwitch } from '@web-ui/components/Switch'
import { assistants } from '@/constants/assistants'
import { SendPrompt_Message } from '@/types/messages'
import { use_popup } from '../App'
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
    current_tab_hook,
    save_prompt_switch_hook,
  } = use_popup()

  return !vision_mode_hook.is_vision_mode ? (
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
          save_prompt_switch_hook.is_checked &&
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
      switches_slot={
        !current_tab_hook.is_new_tab_page &&
        !current_tab_hook.url.startsWith('https://taaabs.com') && (
          <>
            <UiSwitch
              is_checked={
                attach_text_switch_hook.is_checked &&
                parsed_html_hook.parsed_html !== null
              }
              is_disabled={
                !parsed_html_hook.parsed_html &&
                !text_selection_hook.selected_text
              }
              on_change={() => {
                attach_text_switch_hook.set_is_checked(
                  !attach_text_switch_hook.is_checked,
                )
              }}
              label={
                text_selection_hook.selected_text
                  ? 'Attach selection'
                  : get_attach_text_checkbox_label(current_tab_hook.url)
              }
            />
            <UiSwitch
              is_checked={
                attach_text_switch_hook.is_checked &&
                save_prompt_switch_hook.is_checked &&
                parsed_html_hook.parsed_html !== null
              }
              is_disabled={
                !attach_text_switch_hook.is_checked ||
                (!parsed_html_hook.parsed_html &&
                  !text_selection_hook.selected_text)
              }
              on_change={() => {
                save_prompt_switch_hook.set_is_checked(
                  !save_prompt_switch_hook.is_checked,
                )
              }}
              label={'Keep in recents'}
            />
          </>
        )
      }
      prompts_history={[
        ...prompts_history_hook.prompts_history.filter(
          (prompt) => !default_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={
        attach_text_switch_hook.is_checked &&
        (!!parsed_html_hook.parsed_html || !!text_selection_hook.selected_text)
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
        !current_tab_hook.is_new_tab_page &&
        !current_tab_hook.url.startsWith('https://taaabs.com') &&
        parsed_html_hook.parsed_html === null &&
        !text_selection_hook.selected_text
      }
      autofocus={
        !(
          navigator.userAgent.includes('Firefox') &&
          navigator.userAgent.includes('Mobile')
        )
      }
      context={[
        {
          id: '1',
          is_checked: true,
          title: current_tab_hook.title,
        },
      ]}
      translations={{
        new_prompt: 'New chat',
        placeholder: `Ask ${
          assistants[selected_assistant_hook.selected_assistant_name!]
            .display_name
        }`,
        switch: text_selection_hook.selected_text
          ? 'Attach selection'
          : get_attach_text_checkbox_label(current_tab_hook.url),
        active_input_placeholder_suffix: '(⇅ for history)',
        plain_text_too_long: (
          <>
            ⚠ {current_tab_hook.is_youtube_video ? 'Transcript' : 'Text'} is{' '}
            {calculate_shortening_percentage(
              parsed_html_hook.parsed_html?.plain_text,
              props.shortened_plain_text,
            )}
            % over the limit for{' '}
            {
              assistants[selected_assistant_hook.selected_assistant_name!]
                .display_name
            }
          </>
        ),
        text_not_found: current_tab_hook.is_youtube_video
          ? '⚠ Transcript not found'
          : '⚠ Unable to read this page',
      }}
    />
  ) : (
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
      switches_slot={
        <>
          <UiSwitch
            is_checked={true}
            is_disabled={true}
            on_change={() => {}}
            label={'Attach image'}
          />
          <UiSwitch
            is_checked={vision_mode_hook.is_save_prompt_checked}
            on_change={() => {
              vision_mode_hook.set_is_save_prompt_checked(
                !vision_mode_hook.is_save_prompt_checked,
              )
            }}
            label={'Keep in recents'}
          />
        </>
      }
      prompts_history={[
        ...prompts_vision_history_hook.prompts_history.filter(
          (prompt) => !default_vision_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={true}
      is_plain_text_too_long={false}
      text_not_found={false}
      autofocus={
        !(
          navigator.userAgent.includes('Firefox') &&
          navigator.userAgent.includes('Mobile')
        )
      }
      translations={{
        new_prompt: 'New chat',
        placeholder: `Ask ${
          assistants[selected_assistant_vision_hook.selected_assistant_name!]
            .display_name
        }`,
        switch: 'Keep in recents',
        active_input_placeholder_suffix: '(⇅ for history)',
        plain_text_too_long: <></>,
        text_not_found: <></>,
      }}
    />
  )
}

const get_attach_text_checkbox_label = (url: string) => {
  const chat = 'Attach chat'
  const label_map = {
    'https://www.youtube.com/watch': 'Attach transcript',
    'https://m.youtube.com/watch': 'Attach transcript',
    'https://x.com': 'Attach tweet',
    'https://twitter.com': 'Attach tweet',
    'https://www.reddit.com/r/': 'Attach post',
    'https://gemini.google.com/app/': chat,
    'https://chatgpt.com/c/': chat,
    'https://claude.ai/chat/': chat,
    'https://chat.mistral.ai/chat/': chat,
    'https://coral.cohere.com/c/': chat,
    'https://aistudio.google.com/app/prompts/': chat,
    'https://mail.google.com/mail/': 'Attach e-mail',
  }

  let label = 'Attach page' // Default label

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
