import { get_auth_data } from './get-auth-data'
import { send_prompt } from './send-prompt'

export const message_listeners = () => {
  get_auth_data()
  send_prompt()
}
