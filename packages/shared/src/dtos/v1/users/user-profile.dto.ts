export namespace UserProfileDto {
  export namespace Response {
    class UserProfile {
      username: string
      displayName?: string
    }

    export class OnCurrentUser extends UserProfile {
      email: string
      isEmailConfirmed: boolean
    }

    export class OnOtherUser extends UserProfile {}
  }
}
