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
    // First collect all websites that would normally be shown
    const normal_websites = [
      // Add pinned websites
      ...pinned_websites_hook.pinned_websites.map((website) => ({
        url: website.url,
        title: website.title,
        length: website.length,
        is_pinned: true,
        is_enabled: website.is_enabled,
      })),
      // Add temp current tab if present, otherwise add current tab if it has content and isn't already pinned
      ...(message_history_hook.temp_current_tab
        ? [
            {
              url: message_history_hook.temp_current_tab.url,
              title: message_history_hook.temp_current_tab.title,
              length: message_history_hook.temp_current_tab.length,
              is_pinned: false,
              is_enabled: message_history_hook.temp_current_tab.is_enabled,
            },
          ]
        : !pinned_websites_hook.pinned_websites.some(
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
              is_enabled: current_tab_hook.include_in_prompt,
            },
          ]
        : []),
    ]

    // If we're navigating history and the current URL isn't already in the list, add it
    if (
      is_navigating_history &&
      !normal_websites.some(
        (website) => website.url === current_tab_hook.url,
      ) &&
      (text_selection_hook.selected_text || current_tab_hook.parsed_html) &&
      !current_tab_hook.url.startsWith('https://taaabs.com')
    ) {
      normal_websites.push({
        url: current_tab_hook.url,
        title: current_tab_hook.title || '',
        length:
          text_selection_hook.selected_text?.length ||
          current_tab_hook.parsed_html?.plain_text.length ||
          0,
        is_pinned: false,
        is_enabled: current_tab_hook.include_in_prompt,
      })
    }

    return normal_websites
  }, [
    pinned_websites_hook.pinned_websites,
    current_tab_hook.parsed_html,
    current_tab_hook.include_in_prompt,
    current_tab_hook.url,
    current_tab_hook.title,
    text_selection_hook.selected_text,
    message_history_hook.temp_current_tab,
    is_navigating_history,
  ])

  const is_history_enabled = useMemo(() => {
    // Check if there are any enabled pinned websites
    const has_enabled_pinned_websites =
      pinned_websites_hook.pinned_websites.some((website) => website.is_enabled)

    // Check if temp current tab is enabled
    const has_enabled_temp_current_tab =
      message_history_hook.temp_current_tab?.is_enabled

    // Check if current tab text is enabled and available
    const has_enabled_current_tab_text =
      !message_history_hook.temp_current_tab && // Only check current tab if no temp tab
      current_tab_hook.include_in_prompt &&
      !pinned_websites_hook.pinned_websites.some(
        (website) => website.url == current_tab_hook.url,
      ) &&
      (!!text_selection_hook.selected_text || !!current_tab_hook.parsed_html)

    return (
      has_enabled_pinned_websites ||
      has_enabled_temp_current_tab ||
      has_enabled_current_tab_text
    )
  }, [
    pinned_websites_hook.pinned_websites,
    current_tab_hook.include_in_prompt,
    text_selection_hook.selected_text,
    current_tab_hook.parsed_html,
    message_history_hook.temp_current_tab,
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
        !vision_mode_hook.is_vision_mode ? <Actions /> : undefined
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
