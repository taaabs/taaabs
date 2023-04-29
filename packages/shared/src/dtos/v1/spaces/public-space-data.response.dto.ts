class Collection {
  name!: string
  id!: string
  parentId!: string | null
  updatedAt!: string
}

export class PublicSpaceDataResponseDto {
  collections!: Collection[]
}
