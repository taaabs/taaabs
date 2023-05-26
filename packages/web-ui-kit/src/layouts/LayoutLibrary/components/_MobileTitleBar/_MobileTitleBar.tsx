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
    <_.container>
      <_.iconLeft onClick={props.swipeLeftOnClick}>
        <Ui.Atoms.Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      </_.iconLeft>
      <_.title>{props.children}</_.title>
      <_.iconRight onClick={props.swipeRightOnClick}>
        <Ui.Atoms.Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      </_.iconRight>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div`
    border-bottom: var(${Theme.BORDER_PRIMARY});
    display: flex;
    justify-content: space-between;
    height: ${sharedValues.appBar}px;
    background-color: var(${Theme.HEADER_TRANSPARENT_BACKGROUND});
    ${s.backdropFilter.desktopHeader}
  `
  const iconCommon = css`
    display: flex;
    align-items: center;
    padding: 0 ${sharedValues.distance[16]}px;
  `
  export const iconLeft = styled.button`
    ${iconCommon}
    > div > svg {
      ${s.iconSize[20]}
    }
  `
  export const iconRight = styled.button`
    ${iconCommon}
    > div > svg {
      ${s.iconSize[26]}
    }
  `
  export const title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
  `
}
