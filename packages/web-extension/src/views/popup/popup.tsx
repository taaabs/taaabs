import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { Footer as Ui_extension_popup_templates_Popup_Footer } from '@web-ui/components/extension/popup/templates/Popup/Footer'
import { useEffect } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'
import { HtmlParser } from '@shared/utils/html-parser'
import { use_selected_chatbot } from './hooks/use-selected-chatbot'
import { use_custom_chatbot_url } from './hooks/use-custom-chatbot-url'

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
    create_bookmark_hook.set_is_creating_bookmark(false)
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
    >
      Edit
    </UiButton>,
    <UiButton on_click={() => {}} is_danger={true}>
      Delete
    </UiButton>,
  ]

  const unsaved_items = [
    <UiButton on_click={create_bookmark_hook.create_bookmark}>Save</UiButton>,
  ]

  const handle_recent_prompt_click = (prompt_id: string) => {
    const url = document.location.href
    const html = document.getElementsByTagName('html')[0].outerHTML
    const parsed_document = HtmlParser.parse({
      html,
      url,
    })
    if (parsed_document) {
      let prompt = ''
      if (prompt_id == '1') {
        prompt = `Summarize all the key points of the passage in bullet points.\n\n-\n\n${parsed_document.plain_text}`
      } else if (prompt_id == '2') {
        prompt = `Provide explanation that covers all key points of the passage like I'm five years old.\n\n-\n\n${parsed_document.plain_text}`
      } else if (prompt_id == '3') {
        prompt = `Help me explore points of view of the matter the following passage touches.\n\n-\n\n${parsed_document.plain_text}`
      } else if (prompt_id == '4') {
        prompt = `Reply to the OP in this forum thread with a thoughtful response addressing their main points.\n\n-\n\n${parsed_document.plain_text}`
      }

      let chatbot_url = ''
      if (selected_chatbot_name == 'chatgpt') {
        chatbot_url = 'https://chatgpt.com/'
      } else if (selected_chatbot_name == 'gemini') {
        chatbot_url = 'https://gemini.google.com/app'
      } else if (selected_chatbot_name == 'mistral') {
        chatbot_url = 'https://chat.mistral.ai/chat'
      } else if (selected_chatbot_name == 'cohere') {
        chatbot_url = 'https://coral.cohere.com/'
      } else if (selected_chatbot_name == 'duckduckgo') {
        chatbot_url = 'https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat'
      } else if (selected_chatbot_name == 'huggingchat') {
        chatbot_url = 'https://huggingface.co/chat/'
      } else if (selected_chatbot_name == 'aistudio') {
        chatbot_url = 'https://aistudio.google.com/app/prompts/new_chat'
      } else if (selected_chatbot_name == 'deepseek') {
        chatbot_url = 'https://chat.deepseek.com/'
      } else if (selected_chatbot_name == 'claude') {
        chatbot_url = 'https://claude.ai/new'
      } else if (selected_chatbot_name == 'custom') {
        chatbot_url = custom_chatbot_url || 'https://chatgpt.com/'
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
        <Ui_extension_popup_templates_Popup_main_Separator />
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
            ...(custom_chatbot_url
              ? [{ name: 'custom', display_name: 'Custom' }]
              : []),
          ]}
          on_chatbot_change={(chatbot_name) => {
            set_selected_chatbot_name(chatbot_name)
          }}
          recent_prompts={[
            { id: '1', name: 'TL;DR' },
            { id: '2', name: "Explain like I'm five" },
            { id: '3', name: 'In-depth analysis' },
            { id: '4', name: 'Reply to the OP' },
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
