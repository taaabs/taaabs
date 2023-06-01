import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { mq } from '@web-ui/styles/constants'
import styled from '@emotion/styled'

export namespace LayoutLanding {
  export type Props = {
    children: React.ReactNode
  }
}

export const LayoutLanding: React.FC<LayoutLanding.Props> = (props) => {
  return (
    <>
      <_.headerSpacer />
      <_.content>{props.children}</_.content>
    </>
  )
}

namespace _ {
  export const headerSpacer = styled.header`
    position: sticky;
    top: 0;
    width: 100%;
    background-color: var(${Theme.COLOR_WHITE});
    height: ${sharedValues.headerMobile}px;
    ${mq.at992} {
      height: ${sharedValues.headerDesktop}px;
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
      height: ${sharedValues.headerDesktop}px;
      display: flex;
      align-items: center;
    `
  }
}
