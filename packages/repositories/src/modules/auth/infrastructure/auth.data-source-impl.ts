import { KyInstance } from 'ky'
import { Auth_DataSource } from './auth.data-source'
import { LogIn_Dto } from '@shared/types/modules/auth/log-in.dto'
import { LogIn_Params } from '../domain/types/log-in.params'
import { SignUp_Dto } from '@shared/types/modules/auth/sign-up.dto'
import { SignUp_Params } from '../domain/types/sign-up.params'
import { Crypto } from '@repositories/utils/crypto'
import { Refresh_Dto } from '@shared/types/modules/auth/refresh.dto'
import { Refresh_Params } from '../domain/types/refresh.params'
import { GuestLogIn_Dto } from '@shared/types/modules/auth/guest-log-in.dto'
import { GuestSignUp_Dto } from '@shared/types/modules/auth/guest-sign-up.dto'
import { GuestLogIn_Params } from '../domain/types/guest-log-in.params'
import { GuestSignUp_Params } from '../domain/types/guest-sign-up.params'

const encoder = new TextEncoder()

export class Auth_DataSourceImpl implements Auth_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async refresh(params: Refresh_Params): Promise<Refresh_Dto.Response> {
    const body: Refresh_Dto.Request.Body = {
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    }
    return this._ky
      .post('v1/auth/refresh', {
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

  public async guest_sign_up(
    params: GuestSignUp_Params,
  ): Promise<GuestSignUp_Dto.Response> {
    const body: GuestSignUp_Dto.Request.Body = {
      captcha_token: params.captcha_token,
    }
    return this._ky
      .post('v1/auth/guest-signup', {
        json: body,
      })
      .json()
  }

  public async guest_log_in(
    params: GuestLogIn_Params,
  ): Promise<GuestLogIn_Dto.Response> {
    const body: GuestLogIn_Dto.Request.Body = {
      guest_key: params.guest_key,
    }
    return this._ky
      .post('v1/auth/guest-login', {
        json: body,
      })
      .json()
  }
}
