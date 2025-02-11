import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { PLAIN_TEXT_MAX_LENGTH } from '@/constants/plain-text-max-length'
import { assistants } from '@/constants/assistants'
import { usePopup } from './App'
import { Actions } from './components/Actions/Actions'
import { Header } from './components/Header'
import { PromptField } from './components/PromptField'
import { FooterLinks } from './components/FooterLinks'
import { SavedPrompts } from './components/SavedPrompts'

export const Popup: React.FC = () => {
  const {
    auth_state_hook,
    saved_check_hook,
    parsed_html_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    attach_text_switch_hook,
    vision_mode_hook,
    current_url_hook,
    text_selection_hook,
  } = usePopup()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const [shortened_plain_text, set_shortened_plain_text] = useState<string>()

  let assistant_url = assistants['chatgpt'].url
  if (
    !vision_mode_hook.is_vision_mode &&
    selected_assistant_hook.selected_assistant_name
  ) {
    assistant_url =
      assistants[selected_assistant_hook.selected_assistant_name].url
  } else if (selected_assistant_vision_hook.selected_assistant_name) {
    assistant_url =
      assistants[selected_assistant_vision_hook.selected_assistant_name].url
  }

  useUpdateEffect(() => {
    if (
      !text_selection_hook.selected_text &&
      !current_url_hook.url.startsWith('https://taaabs.com')
    ) {
      parsed_html_hook.get_parsed_html()
    }
  }, [text_selection_hook.selected_text, current_url_hook.url])

  // Shorten plain text whenever selected assistant is changed
  useUpdateEffect(() => {
    const max_length =
      (PLAIN_TEXT_MAX_LENGTH as any)[
        selected_assistant_hook.selected_assistant_name!
      ] || PLAIN_TEXT_MAX_LENGTH['default']

    const shortened_plain_text =
      parsed_html_hook.parsed_html?.plain_text &&
      (parsed_html_hook.parsed_html.plain_text.length > max_length
        ? parsed_html_hook.parsed_html.plain_text
            .substring(0, max_length)
            .trim() + '...'
        : parsed_html_hook.parsed_html.plain_text)

    set_shortened_plain_text(shortened_plain_text)
  }, [parsed_html_hook, selected_assistant_hook.selected_assistant_name])

  if (
    auth_state_hook.is_authenticated === undefined ||
    (auth_state_hook.is_authenticated &&
      saved_check_hook.is_saved === undefined) ||
    selected_assistant_hook.selected_assistant_name === undefined ||
    selected_assistant_vision_hook.selected_assistant_name === undefined ||
    attach_text_switch_hook.is_checked === undefined
  ) {
    return <></>
  }

  return (
    <Ui_extension_popup_templates_Popup
      should_set_height={
        // Cases when not showing recent prompts which adjust its height dynamically
        !current_url_hook.is_new_tab_page &&
        !current_url_hook.url.startsWith('https://taaabs.com')
      }
      header_slot={<Header />}
    >
      {!current_url_hook.url.startsWith('https://taaabs.com') &&
        !vision_mode_hook.is_vision_mode && <Actions />}

      <PromptField
        assistant_url={assistant_url}
        prompt_field_value={prompt_field_value}
        set_prompt_field_value={set_prompt_field_value}
        shortened_plain_text={shortened_plain_text}
      />

      <SavedPrompts
        prompt_field_value={prompt_field_value}
        assistant_url={assistant_url}
        shortened_plain_text={shortened_plain_text}
      />

      <FooterLinks />
    </Ui_extension_popup_templates_Popup>
  )
}
