import { check_url_saved } from './check-url-saved'
import { create_bookmark } from './create-bookmark'
import { get_auth_data } from './get-auth-data'
import { get_custom_chatbot_url } from './get-custom-chatbot-url'
import { last_used_chatbot_name } from './last-used-chatbot-name'
import { open_options_page } from './open-options-page'
import { send_chatbot_prompt } from './send-chatbot-prompt'
import { theme_changed } from './theme-changed'

export const message_listeners = () => {
  check_url_saved()
  create_bookmark()
  get_auth_data()
  get_custom_chatbot_url()
  last_used_chatbot_name()
  open_options_page()
  send_chatbot_prompt()
  theme_changed()
}
