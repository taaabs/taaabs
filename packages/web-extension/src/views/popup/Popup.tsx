import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { assistants } from '@/constants/assistants'
import { use_popup } from './App'
import { Actions } from './components/Actions/Actions'
import { Header } from './components/Header'
import { PromptField } from './components/PromptField'
import { FooterLinks } from './components/FooterLinks'
import { RecentPrompts } from './components/RecentPrompts'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_prompt_field } from './hooks/use-prompt-field'
import { useEffect } from 'react'
// import { StoredPinnedWebsite } from './hooks/use-pinned-websites'
// import { websites_store } from './hooks/use-pinned-websites'

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
  } = use_popup()

  const prompt_field_hook = use_prompt_field()

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
      prompt_field_hook.update_value('')
      message_history_hook.set_temp_current_tab(undefined)
    }
  }

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

  if (
    !text_selection_hook.selected_text &&
    !current_tab_hook.url.startsWith('https://taaabs.com')
  ) {
    current_tab_hook.get_parsed_html()
  }

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
      should_set_height={
        // Cases when not showing recent prompts which adjust its height dynamically
        !current_tab_hook.is_new_tab_page &&
        !current_tab_hook.url.startsWith('https://taaabs.com')
      }
      header_slot={<Header />}
    >
      {!current_tab_hook.url.startsWith('https://taaabs.com') &&
        !vision_mode_hook.is_vision_mode && <Actions />}

      <PromptField
        assistant_url={assistant_url}
        prompt_field_value={prompt_field_hook.value}
        set_prompt_field_value={prompt_field_hook.update_value}
        plain_text={current_tab_hook.parsed_html?.plain_text}
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
      />

      <RecentPrompts
        prompt_field_value={prompt_field_hook.value}
        assistant_url={assistant_url}
        plain_text={current_tab_hook.parsed_html?.plain_text}
      />

      <FooterLinks />
    </Ui_extension_popup_templates_Popup>
  )
}
