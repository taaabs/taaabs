import { Auth_Ro } from './types/auth.ro'
import { GuestLogIn_Params } from './types/guest-log-in.params'
import { GuestLogIn_Ro } from './types/guest-log-in.ro'
import { GuestSignUp_Params } from './types/guest-sign-up.params'
import { GuestSignUp_Ro } from './types/guest-sign-up.ro'
import { LogIn_Params } from './types/log-in.params'
import { Refresh_Params } from './types/refresh.params'
import { Refresh_Ro } from './types/refresh.ro'
import { SignUp_Params } from './types/sign-up.params'

export type Auth_Repository = {
  refresh(params: Refresh_Params): Promise<Refresh_Ro>
  sign_up(params: SignUp_Params): Promise<Auth_Ro>
  log_in(params: LogIn_Params): Promise<Auth_Ro>
  guest_sign_up(params: GuestSignUp_Params): Promise<GuestSignUp_Ro>
  guest_log_in(params: GuestLogIn_Params): Promise<GuestLogIn_Ro>
}
