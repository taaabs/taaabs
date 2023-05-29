export namespace CategoryTreeDto {
  export class Category {
    id!: string
    name!: string
    order?: number
    children?: Array<Category>
  }

  export class Response {
    categories!: Array<Category>
  }
}
