export namespace SidebarCategoriesDto {
  export class Category {
    id!: string
    name!: string
    bookmarks?: number
    children?: Array<Category>
  }

  export class Response {
    categories!: Array<Category>
  }
}
