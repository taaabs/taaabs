import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { Switch as UiSwitch } from '@web-ui/components/Switch'
import { assistants } from '@/constants/assistants'
import { use_popup } from '../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../data/default-prompts'
import { useMemo } from 'react'
import { ChatField } from '@web-ui/components/ChatField'
import { send_prompt, get_aggregated_plain_text } from '../utils/send-prompt'

export const PromptField: React.FC<{
  assistant_url: string
  plain_text?: string
  prompt_field_value: string
  set_prompt_field_value: (value: string) => void
}> = (props) => {
  const {
    prompts_history_hook,
    prompts_vision_history_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    current_tab_hook,
    text_selection_hook,
    vision_mode_hook,
    window_dimensions_hook,
    save_prompt_switch_hook,
    pinned_websites_hook,
  } = use_popup()

  const websites = useMemo<ChatField.Website[]>(() => {
    const websites: ChatField.Website[] =
      pinned_websites_hook.pinned_websites.map((website) => ({
        url: website.url,
        title: website.title,
        tokens: Math.ceil(website.plain_text.length / 4),
        is_pinned: true,
        is_enabled: website.is_enabled,
      }))

    // Add current tab if it's not already pinned and has content
    const is_current_tab_pinned = pinned_websites_hook.pinned_websites.some(
      (website) => website.url == current_tab_hook.url,
    )

    if (!is_current_tab_pinned && current_tab_hook.parsed_html?.plain_text) {
      websites.push({
        url: current_tab_hook.url,
        title: current_tab_hook.title,
        tokens: Math.ceil(current_tab_hook.parsed_html.plain_text.length / 4),
        is_pinned: false,
        is_enabled: current_tab_hook.include_in_prompt,
      })
    }

    return websites
  }, [
    pinned_websites_hook.pinned_websites,
    current_tab_hook.parsed_html,
    current_tab_hook.include_in_prompt,
  ])

  // Determine if history should be enabled based on enabled pinned websites and attached text
  const is_history_enabled = useMemo(() => {
    // Check if there are any enabled pinned websites
    const has_enabled_pinned_websites =
      pinned_websites_hook.pinned_websites.some((website) => website.is_enabled)

    // Check if current tab text is enabled and available
    const has_enabled_current_tab_text =
      current_tab_hook.include_in_prompt &&
      !pinned_websites_hook.pinned_websites.some(
        (website) => website.url == current_tab_hook.url,
      ) &&
      (!!text_selection_hook.selected_text || !!current_tab_hook.parsed_html)

    return has_enabled_pinned_websites || has_enabled_current_tab_text
  }, [
    pinned_websites_hook.pinned_websites,
    current_tab_hook.include_in_prompt,
    text_selection_hook.selected_text,
    current_tab_hook.parsed_html,
  ])

  const handle_submit = async () => {
    if (!props.prompt_field_value) return

    if (!vision_mode_hook.is_vision_mode) {
      if (is_history_enabled) {
        prompts_history_hook.update_stored_prompts_history(
          props.prompt_field_value,
        )
      }

      const plain_text = get_aggregated_plain_text({
        pinned_websites: pinned_websites_hook.pinned_websites,
        current_tab: {
          url: current_tab_hook.url,
          title: current_tab_hook.title,
          include_in_prompt: current_tab_hook.include_in_prompt,
        },
        selected_text: text_selection_hook.selected_text,
        tab_plain_text: props.plain_text,
      })

      await send_prompt({
        prompt: props.prompt_field_value,
        assistant_name: selected_assistant_hook.selected_assistant_name!,
        assistant_url: props.assistant_url,
        plain_text,
        window_dimensions: {
          height: window_dimensions_hook.dimensions!.height,
          width: window_dimensions_hook.dimensions!.width,
        },
      })
    } else {
      if (vision_mode_hook.is_save_prompt_checked) {
        prompts_vision_history_hook.update_stored_prompts_history(
          props.prompt_field_value,
        )
      }

      await send_prompt({
        prompt: props.prompt_field_value,
        assistant_name: selected_assistant_vision_hook.selected_assistant_name!,
        assistant_url: props.assistant_url,
        is_vision_mode: true,
        image: vision_mode_hook.image!,
        window_dimensions: {
          height: window_dimensions_hook.dimensions!.height,
          width: window_dimensions_hook.dimensions!.width,
        },
      })
    }
  }

  return !vision_mode_hook.is_vision_mode ? (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={props.prompt_field_value}
      on_change={(value) => {
        props.set_prompt_field_value(value)
      }}
      on_submit={handle_submit}
      switches_slot={
        !current_tab_hook.is_new_tab_page &&
        !current_tab_hook.url.startsWith('https://taaabs.com') && (
          <UiSwitch
            is_checked={
              is_history_enabled && save_prompt_switch_hook.is_checked
            }
            is_disabled={!is_history_enabled}
            on_change={() => {
              save_prompt_switch_hook.set_is_checked(
                !save_prompt_switch_hook.is_checked,
              )
            }}
            label={'Keep in recents'}
          />
        )
      }
      prompts_history={[
        ...prompts_history_hook.prompts_history.filter(
          (prompt) => !default_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={is_history_enabled}
      autofocus={
        !(
          navigator.userAgent.includes('Firefox') &&
          navigator.userAgent.includes('Mobile')
        )
      }
      websites={websites}
      on_pin_click={(url) => {
        const pinned_website = pinned_websites_hook.pinned_websites.find(
          (website) => website.url == url,
        )
        if (pinned_website) {
          pinned_websites_hook.unpin_website(url)
          if (
            pinned_website.url == current_tab_hook.url &&
            !pinned_website.is_enabled
          ) {
            current_tab_hook.set_include_in_prompt(false)
          }
        } else {
          pinned_websites_hook.pin_website({
            url: current_tab_hook.url,
            title: current_tab_hook.title,
            plain_text: current_tab_hook.parsed_html?.plain_text || '',
            is_enabled: true,
          })
          current_tab_hook.set_include_in_prompt(true)
        }
      }}
      on_website_click={(url) => {
        if (
          pinned_websites_hook.pinned_websites.find(
            (website) => website.url == url,
          )
        ) {
          pinned_websites_hook.toggle_is_enabled(url)
        } else {
          current_tab_hook.set_include_in_prompt(
            !current_tab_hook.include_in_prompt,
          )
        }
      }}
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
      }}
    />
  ) : (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={props.prompt_field_value}
      on_change={props.set_prompt_field_value}
      on_submit={handle_submit}
      switches_slot={
        <UiSwitch
          is_checked={vision_mode_hook.is_save_prompt_checked}
          on_change={() => {
            vision_mode_hook.set_is_save_prompt_checked(
              !vision_mode_hook.is_save_prompt_checked,
            )
          }}
          label={'Keep in recents'}
        />
      }
      prompts_history={[
        ...prompts_vision_history_hook.prompts_history.filter(
          (prompt) => !default_vision_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={true}
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
