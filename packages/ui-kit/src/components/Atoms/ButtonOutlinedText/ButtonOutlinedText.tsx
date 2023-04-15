import styled from '@emotion/styled'

export namespace ButtonOutlinedText {
  export type Props = {
    children?: React.ReactNode
  }
}

export const ButtonOutlinedText: React.FC<ButtonOutlinedText.Props> = (
  props,
) => {
  return <$.button>{props.children}</$.button>
}

namespace $ {
  export const button = styled.button`
  `
}
