export namespace SignInDto {
  export class Request {
    public email: string
    public password: string
  }

  export class Response {
    public access_token: string
  }
}
