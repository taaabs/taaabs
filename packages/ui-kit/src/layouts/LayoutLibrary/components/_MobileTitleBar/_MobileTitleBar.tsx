import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
import { s } from '@/styles/constants'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace _MobileTitleBar {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    children?: React.ReactNode
  }
}

export const _MobileTitleBar: React.FC<_MobileTitleBar.Props> = (props) => {
  return (
    <$.container>
      <$.swipe
        onClick={props.swipeLeftOnClick}
        isVisible={props.swipeLeftOnClick != undefined}
      >
        <Ui.Atoms.Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      </$.swipe>
      <$.content>{props.children}</$.content>
      <$.swipe
        onClick={props.swipeRightOnClick}
        isVisible={props.swipeRightOnClick != undefined}
      >
        <Ui.Atoms.Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      </$.swipe>
    </$.container>
  )
}

namespace $ {
  export const container = styled.div`
    border-bottom: var(${Theme.BORDER_PRIMARY});
    display: flex;
    justify-content: space-between;
    height: ${sharedValues.appBar}px;
    background-color: var(${Theme.HEADER_TRANSPARENT_BACKGROUND});
    ${s.backdropFilter.desktopHeader}
  `
  export const swipe = styled.button<{ isVisible: boolean }>`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 ${sharedValues.spacer[16]}px;
    ${({ isVisible }) =>
      !isVisible &&
      css`
        pointer-events: none;
        visibility: hidden;
      `}
    > div > svg {
      ${s.iconSize[24]}
    }
  `
  export const content = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `
}
