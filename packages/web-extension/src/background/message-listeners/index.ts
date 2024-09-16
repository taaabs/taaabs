import { check_url_saved } from './check-url-saved'
import { create_bookmark } from './create-bookmark'
import { delete_bookmark } from './delete-bookmark'
import { get_auth_data } from './get-auth-data'
import { open_options_page } from './open-options-page'
import { open_popup } from './open-popup'
import { send_chatbot_prompt } from './send-chatbot-prompt'
import { theme_changed } from './theme-changed'

export const message_listeners = () => {
  check_url_saved()
  create_bookmark()
  delete_bookmark()
  get_auth_data()
  open_options_page()
  open_popup()
  send_chatbot_prompt()
  theme_changed()
}
