import styled from '@emotion/styled'

export namespace ButtonOutlinedText {
  export type Props = {
    children?: React.ReactNode
  }
}

export const ButtonOutlinedText: React.FC<ButtonOutlinedText.Props> = (
  props,
) => {
  return <S.button>{props.children}</S.button>
}

namespace S {
  export const button = styled.button`
  `
}
