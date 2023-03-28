import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export namespace LayoutLanding {
  export type Props = {
    slotDesktopNavigationBar: React.ReactNode
    slotMobileNavigationBar: React.ReactNode
    slotFooter: React.ReactNode
  }
}

export const LayoutLanding: React.FC<LayoutLanding.Props> = (props) => {
  return (
    <>
      <S.content>
        <S.Content.header></S.Content.header>
      </S.content>
      <S.footer>
        <Ui.Atoms.Wrapper>{props.slotFooter}</Ui.Atoms.Wrapper>
      </S.footer>
    </>
  )
}

namespace S {
  export const content = styled.div`
    min-height: 100vh;
  `
  export namespace Content {
    export const header = styled.header`
      box-shadow: inset 0px -1px 0px 0px var(${Theme.COLOR_BORDER_PRIMARY});
      position: sticky;
      top: 0;
      width: 100%;
      z-index: 100;
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: saturate(180%) blur(5%);
      height: ${sharedValues.DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
      display: flex;
      align-items: center;
    `
  }
  export const footer = styled.footer`
    border-top: var(${Theme.BORDER_PRIMARY});
  `
}
