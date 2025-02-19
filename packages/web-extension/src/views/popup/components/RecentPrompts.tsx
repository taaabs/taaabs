import { Separator as Ui_extension_popup_templates_Popup_main_Separator } from '@web-ui/components/extension/popup/templates/Popup/main/Separator'
import { RecentPrompts as Ui_extension_popup_templates_Popup_main_RecentPrompts } from '@web-ui/components/extension/popup/templates/Popup/main/RecentPrompts'
import { use_popup } from '../App'
import {
  default_prompts,
  default_vision_prompts,
} from '../data/default-prompts'
import { useEffect, useMemo } from 'react'
import { use_prompts_history } from '../hooks/use-prompts-history'
import { use_prompts_vision_history } from '../hooks/use-prompts-vision-history'
import { send_prompt } from '../utils/send-prompt'

export const RecentPrompts: React.FC<{
  prompt_field_value: string
  assistant_url: string
  plain_text?: string
}> = (props) => {
  const {
    text_selection_hook,
    vision_mode_hook,
    current_tab_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    window_dimensions_hook,
    pinned_websites_hook,
    message_history_hook,
  } = use_popup()
  const prompts_history_hook = use_prompts_history()
  const prompts_vision_history_hook = use_prompts_vision_history()

  const handle_quick_prompt_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    // await context_history_hook.save_snapshot(
    //   props.prompt_field_value,
    //   pinned_websites_hook.pinned_websites.map((w) => w.url),
    // )

    // const plain_text = get_aggregated_plain_text({
    //   pinned_websites: pinned_websites_hook.pinned_websites,
    //   current_tab: {
    //     url: current_tab_hook.url,
    //     title: current_tab_hook.title,
    //     include_in_prompt: current_tab_hook.include_in_prompt,
    //   },
    //   selected_text: text_selection_hook.selected_text,
    //   tab_plain_text: props.plain_text,
    // })

    // Only update history if there is content to process
    if (!vision_mode_hook.is_vision_mode) {
      await send_prompt({
        prompt,
        assistant_name: selected_assistant_hook.selected_assistant_name!,
        assistant_url: props.assistant_url,
        plain_text: '',
        open_in_new_tab: is_middle_click,
        window_dimensions: {
          height: window_dimensions_hook.dimensions!.height,
          width: window_dimensions_hook.dimensions!.width,
        },
        on_before_send: () => {
          prompts_history_hook.update_stored_prompts_history(prompt)
        },
      })
    }
  }

  const handle_quick_prompt_vision_click = async (
    prompt: string,
    is_middle_click?: boolean,
  ) => {
    await send_prompt({
      prompt,
      assistant_name: selected_assistant_vision_hook.selected_assistant_name!,
      assistant_url: props.assistant_url,
      is_vision_mode: true,
      image: vision_mode_hook.image!,
      open_in_new_tab: is_middle_click,
      window_dimensions: {
        height: window_dimensions_hook.dimensions!.height,
        width: window_dimensions_hook.dimensions!.width,
      },
      on_before_send: () => {
        prompts_vision_history_hook.update_stored_prompts_history(prompt)
      },
    })
  }

  const handle_remove_prompt = async (prompt: string) => {
    if (vision_mode_hook.is_vision_mode) {
      await prompts_vision_history_hook.remove_prompt(prompt)
    } else {
      await prompts_history_hook.remove_prompt(prompt)
    }
  }

  // Quick select with keyboard numbers (1-9)
  useEffect(() => {
    const handle_key_down = (e: KeyboardEvent) => {
      if (props.prompt_field_value == '' && /^[1-9]$/.test(e.key)) {
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
    props.prompt_field_value,
    prompts_history_hook.prompts_history,
    prompts_vision_history_hook.prompts_history,
    vision_mode_hook.is_vision_mode,
    text_selection_hook.selected_text,
    current_tab_hook.parsed_html,
    props.plain_text,
    selected_assistant_hook.selected_assistant_name,
    window_dimensions_hook.dimensions,
  ])

  // Determine if history should be enabled based on enabled pinned websites and attached text
  const is_history_enabled = useMemo(() => {
    // // Check if there are any enabled pinned websites
    // const has_enabled_pinned_websites =
    //   pinned_websites_hook.pinned_websites.some((website) => website.is_enabled)

    // // Check if current tab text is enabled and available
    // const has_enabled_current_tab_text =
    //   current_tab_hook.include_in_prompt &&
    //   !pinned_websites_hook.pinned_websites.some(
    //     (website) => website.url == current_tab_hook.url,
    //   ) &&
    //   (!!text_selection_hook.selected_text || !!current_tab_hook.parsed_html)

    // return has_enabled_pinned_websites || has_enabled_current_tab_text
    return true
  }, [
    pinned_websites_hook.pinned_websites,
    current_tab_hook.include_in_prompt,
    text_selection_hook.selected_text,
    current_tab_hook.parsed_html,
  ])

  return (
    <>
      {vision_mode_hook.is_vision_mode && (
        <>
          <Ui_extension_popup_templates_Popup_main_Separator />

          <Ui_extension_popup_templates_Popup_main_RecentPrompts
            recent_prompts={[
              ...prompts_vision_history_hook.prompts_history,
            ].reverse()}
            filter_phrase={
              props.prompt_field_value &&
              !default_vision_prompts.includes(props.prompt_field_value) &&
              !prompts_vision_history_hook.prompts_history.includes(
                props.prompt_field_value,
              )
                ? props.prompt_field_value
                : ''
            }
            default_prompts={default_vision_prompts}
            on_recent_prompt_click={handle_quick_prompt_vision_click}
            on_recent_prompt_middle_click={(prompt) => {
              handle_quick_prompt_vision_click(prompt, true)
            }}
            on_remove_prompt={handle_remove_prompt}
            is_disabled={false}
            translations={{
              searching_heading: 'Searching...',
              heading: 'Recently used prompts',
              delete: 'Remove',
            }}
          />
        </>
      )}

      {!vision_mode_hook.is_vision_mode &&
        !current_tab_hook.is_new_tab_page &&
        !current_tab_hook.url.startsWith('https://taaabs.com') && (
          <>
            <Ui_extension_popup_templates_Popup_main_Separator />

            <Ui_extension_popup_templates_Popup_main_RecentPrompts
              recent_prompts={[
                ...prompts_history_hook.prompts_history,
              ].reverse()}
              filter_phrase={
                is_history_enabled &&
                (current_tab_hook.parsed_html ||
                  text_selection_hook.selected_text) &&
                !prompts_history_hook.prompts_history.includes(
                  props.prompt_field_value,
                )
                  ? props.prompt_field_value
                  : ''
              }
              default_prompts={default_prompts}
              on_recent_prompt_click={handle_quick_prompt_click}
              on_recent_prompt_middle_click={(prompt) => {
                handle_quick_prompt_click(prompt, true)
              }}
              on_remove_prompt={handle_remove_prompt}
              is_disabled={!is_history_enabled}
              translations={{
                searching_heading: 'Searching...',
                heading: 'Recently used prompts',
                delete: 'Delete',
              }}
            />
          </>
        )}
    </>
  )
}
