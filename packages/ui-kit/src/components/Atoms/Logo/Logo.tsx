import { Theme } from '@/styles/GlobalStyles'
import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'

export namespace Logo {
  export type Size = 'small' | 'default'
  export type Props = {
    size: Size
  }
}

export const Logo: React.FC<Logo.Props> = ({ size }) => {
  return <S.logo size={size} />
}

namespace S {
  type SizeMap = { [Key in Logo.Size]: SerializedStyles }

  const sizeMap: SizeMap = {
    small: css`
      width: 32px;
      height: 32px;
      font-size: 24px;
      ::after {
        transform: translateX(-0.2px);
      }
    `,
    default: css`
      width: 40px;
      height: 40px;
      font-size: 32px;
      ::after {
        transform: translateX(-1px);
      }
    `,
  }
  export const logo = styled.div<Pick<Logo.Props, 'size'>>`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
    background-color: var(${Theme.COLOR_BRAND});
    color: var(${Theme.COLOR_WHITE});
    ${({ size }) => sizeMap[size]}
  `
}
