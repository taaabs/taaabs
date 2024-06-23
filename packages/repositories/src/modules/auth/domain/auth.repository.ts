import { Auth_Ro } from './auth.ro'
import { LogIn_Params } from './log-in.params'
import { Refresh_Params } from './refresh.params'
import { Refresh_Ro } from './refresh.ro'
import { SignUp_Params } from './sign-up.params'

export type Auth_Repository = {
  log_in(params: LogIn_Params): Promise<Auth_Ro>
  sign_up(params: SignUp_Params): Promise<Auth_Ro>
  refresh(params: Refresh_Params): Promise<Refresh_Ro>
}
