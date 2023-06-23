export namespace CategoryTreeDto {
  export class Category {
    id!: string
    name!: string
    order?: number
    children?: Category[]
  }

  export class Response {
    categories!: Category[]
  }
}
