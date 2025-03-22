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
    pinned_websites: typeof pinned_websites_hook.pinned_websites
    include_current_tab: boolean
    prompt_value: string // Added to store the prompt text
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
          is_enabled: website.is_enabled,
          favicon: website.favicon,
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

      // Store all enabled websites content before sending prompt
      for (const website of enabled_websites) {
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

      await send_prompt({
        prompt: props.prompt_field_value,
        assistant_name: selected_assistant_hook.selected_assistant_name!,
        assistant_url: props.assistant_url,
        plain_text,
        window_dimensions: {
          width: window_dimensions_hook.dimensions?.width,
          height: window_dimensions_hook.dimensions?.height,
        },
      })

      prompt_field_hook.clear_stored_value()
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
          width: window_dimensions_hook.dimensions?.width,
          height: window_dimensions_hook.dimensions?.height,
        },
      })

      // Clear the stored prompt value after submitting in vision mode as well
      prompt_field_hook.clear_stored_value()
    }
  }

  // Helper function to exit history mode and restore original state
  const exit_history_mode = () => {
    if (original_state_ref.current) {
      // Restore original state
      pinned_websites_hook.replace_pinned_websites(
        original_state_ref.current.pinned_websites,
      )
      current_tab_hook.set_include_in_prompt(
        original_state_ref.current.include_current_tab,
      )
      prompt_field_hook.update_value(original_state_ref.current.prompt_value)
      message_history_hook.set_temp_current_tab(undefined)

      // Reset history index
      message_history_hook.set_current_index(-1)

      // Clear original state reference
      original_state_ref.current = null
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
      // Check if we're in history mode
      const is_history_mode = message_history_hook.current_index >= 0
      const is_temp_current_tab =
        message_history_hook.temp_current_tab &&
        message_history_hook.temp_current_tab.url == url

      // If we're in history mode and the URL is the temp current tab,
      // use the title and length from the temp current tab
      if (is_history_mode && is_temp_current_tab) {
        // Check if the URL exists in original pinned websites
        const existing_pinned_index =
          original_state_ref.current?.pinned_websites.findIndex(
            (p) => p.url == url,
          )

        if (existing_pinned_index == -1) {
          // If URL is not pinned, add it to both current and original states
          pinned_websites_hook.pin_website({
            url,
            title: message_history_hook.temp_current_tab!.title,
            length: message_history_hook.temp_current_tab!.length,
            favicon: message_history_hook.temp_current_tab!.favicon, // Include favicon
          })

          if (original_state_ref.current) {
            original_state_ref.current.pinned_websites.push({
              url,
              title: message_history_hook.temp_current_tab!.title,
              length: message_history_hook.temp_current_tab!.length,
              is_enabled: true,
              favicon: message_history_hook.temp_current_tab!.favicon, // Include favicon
            })
          }
        } else {
          // If URL is already pinned but disabled, enable it in both states
          const updated_websites = pinned_websites_hook.pinned_websites.map(
            (website) =>
              website.url == url ? { ...website, is_enabled: true } : website,
          )
          pinned_websites_hook.replace_pinned_websites(updated_websites)

          if (original_state_ref.current) {
            original_state_ref.current.pinned_websites =
              original_state_ref.current.pinned_websites.map((website) =>
                website.url == url ? { ...website, is_enabled: true } : website,
              )
          }
        }

        // Exit history mode after pinning/enabling
        exit_history_mode()
      } else if (url == current_tab_hook.url) {
        // If URL is the current tab, store current tab data
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
      } else if (is_history_mode) {
        // This is a website from history (not the temp current tab)
        const website = props.websites.find((w) => w.url == url)
        if (website) {
          pinned_websites_hook.pin_website({
            url,
            title: website.title,
            length: website.length,
            favicon: website.favicon, // Include favicon
          })

          // Exit history mode after pinning
          exit_history_mode()
        }
      }
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

  const handle_message_history_forward = async () => {
    current_tab_hook.set_include_in_prompt(false)
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
      // We're returning to the current state (most recent)
      if (original_state_ref.current) {
        // Restore original pinned websites
        pinned_websites_hook.replace_pinned_websites(
          original_state_ref.current.pinned_websites,
        )

        // Restore current tab inclusion state
        current_tab_hook.set_include_in_prompt(
          original_state_ref.current.include_current_tab,
        )

        // Clear the temp current tab
        message_history_hook.set_temp_current_tab(undefined)

        // Restore the original prompt text that was typed in
        prompt_field_hook.update_value(original_state_ref.current.prompt_value)

        // Clear the saved original state as we're back at current
        original_state_ref.current = null
      } else {
        // Fallback to previous behavior if no original state was saved
        pinned_websites_hook.replace_pinned_websites([])
        prompt_field_hook.update_value('')
        message_history_hook.set_temp_current_tab(undefined)
      }
    }
  }

  const handle_message_history_back = async () => {
    // Save original state if this is the first navigation
    if (message_history_hook.current_index == -1) {
      original_state_ref.current = {
        pinned_websites: [...pinned_websites_hook.pinned_websites],
        include_current_tab: current_tab_hook.include_in_prompt,
        prompt_value: props.prompt_field_value,
      }
    }

    current_tab_hook.set_include_in_prompt(false)
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
