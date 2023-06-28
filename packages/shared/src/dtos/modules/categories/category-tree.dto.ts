export namespace CategoryTreeDto {
  class Category {
    id: string
    name: string
    order?: number
  }

  export class CategoryAuthorized extends Category {
    children?: CategoryAuthorized[]
    isPublic?: boolean
  }

  export class CategoryPublic extends Category {
    children?: Category[]
  }

  export namespace Response {
    export class Authorized {
      categories: CategoryAuthorized[]
    }

    export class Public {
      categories: CategoryPublic[]
    }
  }
}
