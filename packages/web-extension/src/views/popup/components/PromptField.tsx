import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { Switch as UiSwitch } from '@web-ui/components/Switch'
import { assistants, AssistantName } from '@/constants/assistants'
import { use_popup } from '../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../data/default-prompts'
import { useMemo } from 'react'
import { ChatField } from '@web-ui/components/ChatField'
import { send_prompt } from '../utils/send-prompt'
import { use_websites_store } from '../hooks/use-websites-store'

export const PromptField: React.FC<{
  assistant_url: string
  websites: ChatField.Website[]
  is_history_enabled: boolean
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
    message_history_hook,
    prompt_field_hook,
  } = use_popup()
  const websites_store = use_websites_store()

  const assistants_for_selector = useMemo(() => {
    return Object.entries(assistants)
      .filter(
        ([_, assistant]) =>
          !vision_mode_hook.is_vision_mode || assistant.supports_vision,
      )
      .map(([name, assistant]) => {
        let logo_url: string | undefined
        if (assistant.url) {
          const hostname = new URL(assistant.url).hostname
          logo_url = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
        }
        return { name, label: assistant.label, logo_url }
      }, [])
  }, [vision_mode_hook.is_vision_mode])

  const handle_submit = async () => {
    if (!props.prompt_field_value) return

    if (!vision_mode_hook.is_vision_mode) {
      // Save message
      await message_history_hook.save_message(
        props.prompt_field_value,
        props.websites.map((website) => ({
          url: website.url,
          title: website.title,
          length: website.length,
          is_pinned: website.is_pinned,
          is_enabled: website.is_enabled,
        })),
      )

      if (save_prompt_switch_hook.is_checked && props.is_history_enabled) {
        prompts_history_hook.update_stored_prompts_history(
          props.prompt_field_value,
        )
      }

      let plain_text = ''
      const enabled_websites = props.websites.filter(
        (website) => website.is_enabled,
      )
      for (const website of enabled_websites) {
        // Add plain text from pinned website
        if (website.url == current_tab_hook.url) {
          // For current tab, use selected text or parsed HTML
          const text =
            text_selection_hook.selected_text ||
            current_tab_hook.parsed_html?.plain_text ||
            ''
          if (text) {
            plain_text += `<page title="${website.title}">\n<![CDATA[\n${text}\n]]>\n</page>\n\n`
          }
        } else {
          // For pinned websites, get stored website data
          const stored = await websites_store.get_website(website.url)
          if (stored?.plain_text) {
            plain_text += `<page title="${stored.title}">\n<![CDATA[\n${stored.plain_text}\n]]>\n</page>\n\n`
          }
        }
      }

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

  const handle_pin_click = async (url: string) => {
    const websites_store = use_websites_store()

    // Check if URL is already pinned
    const is_pinned = pinned_websites_hook.pinned_websites.find(
      (w) => w.url == url,
    )

    if (is_pinned) {
      // If URL is pinned, unpin it
      pinned_websites_hook.unpin_website(url)
    } else {
      // If URL is not pinned and it's current tab
      if (url == current_tab_hook.url) {
        // Store current tab data
        if (current_tab_hook.parsed_html) {
          await websites_store.store_website({
            url: current_tab_hook.url,
            title: current_tab_hook.title || '',
            plain_text:
              text_selection_hook.selected_text ||
              current_tab_hook.parsed_html.plain_text ||
              '',
          })
        }
      }

      // Pin the website
      pinned_websites_hook.pin_website({
        url: url,
        title: current_tab_hook.title || '',
        length:
          text_selection_hook.selected_text?.length ||
          current_tab_hook.parsed_html?.plain_text.length ||
          0,
      })
    }
  }

  const handle_website_click = async (url: string) => {
    // Check if URL is in pinned websites
    const pinned_website = pinned_websites_hook.pinned_websites.find(
      (w) => w.url == url,
    )

    if (pinned_website) {
      // If it's a pinned website, toggle its enabled state
      pinned_websites_hook.toggle_website_enabled(url)
    } else if (message_history_hook.temp_current_tab?.url == url) {
      // If it's the temp current tab, toggle its enabled state using set_temp_current_tab
      message_history_hook.set_temp_current_tab({
        ...message_history_hook.temp_current_tab,
        is_enabled: !message_history_hook.temp_current_tab.is_enabled,
      })
    } else {
      // If it's the current tab, toggle the include_in_prompt state
      if (url == current_tab_hook.url) {
        current_tab_hook.set_include_in_prompt(
          !current_tab_hook.include_in_prompt,
        )
      }
    }
  }

  const handle_message_history_back = async () => {
    const previous_message = message_history_hook.navigate_back()
    if (previous_message) {
      prompt_field_hook.update_value(previous_message.prompt)
      pinned_websites_hook.replace_pinned_websites(
        previous_message.websites.filter((website) => website.is_pinned),
      )
      // Set message that is not pinned as temp current tab
      const unpinned_website = previous_message.websites.find(
        (website) => !website.is_pinned,
      )
      message_history_hook.set_temp_current_tab(unpinned_website)
    }
  }

  const handle_message_history_forward = async () => {
    const next_message = message_history_hook.navigate_forward()
    if (next_message) {
      prompt_field_hook.update_value(next_message.prompt)
      pinned_websites_hook.replace_pinned_websites(
        next_message.websites.filter((website) => website.is_pinned),
      )
      // Set message that is not pinned as temp current tab
      const unpinned_website = next_message.websites.find(
        (website) => !website.is_pinned,
      )
      message_history_hook.set_temp_current_tab(unpinned_website)
    } else {
      pinned_websites_hook.replace_pinned_websites([])
      prompt_field_hook.update_value('')
      message_history_hook.set_temp_current_tab(undefined)
    }
  }

  return !vision_mode_hook.is_vision_mode ? (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={props.prompt_field_value}
      on_change={(value) => {
        props.set_prompt_field_value(value)
      }}
      on_submit={handle_submit}
      assistants={assistants_for_selector}
      selected_assistant_name={selected_assistant_hook.selected_assistant_name!}
      on_assistant_change={(name) =>
        selected_assistant_hook.change_selected_assistant(name as AssistantName)
      }
      switches_slot={
        !current_tab_hook.is_new_tab_page &&
        !current_tab_hook.url.startsWith('https://taaabs.com') && (
          <UiSwitch
            is_checked={
              props.is_history_enabled && save_prompt_switch_hook.is_checked
            }
            is_disabled={!props.is_history_enabled}
            on_change={() => {
              save_prompt_switch_hook.set_is_checked(
                !save_prompt_switch_hook.is_checked,
              )
            }}
            label={'Keep my prompt in recents'}
          />
        )
      }
      prompts_history={[
        ...prompts_history_hook.prompts_history.filter(
          (prompt) => !default_prompts.includes(prompt),
        ),
      ].reverse()}
      is_history_enabled={props.is_history_enabled}
      autofocus={
        !(
          navigator.userAgent.includes('Firefox') &&
          navigator.userAgent.includes('Mobile')
        )
      }
      websites={props.websites}
      on_pin_click={handle_pin_click}
      on_website_click={handle_website_click}
      on_history_back_click={
        message_history_hook.can_navigate_back
          ? handle_message_history_back
          : undefined
      }
      on_history_forward_click={
        message_history_hook.can_navigate_forward
          ? handle_message_history_forward
          : undefined
      }
      is_message_history_enabled={true}
      translations={{
        new_prompt: 'New chat',
        placeholder: `Ask ${
          assistants[selected_assistant_hook.selected_assistant_name!].label
        }`,
        active_input_placeholder_suffix: '(⇅ for history)',
      }}
    />
  ) : (
    <Ui_extension_popup_templates_Popup_main_PromptField
      value={props.prompt_field_value}
      on_change={props.set_prompt_field_value}
      on_submit={handle_submit}
      assistants={assistants_for_selector}
      selected_assistant_name={
        selected_assistant_vision_hook.selected_assistant_name!
      }
      on_assistant_change={(name) =>
        selected_assistant_vision_hook.change_selected_assistant(
          name as AssistantName,
        )
      }
      switches_slot={
        <UiSwitch
          is_checked={vision_mode_hook.is_save_prompt_checked}
          on_change={() => {
            vision_mode_hook.set_is_save_prompt_checked(
              !vision_mode_hook.is_save_prompt_checked,
            )
          }}
          label={'Keep my prompt in recents'}
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
            .label
        }`,
        active_input_placeholder_suffix: '(⇅ for history)',
      }}
    />
  )
}
