export namespace IconTypes {
  export enum Variant {
    ACTIVITY,
    ALIAS,
    ARCHIVE,
    COLLECTION_FILLED,
    COLLECTION,
    HOME_FILLED,
    HOME,
    PIN,
    RECENT_FILLED,
    RECENT,
    SORT,
    STAR_FILLED,
    STAR,
    TRASH,
  }

  export type VariantMap = {
    [key in Variant]: JSX.Element
  }

  export type Props = {
    variant: Variant
  }
}
