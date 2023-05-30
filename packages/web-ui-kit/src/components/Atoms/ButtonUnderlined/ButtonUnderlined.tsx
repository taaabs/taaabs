import { sharedValues } from '@/constants'
import { Theme } from '@/styles/components/GlobalStyles'
import { mq, s } from '@/styles/constants'
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
      <Link href={href} passHref legacyBehavior>
        <_.link isActive={isActive}>
          <span>{children}</span>
        </_.link>
      </Link>
    )
  } else if (onClick != undefined) {
    return (
      <_.button onClick={onClick} isActive={isActive}>
        <span>{children}</span>
      </_.button>
    )
  } else {
    return (
      <_.button isActive={isActive} disabled>
        <span>{children}</span>
      </_.button>
    )
  }
}

namespace _ {
  const buttonBase = (isActive: boolean) => {
    const underlineHeight = 2.5

    return css`
      ${s.fontFamily.plusJakartaSans}
      ${s.fontWeight.inter.semiBold}
      display: inline-flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      padding: 0 ${sharedValues.distance[6]}px;
      position: relative;
      ${s.fontSize[15].px}
      ${mq.at992} {
        ${s.fontSize[16].px}
        padding: 0 ${sharedValues.distance[12]}px;
      }
      span {
        height: 100%;
        display: inline-flex;
        align-items: center;
        position: relative;
        color: var(${Theme.COLOR_TEXT_NORMAL});
        ${isActive &&
        css`
          color: var(${Theme.COLOR_BRAND});
          ::after {
            background-color: var(${Theme.COLOR_BRAND});
            position: absolute;
            content: '';
            width: 100%;
            height: ${underlineHeight}px;
            bottom: 0;
            left: 0;
            margin-left: 50%;
            transform: translateX(-50%);
            border-top-right-radius: ${underlineHeight}px;
            border-top-left-radius: ${underlineHeight}px;
          }
        `};
      }
      ::before {
        ${s.transition[100]('background-color')};
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
      }
      @media (hover: hover) {
        :hover {
          ::before {
            background-color: ${isActive
              ? `var(${Theme.HEADER_NAV_HOVER_ACTIVE_BACKGROUND})`
              : `var(${Theme.HEADER_NAV_HOVER_BACKGROUND})`};
          }
        }
      }
    `
  }
  export const link = styled.a<{ isActive: boolean }>`
    ${({ isActive }) => buttonBase(isActive)}
  `
  export const button = styled.button<{ isActive: boolean }>`
    ${({ isActive }) => buttonBase(isActive)}
    :disabled {
      pointer-events: none;
      span {
        color: var(${Theme.COLOR_TEXT_DIMMED});
      }
    }
  `
}
