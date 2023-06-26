export namespace CategoriesForSidebarDto {
  class Category {
    id: string
    name: string
    order?: number
  }

  export class CategoryOnCurrentUser extends Category {
    children?: CategoryOnCurrentUser[]
    isPublic?: boolean
  }

  export class CategoryOnOtherUser extends Category {
    children?: Category[]
  }

  export namespace Response {
    export class All {
      categories: CategoryOnCurrentUser[]
    }

    export class Public {
      categories: CategoryOnOtherUser[]
    }
  }
}
