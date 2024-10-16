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
import { useEffect, useState } from 'react'
import { use_selected_assistant } from './hooks/use-selected-assistant'
import { use_custom_assistant_url } from './hooks/use-custom-assistant-url'
import { use_delete_bookmark } from './hooks/use-delete-bookmark'
import { use_prompts_history } from './hooks/use-prompts-history'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_attach_text_switch } from './hooks/use-attach-text-switch'
import { use_text_selection } from './hooks/use-text-selection'
import { default_prompts, default_vision_prompts } from './data/default-prompts'
import { PLAIN_TEXT_MAX_LENGTH } from '@/constants/plain-text-max-length'
import { use_parsed_html } from './hooks/use-parsed-html'
import { use_auth_state } from './hooks/use-auth-state'
import {
  AssistantName,
  assistants,
  assistants_vision,
} from '@/constants/assistants'
import { use_vision_mode } from './hooks/use-vision-mode'
import { use_prompts_vision_history } from './hooks/use-prompts-vision-history'
import { use_selected_assistant_vision } from './hooks/use-selected-assistant-vision'
import { SendPrompt_Message } from '@/types/messages'
import { use_window_dimensions } from './hooks/use-window-dimensions'
import { use_current_url } from './hooks/use-current-url'

import '@web-ui/styles/style.scss'
import { use_save_vision_prompt_switch } from './hooks/use-save-vision-prompt-switch'

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
  const attach_text_switch_hook = use_attach_text_switch()
  const save_vision_prompt_switch_hook = use_save_vision_prompt_switch()
  const [prompt_field_value, set_prompt_field_value] = useState('')
  const [shortened_plan_text, set_shortened_plain_text] = useState<string>()
  const text_selection_hook = use_text_selection()
  const vision_mode_hook = use_vision_mode()
  const window_dimensions_hook = use_window_dimensions()

  let assistant_url = assistants['chatgpt'].url
  if (
    !vision_mode_hook.is_vision_mode &&
    selected_assistant_hook.selected_assistant_name
  ) {
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

  // Quick select with keyboard numbers (1-9)
  useEffect(() => {
    const handle_key_down = (e: KeyboardEvent) => {
      if (prompt_field_value == '' && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1
        const recent_prompts = vision_mode_hook.is_vision_mode
          ? prompts_vision_history_hook.prompts_history
          : prompts_history_hook.prompts_history

        if (index < recent_prompts.length) {
          e.preventDefault()
          const selected_prompt =
            recent_prompts[recent_prompts.length - 1 - index]
          if (vision_mode_hook.is_vision_mode) {
            handle_quick_prompt_vision_click(selected_prompt)
          } else {
            handle_quick_prompt_click(selected_prompt)
          }
        }
      }
    }
    window.addEventListener('keydown', handle_key_down)
    return () => window.removeEventListener('keydown', handle_key_down)
  }, [
    prompt_field_value,
    prompts_history_hook.prompts_history,
    prompts_vision_history_hook.prompts_history,
    vision_mode_hook.is_vision_mode,
    text_selection_hook.selected_text,
    parsed_html_hook.parsed_html,
    shortened_plan_text,
    selected_assistant_hook.selected_assistant_name,
    window_dimensions_hook.dimensions,
  ])

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
      image: vision_mode_hook.image!,
    }
    browser.runtime.sendMessage(message)
    window.close()
  }

  if (
    (parsed_html_hook.parsed_html === undefined &&
      !current_url_hook.is_youtube_video &&
      !current_url_hook.is_new_tab_page) ||
    auth_state_hook.is_authenticated === undefined ||
    (auth_state_hook.is_authenticated &&
      saved_check_hook.is_saved === undefined) ||
    selected_assistant_hook.selected_assistant_name === undefined ||
    selected_assistant_vision_hook.selected_assistant_name === undefined ||
    attach_text_switch_hook.is_checked === undefined ||
    (!window_dimensions_hook.dimensions && !current_url_hook.is_new_tab_page)
  ) {
    return (
      <Ui_extension_popup_templates_Popup
        should_set_height={false}
        header_slot={
          <Ui_extension_popup_templates_Popup_Header
            settings_on_click={() => {}}
            logo_on_click={() => {}}
            vision_mode_on_click={
              !current_url_hook.is_new_tab_page
                ? vision_mode_hook.enter_vision_mode
                : undefined
            }
            translations={{
              trigger_popup_shortcut: '',
            }}
          />
        }
      >
        <></>
      </Ui_extension_popup_templates_Popup>
    )
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

  return (
    <Ui_extension_popup_templates_Popup
      should_set_height={
        // Cases when showing recent prompts which adjust its height dynamically
        !current_url_hook.is_new_tab_page &&
        !!(
          parsed_html_hook.parsed_html !== null ||
          current_url_hook.is_youtube_video ||
          text_selection_hook.selected_text
        ) &&
        ((attach_text_switch_hook.is_checked &&
          !vision_mode_hook.is_vision_mode) ||
          (save_vision_prompt_switch_hook.is_checked &&
            vision_mode_hook.is_vision_mode))
      }
      header_slot={
        vision_mode_hook.is_vision_mode ? (
          <Ui_extension_popup_templates_Popup_HeaderVision
            key={vision_mode_hook.original_image}
            back_button_on_click={vision_mode_hook.exit_vision_mode}
            image={vision_mode_hook.original_image!}
            on_resize={vision_mode_hook.set_image}
            translations={{
              title: 'Vision',
              restore: 'Restore',
            }}
          />
        ) : (
          <Ui_extension_popup_templates_Popup_Header
            vision_mode_on_click={
              !current_url_hook.is_new_tab_page
                ? vision_mode_hook.enter_vision_mode
                : undefined
            }
            settings_on_click={() => {
              browser.runtime.openOptionsPage()
              // Firefox requires closing manually
              if (browser.browserAction) window.close()
            }}
            logo_on_click={async () => {
              const [current_tab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
              })
              browser.tabs.update(current_tab.id, {
                url: 'https://taaabs.com/',
              })
              window.close()
            }}
            translations={{
              trigger_popup_shortcut: 'Trigger popup shortcut',
            }}
          />
        )
      }
    >
      {!current_url_hook.url.startsWith('https://taaabs.com') &&
        !vision_mode_hook.is_vision_mode && (
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

      {vision_mode_hook.is_vision_mode &&
        save_vision_prompt_switch_hook.is_checked && (
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
              translations={{
                heading: 'Recent prompts',
              }}
            />

            <Ui_extension_popup_templates_Popup_main_Separator />
          </>
        )}

      {!vision_mode_hook.is_vision_mode &&
        (parsed_html_hook.parsed_html !== null ||
          current_url_hook.is_youtube_video ||
          text_selection_hook.selected_text) &&
        !current_url_hook.is_new_tab_page &&
        attach_text_switch_hook.is_checked && (
          <>
            <Ui_extension_popup_templates_Popup_main_RecentPrompts
              recent_prompts={[
                ...prompts_history_hook.prompts_history,
              ].reverse()}
              filter_phrase={
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
              translations={{
                heading: 'Recent prompts',
              }}
            />

            <Ui_extension_popup_templates_Popup_main_Separator />
          </>
        )}

      {vision_mode_hook.is_vision_mode ? (
        <Ui_extension_popup_templates_Popup_main_PromptField
          value={prompt_field_value}
          on_change={(value) => {
            set_prompt_field_value(value)
          }}
          on_submit={() => {
            if (!prompt_field_value) return

            if (save_vision_prompt_switch_hook.is_checked) {
              prompts_vision_history_hook.update_stored_prompts_history(
                prompt_field_value,
              )
            }

            const message: SendPrompt_Message = {
              action: 'send-prompt',
              is_touch_screen: 'ontouchstart' in window,
              assistant_name:
                selected_assistant_vision_hook.selected_assistant_name!,
              assistant_url,
              prompt: prompt_field_value,
              window_height: window_dimensions_hook.dimensions!.height,
              window_width: window_dimensions_hook.dimensions!.width,
              image: vision_mode_hook.image!,
            }
            browser.runtime.sendMessage(message)
            window.close()
          }}
          is_switch_disabled={false}
          is_switch_checked={save_vision_prompt_switch_hook.is_checked}
          is_switch_visible={true}
          on_switch_click={() => {
            save_vision_prompt_switch_hook.set_is_checked(
              !save_vision_prompt_switch_hook.is_checked,
            )
          }}
          prompts_history={[
            ...prompts_vision_history_hook.prompts_history.filter(
              (prompt) => !default_vision_prompts.includes(prompt),
            ),
          ].reverse()}
          is_history_enabled={save_vision_prompt_switch_hook.is_checked}
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
          text_not_found={false}
          translations={{
            new_prompt: 'New chat',
            active_assistant: 'Active vision assistant',
            placeholder: `Message ${
              assistants[selected_assistant_vision_hook.selected_assistant_name]
                .display_name
            }`,
            checkbox: 'Save prompt',
            active_input_placeholder_suffix: '(⇅ for history)',
            plain_text_too_long: <></>,
            text_not_found: <></>,
            footer_privacy_info: 'Data processed 100% locally',
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
                attach_text_switch_hook.is_checked &&
                text_selection_hook.selected_text
              )
            )
              return

            if (
              attach_text_switch_hook.is_checked &&
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
                (attach_text_switch_hook.is_checked &&
                  (text_selection_hook.selected_text || shortened_plan_text)) ||
                '',
              window_height: window_dimensions_hook.dimensions?.height,
              window_width: window_dimensions_hook.dimensions?.width,
            }
            browser.runtime.sendMessage(message)
            window.close()
          }}
          is_switch_disabled={
            parsed_html_hook.parsed_html === undefined &&
            !text_selection_hook.selected_text
          }
          is_switch_checked={
            parsed_html_hook.parsed_html === null &&
            !current_url_hook.is_youtube_video &&
            !text_selection_hook.selected_text
              ? false
              : attach_text_switch_hook.is_checked
          }
          is_switch_visible={
            !current_url_hook.is_new_tab_page &&
            (!!parsed_html_hook.parsed_html ||
              current_url_hook.is_youtube_video ||
              parsed_html_hook.parsed_html === undefined ||
              !!text_selection_hook.selected_text)
          }
          on_switch_click={() => {
            attach_text_switch_hook.set_is_checked(
              !attach_text_switch_hook.is_checked,
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
            (attach_text_switch_hook.is_checked &&
              (!!parsed_html_hook.parsed_html ||
                !!text_selection_hook.selected_text) &&
              parsed_html_hook.parsed_html?.plain_text &&
              shortened_plan_text &&
              parsed_html_hook.parsed_html?.plain_text.length >
                shortened_plan_text?.length) ||
            false
          }
          text_not_found={
            !current_url_hook.is_new_tab_page &&
            parsed_html_hook.parsed_html === null &&
            attach_text_switch_hook.is_checked &&
            !current_url_hook.is_taaabs &&
            !text_selection_hook.selected_text
          }
          translations={{
            new_prompt: 'New chat',
            active_assistant: 'Active assistant',
            placeholder: `Message ${
              assistants[selected_assistant_hook.selected_assistant_name]
                .display_name
            }`,
            checkbox:
              text_selection_hook.selected_text ||
              (parsed_html_hook.parsed_html === null &&
                !current_url_hook.is_youtube_video)
                ? 'Send text selection'
                : get_attach_text_checkbox_label(current_url_hook.url),
            active_input_placeholder_suffix: '(⇅ for history)',
            plain_text_too_long: (
              <>
                ⚠ {current_url_hook.is_youtube_video ? 'Transcript' : 'Text'}{' '}
                will be shortened by{' '}
                {calculate_shortening_percentage(
                  parsed_html_hook.parsed_html?.plain_text,
                  shortened_plan_text,
                )}
                %
              </>
            ),
            text_not_found: current_url_hook.is_youtube_video
              ? '⚠ Transcript not found'
              : '⚠ Text not found',
            footer_privacy_info: 'Data processed 100% locally',
          }}
        />
      )}
    </Ui_extension_popup_templates_Popup>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<Popup />)

const get_attach_text_checkbox_label = (url: string) => {
  const conversation = 'Send chat'
  const label_map = {
    'https://www.youtube.com/watch': 'Send transcript',
    'https://m.youtube.com/watch': 'Send transcript',
    'https://x.com': 'Send tweet',
    'https://twitter.com': 'Send tweet',
    'https://www.reddit.com/r/': 'Send post',
    'https://gemini.google.com/app/': conversation,
    'https://chatgpt.com/c/': conversation,
    'https://huggingface.co/chat/conversation/': conversation,
    'https://claude.ai/chat/': conversation,
    'https://chat.mistral.ai/chat/': conversation,
    'https://coral.cohere.com/c/': conversation,
    'https://aistudio.google.com/app/prompts/': conversation,
    'https://mail.google.com/mail/': 'Send e-mail',
  }

  let label = 'Send page' // Default label

  for (const prefix in label_map) {
    if (url.startsWith(prefix)) {
      label = (label_map as any)[prefix]
      break
    }
  }
  return label
}

const calculate_shortening_percentage = (
  full_text?: string,
  shortened_text?: string,
): number | undefined => {
  if (!full_text || !shortened_text) {
    return
  }

  const full_length = full_text.length
  const shortened_length = shortened_text.length

  const difference = full_length - shortened_length
  const percentage = (difference / full_length) * 100

  return Math.floor(percentage)
}
