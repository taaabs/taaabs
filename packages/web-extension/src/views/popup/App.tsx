import React, { createContext, useContext } from 'react'
import { use_attach_text_switch } from './hooks/use-attach-text-switch'
import { use_auth_state } from './hooks/use-auth-state'
import { use_custom_assistant_url } from './hooks/use-custom-assistant-url'
import { use_current_url } from './hooks/use-current-url'
import { use_parsed_html } from './hooks/use-parsed-html'
import { use_prompts_history } from './hooks/use-prompts-history'
import { use_prompts_vision_history } from './hooks/use-prompts-vision-history'
import { use_saved_check } from './hooks/use-saved-check'
import { use_selected_assistant } from './hooks/use-selected-assistant'
import { use_selected_assistant_vision } from './hooks/use-selected-assistant-vision'
import { use_text_selection } from './hooks/use-text-selection'
import { use_vision_mode } from './hooks/use-vision-mode'
import { use_window_dimensions } from './hooks/use-window-dimensions'
import { createRoot } from 'react-dom/client'
import { Popup } from './Popup'

import '@web-ui/styles/style.scss'

interface PopupContext {
  auth_state_hook: ReturnType<typeof use_auth_state>
  saved_check_hook: ReturnType<typeof use_saved_check>
  prompts_history_hook: ReturnType<typeof use_prompts_history>
  prompts_vision_history_hook: ReturnType<typeof use_prompts_vision_history>
  parsed_html_hook: ReturnType<typeof use_parsed_html>
  selected_assistant_hook: ReturnType<typeof use_selected_assistant>
  selected_assistant_vision_hook: ReturnType<
    typeof use_selected_assistant_vision
  >
  custom_assistant_url_hook: ReturnType<typeof use_custom_assistant_url>
  attach_text_switch_hook: ReturnType<typeof use_attach_text_switch>
  text_selection_hook: ReturnType<typeof use_text_selection>
  vision_mode_hook: ReturnType<typeof use_vision_mode>
  window_dimensions_hook: ReturnType<typeof use_window_dimensions>
  current_url_hook: ReturnType<typeof use_current_url>
}

const PopupContext = createContext<PopupContext | undefined>(undefined)

export const usePopup = () => {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error('usePopupContext must be used within a PopupProvider')
  }
  return context
}

export const App: React.FC = () => {
  const current_url_hook = use_current_url()
  const auth_state_hook = use_auth_state()
  const saved_check_hook = use_saved_check()
  const prompts_history_hook = use_prompts_history()
  const prompts_vision_history_hook = use_prompts_vision_history()
  const parsed_html_hook = use_parsed_html()
  const selected_assistant_hook = use_selected_assistant()
  const selected_assistant_vision_hook = use_selected_assistant_vision()
  const custom_assistant_url_hook = use_custom_assistant_url()
  const attach_text_switch_hook = use_attach_text_switch()
  const text_selection_hook = use_text_selection()
  const vision_mode_hook = use_vision_mode()
  const window_dimensions_hook = use_window_dimensions()

  const context_value: PopupContext = {
    auth_state_hook,
    saved_check_hook,
    prompts_history_hook,
    prompts_vision_history_hook,
    parsed_html_hook,
    selected_assistant_hook,
    selected_assistant_vision_hook,
    custom_assistant_url_hook,
    attach_text_switch_hook,
    text_selection_hook,
    vision_mode_hook,
    window_dimensions_hook,
    current_url_hook,
  }

  return (
    <PopupContext.Provider value={context_value}>
      <Popup />
    </PopupContext.Provider>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<App />)
