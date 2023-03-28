import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace ButtonUnderlined {
  export type Props = {
    children: React.ReactNode
    href?: string
    onClick?: () => void
    isActive: boolean
  }
}

export const ButtonUnderlined: React.FC<ButtonUnderlined.Props> = (props) => {
  const { children, href, onClick, isActive } = props
  if (href != undefined) {
    return (
      <S.link href={href} isActive={isActive}>
        <span>{children}</span>
      </S.link>
    )
  } else if (onClick != undefined) {
    return (
      <S.button onClick={onClick} isActive={isActive}>
        <span>{children}</span>
      </S.button>
    )
  } else {
    return (
      <S.button isActive={isActive} disabled>
        <span>{children}</span>
      </S.button>
    )
  }
}

namespace S {
  const underlineHeight = 2.5
  const buttonBase = (isActive: boolean) => css`
    font-size: var(${Theme.FONT_SIZE_16_REM});
    font-weight: var(${Theme.FONT_WEIGHT_INTER_MEDIUM});
    display: inline-flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 var(${Theme.SPACER_16});
    position: relative;
    overflow: hidden;
    span {
      height: 100%;
      display: inline-flex;
      align-items: center;
      position: relative;
      ${isActive &&
      css`
        ::after {
          background-color: var(${Theme.COLOR_BRAND});
          position: absolute;
          content: '';
          width: 100%;
          height: ${underlineHeight}px;
          bottom: 1px;
          left: 0;
          margin-left: 50%;
          transform: translateX(-50%);
          border-top-right-radius: ${underlineHeight}px;
          border-top-left-radius: ${underlineHeight}px;
        }
      `}
    }
    ::before {
      transition: background-color var(${Theme.ANIMATION_DURATION_150})
        var(${Theme.TRANSITION_TIMING_FUNCTION});
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 1px;
      z-index: -1;
    }

    @media (hover: hover) {
      :hover {
        ::before {
          background-color: ${isActive
            ? `var(${Theme.COLOR_PRIMARY_50})`
            : `var(${Theme.COLOR_NEUTRAL_50})`};
        }
      }
    }
  `
  export const link = styled(Link)<{ isActive: boolean }>`
    ${({ isActive }) => buttonBase(isActive)}
  `
  export const button = styled.button<{ isActive: boolean }>`
    ${({ isActive }) => buttonBase(isActive)}
    :disabled {
      pointer-events: none;
    }
  `
}
