import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace Hamburger {
  export type Props = {
    isToggled: boolean
  }
}

export const Hamburger: React.FC<Hamburger.Props> = ({ isToggled }) => {
  return (
    <S.container>
      <S.hamburger isToggled={isToggled}>
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
    height: 20px;
    width: 22px;
  `
  export const hamburger = styled.div<Pick<Hamburger.Props, 'isToggled'>>`
    position: absolute;
    height: 20px;
    width: 22px;
    & > div {
      width: 22px;
      height: 3px;
      border-radius: 2px;
      background-color: var(${Theme.COLOR_BLACK});
      margin-top: 3px;
      transition: all var(${Theme.ANIMATION_DURATION_300})
        var(${Theme.TRANSITION_TIMING_FUNCTION});
      &:nth-of-type(1) {
        margin-top: 3px;
      }
      ${({ isToggled }) =>
        isToggled &&
        css`
          &:nth-of-type(1) {
            transform: rotate(-45deg);
            margin-top: 9px !important;
          }
          &:nth-of-type(2) {
            transform: rotate(45deg);
            margin-top: -3px;
          }
          &:nth-of-type(3) {
            opacity: 0;
            transform: rotate(45deg);
          }
        `}
    }
  `
}
