export namespace ToggleFollowing_Dto {
  export type Body = {
    username: string
  }
  export type Response = {
    is_following: boolean
  }
}
