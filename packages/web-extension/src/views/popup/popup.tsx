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
import { useEffect, useRef, useState } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'
import { HtmlParser } from '@shared/utils/html-parser'
import { use_selected_chatbot } from './hooks/use-selected-chatbot'
import { use_custom_chatbot_url } from './hooks/use-custom-chatbot-url'
import { chatbot_urls } from '@/constants/chatbot-urls'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { use_prompts_history } from './hooks/use-prompts-history'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

import '../../../../web-ui/src/styles/theme.scss'
import { use_attach_this_page_checkbox } from './hooks/use-attach-this-page-checkbox'
import { use_text_selection } from './hooks/use-text-selection'
import { default_prompts } from './data/default-prompts'

export const Popup: React.FC = () => {
  const saved_check_hook = use_saved_check()
  const create_bookmark_hook = use_create_bookmark()
  const delete_bookmark_hook = use_delete_bookmark()
  const prompts_history_hook = use_prompts_history()
  const { selected_chatbot_name, set_selected_chatbot_name } =
    use_selected_chatbot()
  const { custom_chatbot_url } = use_custom_chatbot_url()
  const attach_this_page_checkbox_hook = use_attach_this_page_checkbox()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const getting_parsed_html_started_at_timestamp = useRef<number>()
  const [parsed_html, set_parsed_html] =
    useState<HtmlParser.ParsedResult | null>()
  const text_selection_hook = use_text_selection()
  const [is_prompt_field_focused, set_is_propmt_field_focused] =
    useState<boolean>()
  const [popup_restored_count, set_popup_restored_count] = useState<number>()

  let chatbot_url = chatbot_urls.chatgpt
  if (selected_chatbot_name) {
    if (selected_chatbot_name != 'custom') {
      chatbot_url = (chatbot_urls as any)[selected_chatbot_name]
    } else if (custom_chatbot_url) {
      chatbot_url = custom_chatbot_url
    }
  }

  useUpdateEffect(() => {
    console.debug(
      `Plain text for Assistant parsed in ${
        Date.now() - getting_parsed_html_started_at_timestamp.current!
      }ms.`,
    )
  }, [parsed_html])

  // Get plain text for Assistant on initialization
  useEffect(() => {
    console.debug('Taaabs popup has been initialized.')

    // 150ms is popup entry animation duration
    setTimeout(() => {
      console.debug('Getting plain text of the current page for Assistant...')
      getting_parsed_html_started_at_timestamp.current = Date.now()

      const html = document.getElementsByTagName('html')[0].outerHTML
      send_message({ action: 'parse-html', html })
    }, 150)

    const listener = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'parsed-html') {
        set_parsed_html(event.data.parsed_html || null)
      } else if (event.data && event.data.action == 'popup-restored') {
        set_prompt_field_value('')
        set_popup_restored_count(Math.random())
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
    saved_check_hook.is_saved === undefined ||
    selected_chatbot_name === undefined ||
    attach_this_page_checkbox_hook.is_checked === undefined
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
      on_click={create_bookmark_hook.create_bookmark}
      is_disabled={create_bookmark_hook.is_creating}
    >
      Clip this page
    </UiButton>,
  ]

  const handle_quick_prompt_click = async (prompt: string) => {
    if (text_selection_hook.selected_text || parsed_html) {
      send_message({
        action: 'send-chatbot-prompt',
        chatbot_url,
        prompt,
        plain_text:
          text_selection_hook.selected_text || parsed_html!.plain_text,
      })

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
              Go to library
            </UiButton>
            {saved_check_hook.is_saved ? saved_items : unsaved_items}
          </Ui_extension_popup_templates_Popup_main_Actions>
        )}

        <Ui_extension_popup_templates_Popup_main_PromptField
          key={popup_restored_count}
          value={prompt_field_value}
          on_focus={() => {
            set_is_propmt_field_focused(true)
            prompts_history_hook.restore_prompts_history()
          }}
          on_blur={() => {
            set_is_propmt_field_focused(false)
          }}
          on_change={(value) => {
            set_prompt_field_value(value)
          }}
          on_submit={() => {
            if (
              !prompt_field_value &&
              !(
                attach_this_page_checkbox_hook.is_checked &&
                text_selection_hook.selected_text
              )
            )
              return

            if (
              attach_this_page_checkbox_hook.is_checked &&
              (parsed_html || text_selection_hook.selected_text)
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
              action: 'send-chatbot-prompt',
              chatbot_url,
              prompt: prompt_field_value,
              plain_text:
                attach_this_page_checkbox_hook.is_checked &&
                (text_selection_hook.selected_text || parsed_html?.plain_text),
            })
          }}
          is_include_content_checkbox_disabled={
            !parsed_html && !text_selection_hook.selected_text
          }
          is_include_content_selected={
            attach_this_page_checkbox_hook.is_checked || false
          }
          on_include_content_click={() => {
            attach_this_page_checkbox_hook.set_is_checked(
              !attach_this_page_checkbox_hook.is_checked,
            )
          }}
          prompts_history={[...prompts_history_hook.prompts_history].reverse()}
          is_history_enabled={
            !!parsed_html || !!text_selection_hook.selected_text
          }
          assistant_selector_slot={
            <Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector
              selected_chatbot_name={selected_chatbot_name}
              chatbots={[
                { name: 'chatgpt', display_name: 'ChatGPT' },
                { name: 'gemini', display_name: 'Gemini' },
                { name: 'copilot', display_name: 'Copilot' },
                { name: 'perplexity', display_name: 'Perplexity' },
                { name: 'claude', display_name: 'Claude' },
                { name: 'grok', display_name: 'Grok' },
                { name: 'meta', display_name: 'Meta AI' },
                { name: 'huggingchat', display_name: 'HuggingChat' },
                { name: 'aistudio', display_name: 'AI Studio' },
                { name: 'mistral', display_name: 'Mistral' },
                { name: 'cohere', display_name: 'Cohere' },
                { name: 'deepseek', display_name: 'DeepSeek' },
                { name: 'notdiamond', display_name: 'Not Diamond' },
                { name: 'librechat', display_name: 'LibreChat' },
                { name: 'phind', display_name: 'Phind' },
                { name: 'poe', display_name: 'Poe' },
                { name: 'you', display_name: 'You' },
                ...(custom_chatbot_url
                  ? [{ name: 'custom', display_name: 'Custom' }]
                  : []),
              ]}
              on_chatbot_change={(chatbot_name) => {
                set_selected_chatbot_name(chatbot_name)
              }}
            />
          }
          translations={{
            placeholder: 'Ask anything!',
            include_page_content: text_selection_hook.selected_text
              ? 'Ask selection'
              : 'Ask this page',
            active_input_placeholder_suffix: '(⇅ for history)',
          }}
        />

        {attach_this_page_checkbox_hook.is_checked && (
          <>
            <Ui_extension_popup_templates_Popup_main_Separator />

            <Ui_extension_popup_templates_Popup_main_RecentPrompts
              recent_prompts={[
                ...prompts_history_hook.prompts_history,
              ].reverse()}
              filter_phrase={is_prompt_field_focused ? prompt_field_value : ''}
              default_prompts={default_prompts}
              on_recent_prompt_click={handle_quick_prompt_click}
              is_disabled={!parsed_html && !text_selection_hook.selected_text}
              is_not_available={
                parsed_html === null && !text_selection_hook.selected_text
              }
            />
          </>
        )}
      </Ui_extension_popup_templates_Popup>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root-taaabs-popup') as HTMLElement,
)
root.render(<Popup />)
