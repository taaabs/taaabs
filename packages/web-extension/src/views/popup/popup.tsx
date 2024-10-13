import { createRoot } from 'react-dom/client'
import browser from 'webextension-polyfill'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'
import { Popup as Ui_extension_popup_templates_Popup } from '@web-ui/components/extension/popup/templates/Popup'
import { Header as Ui_extension_popup_templates_Popup_Header } from '@web-ui/components/extension/popup/templates/Popup/Header'
import { HeaderVision as Ui_extension_popup_templates_Popup_HeaderVision } from '@web-ui/components/extension/popup/templates/Popup/HeaderVision'
import { Actions as Ui_extension_popup_templates_Popup_main_Actions } from '@web-ui/components/extension/popup/templates/Popup/main/Actions'
import { Button as UiButton } from '@web-ui/components/Button'
import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { PromptField as Ui_extension_popup_templates_Popup_main_PromptField } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField'
import { AssistantSelector as Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector } from '@web-ui/components/extension/popup/templates/Popup/main/PromptField/AssistantSelector'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { useState } from 'react'
import { use_selected_assistant } from './hooks/use-selected-assistant'
import { use_custom_assistant_url } from './hooks/use-custom-assistant-url'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'
import { use_prompts_history } from './hooks/use-prompts-history'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_attach_text_checkbox } from './hooks/use-attach-text-checkbox'
import { use_text_selection } from './hooks/use-text-selection'
import { default_prompts, default_vision_prompts } from './data/default-prompts'
import { PLAIN_TEXT_MAX_LENGTH } from '@/constants/plain-text-max-length'
import { use_parsed_html } from './hooks/use-parsed-html'
import { calculate_shortening_percentage } from './helpers/calculate-shortening-percentage'
import { use_auth_state } from './hooks/use-auth-state'
import { get_attach_text_checkbox_label } from './helpers/get-attach-text-checkbox-label'
import {
  AssistantName,
  assistants,
  assistants_vision,
} from '@/constants/assistants'
import { use_captured_image } from './hooks/use-captured-image'
import { use_prompts_vision_history } from './hooks/use-prompts-vision-history'
import { use_selected_assistant_vision } from './hooks/use-selected-assistant-vision'

import '@web-ui/styles/style.scss'
import { SendPrompt_Message } from '@/types/messages'
import { use_window_dimensions } from './hooks/use-window-dimensions'
import { use_current_url } from './hooks/use-current-url'

