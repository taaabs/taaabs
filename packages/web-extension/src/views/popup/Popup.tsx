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
import { StoredPinnedWebsite } from './hooks/use-pinned-websites'
import { websites_store } from './hooks/use-pinned-websites'

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
    context_history_hook,
  } = use_popup()

  const prompt_field_hook = use_prompt_field()

  const handle_context_history_back = async () => {
    const snapshot = context_history_hook.navigate_back()
    if (snapshot) {
      prompt_field_hook.update_value(snapshot.prompt)

      // Batch all the website updates into a single operation
      try {
        // First gather all the stored website data
        const websites_to_restore = await Promise.all(
          snapshot.pinned_websites_urls.map(async (url) => {
            const stored = await websites_store.getItem<StoredPinnedWebsite>(url)
            return stored
              ? {
                  url: stored.url,
                  title: stored.title,
                  plain_text: stored.plain_text,
                  is_enabled: stored.is_enabled,
                }
              : null
          }),
        )

        // Then update state in a single batch
        const filtered_websites = websites_to_restore.filter(
          (w): w is NonNullable<typeof w> => w !== null,
        )
        pinned_websites_hook.update_all_websites(filtered_websites)
      } catch (error) {
        console.error('Error restoring pinned websites:', error)
      }
    }
  }

  const handle_context_history_forward = async () => {
    const snapshot = context_history_hook.navigate_forward()
    if (snapshot) {
      prompt_field_hook.update_value(snapshot.prompt)

      try {
        // First gather all the stored website data
        const websites_to_restore = await Promise.all(
          snapshot.pinned_websites_urls.map(async (url) => {
            const stored = await websites_store.getItem<StoredPinnedWebsite>(url)
            return stored
              ? {
                  url: stored.url,
                  title: stored.title,
                  plain_text: stored.plain_text,
                  is_enabled: stored.is_enabled,
                }
              : null
          }),
        )

        // Then update state in a single batch
        const filtered_websites = websites_to_restore.filter(
          (w): w is NonNullable<typeof w> => w !== null,
        )
        pinned_websites_hook.update_all_websites(filtered_websites)
      } catch (error) {
        console.error('Error restoring pinned websites:', error)
      }
    } else {
      // Clear if we've returned to current state
      prompt_field_hook.update_value('')
      pinned_websites_hook.update_all_websites([])
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
          context_history_hook.can_navigate_back
            ? handle_context_history_back
            : undefined
        }
        on_history_forward_click={
          context_history_hook.can_navigate_forward
            ? handle_context_history_forward
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
