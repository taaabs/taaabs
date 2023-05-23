import { Theme } from '@/styles/components/GlobalStyles'
import { s } from '@/styles/constants'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace Hamburger {
  export type Props = {
    isToggled: boolean
  }
}

export const Hamburger: React.FC<Hamburger.Props> = ({ isToggled }) => {
  return (
    <$.container>
      <$.hamburger isToggled={isToggled}>
        <div />
        <div />
        <div />
      </$.hamburger>
    </$.container>
  )
}

namespace $ {
  export const container = styled.div`
    position: relative;
    height: 20px;
    width: 24px;
  `
  export const hamburger = styled.div<Pick<Hamburger.Props, 'isToggled'>>`
    position: absolute;
    height: 20px;
    width: 24px;
    > div {
      width: 24px;
      height: 3.5px;
      border-radius: 2px;
      background-color: var(${Theme.COLOR_BLACK});
      margin-top: 3px;
      ${s.transition[300]('all')};
      :nth-of-type(1) {
        margin-top: 2.5px;
      }
      ${({ isToggled }) =>
        isToggled &&
        css`
          :nth-of-type(1) {
            transform: rotate(-45deg);
            margin-top: 9px !important;
          }
          :nth-of-type(2) {
            transform: rotate(45deg);
            margin-top: -3.5px;
          }
          :nth-of-type(3) {
            opacity: 0;
            transform: rotate(45deg);
          }
        `}
    }
  `
}
