import { Auth_Ro } from './auth.ro'
import { LogIn_Params } from './log-in.params'
import { SignUp_Params } from './sign-up.params'

export type Auth_Repository = {
  log_in(params: LogIn_Params): Promise<Auth_Ro>
  sign_up(params: SignUp_Params): Promise<Auth_Ro>
}
