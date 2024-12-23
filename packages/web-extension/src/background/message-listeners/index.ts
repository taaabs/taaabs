import { get_auth_data } from './get-auth-data'
import { send_prompt } from './send-prompt'
import { get_favicon } from './get-favicon'
import { get_cover } from './get-cover'

export const message_listeners = () => {
  get_auth_data()
  send_prompt()
  get_favicon()
  get_cover()
}
