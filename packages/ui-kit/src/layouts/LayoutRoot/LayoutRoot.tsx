import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

export namespace LayoutRoot {
  export type Props = {
    slotHeaderDesktop: React.ReactNode
    slotHeaderMobile: React.ReactNode
    children?: React.ReactNode
  }
}

export const LayoutRoot: React.FC<LayoutRoot.Props> = (props) => {
  return (
    <>
      <S.header>
        <S.Header.desktop>
          <Ui.Atoms.Wrapper>{props.slotHeaderDesktop}</Ui.Atoms.Wrapper>
        </S.Header.desktop>
        <S.Header.mobile>{props.slotHeaderMobile}</S.Header.mobile>
      </S.header>
      {props.children}
    </>
  )
}

namespace S {
  export const header = styled.header`
    border-bottom: var(${Theme.BORDER_PRIMARY});
    box-sizing: content-box;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: saturate(180%) blur(5px);
    height: ${sharedValues.HEADER_MOBILE_HEIGHT}px;
    ${mq.at992} {
      height: ${sharedValues.HEADER_DESKTOP_HEIGHT}px;
    }
  `
  export namespace Header {
    export const desktop = styled.div`
      ${mq.to992} {
        display: none;
      }
    `
    export const mobile = styled.div`
      ${mq.at992} {
        display: none;
      }
    `
  }
}