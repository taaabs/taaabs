import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { AssistantSelector as Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField/AssistantSelector'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { Footer as Ui_extension_popup_templates_Popup_Footer } from '@web-ui/components/extension/popup/templates/Popup/Footer'
import { useEffect, useState } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'
import { use_selected_assistant } from './hooks/use-selected-assistant'
import { use_local_assistant_port } from './hooks/use-local-assistant-port'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { use_prompts_history } from './hooks/use-prompts-history'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_attach_text_checkbox } from './hooks/use-attach-text-checkbox'
import { use_text_selection } from './hooks/use-text-selection'
import { default_prompts } from './data/default-prompts'
import { PLAIN_TEXT_MAX_LENGTH } from '@/constants/plain-text-max-length'
import { use_parsed_html } from './hooks/use-parsed-html'
import { calculate_shortening_percentage } from './helpers/calculate-shortening-percentage'

import '../../../../web-ui/src/styles/theme.scss'
import { use_auth_state } from './hooks/use-auth-state'
import { get_attach_text_checkbox_label } from './helpers/get-attach-text-checkbox-label'
import { SendPrompt_Message } from '@/types/messages'
import { AssistantName, assistants } from '@/constants/assistants'

export const Popup: React.FC = () => {
  const auth_state_hook = use_auth_state()
  const saved_check_hook = use_saved_check()
  const create_bookmark_hook = use_create_bookmark()
  const delete_bookmark_hook = use_delete_bookmark()
  const prompts_history_hook = use_prompts_history()
  const parsed_html_hook = use_parsed_html()
  const selected_chatbot_hook = use_selected_assistant()
  const { local_assistant_port } = use_local_assistant_port()
  const attach_text_checkbox_hook = use_attach_text_checkbox()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const [shortened_plan_text, set_shortened_plain_text] = useState<string>()
  const text_selection_hook = use_text_selection({ prompt_field_value })
  const [popup_restored_count, set_popup_restored_count] = useState<number>()

  let assistant_url = assistants['chatgpt'].url
  if (selected_chatbot_hook.selected_assistant_name) {
    if (selected_chatbot_hook.selected_assistant_name != 'custom') {
      assistant_url =
        assistants[selected_chatbot_hook.selected_assistant_name].url
    } else if (local_assistant_port) {
      assistant_url =
        assistants[selected_chatbot_hook.selected_assistant_name].url +
        local_assistant_port +
        '/'
    }
  }

  // Check if current page is saved
  useUpdateEffect(() => {
    if (auth_state_hook.is_authenticated) {
      saved_check_hook.check_is_saved()
    }
  }, [auth_state_hook.is_authenticated])

  // Shorten plain text
  useUpdateEffect(() => {
    const max_length =
      (PLAIN_TEXT_MAX_LENGTH as any)[
        selected_chatbot_hook.selected_assistant_name!
      ] || PLAIN_TEXT_MAX_LENGTH['default']

    const shortened_plain_text =
      parsed_html_hook.parsed_html?.plain_text &&
      (parsed_html_hook.parsed_html.plain_text.length > max_length
        ? parsed_html_hook.parsed_html.plain_text
            .substring(0, max_length)
            .trim() + '...'
        : parsed_html_hook.parsed_html.plain_text)

    set_shortened_plain_text(shortened_plain_text)
  }, [parsed_html_hook, selected_chatbot_hook.selected_assistant_name])

  useEffect(() => {
    console.debug('Taaabs popup has been initialized.')

    const listener = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'popup-restored') {
        set_popup_restored_count(Date.now())
      }
    }
    window.addEventListener('message', listener)

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [])

  useEffect(() => {
    create_bookmark_hook.set_is_creating(false)
    delete_bookmark_hook.set_is_deleting(false)
  }, [saved_check_hook.is_saved])

  if (
    auth_state_hook.is_authenticated === undefined ||
    (auth_state_hook.is_authenticated &&
      saved_check_hook.is_saved === undefined) ||
    selected_chatbot_hook.selected_assistant_name === undefined ||
    attach_text_checkbox_hook.is_checked === undefined
  ) {
    return <></>
  }

  const saved_items = [
    <UiButton
      href={
        'https://taaabs.com/library#url=' +
        encodeURIComponent(url_cleaner(window.location.href))
      }
      rel="noreferrer noopener"
      is_disabled={delete_bookmark_hook.is_deleting}
    >
      Edit
    </UiButton>,
    <UiButton
      on_click={delete_bookmark_hook.delete_bookmark}
      is_danger={true}
      is_disabled={delete_bookmark_hook.is_deleting}
    >
      Delete
    </UiButton>,
  ]

  const unsaved_items = [
    <UiButton
      on_click={() => {
        create_bookmark_hook.create_bookmark({
          reader_data: parsed_html_hook.parsed_html?.reader_data,
        })
      }}
      is_disabled={create_bookmark_hook.is_creating}
    >
      Clip this page
    </UiButton>,
  ]

  const handle_quick_prompt_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    if (text_selection_hook.selected_text || parsed_html_hook.parsed_html) {
      send_message({
        action: 'send-prompt',
        assistant_name: selected_chatbot_hook.selected_assistant_name,
        assistant_url,
        prompt,
        plain_text: text_selection_hook.selected_text || shortened_plan_text,
        open_in_new_tab: is_middle_click,
      } as SendPrompt_Message)

      // Update prompts history when a quick prompt is clicked
      const new_prompts_history = prompts_history_hook.prompts_history.filter(
        (item) => item != prompt,
      )
      new_prompts_history.push(prompt)
      prompts_history_hook.set_prompts_history(new_prompts_history)
    }
  }

  return (
    <div className={styles.container}>
      <Ui_extension_popup_templates_Popup
        header_slot={
          <Ui_extension_popup_templates_Popup_Header
            settings_on_click={() => {
              send_message({ action: 'open-options-page' })
            }}
          />
        }
        footer_slot={
          <Ui_extension_popup_templates_Popup_Footer
            feedback_url="https://github.com/taaabs/taaabs/discussions"
            transaltions={{
              contribute: 'Contribute',
              send_feedback: 'Send feedback',
            }}
          />
        }
      >
        {!window.location.href.startsWith('https://taaabs.com') && (
          <Ui_extension_popup_templates_Popup_main_Actions>
            <UiButton
              href={'https://taaabs.com/library#fresh'}
              rel="noreferrer noopener"
              is_outlined={true}
            >
              {auth_state_hook.is_authenticated ? 'Go to library' : 'Sign in'}
            </UiButton>
            {auth_state_hook.is_authenticated &&
              (saved_check_hook.is_saved ? saved_items : unsaved_items)}
          </Ui_extension_popup_templates_Popup_main_Actions>
        )}

        <Ui_extension_popup_templates_Popup_main_RecentPrompts
          recent_prompts={[...prompts_history_hook.prompts_history].reverse()}
          filter_phrase={
            attach_text_checkbox_hook.is_checked &&
            (parsed_html_hook.parsed_html ||
              text_selection_hook.selected_text) &&
            !prompts_history_hook.prompts_history.includes(prompt_field_value)
              ? prompt_field_value
              : ''
          }
          default_prompts={default_prompts}
          on_recent_prompt_click={handle_quick_prompt_click}
          on_recent_prompt_middle_click={(prompt) => {
            handle_quick_prompt_click(prompt, true)
          }}
          is_disabled={
            !parsed_html_hook.parsed_html && !text_selection_hook.selected_text
          }
        />

        <Ui_extension_popup_templates_Popup_main_Separator />

        <Ui_extension_popup_templates_Popup_main_PromptField
          key={popup_restored_count}
          value={prompt_field_value}
          on_focus={() => {
            prompts_history_hook.restore_prompts_history()
          }}
          on_change={(value) => {
            set_prompt_field_value(value)
          }}
          on_submit={() => {
            if (
              !prompt_field_value &&
              !(
                attach_text_checkbox_hook.is_checked &&
                text_selection_hook.selected_text
              )
            )
              return

            if (
              attach_text_checkbox_hook.is_checked &&
              (parsed_html_hook.parsed_html ||
                text_selection_hook.selected_text)
            ) {
              // Update prompts history
              const new_prompts_history =
                prompts_history_hook.prompts_history.filter(
                  (item) => item != prompt_field_value,
                )
              new_prompts_history.push(prompt_field_value)
              prompts_history_hook.set_prompts_history(new_prompts_history)
            }

            send_message({
              action: 'send-prompt',
              assistant_name: selected_chatbot_hook.selected_assistant_name,
              assistant_url,
              prompt: prompt_field_value,
              plain_text:
                attach_text_checkbox_hook.is_checked &&
                (text_selection_hook.selected_text || shortened_plan_text),
            } as SendPrompt_Message)
          }}
          is_attach_text_checkbox_disabled={
            !parsed_html_hook.parsed_html && !text_selection_hook.selected_text
          }
          is_attach_text_checkbox_not_available={
            parsed_html_hook.parsed_html === null &&
            !text_selection_hook.selected_text
          }
          is_attach_text_checkbox_checked={
            attach_text_checkbox_hook.is_checked || false
          }
          on_include_content_click={() => {
            attach_text_checkbox_hook.set_is_checked(
              !attach_text_checkbox_hook.is_checked,
            )
          }}
          prompts_history={[
            ...prompts_history_hook.prompts_history.filter(
              (prompt) => !default_prompts.includes(prompt),
            ),
          ].reverse()}
          is_history_enabled={
            !!parsed_html_hook.parsed_html ||
            !!text_selection_hook.selected_text
          }
          assistant_selector_slot={
            <Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector
              selected_assistant_name={
                selected_chatbot_hook.selected_assistant_name
              }
              chatbots={Object.entries(assistants).map(([key, value]) => ({
                name: key,
                display_name: value.display_name,
              }))}
              on_assistant_change={(chatbot_name) => {
                selected_chatbot_hook.set_selected_assistant_name(
                  chatbot_name as AssistantName,
                )
              }}
            />
          }
          is_plain_text_too_long={
            ((!!parsed_html_hook.parsed_html ||
              !!text_selection_hook.selected_text) &&
              parsed_html_hook.parsed_html?.plain_text &&
              shortened_plan_text &&
              parsed_html_hook.parsed_html?.plain_text.length >
                shortened_plan_text?.length) ||
            false
          }
          text_not_found={
            parsed_html_hook.parsed_html === null &&
            !text_selection_hook.selected_text
          }
          translations={{
            placeholder: 'Ask anything!',
            checkbox: text_selection_hook.selected_text
              ? 'Attach selection'
              : get_attach_text_checkbox_label(document.location.href),
            active_input_placeholder_suffix: '(⇅ for history)',
            plain_text_too_long: (
              <>
                <strong>Text is too long for selected assistant</strong>
                <br />
                <i>
                  Shortening by{' '}
                  {calculate_shortening_percentage(
                    parsed_html_hook.parsed_html?.plain_text,
                    shortened_plan_text,
                  )}
                  %
                </i>
              </>
            ),
            text_not_found: document.location.href.startsWith(
              'https://www.youtube.com/watch',
            ) ? (
              <strong>This video is missing transcript</strong>
            ) : (
              <>
                <strong>Unable to extract text from this page</strong>
                <br />
                <i>Please select manually...</i>
              </>
            ),
          }}
        />
      </Ui_extension_popup_templates_Popup>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root-taaabs-popup') as HTMLElement,
)
root.render(<Popup />)
