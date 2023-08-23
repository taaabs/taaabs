export namespace CategoryTreeDto {
  class Category {
    public id: string
    public name: string
  }

  export class AuthorizedCategory extends Category {
    public children?: AuthorizedCategory[]
    public isPublic?: boolean
  }

  export class PublicCategory extends Category {
    public children?: Category[]
  }

  export namespace Response {
    export class Authorized {
      public categories: AuthorizedCategory[]
    }

    export class Public {
      public categories: PublicCategory[]
    }
  }
}
