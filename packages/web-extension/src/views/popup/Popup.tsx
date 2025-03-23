import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { assistants } from '@/constants/assistants'
import { use_popup } from './App'
import { Actions } from './components/Actions/Actions'
import { Header } from './components/Header'
import { PromptField } from './components/PromptField'
import { FooterLinks } from './components/FooterLinks'
import { RecentPrompts } from './components/RecentPrompts'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect, useMemo } from 'react'
import { Textarea } from '@web-ui/components/extension/popup/Textarea'

export const Popup: React.FC = () => {
  const {
    auth_state_hook,
    saved_check_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    custom_assistant_url_hook,
    vision_mode_hook,
    current_tab_hook,
    text_selection_hook,
    pinned_websites_hook,
    message_history_hook,
    prompt_field_hook,
  } = use_popup()

  // Update the prompt field mode when vision mode changes
  useEffect(() => {
    prompt_field_hook.set_mode(vision_mode_hook.is_vision_mode)
  }, [vision_mode_hook.is_vision_mode])

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

  useUpdateEffect(() => {
    if (!text_selection_hook.selected_text) {
      current_tab_hook.get_parsed_html()
    }
  }, [text_selection_hook.selected_text, current_tab_hook.url])

  // Change popup width in vision mode. Value is set in index.html
  useUpdateEffect(() => {
    const root_element = document.getElementById('root')
    if (root_element) {
      if (vision_mode_hook.is_vision_mode) {
        root_element.classList.add('vision-mode')
      } else {
        root_element.classList.remove('vision-mode')
      }
    }
  }, [vision_mode_hook.is_vision_mode])

  // Check if we're navigating through history (current_index >= 0)
  const is_navigating_history = message_history_hook.current_index >= 0

  const websites = useMemo<Textarea.Website[]>(() => {
    // If navigating through history, show websites from that history item
    if (is_navigating_history && message_history_hook.current_message) {
      // Create a set of pinned website URLs for efficient lookup
      const pinned_website_urls = new Set(
        pinned_websites_hook.pinned_websites.map((website) => website.url),
      )

      return message_history_hook.current_message.websites.map((website) => ({
        url: website.url,
        title: website.title,
        length: website.length,
        // Check if this history website is currently pinned
        is_pinned: pinned_website_urls.has(website.url),
        favicon: website.favicon || undefined,
      }))
    }

    // Not navigating history, show current websites
    const all_websites = [
      // Include pinned websites with their true pinned status
      ...pinned_websites_hook.pinned_websites.map((website) => ({
        url: website.url,
        title: website.title,
        length: website.length,
        is_pinned: true, // Always true for pinned websites
        is_enabled: true, // Always enabled
        favicon: website.favicon || undefined,
      })),

      // Add current tab if it has content and isn't already in the list
      ...(!pinned_websites_hook.pinned_websites.some(
        (website) => website.url == current_tab_hook.url,
      ) &&
      (text_selection_hook.selected_text || current_tab_hook.parsed_html)
        ? [
            {
              url: current_tab_hook.url,
              title: current_tab_hook.title || '',
              length:
                text_selection_hook.selected_text?.length ||
                current_tab_hook.parsed_html?.plain_text.length ||
                0,
              is_pinned: false,
              is_enabled: true, // Always enabled
              favicon: current_tab_hook.favicon || undefined,
            },
          ]
        : []),
    ]

    return all_websites
  }, [
    is_navigating_history,
    message_history_hook.current_message,
    message_history_hook.current_index,
    pinned_websites_hook.pinned_websites,
    current_tab_hook.parsed_html,
    current_tab_hook.include_in_prompt,
    current_tab_hook.url,
    current_tab_hook.title,
    current_tab_hook.favicon,
    text_selection_hook.selected_text,
  ])

  const is_history_enabled = useMemo(() => {
    // Since all websites are now always enabled, we just need to check if there are any websites

    // When navigating history, enable if the current message has websites
    if (is_navigating_history && message_history_hook.current_message) {
      return message_history_hook.current_message.websites.length > 0
    }

    // Check if there are any pinned websites
    const has_pinned_websites = pinned_websites_hook.pinned_websites.length > 0

    // Check if current tab text is available
    const has_current_tab_text =
      !pinned_websites_hook.pinned_websites.some(
        (website) => website.url == current_tab_hook.url,
      ) &&
      (!!text_selection_hook.selected_text || !!current_tab_hook.parsed_html)

    return has_pinned_websites || has_current_tab_text
  }, [
    is_navigating_history,
    message_history_hook.current_message,
    pinned_websites_hook.pinned_websites,
    current_tab_hook.include_in_prompt,
    text_selection_hook.selected_text,
    current_tab_hook.parsed_html,
  ])

  if (
    auth_state_hook.is_authenticated === undefined ||
    (auth_state_hook.is_authenticated &&
      saved_check_hook.is_saved === undefined) ||
    selected_assistant_hook.selected_assistant_name === undefined ||
    selected_assistant_vision_hook.selected_assistant_name === undefined
  ) {
    return <></>
  }

  return (
    <Ui_extension_popup_templates_Popup
      header_slot={<Header />}
      actions_slot={
        !current_tab_hook.url.startsWith('https://taaabs.com') &&
        !vision_mode_hook.is_vision_mode ? (
          <Actions />
        ) : undefined
      }
      prompt_field_slot={
        <PromptField
          assistant_url={assistant_url}
          websites={websites}
          is_history_enabled={is_history_enabled}
          prompt_field_value={prompt_field_hook.value}
          set_prompt_field_value={prompt_field_hook.update_value}
        />
      }
      recent_prompts_slot={
        <RecentPrompts
          prompt_field_value={prompt_field_hook.value}
          websites={websites}
          is_history_enabled={is_history_enabled}
          assistant_url={assistant_url}
        />
      }
      footer_links_slot={<FooterLinks />}
    />
  )
}
