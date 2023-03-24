import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace Logo {
  export type Props = {
    text?: string
    isPrimary?: boolean
    isLinkingToHomepage?: boolean
  }
}

export const Logo: React.FC<Logo.Props> = ({
  isPrimary = true,
  text,
  isLinkingToHomepage,
}) => {
  return (
    <S.container>
      <S.circle
        isPrimary={isPrimary}
        href="/"
        isLinkingToHomepage={isLinkingToHomepage}
      ></S.circle>
      {text && <S.text>{text}</S.text>}
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    display: inline-flex;
    gap: var(${Theme.SPACER_8});
    align-items: center;
    font-weight: var(${Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM});
  `
  type CircleProps = Pick<Logo.Props, 'isPrimary' | 'isLinkingToHomepage'>
  export const circle = styled(Link)<CircleProps>`
    width: var(${Theme.BUTTON_HEIGHT_40});
    height: var(${Theme.BUTTON_HEIGHT_40});
    font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    ${({ isLinkingToHomepage }) =>
      !isLinkingToHomepage &&
      css`
        pointer-events: none;
      `}
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
