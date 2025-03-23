import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { Switch as UiSwitch } from '@web-ui/components/Switch'
import { assistants, AssistantName } from '@/constants/assistants'
import { use_popup } from '../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../data/default-prompts'
import { useMemo, useRef, useEffect } from 'react'
import { Textarea as Ui_extension_popup_Textarea } from '@web-ui/components/extension/popup/Textarea'
import { send_prompt } from '../utils/send-prompt'
import { use_websites_store } from '../hooks/use-websites-store'
import { is_youtube_video } from '@/utils/is-youtube-video'
import browser from 'webextension-polyfill'

export const PromptField: React.FC<{
  assistant_url: string
  websites: Ui_extension_popup_Textarea.Website[]
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

  // Store original state to restore when returning to current prompt
  const original_state_ref = useRef<{
    include_current_tab: boolean
    prompt_value: string
  } | null>(null)

  useEffect(() => {
    // Reset original state reference when not navigating history
    if (message_history_hook.current_index == -1) {
      original_state_ref.current = null
    }
  }, [message_history_hook.current_index])

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
          favicon: website.favicon,
        })),
      )

      if (save_prompt_switch_hook.is_checked && props.is_history_enabled) {
        prompts_history_hook.update_stored_prompts_history(
          props.prompt_field_value,
        )
      }

      let plain_text = ''
      // All websites are enabled now, so we don't need to filter
      const websites_to_include = props.websites

      // Store all websites content before sending prompt
      for (const website of websites_to_include) {
        if (website.url == current_tab_hook.url) {
          const text =
            text_selection_hook.selected_text ||
            current_tab_hook.parsed_html?.plain_text ||
            ''

          if (text) {
            // Store current tab content in website store regardless of pinned status
            await websites_store.store_website({
              url: website.url,
              title: website.title,
              plain_text: text,
              favicon: website.favicon,
            })

            // Add to plain text for the prompt
            if (is_youtube_video(website.url)) {
              plain_text += `<transcript title="${website.title}">\n<![CDATA[\n${text}\n]]>\n</transcript>\n`
            } else {
              plain_text += `<text title="${website.title}">\n<![CDATA[\n${text}\n]]>\n</text>\n`
            }
          }
        } else {
          // For other websites, get stored website data
          const stored = await websites_store.get_website(website.url)
          if (stored?.plain_text) {
            if (is_youtube_video(website.url)) {
              plain_text += `<transcript title="${stored.title}">\n<![CDATA[\n${stored.plain_text}\n]]>\n</transcript>\n`
            } else {
              plain_text += `<text title="${stored.title}">\n<![CDATA[\n${stored.plain_text}\n]]>\n</text>\n`
            }
          }
        }
      }

      prompt_field_hook.clear_stored_value()
      send_prompt({
        prompt: props.prompt_field_value,
        assistant_name: selected_assistant_hook.selected_assistant_name!,
        assistant_url: props.assistant_url,
        plain_text,
        window_dimensions: {
          width: window_dimensions_hook.dimensions?.width,
          height: window_dimensions_hook.dimensions?.height,
        },
      })
    } else {
      if (vision_mode_hook.is_save_prompt_checked) {
        prompts_vision_history_hook.update_stored_prompts_history(
          props.prompt_field_value,
        )
      }

      prompt_field_hook.clear_stored_value()
      send_prompt({
        prompt: props.prompt_field_value,
        assistant_name: selected_assistant_vision_hook.selected_assistant_name!,
        assistant_url: props.assistant_url,
        is_vision_mode: true,
        image: vision_mode_hook.image!,
        window_dimensions: {
          width: window_dimensions_hook.dimensions?.width,
          height: window_dimensions_hook.dimensions?.height,
        },
      })
    }
  }

  const handle_pin_click = async (url: string) => {
    const websites_store = use_websites_store()
    const is_in_history_mode = message_history_hook.current_index >= 0

    // Check if URL is already pinned
    const is_pinned = pinned_websites_hook.pinned_websites.find(
      (w) => w.url == url,
    )

    if (is_pinned) {
      // If URL is pinned, unpin it
      pinned_websites_hook.unpin_website(url)
    } else {
      // If we're in history mode, handle pinning from history
      if (is_in_history_mode && message_history_hook.current_message) {
        // Find the website in the current history message
        const history_website =
          message_history_hook.current_message.websites.find(
            (w) => w.url == url,
          )

        if (history_website) {
          // Get stored content or use placeholder
          const stored = await websites_store.get_website(url)

          // If content is not already in the websites store, we need to store a placeholder
          // In a real implementation, you might have the content stored with the history
          if (!stored) {
            await websites_store.store_website({
              url: history_website.url,
              title: history_website.title || '',
              plain_text: '(Historical content)', // Placeholder or actual content if available
              favicon: history_website.favicon || undefined,
            })
          }

          // Pin the website from history
          pinned_websites_hook.pin_website({
            url,
            title: history_website.title || '',
            length: history_website.length || 0,
            favicon: history_website.favicon || undefined,
          })
        }
      } else if (url == current_tab_hook.url) {
        // Standard case: If URL is the current tab, store current tab data
        if (current_tab_hook.parsed_html) {
          await websites_store.store_website({
            url: current_tab_hook.url,
            title: current_tab_hook.title || '',
            plain_text:
              text_selection_hook.selected_text ||
              current_tab_hook.parsed_html.plain_text ||
              '',
            favicon: current_tab_hook.favicon || undefined,
          })
        }

        // Pin the current website
        pinned_websites_hook.pin_website({
          url,
          title: current_tab_hook.title || '',
          length:
            text_selection_hook.selected_text?.length ||
            current_tab_hook.parsed_html?.plain_text.length ||
            0,
          favicon: current_tab_hook.favicon || undefined,
        })
      }
    }
  }

  const handle_website_click = (url: string) => {
    browser.tabs.create({ url, active: false })
  }

  const handle_message_history_back = async () => {
    // Save original state if this is first time going into history
    if (message_history_hook.current_index == -1) {
      original_state_ref.current = {
        include_current_tab: current_tab_hook.include_in_prompt,
        prompt_value: props.prompt_field_value,
      }
    }

    current_tab_hook.set_include_in_prompt(false)
    const previous_message = message_history_hook.navigate_back()
    if (previous_message) {
      prompt_field_hook.update_value(previous_message.prompt)
    }
  }

  const handle_message_history_forward = async () => {
    current_tab_hook.set_include_in_prompt(false)
    const next_message = message_history_hook.navigate_forward()
    if (next_message) {
      prompt_field_hook.update_value(next_message.prompt)
    } else {
      // We're returning to the current state (most recent)
      if (original_state_ref.current) {
        // Don't restore pinned websites

        // Restore current tab inclusion state
        current_tab_hook.set_include_in_prompt(
          original_state_ref.current.include_current_tab,
        )

        // Restore the original prompt text
        prompt_field_hook.update_value(original_state_ref.current.prompt_value)

        // Clear the saved original state
        original_state_ref.current = null
      } else {
        // Don't clear pinned websites
        prompt_field_hook.update_value('')
      }
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
      switch_slot={
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
          label={'Keep in recent prompts'}
        />
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
      current_history_entry_timestamp={
        message_history_hook.current_message?.timestamp
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
      switch_slot={
        <UiSwitch
          is_checked={vision_mode_hook.is_save_prompt_checked}
          on_change={() => {
            vision_mode_hook.set_is_save_prompt_checked(
              !vision_mode_hook.is_save_prompt_checked,
            )
          }}
          label={'Keep in recent prompts:'}
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
