export namespace ClientSideSearchDto {
  export namespace Response {
    class Bookmark {
      public title: string
      public url: string
    }

    export class Authorized {
      public bookmarks: Bookmark[]
    }
    export class Public {
      public bookmarks: Bookmark[]
    }
  }
}
