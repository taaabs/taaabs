import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { use_popup } from '../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../data/default-prompts'
import { useEffect } from 'react'
import { use_prompts_history } from '../hooks/use-prompts-history'
import { use_prompts_vision_history } from '../hooks/use-prompts-vision-history'
import { send_prompt } from '../utils/send-prompt'
import { use_websites_store } from '../hooks/use-websites-store'
import { Textarea } from '@web-ui/components/extension/popup/Textarea'
import { is_youtube_video } from '@/utils/is-youtube-video'

export const RecentPrompts: React.FC<{
  prompt_field_value: string
  websites: Textarea.Website[]
  is_history_enabled: boolean
  assistant_url: string
}> = (props) => {
  const {
    text_selection_hook,
    vision_mode_hook,
    current_tab_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    window_dimensions_hook,
    message_history_hook,
  } = use_popup()
  const prompts_history_hook = use_prompts_history()
  const prompts_vision_history_hook = use_prompts_vision_history()
  const websites_store = use_websites_store()

  const handle_quick_prompt_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    // Save message
    await message_history_hook.save_message(prompt, props.websites)

    let plain_text = ''
    // Get plain text content from enabled websites
    const enabled_websites = props.websites.filter(
      (website) => website.is_enabled,
    )

    for (const website of enabled_websites) {
      if (website.url == current_tab_hook.url) {
        // For current tab, use selected text or parsed HTML
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

          if (is_youtube_video(website.url)) {
            plain_text += `<transcript title="${website.title}">${text}</transcript>`
          } else {
            plain_text += `<text title="${website.title}"><![CDATA[${text}]]></text>`
          }
        }
      } else {
        // For pinned websites, get stored website data
        const stored = await websites_store.get_website(website.url)
        if (stored?.plain_text) {
          if (is_youtube_video(website.url)) {
            plain_text += `<transcript title="${stored.title}">${stored.plain_text}</transcript>`
          } else {
            plain_text += `<text title="${stored.title}"><![CDATA[${stored.plain_text}]]></text>`
          }
        }
      }
    }

    await send_prompt({
      prompt,
      assistant_name: selected_assistant_hook.selected_assistant_name!,
      assistant_url: props.assistant_url,
      plain_text,
      open_in_new_tab: is_middle_click,
      window_dimensions: {
        height: window_dimensions_hook.dimensions?.height,
        width: window_dimensions_hook.dimensions?.width,
      },
      on_before_send: () => {
        prompts_history_hook.update_stored_prompts_history(prompt)
      },
    })
  }

  const handle_quick_prompt_vision_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    await send_prompt({
      prompt,
      assistant_name: selected_assistant_vision_hook.selected_assistant_name!,
      assistant_url: props.assistant_url,
      is_vision_mode: true,
      image: vision_mode_hook.image!,
      open_in_new_tab: is_middle_click,
      window_dimensions: {
        height: window_dimensions_hook.dimensions?.height,
        width: window_dimensions_hook.dimensions?.width,
      },
      on_before_send: () => {
        prompts_vision_history_hook.update_stored_prompts_history(prompt)
      },
    })
  }

  const handle_remove_prompt = async (prompt: string) => {
    if (vision_mode_hook.is_vision_mode) {
      await prompts_vision_history_hook.remove_prompt(prompt)
    } else {
      await prompts_history_hook.remove_prompt(prompt)
    }
  }

  // Quick select with keyboard numbers (1-9)
  useEffect(() => {
    const handle_key_down = (e: KeyboardEvent) => {
      if (props.prompt_field_value == '' && /^[1-9]$/.test(e.key)) {
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
    props.prompt_field_value,
    prompts_history_hook.prompts_history,
    prompts_vision_history_hook.prompts_history,
    vision_mode_hook.is_vision_mode,
    text_selection_hook.selected_text,
    current_tab_hook.parsed_html,
    selected_assistant_hook.selected_assistant_name,
    window_dimensions_hook.dimensions,
  ])

  // Check if we're navigating through message history
  const is_in_history_navigation = message_history_hook.current_index >= 0

  // Determine if we should show the filter phrase in non-vision mode
  const should_show_filter_phrase =
    props.is_history_enabled &&
    props.prompt_field_value &&
    // Either we're in history navigation mode (don't need page content)
    ((is_in_history_navigation &&
      !prompts_history_hook.prompts_history.includes(
        props.prompt_field_value,
      )) ||
      // Or we have content AND the prompt isn't already in history
      ((current_tab_hook.parsed_html || text_selection_hook.selected_text) &&
        !prompts_history_hook.prompts_history.includes(
          props.prompt_field_value,
        )))

  return (
    <>
      {!vision_mode_hook.is_vision_mode && (
        <Ui_extension_popup_templates_Popup_main_RecentPrompts
          recent_prompts={[...prompts_history_hook.prompts_history].reverse()}
          filter_phrase={
            should_show_filter_phrase ? props.prompt_field_value : ''
          }
          default_prompts={default_prompts}
          on_recent_prompt_click={handle_quick_prompt_click}
          on_recent_prompt_middle_click={(prompt) => {
            handle_quick_prompt_click(prompt, true)
          }}
          on_remove_prompt={handle_remove_prompt}
          is_disabled={!props.is_history_enabled}
          translations={{
            delete: 'Delete',
          }}
        />
      )}

      {vision_mode_hook.is_vision_mode && (
        <Ui_extension_popup_templates_Popup_main_RecentPrompts
          recent_prompts={[
            ...prompts_vision_history_hook.prompts_history,
          ].reverse()}
          filter_phrase={
            props.prompt_field_value &&
            !default_vision_prompts.includes(props.prompt_field_value) &&
            !prompts_vision_history_hook.prompts_history.includes(
              props.prompt_field_value,
            )
              ? props.prompt_field_value
              : ''
          }
          default_prompts={default_vision_prompts}
          on_recent_prompt_click={handle_quick_prompt_vision_click}
          on_recent_prompt_middle_click={(prompt) => {
            handle_quick_prompt_vision_click(prompt, true)
          }}
          on_remove_prompt={handle_remove_prompt}
          is_disabled={false}
          translations={{
            delete: 'Delete',
          }}
        />
      )}
    </>
  )
}
