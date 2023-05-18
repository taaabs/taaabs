import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

export namespace Layout2ndLanding {
  export type Props = {
    children: React.ReactNode
    slotFooter: React.ReactNode
  }
}

export const Layout2ndLanding: React.FC<Layout2ndLanding.Props> = (props) => {
  return (
    <>
      <$.headerSpacer />
      <$.content>{props.children}</$.content>
      <$.footer>
        <Ui.Atoms.Wrapper>{props.slotFooter}</Ui.Atoms.Wrapper>
      </$.footer>
    </>
  )
}

namespace $ {
  export const headerSpacer = styled.header`
    position: sticky;
    top: 0;
    width: 100%;
    background-color: var(${Theme.COLOR_WHITE});
    height: ${sharedValues.numeric.headerMobile}px;
    ${mq.at992} {
      height: ${sharedValues.numeric.headerDesktop}px;
    }
  `
  export const content = styled.div`
    min-height: 100vh;
    position: relative;
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
      height: ${sharedValues.numeric.headerDesktop}px;
      display: flex;
      align-items: center;
    `
  }
  export const footer = styled.footer`
    border-top: var(${Theme.BORDER_PRIMARY});
  `
}
