import { Auth_Repository } from '../domain/auth.repository'
import { Auth_Ro } from '../domain/auth.ro'
import { LogIn_Params } from '../domain/log-in.params'
import { SignUp_Params } from '../domain/sign-up.params'
import { Auth_DataSource } from './auth.data-source'

export class Auth_RepositoryImpl implements Auth_Repository {
  constructor(private readonly _auth_data_source: Auth_DataSource) {}

  public async log_in(params: LogIn_Params): Promise<Auth_Ro> {
    const result = await this._auth_data_source.log_in(params)
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      username: result.username,
    }
  }

  public async sign_up(params: SignUp_Params): Promise<Auth_Ro> {
    const result = await this._auth_data_source.sign_up(params)
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      username: result.username,
    }
  }
}