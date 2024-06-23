import { LogIn_Dto } from '@shared/types/modules/auth/log-in.dto'
import { LogIn_Params } from '../domain/log-in.params'
import { SignUp_Params } from '../domain/sign-up.params'
import { SignUp_Dto } from '@shared/types/modules/auth/sign-up.dto'
import { Refresh_Params } from '../domain/refresh.params'
import { Refresh_Dto } from '@shared/types/modules/auth/refresh.dto'

export type Auth_DataSource = {
  log_in(params: LogIn_Params): Promise<LogIn_Dto.Response>
  sign_up(params: SignUp_Params): Promise<SignUp_Dto.Response>
  refresh(params: Refresh_Params): Promise<Refresh_Dto.Response>
}
