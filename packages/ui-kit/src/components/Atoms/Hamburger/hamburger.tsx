import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace Hamburger {
  export type Props = {
    isToggled: boolean
    onClick: () => void
  }
}

export const Hamburger: React.FC<Hamburger.Props> = ({
  isToggled,
  onClick,
}) => {
  return (
    <S.container>
      <S.hamburger onClick={onClick} isToggled={isToggled}>
        <div />
        <div />
        <div />
      </S.hamburger>
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    position: relative;
    display: inline-flex;
    height: var(${Theme.BUTTON_HEIGHT_46});
    width: var(${Theme.BUTTON_HEIGHT_46});
  `
  export const hamburger = styled.div<Pick<Hamburger.Props, 'isToggled'>>`
    position: absolute;
    height: var(${Theme.BUTTON_HEIGHT_46});
    width: var(${Theme.BUTTON_HEIGHT_46});
    transform: scale(0.6);
    & > div {
      position: relative;
      width: var(${Theme.BUTTON_HEIGHT_46});
      height: 6px;
      border-radius: 2px;
      background-color: var(${Theme.COLOR_BLACK});
      margin-top: 8px;
      transition: all var(${Theme.ANIMATION_DURATION_300})
        var(${Theme.TRANSITION_TIMING_FUNCTION});
      &:nth-of-type(1) {
        margin-top: 6px;
      }
      ${({ isToggled }) =>
        isToggled &&
        css`
          &:nth-of-type(1) {
            transform: rotate(-45deg);
            margin-top: 20px !important;
          }
          &:nth-of-type(2) {
            transform: rotate(45deg);
            margin-top: -7px;
          }
          &:nth-of-type(3) {
            opacity: 0;
            transform: rotate(45deg);
          }
        `}
    }
  `
  export namespace Bar {
    export const top = styled.div``
    export const center = styled.div``
    export const bottom = styled.div``
  }
}