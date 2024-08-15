import { Auth_Repository } from '../domain/auth.repository'
import { Auth_Ro } from '../domain/types/auth.ro'
import { LogIn_Params } from '../domain/types/log-in.params'
import { Refresh_Params } from '../domain/types/refresh.params'
import { Refresh_Ro } from '../domain/types/refresh.ro'
import { SignUp_Params } from '../domain/types/sign-up.params'
import { Auth_DataSource } from './auth.data-source'
import { GuestLogIn_Params } from '../domain/types/guest-log-in.params'
import { GuestSignUp_Params } from '../domain/types/guest-sign-up.params'
import { GuestSignUp_Ro } from '../domain/types/guest-sign-up.ro'
import { GuestLogIn_Ro } from '../domain/types/guest-log-in.ro'

export class Auth_RepositoryImpl implements Auth_Repository {
  constructor(private readonly _auth_data_source: Auth_DataSource) {}

  public async refresh(params: Refresh_Params): Promise<Refresh_Ro> {
    const result = await this._auth_data_source.refresh(params)
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    }
  }

  public async sign_up(params: SignUp_Params): Promise<Auth_Ro> {
    const result = await this._auth_data_source.sign_up(params)
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      id: result.id,
      username: result.username,
    }
  }

  public async log_in(params: LogIn_Params): Promise<Auth_Ro> {
    const result = await this._auth_data_source.log_in(params)
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      id: result.id,
      username: result.username,
    }
  }

  public async guest_sign_up(
    params: GuestSignUp_Params,
  ): Promise<GuestSignUp_Ro> {
    const result = await this._auth_data_source.guest_sign_up(params)
    return {
      id: result.id,
      guest_key: result.guest_key,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    }
  }

  public async guest_log_in(params: GuestLogIn_Params): Promise<GuestLogIn_Ro> {
    const result = await this._auth_data_source.guest_log_in(params)
    return {
      id: result.id,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    }
  }
}
