import { KyInstance } from 'ky'
import { Auth_DataSource } from './auth.data-source'
import { LogIn_Dto } from '@shared/types/modules/auth/log-in.dto'
import { LogIn_Params } from '../domain/log-in.params'
import { SignUp_Dto } from '@shared/types/modules/auth/sign-up.dto'
import { SignUp_Params } from '../domain/sign-up.params'
import { Crypto } from '@repositories/utils/crypto'

const encoder = new TextEncoder()

export class Auth_DataSourceImpl implements Auth_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async log_in(params: LogIn_Params): Promise<LogIn_Dto.Response> {
    const body: LogIn_Dto.Request.Body = {
      email: params.email,
      password: await Crypto.SHA256(
        params.password,
        encoder.encode(params.email),
      ),
    }

    return this._ky
      .post('v1/auth/login', {
        json: body,
      })
      .json()
  }

  public async sign_up(params: SignUp_Params): Promise<SignUp_Dto.Response> {
    const body: SignUp_Dto.Request.Body = {
      username: params.username,
      email: params.email,
      password: await Crypto.SHA256(
        params.password,
        encoder.encode(params.email),
      ),
      hint: params.hint,
      captcha_token: params.captcha_token,
    }

    return this._ky
      .post('v1/auth/signup', {
        json: body,
      })
      .json()
  }
}
