export namespace SignInDto {
  export class Request {
    email: string
    password: string
  }

  export class Response {
    accessToken: string
  }
}
