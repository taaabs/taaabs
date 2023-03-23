import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace Logo {
  export type Props = {
    text?: string
    isPrimary?: boolean
  }
}

export const Logo: React.FC<Logo.Props> = ({ isPrimary = true, text }) => {
  return (
    <S.container>
      <S.circle isPrimary={isPrimary}></S.circle>
      {text && <S.text>{text}</S.text>}
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    display: inline-flex;
    gap: var(${Theme.SPACER_8});
    align-items: center;
    font-weight: var(${Theme.FONT_WEIGHT_MEDIUM});
  `
  export const circle = styled.div<{ isPrimary: boolean }>`
    width: var(${Theme.BUTTON_HEIGHT_40});
    height: var(${Theme.BUTTON_HEIGHT_40});
    font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    ${({ isPrimary }) =>
      isPrimary
        ? css`
            background-color: var(${Theme.LOGO_BACKGROUND_COLOR_PRIMARY});
            color: var(${Theme.LOGO_FOREGROUND_COLOR_PRIMARY});
          `
        : css`
            background-color: var(${Theme.LOGO_BACKGROUND_COLOR_SECONDARY});
            color: var(${Theme.LOGO_FOREGROUND_COLOR_SECONDARY});
          `}
    &::after {
      content: 't';
    }
  `
  export const text = styled.span`
    font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
    font-size: 20px;
  `
}
