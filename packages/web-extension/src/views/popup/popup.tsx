import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { AssistantSelector as Ui_extension_popup_templates_Popup_main_AssistantSelector } from '@web-ui/components/extension/popup/templates/Popup/main/AssistantSelector'
import { Footer as Ui_extension_popup_templates_Popup_Footer } from '@web-ui/components/extension/popup/templates/Popup/Footer'
import { useEffect, useState } from 'react'
import { Button as UiButton } from '@web-ui/components/Button'
import { send_message } from './helpers/send-message'
import { HtmlParser } from '@shared/utils/html-parser'
import { use_selected_chatbot } from './hooks/use-selected-chatbot'
import { use_custom_chatbot_url } from './hooks/use-custom-chatbot-url'
import { chatbot_urls } from '@/constants/chatbot-urls'
import { get_chatbot_prompt } from './helpers/get-chatbot-prompt'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { YouTubeTranscriptExtractor } from './helpers/youtube-transcript-extractor'

import '../../../../web-ui/src/styles/theme.scss'

export const Popup: React.FC = () => {
  const { is_saved } = use_saved_check()
  const create_bookmark_hook = use_create_bookmark()
  const delete_bookmark_hook = use_delete_bookmark()
  const { selected_chatbot_name, set_selected_chatbot_name } =
    use_selected_chatbot()
  const { custom_chatbot_url } = use_custom_chatbot_url()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const [
    is_include_page_content_selected,
    set_is_include_page_content_selected,
  ] = useState<boolean>()

  let chatbot_url = 'https://chatgpt.com/'

  if (selected_chatbot_name) {
    if (selected_chatbot_name != 'custom') {
      chatbot_url = (chatbot_urls as any)[selected_chatbot_name]
    } else if (custom_chatbot_url) {
      chatbot_url = custom_chatbot_url
    }
  }

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

  const is_taaabs_com = window.location.href.startsWith('https://taaabs.com')

  const saved_items = [
    <UiButton
      href={
        'https://taaabs.com/library#url=' +
        encodeURIComponent(url_cleaner(location.href))
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

  const get_page_plain_text = async (): Promise<string> => {
    const url = document.location.href
    const html = document.getElementsByTagName('html')[0].outerHTML
    let plain_text = ''

    if (url.startsWith('https://www.youtube.com/watch?')) {
      try {
        const youtube_transcript_extractor = new YouTubeTranscriptExtractor(url)
        plain_text =
          await youtube_transcript_extractor.get_transcript_plain_text()
      } catch (e) {
        console.error(e)
        alert("Couldn't find transcript.")
      }
    } else if (url.match(/^https:\/\/t\.me\/[^\/]+\/[^\/]+$/)) {
      try {
        // Post is rendered in inframe, we need to grab the original html
        const embed_url = `${url}?embed=1&mode=tme`
        const response = await fetch(embed_url)
        const html_content = await response.text()
        const parsed_html = HtmlParser.parse({
          html: html_content,
          url: embed_url,
        })
        if (parsed_html) {
          plain_text = parsed_html.plain_text
        }
      } catch (e) {
        console.error(e)
        alert("Couldn't fetch or parse the page.")
      }
    } else {
      const parsed_html = HtmlParser.parse({
        html,
        url,
      })
      if (parsed_html) {
        plain_text = parsed_html.plain_text
      }
    }

    if (!plain_text) {
      throw new Error(
        "We're sorry, but we are unable to process the page content at this time.",
      )
    } else {
      return plain_text
    }
  }

  const handle_quick_prompt_click = async (prompt_id: string) => {
    try {
      const plain_text = await get_page_plain_text()

      const prompt = get_chatbot_prompt({
        prompt_id,
        plain_text,
      })

      send_message({
        action: 'send-chatbot-prompt',
        chatbot_url,
        prompt,
      })
    } catch (e) {
      alert(e)
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
        {!is_taaabs_com && (
          <Ui_extension_popup_templates_Popup_main_Actions>
            <UiButton
              href={'https://taaabs.com/library#fresh'}
              rel="noreferrer noopener"
              is_outlined={true}
            >
              Go to library
            </UiButton>
            {is_saved ? saved_items : !is_taaabs_com && unsaved_items}
          </Ui_extension_popup_templates_Popup_main_Actions>
        )}
        <Ui_extension_popup_templates_Popup_main_AssistantSelector
          label="Assistant:"
          selected_chatbot_name={selected_chatbot_name}
          chatbots={[
            { name: 'chatgpt', display_name: 'ChatGPT' },
            { name: 'gemini', display_name: 'Gemini' },
            { name: 'aistudio', display_name: 'AI Studio' },
            { name: 'claude', display_name: 'Claude' },
            { name: 'grok', display_name: 'Grok' },
            { name: 'meta', display_name: 'Meta AI' },
            { name: 'duckduckgo', display_name: 'DuckDuckGo' },
            { name: 'huggingchat', display_name: 'HuggingChat' },
            { name: 'mistral', display_name: 'Mistral' },
            { name: 'cohere', display_name: 'Cohere' },
            { name: 'deepseek', display_name: 'DeepSeek' },
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
        <Ui_extension_popup_templates_Popup_main_Separator />
        <Ui_extension_popup_templates_Popup_main_RecentPrompts
          recent_prompts={[
            { id: 'summarize', name: 'Summarize' },
            { id: 'layman', name: 'Simplify' },
            { id: 'eli5', name: 'ELI5' },
            { id: 'ask-question', name: 'Answer me' },
            { id: 'quiz-me', name: 'Quiz me' },
            { id: 'study-guide', name: 'Study guide' },
          ]}
          on_recent_prompt_click={handle_quick_prompt_click}
        />
        <Ui_extension_popup_templates_Popup_main_Separator />

        <Ui_extension_popup_templates_Popup_main_PromptField
          heading="New chat"
          value={prompt_field_value}
          on_change={(prompt) => {
            set_prompt_field_value(prompt)
          }}
          on_submit={async () => {
            try {
              let plain_text = ''
              if (is_include_page_content_selected) {
                plain_text = await get_page_plain_text()
              }

              if (plain_text) {
                plain_text = `\n\n---\n\n${plain_text}`
              }

              const prompt = prompt_field_value + plain_text

              send_message({
                action: 'send-chatbot-prompt',
                chatbot_url,
                prompt,
              })
            } catch (e) {
              alert(e)
            }
          }}
          placeholder={'Enter a prompt here'}
          is_include_content_selected={
            is_include_page_content_selected || false
          }
          on_include_content_click={() => {
            set_is_include_page_content_selected(
              !is_include_page_content_selected,
            )
          }}
          translations={{
            include_page_content: 'Include page content',
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
