import { LogIn_Dto } from '@shared/types/modules/auth/log-in.dto'
import { LogIn_Params } from '../domain/types/log-in.params'
import { SignUp_Params } from '../domain/types/sign-up.params'
import { SignUp_Dto } from '@shared/types/modules/auth/sign-up.dto'
import { Refresh_Params } from '../domain/types/refresh.params'
import { Refresh_Dto } from '@shared/types/modules/auth/refresh.dto'
import { GuestLogIn_Params } from '../domain/types/guest-log-in.params'
import { GuestSignUp_Params } from '../domain/types/guest-sign-up.params'
import { GuestLogIn_Dto } from '@shared/types/modules/auth/guest-log-in.dto'
import { GuestSignUp_Dto } from '@shared/types/modules/auth/guest-sign-up.dto'

export type Auth_DataSource = {
  refresh(params: Refresh_Params): Promise<Refresh_Dto.Response>
  sign_up(params: SignUp_Params): Promise<SignUp_Dto.Response>
  log_in(params: LogIn_Params): Promise<LogIn_Dto.Response>
  guest_sign_up(params: GuestSignUp_Params): Promise<GuestSignUp_Dto.Response>
  guest_log_in(params: GuestLogIn_Params): Promise<GuestLogIn_Dto.Response>
}
