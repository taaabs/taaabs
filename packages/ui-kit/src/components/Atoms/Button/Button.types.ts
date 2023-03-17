import { SerializedStyles } from '@emotion/react'

export namespace ButtonTypes {
  export enum Size {
    DEFAULT = 'default',
    LARGE = 'large',
  }

  export type SizeMap = {
    [Key in Size]: SerializedStyles
  }

  export type Props = {
    href?: string
    size?: Size
    onClick?: () => void
    type?: 'submit'
    children?: React.ReactNode
    ariaLabel?: string
    ariaLabelledby?: string
  }
}
