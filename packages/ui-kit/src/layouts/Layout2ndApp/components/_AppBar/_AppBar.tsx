import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace _AppBar {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    isLeftOpen?: boolean
    isRightOpen?: boolean
    children?: React.ReactNode
  }
}

export const _AppBar: React.FC<_AppBar.Props> = (props) => {
  return (
    <$.container>
      <$.swipe
        onClick={props.swipeLeftOnClick}
        isVisible={props.swipeLeftOnClick != undefined}
      >
        <Ui.Atoms.Icon
          variant={!props.isLeftOpen ? 'SWIPE_RIGHT' : 'SWIPE_LEFT'}
        />
      </$.swipe>
      <$.content>{props.children}</$.content>
      <$.swipe
        onClick={props.swipeRightOnClick}
        isVisible={props.swipeRightOnClick != undefined}
      >
        <Ui.Atoms.Icon
          variant={!props.isRightOpen ? 'SWIPE_LEFT' : 'SWIPE_RIGHT'}
        />
      </$.swipe>
    </$.container>
  )
}

namespace $ {
  export const container = styled.div`
    background-color: var(${Theme.COLOR_WHITE});
    border-bottom: var(${Theme.BORDER_PRIMARY});
    display: flex;
    justify-content: space-between;
    height: ${sharedValues.height.APP_BAR}px;
  `
  export const swipe = styled.button<{ isVisible: boolean }>`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 var(${Theme.SPACER_16});
    ${({ isVisible }) =>
      !isVisible &&
      css`
        pointer-events: none;
        visibility: hidden;
      `}
    > div > svg {
      width: ${sharedValues.icon[24]}px;
      height: ${sharedValues.icon[24]}px;
    }
  `
  export const content = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `
}
