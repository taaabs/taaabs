import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { AssistantSelector as Ui_extension_popup_templates_Popup_main_AssistantSelector } from '@web-ui/components/extension/popup/templates/Popup/main/AssistantSelector'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { Footer as Ui_extension_popup_templates_Popup_Footer } from '@web-ui/components/extension/popup/templates/Popup/Footer'
import { useEffect, useRef, useState } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'
import { HtmlParser } from '@shared/utils/html-parser'
import { use_selected_chatbot } from './hooks/use-selected-chatbot'
import { use_custom_chatbot_url } from './hooks/use-custom-chatbot-url'
import { chatbot_urls } from '@/constants/chatbot-urls'
import { get_chatbot_prompt_by_id } from './helpers/get-chatbot-prompt-by-id'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { use_prompts_history } from './hooks/use-prompts-history'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

import '../../../../web-ui/src/styles/theme.scss'
import { use_attach_this_page_checkbox } from './hooks/use-attach-this-page-checkbox'
import { use_text_selection } from './hooks/use-text-selection'

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
  const [parsed_html, set_parsed_html] = useState<HtmlParser.ParsedResult>()
  const text_selection_hook = use_text_selection()

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
        const parsed_html = event.data.parsed_html as HtmlParser.ParsedResult
        set_parsed_html(parsed_html)
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
      Save this page
    </UiButton>,
  ]

  const handle_quick_prompt_click = async (prompt_id: string) => {
    if (!parsed_html) return

    send_message({
      action: 'send-chatbot-prompt',
      chatbot_url,
      prompt: get_chatbot_prompt_by_id(prompt_id),
      plain_text: text_selection_hook.selected_text || parsed_html.plain_text,
    })
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

        <Ui_extension_popup_templates_Popup_main_AssistantSelector
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
          translations={{
            heading: 'Assistant:',
          }}
        />

        <Ui_extension_popup_templates_Popup_main_Separator />

        <Ui_extension_popup_templates_Popup_main_RecentPrompts
          recent_prompts={[
            { id: 'summarize', name: 'Summarize' },
            { id: 'layman', name: 'Simplify' },
            { id: 'study-guide', name: 'Study guide' },
            { id: 'ask-question', name: 'Answer questions' },
            { id: 'quiz-me', name: 'Quiz me' },
            { id: 'eli5', name: 'ELI5' },
          ]}
          on_recent_prompt_click={handle_quick_prompt_click}
          is_disabled={!parsed_html && !text_selection_hook.selected_text}
          translations={{
            heading: 'Quick actions',
          }}
        />

        <Ui_extension_popup_templates_Popup_main_Separator />

        <Ui_extension_popup_templates_Popup_main_PromptField
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
                attach_this_page_checkbox_hook.is_checked &&
                text_selection_hook.selected_text
              )
            )
              return

            if (attach_this_page_checkbox_hook.is_checked && parsed_html) {
              // Update prompts history
              const new_prompts_history = prompts_history_hook.prompts_history
                .filter((item) => item != prompt_field_value)
                .slice(-50, prompts_history_hook.prompts_history.length)

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
          translations={{
            heading: 'New chat',
            placeholder: 'Ask anything!',
            include_page_content: text_selection_hook.selected_text
              ? 'Include selected text'
              : 'Include this page',
            active_input_placeholder_suffix: '(⇅ for history)',
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
