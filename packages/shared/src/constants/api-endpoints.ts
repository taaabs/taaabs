export namespace ApiEndpoints {
  export namespace Points {
    export enum POST {
      GIVE_POINTS = 'v1/points',
      CHECK_TOTAL_GIVEN = 'v1/check-total-given',
    }
  }
  export namespace Users {
    export enum POST {
      CHECK_USRNAME_AVAILABILITY = 'v1/users/username-availability',
    }
  }
}