export const Popup: React.FC = () => {
  const current_url_hook = use_current_url()
  const auth_state_hook = use_auth_state()
  const saved_check_hook = use_saved_check()
  const create_bookmark_hook = use_create_bookmark({
    set_is_saved: saved_check_hook.set_is_saved,
  })
  const delete_bookmark_hook = use_delete_bookmark({
    current_url: current_url_hook.url,
    set_is_saved: saved_check_hook.set_is_saved,
  })
  const prompts_history_hook = use_prompts_history()
  const prompts_vision_history_hook = use_prompts_vision_history()
  const parsed_html_hook = use_parsed_html()
  const selected_assistant_hook = use_selected_assistant()
  const selected_assistant_vision_hook = use_selected_assistant_vision()
  const { custom_assistant_url } = use_custom_assistant_url()
  const attach_text_checkbox_hook = use_attach_text_checkbox()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const [shortened_plan_text, set_shortened_plain_text] = useState<string>()
  const text_selection_hook = use_text_selection()
  const captured_image_hook = use_captured_image()
  const window_dimensions_hook = use_window_dimensions()

  const is_in_vision_mode = captured_image_hook.image

  let assistant_url = assistants['chatgpt'].url
  if (!is_in_vision_mode && selected_assistant_hook.selected_assistant_name) {
    if (selected_assistant_hook.selected_assistant_name != 'custom') {
      assistant_url =
        assistants[selected_assistant_hook.selected_assistant_name].url
    } else if (custom_assistant_url) {
      assistant_url = custom_assistant_url
    }
  } else if (selected_assistant_vision_hook.selected_assistant_name) {
    if (selected_assistant_vision_hook.selected_assistant_name != 'custom') {
      assistant_url =
        assistants[selected_assistant_vision_hook.selected_assistant_name].url
    } else if (custom_assistant_url) {
      assistant_url = custom_assistant_url
    }
  }

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
    // captured_image_hook.image === undefined ||
    (parsed_html_hook.parsed_html === undefined &&
      !current_url_hook.is_youtube_video &&
      !current_url_hook.is_new_tab_page) ||
    auth_state_hook.is_authenticated === undefined ||
    (auth_state_hook.is_authenticated &&
      saved_check_hook.is_saved === undefined) ||
    selected_assistant_hook.selected_assistant_name === undefined ||
    selected_assistant_vision_hook.selected_assistant_name === undefined ||
    attach_text_checkbox_hook.is_checked === undefined ||
    (!window_dimensions_hook.dimensions && !current_url_hook.is_new_tab_page)
  ) {
    return <></>
  }

  const saved_items = [
    <UiButton
      href={
        'https://taaabs.com/library#url=' +
        encodeURIComponent(current_url_hook.url)
      }
      on_click={async (e) => {
        e.preventDefault()
        const [current_tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        })
        browser.tabs.update(current_tab.id, {
          url:
            'https://taaabs.com/library#url=' +
            encodeURIComponent(current_url_hook.url),
        })
        window.close()
      }}
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
      prompts_history_hook.update_stored_prompts_history(prompt)
      const message: SendPrompt_Message = {
        action: 'send-prompt',
        is_touch_screen: 'ontouchstart' in window,
        assistant_name: selected_assistant_hook.selected_assistant_name!,
        assistant_url,
        prompt,
        plain_text: text_selection_hook.selected_text || shortened_plan_text,
        open_in_new_tab: is_middle_click,
        window_height: window_dimensions_hook.dimensions!.height,
        window_width: window_dimensions_hook.dimensions!.width,
      }
      browser.runtime.sendMessage(message)
      window.close()
    }
  }

  const handle_quick_prompt_vision_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    prompts_vision_history_hook.update_stored_prompts_history(prompt)
    const message: SendPrompt_Message = {
      action: 'send-prompt',
      is_touch_screen: 'ontouchstart' in window,
      assistant_name: selected_assistant_vision_hook.selected_assistant_name!,
      assistant_url,
      prompt,
      open_in_new_tab: is_middle_click,
      window_height: window_dimensions_hook.dimensions!.height,
      window_width: window_dimensions_hook.dimensions!.width,
      image: captured_image_hook.image!,
    }
    browser.runtime.sendMessage(message)
    window.close()
  }

  return (
    <Ui_extension_popup_templates_Popup
      should_set_height={
        // Showing recent prompts which adjust its height dynamically
        !current_url_hook.is_new_tab_page &&
        !!(
          parsed_html_hook.parsed_html !== null ||
          current_url_hook.is_youtube_video ||
          text_selection_hook.selected_text ||
          is_in_vision_mode
        )
      }
      header_slot={
        is_in_vision_mode ? (
          <Ui_extension_popup_templates_Popup_HeaderVision
            key={captured_image_hook.original_image}
            back_button_on_click={captured_image_hook.remove}
            image={captured_image_hook.original_image!}
            on_resize={captured_image_hook.set_image}
            translations={{
              title: 'Vision',
              restore: 'Restore',
            }}
          />
        ) : (
          <Ui_extension_popup_templates_Popup_Header
            settings_on_click={() => {
              browser.runtime.openOptionsPage()
              // Firefox requires closing manually
              if (browser.browserAction) {
                window.close()
              }
            }}
          />
        )
      }
    >
      {!current_url_hook.url.startsWith('https://taaabs.com') &&
        !is_in_vision_mode && (
          <Ui_extension_popup_templates_Popup_main_Actions>
            <UiButton
              href={'https://taaabs.com/library'}
              rel="noreferrer noopener"
              is_outlined={true}
              on_click={async (e) => {
                e.preventDefault()
                const [current_tab] = await browser.tabs.query({
                  active: true,
                  currentWindow: true,
                })
                browser.tabs.update(current_tab.id, {
                  url: 'https://taaabs.com/library#fresh',
                })
                window.close()
              }}
            >
              {auth_state_hook.is_authenticated ? 'Go to library' : 'Sign in'}
            </UiButton>
            {auth_state_hook.is_authenticated &&
              !current_url_hook.is_new_tab_page &&
              (saved_check_hook.is_saved ? saved_items : unsaved_items)}
          </Ui_extension_popup_templates_Popup_main_Actions>
        )}

      {is_in_vision_mode ? (
        <>
          <Ui_extension_popup_templates_Popup_main_RecentPrompts
            recent_prompts={[
              ...prompts_vision_history_hook.prompts_history,
            ].reverse()}
            filter_phrase={
              !prompts_vision_history_hook.prompts_history.includes(
                prompt_field_value,
              )
                ? prompt_field_value
                : ''
            }
            default_prompts={default_vision_prompts}
            on_recent_prompt_click={handle_quick_prompt_vision_click}
            on_recent_prompt_middle_click={(prompt) => {
              handle_quick_prompt_vision_click(prompt, true)
            }}
            is_disabled={false}
          />

          <Ui_extension_popup_templates_Popup_main_Separator />
        </>
      ) : (
        (parsed_html_hook.parsed_html !== null ||
          current_url_hook.is_youtube_video ||
          text_selection_hook.selected_text) &&
        !current_url_hook.is_new_tab_page && (
          <>
            <Ui_extension_popup_templates_Popup_main_RecentPrompts
              recent_prompts={[
                ...prompts_history_hook.prompts_history,
              ].reverse()}
              filter_phrase={
                attach_text_checkbox_hook.is_checked &&
                (parsed_html_hook.parsed_html ||
                  text_selection_hook.selected_text) &&
                !prompts_history_hook.prompts_history.includes(
                  prompt_field_value,
                )
                  ? prompt_field_value
                  : ''
              }
              default_prompts={default_prompts}
              on_recent_prompt_click={handle_quick_prompt_click}
              on_recent_prompt_middle_click={(prompt) => {
                handle_quick_prompt_click(prompt, true)
              }}
              is_disabled={
                !parsed_html_hook.parsed_html &&
                !text_selection_hook.selected_text
              }
            />

            <Ui_extension_popup_templates_Popup_main_Separator />
          </>
        )
      )}

      {is_in_vision_mode ? (
        <Ui_extension_popup_templates_Popup_main_PromptField
          value={prompt_field_value}
          on_change={(value) => {
            set_prompt_field_value(value)
          }}
          on_submit={() => {
            if (!prompt_field_value) return

            prompts_vision_history_hook.update_stored_prompts_history(
              prompt_field_value,
            )

            const message: SendPrompt_Message = {
              action: 'send-prompt',
              is_touch_screen: 'ontouchstart' in window,
              assistant_name: selected_assistant_hook.selected_assistant_name!,
              assistant_url,
              prompt: prompt_field_value,
              window_height: window_dimensions_hook.dimensions!.height,
              window_width: window_dimensions_hook.dimensions!.width,
              image: captured_image_hook.image!,
            }
            browser.runtime.sendMessage(message)
            window.close()
          }}
          is_attach_text_checkbox_disabled={true}
          is_attach_text_checkbox_checked={true}
          on_include_content_click={() => {}}
          prompts_history={[
            ...prompts_vision_history_hook.prompts_history.filter(
              (prompt) => !default_vision_prompts.includes(prompt),
            ),
          ].reverse()}
          is_history_enabled={true}
          assistant_selector_slot={
            <Ui_extension_popup_templates_Popup_main_PromptField_AssistantSelector
              selected_assistant_name={
                selected_assistant_vision_hook.selected_assistant_name
              }
              chatbots={Object.entries(assistants)
                .filter(([key]) =>
                  assistants_vision.includes(key as AssistantName),
                )
                .map(([key, value]) => ({
                  name: key,
                  display_name: value.display_name,
                }))}
              on_assistant_change={(assistant_name) => {
                selected_assistant_vision_hook.set_selected_assistant_name(
                  assistant_name as AssistantName,
                )
              }}
            />
          }
          is_plain_text_too_long={false}
          transcript_not_found={false}
          translations={{
            placeholder: 'Ask anything!',
            checkbox: 'Attach image',
            active_input_placeholder_suffix: '(⇅ for history)',
            plain_text_too_long: <></>,
            transcript_not_found: <></>,
          }}
        />
      ) : (
        <Ui_extension_popup_templates_Popup_main_PromptField
          value={prompt_field_value}
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
              prompts_history_hook.update_stored_prompts_history(
                prompt_field_value,
              )
            }

            const message: SendPrompt_Message = {
              action: 'send-prompt',
              is_touch_screen: 'ontouchstart' in window,
              assistant_name: selected_assistant_hook.selected_assistant_name!,
              assistant_url,
              prompt: prompt_field_value,
              plain_text:
                (attach_text_checkbox_hook.is_checked &&
                  (text_selection_hook.selected_text || shortened_plan_text)) ||
                '',
              window_height: window_dimensions_hook.dimensions?.height,
              window_width: window_dimensions_hook.dimensions?.width,
            }
            browser.runtime.sendMessage(message)
            window.close()
          }}
          is_attach_text_checkbox_disabled={
            !parsed_html_hook.parsed_html && !text_selection_hook.selected_text
          }
          is_attach_text_checkbox_checked={
            !parsed_html_hook.parsed_html && !text_selection_hook.selected_text
              ? false
              : attach_text_checkbox_hook.is_checked
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
                selected_assistant_hook.selected_assistant_name
              }
              chatbots={Object.entries(assistants).map(([key, value]) => ({
                name: key,
                display_name: value.display_name,
              }))}
              on_assistant_change={(chatbot_name) => {
                selected_assistant_hook.set_selected_assistant_name(
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
          transcript_not_found={
            current_url_hook.is_youtube_video &&
            parsed_html_hook.parsed_html === null
          }
          translations={{
            placeholder: 'Ask anything!',
            checkbox:
              text_selection_hook.selected_text ||
              (parsed_html_hook.parsed_html === null &&
                !current_url_hook.is_youtube_video)
                ? 'Include text selection'
                : get_attach_text_checkbox_label(current_url_hook.url),
            active_input_placeholder_suffix: '(⇅ for history)',
            plain_text_too_long: (
              <>
                <strong>
                  {current_url_hook.is_youtube_video ? 'Transcript' : 'Text'} is
                  too long for this assistant {sad_emoji()}
                </strong>
                <br />
                <i>
                  ...shortening by{' '}
                  {calculate_shortening_percentage(
                    parsed_html_hook.parsed_html?.plain_text,
                    shortened_plan_text,
                  )}
                  %
                </i>
              </>
            ),
            transcript_not_found: (
              <strong>Transcript not found {sad_emoji()}</strong>
            ),
          }}
        />
      )}
    </Ui_extension_popup_templates_Popup>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<Popup />)

const sad_emoji = () => {
  const emojis = ['💔', '😪', '😢', '😓', '😭']
  return emojis[Math.floor(Math.random() * emojis.length)]
}
