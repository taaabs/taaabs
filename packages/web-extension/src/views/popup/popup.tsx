import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { Footer as Ui_extension_popup_templates_Popup_Footer } from '@web-ui/components/extension/popup/templates/Popup/Footer'
import { useEffect } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'
import { HtmlParser } from '@shared/utils/html-parser'
import { use_selected_chatbot } from './hooks/use-selected-chatbot'
import { use_custom_chatbot_url } from './hooks/use-custom-chatbot-url'
import { chatbot_urls } from '@/constants/chatbot-urls'
import { get_chatbot_prompt } from './helpers/get-chatbot-prompt'

import '../../../../web-ui/src/styles/theme.scss'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'

export const Popup: React.FC = () => {
  const { is_saved } = use_saved_check()
  const create_bookmark_hook = use_create_bookmark()
  const delete_bookmark_hook = use_delete_bookmark()
  const { selected_chatbot_name, set_selected_chatbot_name } =
    use_selected_chatbot()
  const { custom_chatbot_url } = use_custom_chatbot_url()

  useEffect(() => {
    console.log('Taaabs popup has been initialized')
  }, [])

  useEffect(() => {
    create_bookmark_hook.set_is_creating(false)
    delete_bookmark_hook.set_is_deleting(false)
  }, [is_saved])

  if (is_saved === undefined || selected_chatbot_name === undefined) {
    return <></>
  }

  const saved_items = [
    <UiButton
      href={
        'https://taaabs.com/library#url=' + encodeURIComponent(location.href)
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
      Save
    </UiButton>,
  ]

  const handle_recent_prompt_click = (prompt_id: string) => {
    const url = document.location.href
    const html = document.getElementsByTagName('html')[0].outerHTML
    const parsed_document = HtmlParser.parse({
      html,
      url,
    })
    if (parsed_document) {
      const prompt = get_chatbot_prompt({
        prompt_id,
        plain_text: parsed_document.plain_text,
      })

      let chatbot_url = 'https://chatgpt.com/'

      if (selected_chatbot_name) {
        if (selected_chatbot_name != 'custom') {
          chatbot_url = (chatbot_urls as any)[selected_chatbot_name]
        } else if (custom_chatbot_url) {
          chatbot_url = custom_chatbot_url
        }
      }

      send_message({
        action: 'send-chatbot-prompt',
        chatbot_url,
        prompt,
      })
    } else {
      alert('Unable to parse the document')
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
        footer_slot={<Ui_extension_popup_templates_Popup_Footer />}
      >
        <Ui_extension_popup_templates_Popup_main_Actions>
          {is_saved ? saved_items : unsaved_items}
        </Ui_extension_popup_templates_Popup_main_Actions>
        <Ui_extension_popup_templates_Popup_main_RecentPrompts
          selected_chatbot_name={selected_chatbot_name}
          chatbots={[
            { name: 'chatgpt', display_name: 'ChatGPT' },
            { name: 'gemini', display_name: 'Gemini' },
            { name: 'aistudio', display_name: 'AI Studio' },
            { name: 'claude', display_name: 'Claude' },
            { name: 'duckduckgo', display_name: 'DuckDuckGo' },
            { name: 'huggingchat', display_name: 'HuggingChat' },
            { name: 'mistral', display_name: 'Mistral' },
            { name: 'cohere', display_name: 'Cohere' },
            { name: 'deepseek', display_name: 'DeepSeek' },
            { name: 'phind', display_name: 'Phind' },
            ...(custom_chatbot_url
              ? [{ name: 'custom', display_name: 'Custom' }]
              : []),
          ]}
          on_chatbot_change={(chatbot_name) => {
            set_selected_chatbot_name(chatbot_name)
          }}
          recent_prompts={[
            { id: '1', name: 'Summarize' },
            { id: '2', name: "Explain like I'm five" },
            { id: '3', name: 'In-depth analysis' },
            { id: '4', name: 'Reply to the OP' },
            { id: '5', name: 'Ask question' },
            { id: '6', name: 'Quiz me!' },
            { id: '7', name: 'Study guide' },
          ]}
          on_recent_prompt_click={handle_recent_prompt_click}
          translations={{
            heading: 'AI prompts',
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
