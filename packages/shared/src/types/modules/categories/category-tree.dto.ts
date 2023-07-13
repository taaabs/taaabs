export namespace CategoryTreeDto {
  class Category {
    public id: string
    public name: string
    public order?: number
  }

  export class CategoryAuthorized extends Category {
    public children?: CategoryAuthorized[]
    public isPublic?: boolean
  }

  export class CategoryPublic extends Category {
    public children?: Category[]
  }

  export namespace Response {
    export class Authorized {
      public categories: CategoryAuthorized[]
    }

    export class Public {
      public categories: CategoryPublic[]
    }
  }
}
