import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../services/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super()
  }

  public async validate(username: string, password: string): Promise<any> {
    const userId = await this._authService.validateUser(username, password)
    if (!userId) {
      throw new UnauthorizedException()
    }
    return userId
  }
}
